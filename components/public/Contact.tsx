import { contact } from "@/content/contact";
import { socials } from "@/content/contact";
import { isRealUrl } from "@/lib/placeholder";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/public/SectionHead";
import {
  ArrowUpRight, GithubIcon, InstagramIcon, LinkedinIcon, MailIcon, PhoneIcon, XIcon,
} from "@/components/Icons";

type Row = {
  label: string;
  display: string;
  href: string | null; // null → not clickable until real
  icon: React.ReactNode;
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
    },
    {
      label: "Phone",
      display: contact.phone ?? "[MY PHONE NUMBER WILL BE ADDED HERE]",
      href: phoneOk ? `tel:${contact.phone!.replace(/[^\d+]/g, "")}` : null,
      icon: <PhoneIcon size={16} />,
    },
    {
      label: "Instagram",
      display: socials.instagram ? socials.instagram.replace(/^https?:\/\/(www\.)?/, "") : "[MY INSTAGRAM HANDLE WILL BE ADDED HERE]",
      href: isRealUrl(socials.instagram) ? socials.instagram : null,
      icon: <InstagramIcon size={16} />,
    },
    {
      label: "GitHub",
      display: socials.github ? socials.github.replace(/^https?:\/\/(www\.)?/, "") : "[MY GITHUB PROFILE WILL BE ADDED HERE]",
      href: isRealUrl(socials.github) ? socials.github : null,
      icon: <GithubIcon size={16} />,
    },
    {
      label: "LinkedIn",
      display: socials.linkedin ? socials.linkedin.replace(/^https?:\/\/(www\.)?/, "") : "[IF AVAILABLE]",
      href: isRealUrl(socials.linkedin) ? socials.linkedin : null,
      icon: <LinkedinIcon size={16} />,
    },
  ];
  if (isRealUrl(socials.x)) {
    rows.push({ label: "X", display: socials.x!.replace(/^https?:\/\/(www\.)?/, ""), href: socials.x, icon: <XIcon size={16} /> });
  }

  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionHead
          index="08"
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
                    {r.href ? r.display : <span className="ph">{r.display}</span>}
                  </span>
                  <span className="go" aria-hidden>
                    {r.href ? <ArrowUpRight size={18} /> : r.icon}
                  </span>
                </>
              );
              return r.href ? (
                <a className="contact-row" key={r.label} href={r.href}
                   {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  {inner}
                </a>
              ) : (
                <div className="contact-row" key={r.label} aria-disabled="true"
                     title="Not configured yet — set it in content/contact.ts">
                  {inner}
                </div>
              );
            })}
          </div>
        </Reveal>

        <p className="contact-note muted">{contact.note}</p>
      </div>
    </section>
  );
}
