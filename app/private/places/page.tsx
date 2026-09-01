import type { Metadata } from "next";
import { PrivateCollection } from "@/components/private/Collection";

export const metadata: Metadata = { title: "Places — The Real Me" };

export default function PlacesPage() {
  return (
    <PrivateCollection
      title="Places I've been"
      sub="Somewhere you've stood, that mattered. Add places, dates and memories — photos here link back to each place."
      endpoint="/api/private/places"
      linkField="place"
      addLabel="Add place"
      emptyText="No places yet — add the first one."
      fields={[
        { key: "name", label: "Name", type: "text", required: true },
        { key: "date", label: "Date (optional)", type: "date" },
        { key: "memory", label: "Memory (optional)", type: "textarea", placeholder: "What happened there…" },
      ]}
    />
  );
}
