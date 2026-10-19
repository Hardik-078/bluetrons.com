// The one canonical origin every absolute URL we hand to search engines uses.
// NEXT_PUBLIC_SITE_URL sets it; on Vercel it falls back to the project's
// production domain, and locally to the dev server.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

// Every indexable page, in the order the sitemap lists them. Add new routes
// here, and bump `lastModified` when a page's content meaningfully changes:
// Google trusts lastmod only while it stays accurate.
export const SITE_ROUTES = [
  { path: "/", lastModified: "2026-10-05", changeFrequency: "monthly", priority: 1 },
  { path: "/about", lastModified: "2026-10-05", changeFrequency: "monthly", priority: 0.8 },
  { path: "/terms", lastModified: "2026-10-05", changeFrequency: "yearly", priority: 0.3 },
] as const;
