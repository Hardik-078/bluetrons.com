import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions — BLUETRON INFOTECH LLP",
  description: "Terms & Conditions for BLUETRON INFOTECH LLP. Official governance and legal documentation.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="flex flex-col w-full min-h-[90dvh] items-center justify-center px-6 py-36 md:py-44">
      <div className="mx-auto max-w-4xl w-full flex flex-col gap-12">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-ink-5 hover:text-accent-ink transition-colors duration-200"
          >
            <ArrowLeft size={14} />
            <span>Return to Home</span>
          </Link>
        </div>

        {/* Header Block */}
        <div className="flex flex-col gap-4">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent-ink">
            LEGAL & GOVERNANCE // DOCUMENTATION
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-ink-1 leading-[1.05]">
            Terms & <em className="italic text-accent-ink">Conditions</em>
          </h1>
          <p className="text-base sm:text-xl text-ink-3 font-light leading-relaxed max-w-2xl">
            Governance, service provisions, and legal guidelines.
          </p>
        </div>

        {/* Content Enclosure */}
        <div className="relative rounded-3xl border border-[var(--plate-border)] bg-[var(--plate-bg)] p-8 sm:p-14 flex flex-col gap-10 shadow-[0_24px_60px_-30px_var(--shadow-plate)]">
          <div className="flex items-start gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-rule bg-wash text-accent-ink">
              <FileText size={22} />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-medium text-ink-1 tracking-tight">
                Governance Framework in Preparation
              </h2>
              <p className="text-ink-3 font-light text-sm leading-relaxed">
                Our comprehensive Terms of Service, Privacy Policies, and Acceptable Use Framework are currently being finalized by legal counsel ahead of public service availability.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-rule-faint bg-wash p-6 text-xs text-ink-3 leading-relaxed font-mono flex flex-col gap-3">
            <div className="flex items-center gap-2 text-ink-2 font-semibold uppercase tracking-wider">
              <ShieldAlert size={15} className="text-accent-ink" />
              NOTICE OF CURRENT STATUS
            </div>
            <p>
              Bluetrons currently does not offer public accounts, subscriptions, or transactional commercial services through this web property. Formal binding agreements will be provided and required upon onboarding to any future Bluetrons applications, software platforms, or enterprise services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
