import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

/* Only public routes. /login and /private are intentionally absent. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${getSiteUrl()}/`, changeFrequency: "monthly", priority: 1 },
  ];
}
