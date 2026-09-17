import { notFound } from "next/navigation";
import { getById } from "@/lib/db/activities";
import { updateActivityAction } from "@/lib/db/activities-actions";
import { ActivityForm } from "@/components/admin/ActivityForm";
import { prisma } from "@/lib/db/client";

export default async function EditActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [activity, destinations] = await Promise.all([
    getById(id),
    prisma.destination.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  if (!activity) notFound();

  const boundAction = updateActivityAction.bind(null, id);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Edit {activity.name}</h1>
      <ActivityForm
        action={boundAction}
        submitLabel="Save Changes"
        destinations={destinations}
        defaultValues={{ ...activity, priceFrom: activity.priceFrom?.toString() ?? null }}
      />
    </div>
  );
}
