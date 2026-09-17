import { getSeoDefaults } from "@/lib/db/seo-settings";
import { SeoSettingsForm } from "@/components/admin/SeoSettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSeoPage() {
  const seo = await getSeoDefaults();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Global SEO</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Used as the fallback whenever a page doesn&apos;t set its own SEO title or
          description.
        </p>
      </div>
      <SeoSettingsForm seo={seo} />
    </div>
  );
}
