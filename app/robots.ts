import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Everything is public. /_next/ stays crawlable on purpose: Googlebot needs
// the JS and CSS there to render the pages it indexes.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
