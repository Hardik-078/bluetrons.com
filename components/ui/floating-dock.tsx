"use client";

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { chromeTransition } from "@/lib/useChromeVisibility";

export interface DockItem {
  title: string;
  icon: React.ReactNode;
  href: string;
}

/**
 * Slides the dock down out of the frame while `hidden`. The horizontal
 * centring goes through motion as well: a Tailwind translate and a motion
 * transform on the same element overwrite each other.
 */
function useDockMotion(hidden: boolean) {
  const reduce = useReducedMotion();
  return {
    initial: false as const,
    // Reduced motion keeps the fade and drops the travel.
    animate: {
      x: "-50%",
      y: hidden && !reduce ? "160%" : "0%",
      opacity: hidden ? 0 : 1,
    },
    transition: chromeTransition(hidden),
  };
}

export const FloatingDock = ({
  items,
  hidden = false,
  desktopClassName,
  mobileClassName,
}: {
  items: DockItem[];
  hidden?: boolean;
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop
        items={items}
        hidden={hidden}
        className={desktopClassName}
      />
      <FloatingDockMobile
        items={items}
        hidden={hidden}
        className={mobileClassName}
      />
    </>
  );
};

/* Mobile Floating Dock: Curved horizontal dock pill, no toggle button */
const FloatingDockMobile = ({
  items,
  hidden,
  className,
}: {
  items: DockItem[];
  hidden: boolean;
  className?: string;
}) => {
  const pathname = usePathname();
  const dockMotion = useDockMotion(hidden);

  return (
    <motion.nav
      aria-label="Mobile Navigation Dock"
      {...dockMotion}
      className={cn(
        "fixed bottom-4 left-1/2 z-50 flex md:hidden items-center gap-1.5 rounded-full border border-[var(--chrome-border)] bg-[var(--chrome-bg)] px-3 py-1.5 backdrop-blur-2xl shadow-[var(--chrome-shadow)]",
        hidden && "pointer-events-none",
        className
      )}
    >
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.title}
            href={item.href}
            className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 active:scale-95",
              isActive
                ? "border-accent bg-accent/20 text-accent-ink shadow-[0_0_16px_rgb(var(--accent-rgb)/0.4)]"
                : "border-rule-faint bg-wash text-ink-3 hover:text-ink-1"
            )}
            aria-label={item.title}
          >
            <div className="h-4 w-4 flex items-center justify-center">{item.icon}</div>
            {isActive && (
              <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-accent shadow-[0_0_6px_var(--accent)]" />
            )}
          </Link>
        );
      })}
    </motion.nav>
  );
};

/* Desktop Floating Dock: Smooth spring proximity magnification */
const FloatingDockDesktop = ({
  items,
  hidden,
  className,
}: {
  items: DockItem[];
  hidden: boolean;
  className?: string;
}) => {
  const mouseX = useMotionValue(Infinity);
  const dockMotion = useDockMotion(hidden);
  return (
    <motion.nav
      aria-label="Desktop Navigation Dock"
      {...dockMotion}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "fixed bottom-5 left-1/2 z-50 hidden h-[50px] items-end gap-2.5 rounded-full border border-[var(--chrome-border)] bg-[var(--chrome-bg)] px-3 pb-1.5 backdrop-blur-2xl shadow-[var(--chrome-shadow)] md:flex",
        hidden && "pointer-events-none",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.nav>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isActive = pathname === href;

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Sleek compact dimensions
  const widthTransform = useTransform(distance, [-120, 0, 120], [34, 48, 34]);
  const heightTransform = useTransform(distance, [-120, 0, 120], [34, 48, 34]);

  const widthTransformIcon = useTransform(distance, [-120, 0, 120], [16, 22, 16]);
  const heightTransformIcon = useTransform(distance, [-120, 0, 120], [16, 22, 16]);

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 170,
    damping: 14,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 170,
    damping: 14,
  });

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 170,
    damping: 14,
  });
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 170,
    damping: 14,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <Link href={href} className="relative group">
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "relative flex aspect-square items-center justify-center rounded-full border transition-colors duration-200",
          isActive
            ? "border-accent bg-accent/15 text-accent-ink shadow-[0_0_16px_rgb(var(--accent-rgb)/0.35)]"
            : "border-rule bg-wash text-ink-3 hover:border-rule-prominent hover:bg-wash-strong hover:text-ink-1"
        )}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 6, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 3, x: "-50%" }}
              className="pointer-events-none absolute -top-8 left-1/2 rounded-md border border-[var(--chrome-border)] bg-[var(--chrome-bg)] px-2.5 py-0.5 font-mono text-[10px] tracking-wider uppercase whitespace-nowrap text-ink-2 shadow-lg backdrop-blur-xl"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>

        {/* Active Route Indicator Pip */}
        {isActive && (
          <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-accent shadow-[0_0_6px_var(--accent)]" />
        )}
      </motion.div>
    </Link>
  );
}
