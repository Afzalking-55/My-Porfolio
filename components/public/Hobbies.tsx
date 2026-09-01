import { SectionHead } from "./SectionHead";
import { Reveal } from "@/components/Reveal";
import { hobbies } from "@/content/hobbies";

export function Hobbies() {
  return (
    <section id="hobbies" className="section">
      <div className="container">
        <SectionHead
          index="08"
          title={<>Hobbies &amp; <span className="serif-it">interests</span>.</>}
          lede="Things I enjoy — interests only, not credentials."
        />
        <Reveal>
          <ol className="hobby-list">
            {hobbies.map((h, i) => (
              <li key={h}>
                <span className="idx" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                {h}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
