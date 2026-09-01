import type { Metadata } from "next";
import { Gallery } from "@/components/private/Gallery";

export const metadata: Metadata = { title: "Photos — The Real Me" };

export default function PhotosPage() {
  return <Gallery />;
}
