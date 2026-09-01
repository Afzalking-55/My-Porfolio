import { education } from "@/content/education";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/public/SectionHead";
import { Ph } from "@/components/Ph";

export function Education() {
  return (
    <section id="education" className="section">
      <div className="container">
        <SectionHead
          index="05"
          title={<>Where the <span className="serif-it">foundations</span> were laid.</>}
          lede="Formal or self-directed — whichever is true."
        />

        <div className="grid-2">
          {education.map((e, i) => (
            <Reveal key={i} className="card edu-card">
              <span className="period"><Ph value={e.period}>{e.period}</Ph></span>
              <h3><Ph value={e.institution}>{e.institution}</Ph></h3>
              <span className="field">
                <Ph value={e.degree}>{e.degree}</Ph>
                {e.field ? <> · <Ph value={e.field}>{e.field}</Ph></> : null}
              </span>
              {e.result && (
                <p className="edu-result">
                  <span className="edu-result-label">Result</span>
                  <b>{e.result}</b>
                </p>
              )}
              {e.description ? <p><Ph value={e.description}>{e.description}</Ph></p> : null}
              {e.relevant.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 4 }}>
                  {e.relevant.map((r, ri) => (
                    <span className="tag" key={ri}><Ph value={r}>{r}</Ph></span>
                  ))}
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
