import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";
import { profile, heroIntro } from "@/content/profile";
import { Reveal } from "@/components/Reveal";
import { Ph } from "@/components/Ph";
import { ArrowRight } from "@/components/Icons";

async function Portrait({ src }: { src: string }) {
  // Gracefully degrade: real <img> only when the file actually exists,
  // so a missing photo shows the intentional placeholder frame, never a
  // broken-image icon.
  const file = path.join(process.cwd(), "public", src.replace(/^\//, ""));
  const exists = await fs.access(file).then(() => true).catch(() => false);

  const initials = profile.name
    .replace(/[^\p{L}\p{N} ]/gu, "")
    .trim()
    .split(/\s+/)
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "✳";

  return (
    <div className="portrait">
      {exists ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={`Portrait of ${profile.name}`} />
      ) : (
        <div className="ph-frame">
          <span className="corner tl" aria-hidden />
          <span className="mono-mark">{initials}</span>
          <span className="cap">
            Your portrait here<br />
            drop <b>profile.jpg</b> into<br />
            public/images/
          </span>
          <span className="corner br" aria-hidden />
        </div>
      )}
    </div>
  );
}

export function Hero() {
  return (
    <section id="home" className="hero" aria-label="Introduction">
      <div className="container" style={{ width: "100%" }}>
        <Reveal as="header" className="hero-top" delay={0}>
          <span className="eyebrow" style={{ color: "var(--dim)" }}>
            Portfolio&nbsp;/&nbsp;{new Date().getFullYear()}
          </span>
          <span className="eyebrow">
            AI&nbsp;·&nbsp;Automation&nbsp;·&nbsp;Web&nbsp;·&nbsp;Business
          </span>
        </Reveal>

        <div className="hero-body">
          <div>
            <Reveal delay={1}>
              <span className="eyebrow">Welcome</span>
            </Reveal>
            <Reveal delay={1}>
              <h1 className="hero-name">
                <Ph value={profile.name}>{profile.name}</Ph>
                <span className="serif-it" style={{ display: "block", fontSize: "0.38em", marginTop: 14, color: "var(--ink)" }}>
                  {profile.tagline}
                </span>
              </h1>
            </Reveal>
            <Reveal delay={2}>
              <p className="hero-intro">{heroIntro}</p>
            </Reveal>
            <Reveal delay={3}>
              <div className="hero-ctas">
                <a className="btn btn-primary" href="#projects">
                  Explore My Work <ArrowRight size={14} className="arr" />
                </a>
                <a className="btn btn-ghost" href="#contact">
                  Contact Me
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={2}>
            <Portrait src={profile.portraitImage} />
          </Reveal>
        </div>

        <Reveal delay={4}>
          <div className="hero-indices" aria-label="Focus areas">
            <span><b>01</b> Artificial&nbsp;Intelligence</span>
            <span><b>02</b> Automation</span>
            <span><b>03</b> Web Development</span>
            <span><b>04</b> Entrepreneurship</span>
            <span><b>05</b> Business</span>
          </div>
        </Reveal>
      </div>
      <Link className="scroll-hint" href="#about" aria-label="Scroll to About">
        Scroll
      </Link>
    </section>
  );
}
