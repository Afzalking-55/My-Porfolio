import type { Metadata } from "next";
import { PrivateCollection } from "@/components/private/Collection";

export const metadata: Metadata = { title: "My People — The Real Me" };

export default function PeoplePage() {
  return (
    <PrivateCollection
      title="My people"
      sub="The circle — off the record. Names, a line about them, an optional memory. Add photos anytime; nothing here ever leaves this server."
      endpoint="/api/private/people"
      linkField="person"
      addLabel="Add person"
      emptyText="No one added yet — your call, whenever."
      showDetail
      fields={[
        { key: "name", label: "Name", type: "text", required: true },
        { key: "dob", label: "Date of birth (optional)", type: "date" },
        { key: "description", label: "Short personal note (optional)", type: "textarea", placeholder: "Who they are to you…" },
        { key: "memory", label: "Memory (optional)", type: "textarea", placeholder: "A moment worth keeping…" },
      ]}
    />
  );
}
