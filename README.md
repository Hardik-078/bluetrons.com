# Bluetrons

Corporate website for Bluetron Infotech LLP, an IT infrastructure and technology solutions company.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack), React 19, TypeScript
- **Styling:** Tailwind CSS 4, custom CSS design tokens
- **Motion:** Motion, Lenis smooth scrolling
- **UI:** Lucide icons, Radix Slot, class-variance-authority, tailwind-merge
- **Fonts:** Cormorant Garamond, Geist, JetBrains Mono (`next/font`)
- **SEO and analytics:** generated sitemap and robots.txt, Open Graph metadata, optional GA4
- **Hosting:** Vercel

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. `npm run build` makes a production build and `npm run lint` runs ESLint.

## Environment variables

All are optional.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL. On Vercel it defaults to the production domain. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 ID. With no ID set, no analytics load. |
| `GOOGLE_SITE_VERIFICATION` | Search Console verification token. |
