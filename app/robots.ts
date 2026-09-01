import type { MetadataRoute } from "next";

/* Public site may be indexed; the private area, login and all APIs
 * must never be. */
export default function robots(): MetadataRoute.Robots {
  const base = process.env.SITE_URL ?? "http://localhost:3000";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/private", "/private/", "/login", "/api/"],
      },
    ],
    sitemap: `${base.replace(/\/$/, "")}/sitemap.xml`,
  };
}
