import { GalleryForm } from "@/components/admin/GalleryForm";
import { createGalleryAction } from "@/lib/db/galleries-actions";
import { prisma } from "@/lib/db/client";

export default async function NewGalleryPage() {
  const media = await prisma.media.findMany({
    select: { id: true, url: true, altText: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink">New Gallery</h1>
      <GalleryForm action={createGalleryAction} submitLabel="Create Gallery" media={media} />
    </div>
  );
}
