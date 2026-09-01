import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = "Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0b",
          color: "#f2f0ea",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 16, letterSpacing: 4, color: "#6d6c74", textTransform: "uppercase" }}>
          <span style={{ display: "flex", width: 8, height: 8, borderRadius: 8, background: "#d5c49c" }} />
          Portfolio · {new Date().getFullYear()}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 600, letterSpacing: -3, lineHeight: 1 }}>
            {profile.name}
          </div>
          <div style={{ display: "flex", fontSize: 34, fontStyle: "italic", color: "#d5c49c" }}>
            {profile.tagline}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, color: "#a5a3ab" }}>
          <span>AI · Automation · Web · Business</span>
          <span style={{ color: "#6d6c74" }}>{(process.env.SITE_URL ?? "localhost:3000").replace(/^https?:\/\//, "")}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
