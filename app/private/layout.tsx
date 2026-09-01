import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { PrivateShell } from "@/components/private/Shell";

export const metadata: Metadata = {
  title: { absolute: "The Real Me — Private" },
  robots: { index: false, follow: false, noarchive: true },
};

/**
 * Middleware already guards /private/*, but we verify again here so
 * protection holds even if middleware config ever changes.
 */
export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthenticated())) redirect("/login?next=/private");
  return <PrivateShell>{children}</PrivateShell>;
}
