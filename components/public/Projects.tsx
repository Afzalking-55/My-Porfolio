"use client";

/* Projects grid with category filtering. Data: content/projects.ts.
 * Images: public/images/projects/<slug>.jpg — missing image = styled
 * placeholder, never a broken icon. */

import { useMemo, useState } from "react";
import { projects as allProjects } from "@/content/projects";
import { SectionHead } from "@/components/public/SectionHead";
import { Reveal } from "@/components/Reveal";
import { Ph } from "@/components/Ph";
import { isRealUrl } from "@/lib/placeholder";
import { ArrowUpRight, GithubIcon } from "@/components/Icons";
import type { Project, ProjectCategory } from "@/lib/types";

const FILTERS = ["ALL", "AI", "AUTOMATION", "WEB", "BUSINESS", "OTHER"] as const;
type Filter = (typeof FILTERS)[number];

const STATUS_TAG: Record<Project["status"], string> = {
  IDEA: "tag",
  "IN PROGRESS": "tag tag-accent",
  SHIPPED: "tag",
  "ON HOLD": "tag",
};

function ProjectCard({ p }: { p: Project }) {
  return (
    <Reveal as="article" className="card project">
      <div className="thumb">
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} alt={`${p.name} thumbnail`} loading="lazy"
               onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
        ) : null}
        {!p.image && <span className="thumb-ph">Add image · public/images/projects/</span>}
      </div>
      <div className="pbody">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
          <span className={STATUS_TAG[p.status]}>{p.status}</span>
          <span className="faint" style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            <Ph value={p.date}>{p.date}</Ph>
          </span>
        </div>
        <h3><Ph value={p.name}>{p.name}</Ph></h3>
        <p className="pdesc"><Ph value={p.description}>{p.description}</Ph></p>
        <div className="pmeta">
          <span className="tag" style={{ color: "var(--accent)", borderColor: "rgba(213,196,156,0.25)" }}>
            <Ph value={p.role}>{p.role}</Ph>
          </span>
          {p.tech.map((t, i) => (
            <span className="tag" key={i}>{t}</span>
          ))}
        </div>
        <div className="prow">
          <div className="plinks">            {isRealUrl(p.liveUrl) ? (
              <a className="btn btn-primary btn-sm" href={p.liveUrl!} target="_blank" rel="noopener noreferrer">
                Live Demo <ArrowUpRight size={12} />
              </a>
            ) : (
              <span className="btn btn-primary btn-sm" aria-disabled="true" title="Add a live URL in content/projects.ts">Live Demo</span>
            )}
            {isRealUrl(p.repoUrl) ? (
              <a className="btn btn-ghost btn-sm" href={p.repoUrl!} target="_blank" rel="noopener noreferrer">
                <GithubIcon size={13} /> GitHub
              </a>
            ) : (
              <span className="btn btn-ghost btn-sm" aria-disabled="true" title="Add a repo URL in content/projects.ts">GitHub</span>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<Filter>("ALL");

  const visible = useMemo(
    () =>
      filter === "ALL"
        ? allProjects
        : allProjects.filter((p) => (p.categories as readonly string[]).includes(filter as ProjectCategory)),
    [filter]
  );

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHead
          index="03"
          title={<>Selected <span className="serif-it">work</span>.</>}
          lede="Real projects only — as you build them, add a block to content/projects.ts. This grid, the filters and the buttons update themselves."
        />

        <div className="filters" role="group" aria-label="Filter projects by category">
          {FILTERS.map((f) => (
            <button
              key={f}
              className="chip"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f}
              <span aria-hidden style={{ opacity: 0.6, marginLeft: 7 }}>
                {f === "ALL"
                  ? allProjects.length
                  : allProjects.filter((p) => (p.categories as readonly string[]).includes(f)).length}
              </span>
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {visible.length === 0 ? (
            <div className="proj-empty">No projects in this category yet — add one in content/projects.ts</div>
          ) : (
            visible.map((p) => <ProjectCard key={p.slug} p={p} />)
          )}
        </div>
      </div>
    </section>
  );
}
