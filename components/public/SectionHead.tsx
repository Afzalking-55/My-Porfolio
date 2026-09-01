import { Reveal } from "@/components/Reveal";
import type { ReactNode } from "react";

export function SectionHead({
  index,
  title,
  lede,
}: {
  index: string;
  title: ReactNode;
  lede?: ReactNode;
}) {
  return (
    <Reveal as="header" className="section-head">
      <span className="eyebrow">{index}&nbsp;/&nbsp;Section</span>
      <h2>{title}</h2>
      {lede && <p className="lede">{lede}</p>}
    </Reveal>
  );
}
