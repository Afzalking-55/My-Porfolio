import { currentlyBuilding } from "@/content/building";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/public/SectionHead";
import { Ph } from "@/components/Ph";

export function Building() {
  return (
    <section id="building" className="section">
      <div className="container">
        <SectionHead
          index="06"
          title={<>Currently <span className="serif-it">building</span>.</>}
          lede="The open workbench. What's live on the desk right now — update freely in content/building.ts."
        />

        <div className="building-list">
          {currentlyBuilding.map((b, i) => (
            <Reveal key={i} as="article" className="building-item" delay={(i % 3) as 0 | 1 | 2}>
              <span className="idx">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3><Ph value={b.title}>{b.title}</Ph></h3>
                <p><Ph value={b.note}>{b.note}</Ph></p>
              </div>
              <span className={`status-dot ${b.status === "BUILDING" || b.status === "SHIPPING" ? "live" : ""}`}>
                {b.category} · {b.status}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
