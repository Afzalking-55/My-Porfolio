import { contact, socials } from "@/content/contact";
import { isRealUrl } from "@/lib/placeholder";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/public/SectionHead";
import {
  ArrowUpRight, GithubIcon, InstagramIcon, LinkedinIcon, LockIcon, MailIcon, PhoneIcon, XIcon,
} from "@/components/Icons";

type Row = {
  label: string;
  display: string;
  href: string | null; // null → not clickable until real
  icon: React.ReactNode;
  /** link into the authenticated private area (internal, never external) */
  privateLink?: boolean;
  /** real contact value → render plainly (no placeholder styling) */
  real?: boolean;
};

export function Contact() {
  const emailOk = Boolean(contact.email && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact.email.trim()));
  const phoneOk = Boolean(contact.phone && /^[+\d][\d\s().+-]{5,}$/.test(contact.phone.trim()));
  const rows: Row[] = [
    {
      label: "Email",
      display: contact.email ?? "[MY GMAIL WILL BE ADDED HERE]",
      href: emailOk ? `mailto:${contact.email!.trim()}` : null,
      icon: <MailIcon size={16} />,
      real: emailOk,
    },
    {
      // Phone is private-only by owner's instruction: the public row
      // points INTO the authenticated area — no number is ever exposed.
      label: "Phone",
      display: phoneOk ? contact.phone! : "Available in my private area.",
      href: phoneOk ? `tel:${contact.phone!.replace(/[^\d+]/g, "")}` : "/private",
      icon: <PhoneIcon size={16} />,
      real: phoneOk,
      privateLink: !phoneOk,
    },
    {
      label: "Instagram",
      display: socials.instagram ? socials.instagram.replace(/^https?:\/\/(www\.)?/, "") : "[MY INSTAGRAM HANDLE WILL BE ADDED HERE]",
      href: isRealUrl(socials.instagram) ? socials.instagram : null,
      icon: <InstagramIcon size={16} />,
      real: isRealUrl(socials.instagram),
    },
    {
      label: "GitHub",
      display: socials.github ? socials.github.replace(/^https?:\/\/(www\.)?/, "") : "[MY GITHUB PROFILE WILL BE ADDED HERE]",
      href: isRealUrl(socials.github) ? socials.github : null,
      icon: <GithubIcon size={16} />,
      real: isRealUrl(socials.github),
    },
    {
      label: "LinkedIn",
      display: socials.linkedin ? socials.linkedin.replace(/^https?:\/\/(www\.)?/, "") : "[IF AVAILABLE]",
      href: isRealUrl(socials.linkedin) ? socials.linkedin : null,
      icon: <LinkedinIcon size={16} />,
      real: isRealUrl(socials.linkedin),
    },
  ];
  if (isRealUrl(socials.x)) {
    rows.push({ label: "X", display: socials.x!.replace(/^https?:\/\/(www\.)?/, ""), href: socials.x, icon: <XIcon size={16} />, real: true });
  }

  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionHead
          index="09"
          title={<>Let&apos;s build something <span className="serif-it">together</span>.</>}
          lede="Open to projects, collaborations and good conversations about AI, automation and starting things from zero."
        />

        <Reveal>
          <div className="contact-rows">
            {rows.map((r) => {
              const inner = (
                <>
                  <span className="lbl">{r.label}</span>
                  <span className="val">
                    {r.href || r.real ? (
                      r.privateLink ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                          <span style={{ color: "var(--dim)" }}>{r.display}</span>
                          <LockIcon size={15} />
                        </span>
                      ) : (
                        r.display
                      )
                    ) : (
                      <span className="ph">{r.display}</span>
                    )}
                  </span>
                  <span className="go" aria-hidden>
                    {r.href ? <ArrowUpRight size={18} /> : r.icon}
                  </span>
                </>
              );
              const key = r.label;
              if (r.href && r.privateLink) {
                // internal pointer to the authenticated area — middleware
                // sends logged-out visitors to /login automatically
                return (
                  <a className="contact-row" key={key} href={r.href}
                     title="Private — sign in to view" aria-label="Phone: available in the private area, sign in required">
                    {inner}
                  </a>
                );
              }
              if (r.href) {
                return (
                  <a className="contact-row" key={key} href={r.href}
                     {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    {inner}
                  </a>
                );
              }
              return (
                <div className="contact-row" key={key} aria-disabled="true"
                     title="Not configured yet — set it in content/contact.ts">
                  {inner}
                </div>
              );
            })}
          </div>
        </Reveal>

        {contact.note && <p className="contact-note muted">{contact.note}</p>}
      </div>
    </section>
  );
}
