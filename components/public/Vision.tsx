import { goalGroups } from "@/content/goals";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/public/SectionHead";
import { Ph } from "@/components/Ph";

export function Vision() {
  return (
    <section id="vision" className="section">
      <div className="container">
        <SectionHead
          index="07"
          title={<>Where this is <span className="serif-it">headed</span>.</>}
          lede="Ambitions on a timeline. Ambitious — but written to be kept. Edit content/goals.ts."
        />

        <div className="goals-grid">
          {goalGroups.map((g, gi) => (
            <Reveal key={g.label} delay={(gi % 3) as 0 | 1 | 2} className="card goal-card">
              <span className="horizon">{String(gi + 1).padStart(2, "0")} / {g.horizon}</span>
              <h3>{g.label}</h3>
              <ul>
                {g.items.map((item, ii) => (
                  <li key={ii}>
                    <span className="num">{String(ii + 1).padStart(2, "0")}</span>
                    <Ph value={item}>{item}</Ph>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
