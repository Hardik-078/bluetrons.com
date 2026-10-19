class Wave {
  phase: number;
  offset: number;
  frequency: number;
  amplitude: number;
  currentValue: number = 0;

  constructor(options?: { phase?: number; offset?: number; frequency?: number; amplitude?: number }) {
    const opts = options || {};
    this.phase = opts.phase || 0;
    this.offset = opts.offset || 195;
    this.frequency = opts.frequency || 0.002;
    this.amplitude = opts.amplitude || 25;
  }

  update(): number {
    this.phase += this.frequency;
    this.currentValue = this.offset + Math.sin(this.phase) * this.amplitude;
    return this.currentValue;
  }

  value(): number {
    return this.currentValue;
  }
}

class NodePoint {
  x: number = 0;
  y: number = 0;
  vx: number = 0;
  vy: number = 0;
}

const config = {
  friction: 0.52,
  trails: 80,
  size: 50,
  dampening: 0.025,
  tension: 0.99,
  lineWidth: 12,
};

/**
 * Below this, in px, every node is on the pointer and the trail draws nothing
 * visible, so the loop can stop. Summed |dx|+|dy| and |vx|+|vy| per node.
 */
const REST_DISTANCE = 0.5;
const REST_SPEED = 0.1;

/**
 * How finely each curve segment is flattened for the GPU: one step per this
 * many px of control polygon, up to MAX_STEPS. At 12px wide and 5% alpha the
 * facets are invisible well before that.
 */
const FLATNESS = 6;
const MAX_STEPS = 8;

/** Canvas 2D's default. Sharper joins than this fall back to a plain normal. */
const MITER_LIMIT = 10;

/**
 * Floats per vertex: position, then where across the stroke it sits (-1 on
 * one outer edge, 1 on the other), which the shader turns into edge coverage.
 */
const STRIDE = 3;

/** Upper bound of points in one line's flattened centreline. */
const MAX_POINTS = 1 + (config.size - 2) * MAX_STEPS;

type Point = { x: number; y: number };

class SpringLine {
  spring: number;
  friction: number;
  nodes: NodePoint[];

  constructor(at: Point, options?: { spring?: number }) {
    const opts = options || {};
    this.spring = (opts.spring ?? 0.45) + 0.1 * Math.random() - 0.05;
    this.friction = config.friction + 0.01 * Math.random() - 0.005;
    this.nodes = [];
    for (let i = 0; i < config.size; i++) {
      const node = new NodePoint();
      node.x = at.x;
      node.y = at.y;
      this.nodes.push(node);
    }
  }

  /** Steps the springs toward `target`. Returns true once the line is at rest. */
  update(target: Point): boolean {
    let springFactor = this.spring;
    const firstNode = this.nodes[0];
    if (!firstNode) return true;

    firstNode.vx += (target.x - firstNode.x) * springFactor;
    firstNode.vy += (target.y - firstNode.y) * springFactor;

    let atRest = true;
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      if (i > 0) {
        const prev = this.nodes[i - 1];
        node.vx += (prev.x - node.x) * springFactor;
        node.vy += (prev.y - node.y) * springFactor;
        node.vx += prev.vx * config.dampening;
        node.vy += prev.vy * config.dampening;
      }
      node.vx *= this.friction;
      node.vy *= this.friction;
      node.x += node.vx;
      node.y += node.vy;
      springFactor *= config.tension;

      if (
        atRest &&
        (Math.abs(target.x - node.x) + Math.abs(target.y - node.y) > REST_DISTANCE ||
          Math.abs(node.vx) + Math.abs(node.vy) > REST_SPEED)
      ) {
        atRest = false;
      }
    }
    return atRest;
  }

  /**
   * Writes the line's stroke into `out` from `offset` as a triangle strip, two
   * vertices per centreline point, and returns the vertex count.
   *
   * The centreline is the curve the 2D version stroked: a quadratic through
   * the midpoint of each pair of nodes, with the node as control point, from
   * the first node to the last. `scratch` holds it flattened.
   */
  outline(out: Float32Array, offset: number, scratch: Float32Array): number {
    const nodes = this.nodes;
    if (nodes.length < 2) return 0;

    let n = 0;
    const push = (x: number, y: number) => {
      // Coincident points have no direction to build a join from.
      if (n > 0) {
        const dx = x - scratch[2 * n - 2];
        const dy = y - scratch[2 * n - 1];
        if (dx * dx + dy * dy < 1e-4) return;
      }
      scratch[2 * n] = x;
      scratch[2 * n + 1] = y;
      n++;
    };

    let x0 = nodes[0].x;
    let y0 = nodes[0].y;
    push(x0, y0);
    const quad = (cx: number, cy: number, x1: number, y1: number) => {
      const dx0 = cx - x0, dy0 = cy - y0, dx1 = x1 - cx, dy1 = y1 - cy;
      const reach = Math.sqrt(dx0 * dx0 + dy0 * dy0) + Math.sqrt(dx1 * dx1 + dy1 * dy1);
      const steps = Math.min(MAX_STEPS, Math.max(1, Math.ceil(reach / FLATNESS)));
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const u = 1 - t;
        push(
          u * u * x0 + 2 * u * t * cx + t * t * x1,
          u * u * y0 + 2 * u * t * cy + t * t * y1,
        );
      }
      x0 = x1;
      y0 = y1;
    };

    for (let a = 1; a < nodes.length - 2; a++) {
      const curr = nodes[a];
      const next = nodes[a + 1];
      quad(curr.x, curr.y, 0.5 * (curr.x + next.x), 0.5 * (curr.y + next.y));
    }
    const last = nodes.length - 2;
    quad(nodes[last].x, nodes[last].y, nodes[last + 1].x, nodes[last + 1].y);

    // A line gathered onto the pointer has no length and draws nothing.
    if (n < 2) return 0;

    // Offset each point to both sides along its miter, as the 2D stroke did
    // (butt caps, mitred joins), one px wider than the stroke on each side for
    // the antialiased edge to fade out in.
    const reach = config.lineWidth / 2 + 1;
    let o = offset;
    for (let i = 0; i < n; i++) {
      const px = scratch[2 * i];
      const py = scratch[2 * i + 1];
      // Unit directions of the segments in and out of this point. The ends
      // only have one, and use it for both.
      let ax = 0, ay = 0, bx = 0, by = 0;
      if (i > 0) {
        ax = px - scratch[2 * i - 2];
        ay = py - scratch[2 * i - 1];
        const l = Math.sqrt(ax * ax + ay * ay);
        ax /= l;
        ay /= l;
      }
      if (i < n - 1) {
        bx = scratch[2 * i + 2] - px;
        by = scratch[2 * i + 3] - py;
        const l = Math.sqrt(bx * bx + by * by);
        bx /= l;
        by /= l;
      }
      if (i === 0) {
        ax = bx;
        ay = by;
      } else if (i === n - 1) {
        bx = ax;
        by = ay;
      }

      let tx = ax + bx;
      let ty = ay + by;
      const tl = Math.sqrt(tx * tx + ty * ty);
      let nx: number, ny: number, scale: number;
      if (tl < 1e-6) {
        // Doubles straight back: no miter exists, use the outgoing normal.
        nx = -by;
        ny = bx;
        scale = 1;
      } else {
        tx /= tl;
        ty /= tl;
        nx = -ty;
        ny = tx;
        // Miter length over half width is 1 / cos of half the turn.
        const cos = nx * -by + ny * bx;
        scale = cos > 1 / MITER_LIMIT ? 1 / cos : 1;
      }

      const ox = nx * reach * scale;
      const oy = ny * reach * scale;
      out[o++] = px + ox;
      out[o++] = py + oy;
      out[o++] = 1;
      out[o++] = px - ox;
      out[o++] = py - oy;
      out[o++] = -1;
    }
    return n * 2;
  }
}

/**
 * How the trail is painted. Read from the theme tokens rather than hardcoded,
 * because the dark treatment is additive and cannot survive on a light ground:
 * `lighter` sums overlapping strokes toward white, and the element sits under
 * `mix-blend-screen`, which against white is white by definition. Light instead
 * composites normally and multiplies a darker, slightly more opaque stroke, so
 * the trail reads as ink on paper.
 */
type PaintConfig = {
  composite: "lighter" | "source-over";
  saturation: number;
  lightness: number;
  alpha: number;
};

const FALLBACK_PAINT = {
  composite: "source-over",
  saturation: "85%",
  lightness: "42%",
  alpha: "0.05",
};

function readPaintConfig(): PaintConfig {
  const style = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) =>
    style.getPropertyValue(name).trim() || fallback;
  const fraction = (value: string) =>
    value.endsWith("%") ? parseFloat(value) / 100 : parseFloat(value);

  const composite = read("--canvas-composite", FALLBACK_PAINT.composite);
  return {
    composite: composite === "lighter" ? "lighter" : "source-over",
    saturation: fraction(read("--canvas-stroke-s", FALLBACK_PAINT.saturation)),
    lightness: fraction(read("--canvas-stroke-l", FALLBACK_PAINT.lightness)),
    alpha: fraction(read("--canvas-stroke-a", FALLBACK_PAINT.alpha)),
  };
}

/** CSS hsl() as sRGB channels in 0..1. */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [f(0), f(8), f(4)];
}

const VERTEX_SHADER = `
attribute vec3 a_vertex;
uniform vec2 u_size;
varying float v_across;
void main() {
  v_across = a_vertex.z;
  vec2 clip = a_vertex.xy / u_size * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}`;

/**
 * Coverage is the stroke's own box-filtered edge: full to half a px inside
 * the stroke's edge, none half a px outside it. The strip reaches one px past
 * the edge (see SpringLine.outline), so distance from the centreline is
 * |v_across| * (half width + 1). `u_edge` picks which fragments a pass draws:
 * 0 the fully covered core, 1 the partly covered rim.
 */
const FRAGMENT_SHADER = `
precision mediump float;
uniform vec4 u_color;
uniform float u_half;
uniform float u_edge;
varying float v_across;
void main() {
  float coverage = clamp(u_half + 0.5 - abs(v_across) * (u_half + 1.0), 0.0, 1.0);
  if (u_edge < 0.5 ? coverage < 1.0 : (coverage <= 0.0 || coverage >= 1.0)) discard;
  gl_FragColor = u_color * coverage;
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Starts the pointer trail on `canvas` and returns the function that stops it.
 *
 * WHY WEBGL
 *
 * The trail is 80 translucent 12px strokes, redrawn every frame the pointer
 * moves. On a 2D canvas each one is a wide stroke Chrome has to turn into an
 * outline and fill without letting it overlap itself, and on an integrated GPU
 * 80 of those took around 55 ms a frame: the page fell to 17 fps whenever the
 * pointer moved over the hero, scrolling or not, and Lenis made it obvious
 * because eased scrolling needs every frame. Width was the whole cost (the
 * same strokes at 1px ran at 60 fps; the blend modes, the curves and the
 * canvas resolution made no difference).
 *
 * Here the same curves are flattened on the CPU into triangle strips and
 * drawn from one upload. The stencil buffer stands in for the 2D stroke's
 * no-overlap rule: each line tags the pixels it covers and cannot paint them
 * twice, so a line crossing itself is no brighter, while separate lines still
 * sum as `lighter` summed them.
 *
 * Edges are antialiased in the shader, not by multisampling: WebGL's MSAA
 * alone cost the same integrated GPU enough to hold the trail near 25 fps.
 * Each line is drawn twice, its solid core and then its soft rim, so that
 * where a line crosses itself the first pass's core claims the pixels before
 * any rim can; a rim drawn first would block the core behind it and leave a
 * faint seam. Against the 2D rendering of the same springs, the total light
 * matches to 0.1% and pixels differ by under one 8-bit level on average.
 *
 * Without a hardware WebGL context (`failIfMajorPerformanceCaveat`), there is
 * no trail: those are exactly the machines that could not afford it.
 *
 * WHEN IT RUNS
 *
 * The trail only costs anything while it can be seen moving. The loop sleeps
 * in two cases:
 *
 * - At rest. Once every node has settled on the pointer the trail draws
 *   nothing, so the canvas is cleared and the loop stops until the pointer
 *   next moves. Scrolling does not move the pointer, so a wheel scroll never
 *   wakes it.
 * - Covered. A page can mark the regions the canvas shows through with
 *   `data-pointer-trail-window` (the homepage marks its hero; everything below
 *   it is opaque). While none of them is on screen the trail is not drawn at
 *   all. On a page that marks nothing, the canvas is visible everywhere and
 *   only the rest rule applies.
 *
 * Everything is scoped to this call, so remounting (a route change, Fast
 * Refresh) starts one clean loop instead of stacking another on the last.
 */
export function startPointerTrail(canvas: HTMLCanvasElement): () => void {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    stencil: true,
    depth: false,
    powerPreference: "low-power",
    failIfMajorPerformanceCaveat: true,
  });
  if (!gl) return () => {};

  // Cached once: reading computed style every frame would force a style
  // recalc sixty times a second, and these values never change.
  const paint = readPaintConfig();
  // Hue oscillates around Bluetrons cobalt/cyan; saturation, lightness and
  // alpha come from the theme.
  const wave = new Wave({
    phase: Math.random() * 2 * Math.PI,
    amplitude: 25,
    frequency: 0.002,
    offset: 195, // Center around electric cyan / blue
  });

  const pointer: Point = { x: 0, y: 0 };
  let lines: SpringLine[] = [];
  let frame = 0;
  let visible = true;

  // Allocated once at the largest size a frame can need.
  const vertices = new Float32Array(config.trails * MAX_POINTS * 2 * STRIDE);
  const scratch = new Float32Array(MAX_POINTS * 2);
  const firsts = new Int32Array(config.trails);
  const counts = new Int32Array(config.trails);

  // GPU state, rebuilt if the context is lost and restored.
  let program: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null;
  let uSize: WebGLUniformLocation | null = null;
  let uColor: WebGLUniformLocation | null = null;
  let uEdge: WebGLUniformLocation | null = null;

  const setup = () => {
    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    program = gl.createProgram();
    if (!vs || !fs || !program) return false;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
    gl.useProgram(program);

    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices.byteLength, gl.DYNAMIC_DRAW);
    const aVertex = gl.getAttribLocation(program, "a_vertex");
    gl.enableVertexAttribArray(aVertex);
    gl.vertexAttribPointer(aVertex, STRIDE, gl.FLOAT, false, 0, 0);
    uSize = gl.getUniformLocation(program, "u_size");
    uColor = gl.getUniformLocation(program, "u_color");
    uEdge = gl.getUniformLocation(program, "u_edge");
    gl.uniform1f(gl.getUniformLocation(program, "u_half"), config.lineWidth / 2);

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    // Premultiplied: `lighter` is a plain sum, source-over is the usual.
    gl.blendFunc(
      gl.ONE,
      paint.composite === "lighter" ? gl.ONE : gl.ONE_MINUS_SRC_ALPHA,
    );
    gl.enable(gl.STENCIL_TEST);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
    gl.clearColor(0, 0, 0, 0);
    gl.clearStencil(0);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uSize, canvas.width, canvas.height);
    return true;
  };
  let ready = setup();

  const seed = () => {
    lines = [];
    for (let i = 0; i < config.trails; i++) {
      lines.push(new SpringLine(pointer, { spring: 0.45 + (i / config.trails) * 0.025 }));
    }
  };

  const clear = () => {
    if (ready) gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
  };

  const render = () => {
    frame = 0;
    if (!ready) return;

    let atRest = true;
    let used = 0;
    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].update(pointer)) atRest = false;
      const count = lines[i].outline(vertices, used * STRIDE, scratch);
      firsts[i] = used;
      counts[i] = count;
      used += count;
    }

    const hue = Math.round(wave.update());
    clear();
    if (atRest) return;

    const [r, g, b] = hslToRgb(hue, paint.saturation, paint.lightness);
    const a = paint.alpha;
    gl.uniform4f(uColor, r * a, g * a, b * a, a);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices.subarray(0, used * STRIDE));
    for (let i = 0; i < lines.length; i++) {
      if (counts[i] < 4) continue;
      // Stencil ids are 1-based; 0 is the cleared state. 80 lines fit the
      // eight bits every context provides.
      gl.stencilFunc(gl.NOTEQUAL, i + 1, 0xff);
      gl.uniform1f(uEdge, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, firsts[i], counts[i]);
      gl.uniform1f(uEdge, 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, firsts[i], counts[i]);
    }
    frame = requestAnimationFrame(render);
  };

  const wake = () => {
    if (!frame && visible && ready && lines.length > 0) {
      frame = requestAnimationFrame(render);
    }
  };

  const sleep = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    clear();
  };

  const move = (x: number, y: number) => {
    pointer.x = x;
    pointer.y = y;
    // The first movement places the trail under the pointer rather than
    // sweeping it in from the corner.
    if (lines.length === 0) seed();
    wake();
  };

  const onMouseMove = (e: MouseEvent) => move(e.clientX, e.clientY);
  const onTouch = (e: TouchEvent) => {
    const touch = e.touches[0];
    if (touch) move(touch.clientX, touch.clientY);
  };

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (!ready) return;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uSize, canvas.width, canvas.height);
  };

  // A lost context (GPU reset, driver update, too many contexts) is restored
  // by the browser only if the loss is claimed; the trail then picks up again
  // on the next pointer move.
  const onContextLost = (e: Event) => {
    e.preventDefault();
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    ready = false;
  };
  const onContextRestored = () => {
    ready = setup();
    resize();
  };

  document.addEventListener("mousemove", onMouseMove, { passive: true });
  document.addEventListener("touchstart", onTouch, { passive: true });
  document.addEventListener("touchmove", onTouch, { passive: true });
  window.addEventListener("resize", resize);
  window.addEventListener("orientationchange", resize);
  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);
  resize();

  let observer: IntersectionObserver | null = null;
  const windows = document.querySelectorAll("[data-pointer-trail-window]");
  if (windows.length > 0) {
    const onScreen = new Set<Element>();
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onScreen.add(entry.target);
        else onScreen.delete(entry.target);
      }
      const next = onScreen.size > 0;
      if (next === visible) return;
      visible = next;
      if (!visible) {
        sleep();
      } else if (lines.length > 0) {
        // Whatever the pointer did while the trail was covered, it comes back
        // settled under the pointer instead of frozen mid-swing.
        seed();
      }
    });
    windows.forEach((el) => observer!.observe(el));
  }

  return () => {
    sleep();
    observer?.disconnect();
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("touchstart", onTouch);
    document.removeEventListener("touchmove", onTouch);
    window.removeEventListener("resize", resize);
    window.removeEventListener("orientationchange", resize);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    canvas.removeEventListener("webglcontextrestored", onContextRestored);
    // The context outlives this call (a route change restarts the trail on
    // the same canvas), so only what this call created is released.
    if (!gl.isContextLost()) {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    }
  };
}
