"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { profile } from "@/content/profile";
import { contact, socials } from "@/content/contact";
import { isRealUrl } from "@/lib/placeholder";
import {
  ArrowRight, GithubIcon, InstagramIcon, LinkedinIcon, LockIcon, MailIcon, XIcon,
} from "@/components/Icons";

export const NAV_ITEMS = [
  ["Home", "#home"],
  ["About", "#about"],
  ["Skills", "#skills"],
  ["Projects", "#projects"],
  ["Experience", "#experience"],
  ["Education", "#education"],
  ["Contact", "#contact"],
] as const;

function SocialIcons() {
  const real = (u: string | null): u is string => isRealUrl(u);
  return (
    <nav className="nav-social" aria-label="Social links">
      {real(socials.instagram) && (
        <a className="icon-btn" href={socials.instagram!} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon /></a>
      )}
      {real(socials.github) && (
        <a className="icon-btn" href={socials.github!} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GithubIcon /></a>
      )}
      {real(socials.linkedin) && (
        <a className="icon-btn" href={socials.linkedin!} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedinIcon /></a>
      )}
      {real(socials.x) && (
        <a className="icon-btn" href={socials.x!} target="_blank" rel="noopener noreferrer" aria-label="X"><XIcon /></a>
      )}
      {real(contact.email) && (
        <a className="icon-btn" href={`mailto:${contact.email}`} aria-label="Email"><MailIcon /></a>
      )}
    </nav>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  return (
    <>
      <header className={`nav ${scrolled || open ? "is-scrolled" : ""}`}>
        <div className="container nav-inner">
          <Link href="#home" className="nav-brand" onClick={() => setOpen(false)}>
            <span className="mark" aria-hidden>✳</span>
            {profile.name}
          </Link>

          <nav className="nav-links" aria-label="Primary">
            {NAV_ITEMS.map(([label, href]) => (
              <a key={href} href={href}>{label}</a>
            ))}
          </nav>

          <div className="nav-right">
            <SocialIcons />
            <Link className="btn-lock" href="/login">
              <LockIcon size={13} />
              Private&nbsp;Me
            </Link>
            <button
              className="burger"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        {NAV_ITEMS.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}
             tabIndex={open ? 0 : -1}>{label}</a>
        ))}
        <div className="mm-foot">
          <SocialIcons />
          <Link className="btn-lock" href="/login" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
            <LockIcon size={13} /> Private Me <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </>
  );
}
