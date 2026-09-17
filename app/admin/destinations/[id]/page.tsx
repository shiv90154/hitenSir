import { notFound } from "next/navigation";
import { getById } from "@/lib/db/destinations";
import { updateDestinationAction } from "@/lib/db/destinations-actions";
import { getRelatedIds } from "@/lib/db/content-relations";
import { DestinationForm } from "@/components/admin/DestinationForm";
import { prisma } from "@/lib/db/client";

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [destination, media, otherDestinations, nearbyDestinationIds] = await Promise.all([
    getById(id),
    prisma.media.findMany({
      select: { id: true, url: true, altText: true, title: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.destination.findMany({
      where: { NOT: { id } },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    getRelatedIds("DESTINATION", id, "DESTINATION", "NEARBY"),
  ]);

  if (!destination) notFound();

  const boundAction = updateDestinationAction.bind(null, id);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink">
        Edit {destination.name}
      </h1>
      <DestinationForm
        action={boundAction}
        submitLabel="Save Changes"
        media={media}
        otherDestinations={otherDestinations}
        defaultValues={{ ...destination, nearbyDestinationIds }}
      />
    </div>
  );
}
