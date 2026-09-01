import { experience } from "@/content/experience";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/public/SectionHead";
import { Ph } from "@/components/Ph";

export function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container">
        <SectionHead
          index="04"
          title={<>The <span className="serif-it">path</span> so far.</>}
          lede="Projects, freelance work, business experiments, academic work — only what actually happened. Entries live in content/experience.ts, newest first."
        />

        <div className="timeline">
          {experience.map((e, i) => (
            <Reveal key={i} as="article" className="tl-entry" delay={(i % 3) as 0 | 1 | 2}>
              <div className="period">
                <Ph value={e.period}>{e.period}</Ph>
                <span className="tag">{e.kind}</span>
              </div>
              <h3><Ph value={e.title}>{e.title}</Ph></h3>
              <p className="org"><Ph value={e.org}>{e.org}</Ph></p>
              <p><Ph value={e.description}>{e.description}</Ph></p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
