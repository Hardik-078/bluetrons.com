import type { MetadataRoute } from "next";
import { SITE_ROUTES, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return SITE_ROUTES.map(({ path, lastModified, changeFrequency, priority }) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
