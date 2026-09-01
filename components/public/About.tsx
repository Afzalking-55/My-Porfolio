import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/public/SectionHead";
import { Ph } from "@/components/Ph";
import { aboutFacets, aboutLede, aboutManifesto } from "@/content/about";

export function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHead
          index="01"
          title={<>Learning by <span className="serif-it">building</span>.</>}
          lede={aboutLede}
        />
        <div className="grid-2-55">
          <Reveal>
            <dl className="about-facts">
              {aboutFacets.map((f) => (
                <div className="about-fact" key={f.label}>
                  <dt>{f.label}</dt>
                  <dd><Ph value={f.value}>{f.value}</Ph></dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={1}>
            <div className="card" style={{ position: "sticky", top: 100 }}>
              <span className="eyebrow" style={{ marginBottom: 18 }}>The short version</span>
              <p className="about-manifesto">
                <span className="serif-it">{aboutManifesto.strong}</span>
              </p>
              {aboutManifesto.note && (
                <p className="muted" style={{ marginTop: 18, fontSize: 14 }}>
                  {aboutManifesto.note}
                </p>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
