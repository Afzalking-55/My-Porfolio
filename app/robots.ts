import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

/* Public site may be indexed; the private area, login and all APIs
 * must never be. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/private", "/private/", "/login", "/api/"],
      },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
