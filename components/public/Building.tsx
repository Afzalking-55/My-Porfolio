import { currentlyBuilding } from "@/content/building";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/public/SectionHead";

/* Rendered as "Currently Learning" — five learning areas the owner
 * named. No levels, no percentages, no achievement claims by design. */

export function Building() {
  return (
    <section id="learning" className="section">
      <div className="container">
        <SectionHead
          index="06"
          title={<>Currently <span className="serif-it">learning</span>.</>}
          lede="What I'm focused on right now — areas I'm actively studying and developing. Learning areas, nothing more, nothing less."
        />

        <div className="building-list">
          {currentlyBuilding.map((b, i) => (
            <Reveal key={i} as="article" className="building-item" delay={(i % 3) as 0 | 1 | 2}>
              <span className="idx">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{b.title}</h3>
                <p>{b.note}</p>
              </div>
              <span className="status-dot">
                {b.category} · {b.status}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
