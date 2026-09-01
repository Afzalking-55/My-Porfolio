import { skillGroups } from "@/content/skills";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/public/SectionHead";

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
          title={<>Skills, as they actually <span className="serif-it">stand</span>.</>}
          lede="Only skills in real use — nothing inflated, no invented ratings. Proficiency indicators appear only when an honest self-assessment has been set in content/skills.ts."
        />

        <div className="skills-grid">
          {skillGroups.map((g, gi) => (
            <Reveal key={g.title} delay={(gi % 2) as 0 | 1} className="card skill-group">
              <h3>{g.title}</h3>
              <p className="grp-cap">{g.caption}</p>
              <div>
                {g.skills.map((s, si) => (
                  <div className="skill" key={`${s.name}-${si}`}>
                    <b>{s.name}</b>
                    {typeof s.level === "number" && <Pips level={s.level} />}
                    <small>{s.description}</small>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <p className="skills-note">
          ▸ No percentages, no stars — just what&apos;s real today. New skills are added in
          content/skills.ts as they earn their place.
        </p>
      </div>
    </section>
  );
}
