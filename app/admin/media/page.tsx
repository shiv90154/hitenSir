import { prisma } from "@/lib/db/client";
import { MediaUploadForm } from "@/components/admin/MediaUploadForm";
import { MediaGrid } from "@/components/admin/MediaGrid";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-semibold text-ink">Media Library</h1>

      <div className="rounded-lg border border-border bg-white p-5">
        <MediaUploadForm />
      </div>

      <MediaGrid media={media} />
    </div>
  );
}
