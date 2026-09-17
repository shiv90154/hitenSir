import { ActivityForm } from "@/components/admin/ActivityForm";
import { createActivityAction } from "@/lib/db/activities-actions";
import { prisma } from "@/lib/db/client";

export default async function NewActivityPage() {
  const destinations = await prisma.destination.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink">New Activity</h1>
      <ActivityForm
        action={createActivityAction}
        submitLabel="Create Activity"
        destinations={destinations}
      />
    </div>
  );
}
