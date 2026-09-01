import { skillGroups } from "@/content/skills";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/public/SectionHead";
import { Ph } from "@/components/Ph";

function Pips({ level }: { level: number }) {
  const n = Math.max(0, Math.min(5, Math.round(level)));
  return (
    <span className="pips" role="img" aria-label={`Self-assessed level ${n} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <i key={i} className={i <= n ? "on" : undefined} />
      ))}
    </span>
  );
}

export function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHead
          index="02"
          title={<>Tools of the <span className="serif-it">trade</span> — as it grows.</>}
          lede="Nothing here is invented. Every dashed label is a slot waiting for a skill you actually have — edit content/skills.ts and the dots become your honest self-assessment (1–5)."
        />

        <div className="skills-grid">
          {skillGroups.map((g, gi) => (
            <Reveal key={g.title} delay={(gi % 2) as 0 | 1} className="card skill-group">
              <h3>{g.title}</h3>
              <p className="grp-cap">{g.caption}</p>
              <div>
                {g.skills.map((s, si) => (
                  <div className="skill" key={`${s.name}-${si}`}>
                    <b><Ph value={s.name}>{s.name}</Ph></b>
                    <Pips level={s.level} />
                    <small><Ph value={s.description}>{s.description}</Ph></small>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <p className="skills-note">
          ▸ Levels are self-assessed and editable — delete skills you don&apos;t have, add the ones you do.
        </p>
      </div>
    </section>
  );
}
