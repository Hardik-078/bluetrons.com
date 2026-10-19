import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-auto w-full border-t border-rule-faint bg-[var(--chrome-bg)] px-6 py-5 md:px-12 md:py-6 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between text-xs font-mono text-ink-5">
        {/* Left: Brand */}
        <div className="flex flex-col items-start gap-2">
          <Link href="/" className="inline-block" aria-label="Bluetrons Home">
            <Image
              src="/images/bluetrons-logo.webp"
              alt="Bluetrons"
              width={939}
              height={143}
              unoptimized
              className="h-4 sm:h-5 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
          </Link>
        </div>

        {/* Right: Copyright & Minimal Links */}
        <div className="flex flex-wrap items-center gap-5 text-[10px] sm:text-[11px] tracking-wider uppercase text-ink-3">
          <Link href="/about" className="hover:text-accent-ink transition-colors">
            About
          </Link>
          <Link href="/terms" className="hover:text-accent-ink transition-colors">
            Terms
          </Link>
          <span className="text-ink-6">
            © {new Date().getFullYear()} BLUETRON INFOTECH LLP
          </span>
        </div>
      </div>
    </footer>
  );
}
