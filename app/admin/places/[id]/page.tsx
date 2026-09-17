import { notFound } from "next/navigation";
import { getById } from "@/lib/db/places";
import { updatePlaceAction } from "@/lib/db/places-actions";
import { PlaceForm } from "@/components/admin/PlaceForm";
import { prisma } from "@/lib/db/client";

export default async function EditPlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [place, destinations] = await Promise.all([
    getById(id),
    prisma.destination.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  if (!place) notFound();

  const boundAction = updatePlaceAction.bind(null, id);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Edit {place.name}</h1>
      <PlaceForm
        action={boundAction}
        submitLabel="Save Changes"
        destinations={destinations}
        defaultValues={place}
      />
    </div>
  );
}
