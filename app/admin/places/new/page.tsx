import { PlaceForm } from "@/components/admin/PlaceForm";
import { createPlaceAction } from "@/lib/db/places-actions";
import { prisma } from "@/lib/db/client";

export default async function NewPlacePage() {
  const destinations = await prisma.destination.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink">New Place</h1>
      <PlaceForm
        action={createPlaceAction}
        submitLabel="Create Place"
        destinations={destinations}
      />
    </div>
  );
}
