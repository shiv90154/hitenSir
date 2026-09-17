import { notFound } from "next/navigation";
import { getById } from "@/lib/db/galleries";
import { updateGalleryAction } from "@/lib/db/galleries-actions";
import { GalleryForm } from "@/components/admin/GalleryForm";
import { prisma } from "@/lib/db/client";

export default async function EditGalleryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [gallery, media] = await Promise.all([
    getById(id),
    prisma.media.findMany({
      select: { id: true, url: true, altText: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!gallery) notFound();

  const boundAction = updateGalleryAction.bind(null, id);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Edit {gallery.title}</h1>
      <GalleryForm
        action={boundAction}
        submitLabel="Save Changes"
        media={media}
        defaultValues={{ ...gallery, mediaIds: gallery.images.map((i) => i.mediaId) }}
      />
    </div>
  );
}
