import type { Metadata } from "next";
import { Journal } from "@/components/private/Journal";

export const metadata: Metadata = { title: "Journal — The Real Me" };

export default function JournalPage() {
  return <Journal />;
}
