import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { profile } from "@/content/profile";
import "./globals.css";

/* Fonts are self-hosted (next/font/local + @fontsource) — no Google
 * CDN dependency, no layout shift, fully private, works offline.
 * Files live in node_modules under @fontsource*. */

/* Display serif for headings — editorial, not template-y. */
const display = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    { path: "../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2", weight: "100 900", style: "normal" },
    { path: "../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-full-italic.woff2", weight: "100 900", style: "italic" },
  ],
});

/* Workhorse sans for body copy. */
const body = localFont({
  variable: "--font-body",
  display: "swap",
  src: [
    { path: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2", weight: "100 900", style: "normal" },
  ],
});

/* Mono for eyebrow labels, indices, UI meta. */
const mono = localFont({
  variable: "--font-mono",
  display: "swap",
  src: [
    { path: "../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
});

const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0b",
};

export async function generateMetadata(): Promise<Metadata> {
  const title = `${profile.name} — ${profile.tagline}`;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s · ${profile.name}` },
    description: profile.summary,
    keywords: ["portfolio", "AI", "automation", "web development", "entrepreneurship"],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      title,
      description: profile.summary,
      url: siteUrl,
      siteName: profile.name,
    },
    twitter: { card: "summary_large_image", title, description: profile.summary },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
