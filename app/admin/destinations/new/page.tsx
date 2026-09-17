import { DestinationForm } from "@/components/admin/DestinationForm";
import { createDestinationAction } from "@/lib/db/destinations-actions";
import { prisma } from "@/lib/db/client";

export default async function NewDestinationPage() {
  const media = await prisma.media.findMany({
    select: { id: true, url: true, altText: true, title: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink">New Destination</h1>
      <DestinationForm action={createDestinationAction} submitLabel="Create Destination" media={media} />
    </div>
  );
}
