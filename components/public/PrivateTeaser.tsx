import Link from "next/link";
import { LockIcon, ArrowRight } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";

/* The single, understated door to the private area. No hint of what's
 * behind it. All private data is fetched server-side only, after login. */

export function PrivateTeaser() {
  return (
    <section className="teaser" aria-label="Private area">
      <div className="container">
        <Reveal>
          <div className="lock-ring"><LockIcon size={20} /></div>
          <h2>Some chapters stay <span className="serif-it">off the record</span>.</h2>
          <p>
            A separate, password-protected space for the personal side — the story,
            the journal, the work that isn&apos;t for public eyes yet.
          </p>
          <Link className="btn-lock" href="/login" style={{ margin: "0 auto" }}>
            🔒 Private Me <ArrowRight size={12} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
