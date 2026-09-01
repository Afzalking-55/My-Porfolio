import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthenticated, privateAreaConfigured } from "@/lib/auth";
import { site } from "@/content/meta";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Private Area — Login",
  description: site.loginIntro,
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  if (await isAuthenticated()) redirect("/private");
  return (
    <main id="main" className="login-page">
      <LoginForm next={next ?? "/private"} configured={privateAreaConfigured()} />
    </main>
  );
}
