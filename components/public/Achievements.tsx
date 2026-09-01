import { SectionHead } from "./SectionHead";
import { Reveal } from "@/components/Reveal";
import { achievements } from "@/content/achievements";

export function Achievements() {
  return (
    <section id="achievements" className="section">
      <div className="container">
        <SectionHead
          index="07"
          title={<>Recorded <span className="serif-it">achievements</span>.</>}
          lede="Stated exactly as they happened — nothing added, nothing embellished."
        />
        <div className="ach-grid">
          {achievements.map((a, i) => (
            <article key={a.title} className="reveal card ach-card" data-delay={i % 2}>
              <span className="eyebrow">{a.kind}</span>
              <div className="ach-head">
                <h3>{a.title}</h3>
                {a.date && <span className="period">{a.date}</span>}
              </div>
              {a.body && <p className="ach-body">{a.body}</p>}
              {a.stats && (
                <div className="ach-stats">
                  {a.stats.map((s) => (
                    <div className="ach-stat" key={s.label}>
                      <span>{s.label}</span>
                      <b>{s.value}</b>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
