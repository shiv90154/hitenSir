import { getSiteSettings } from "@/lib/db/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Settings</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
