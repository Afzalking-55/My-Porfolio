import { getPrivateContent, defaultPrivateContent } from "@/lib/private-data";
import { privateSections } from "@/content/private";
import { profile } from "@/content/profile";
import { PrivateDashboard } from "@/components/private/Dashboard";

export default async function PrivateHomePage() {
  const content = await getPrivateContent();
  const defaults = defaultPrivateContent();
  const savedKeys = privateSections
    .map((s) => s.key)
    .filter((k) => content[k] !== undefined && content[k] !== defaults[k]);
  return (
    <PrivateDashboard
      sections={privateSections}
      initialContent={content}
      initialSaved={savedKeys}
      ownerName={profile.name}
    />
  );
}
