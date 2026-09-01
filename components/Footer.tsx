import Link from "next/link";
import { profile } from "@/content/profile";
import { contact, socials } from "@/content/contact";
import { site } from "@/content/meta";
import { isRealUrl } from "@/lib/placeholder";
import { GithubIcon, InstagramIcon, LinkedinIcon, LockIcon, MailIcon, XIcon } from "@/components/Icons";

export function Footer() {
  const real = (u: string | null): u is string => isRealUrl(u);
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="f-brand">{profile.name}</div>
            <p className="f-tag">{site.footertagline}</p>
          </div>

          <div className="footer-links" aria-label="Footer">
            {real(contact.email) ? (
              <a className="ulink" href={`mailto:${contact.email}`}>{contact.email}</a>
            ) : (
              <span className="ph">[email not set — edit content/contact.ts]</span>
            )}
            {real(socials.instagram) && <a className="ulink" href={socials.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
            {real(socials.github) && <a className="ulink" href={socials.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
            {real(socials.linkedin) && <a className="ulink" href={socials.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
          </div>

          <div className="footer-links">
            <span className="eyebrow" style={{ marginBottom: 6 }}>Elsewhere</span>
            <div style={{ display: "flex", gap: 4 }}>
              {real(socials.instagram) && <a className="icon-btn" href={socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon /></a>}
              {real(socials.github) && <a className="icon-btn" href={socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GithubIcon /></a>}
              {real(socials.linkedin) && <a className="icon-btn" href={socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedinIcon /></a>}
              {real(socials.x) && <a className="icon-btn" href={socials.x} target="_blank" rel="noopener noreferrer" aria-label="X"><XIcon /></a>}
              {real(contact.email) && <a className="icon-btn" href={`mailto:${contact.email}`} aria-label="Email"><MailIcon /></a>}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} {profile.name}. All rights reserved.</span>
          <Link className="ulink" href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--dim)" }}>
            <LockIcon size={12} /> Private Area
          </Link>
        </div>
      </div>
    </footer>
  );
}
