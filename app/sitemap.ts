import type { MetadataRoute } from "next";

/* Only public routes. /login and /private are intentionally absent. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
  ];
}
