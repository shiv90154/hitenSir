import { prisma } from "@/lib/db/client";
import { deleteNavigationItemAction } from "@/lib/db/navigation-actions";
import { NavigationItemForm } from "@/components/admin/NavigationItemForm";
import { NavigationItemRow } from "@/components/admin/NavigationItemRow";

export const dynamic = "force-dynamic";

export default async function AdminNavigationPage() {
  const items = await prisma.navigationItem.findMany({
    orderBy: { sortOrder: "asc" },
    include: { parent: true },
  });

  const parentOptions = items.filter((i) => !i.parentId).map((i) => ({ id: i.id, label: i.label }));

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-semibold text-ink">Navigation</h1>

      <div className="rounded-lg border border-border bg-white p-5">
        <NavigationItemForm parentOptions={parentOptions} />
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-admin-surface text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3">Label</th>
              <th className="px-4 py-3">URL</th>
              <th className="px-4 py-3">Parent</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-ink-soft">
                  No navigation items yet.
                </td>
              </tr>
            )}
            {items.map((item) => (
              <NavigationItemRow
                key={item.id}
                item={{
                  id: item.id,
                  label: item.label,
                  url: item.url,
                  parentId: item.parentId,
                  parentLabel: item.parent?.label ?? null,
                  sortOrder: item.sortOrder,
                }}
                parentOptions={parentOptions}
                deleteAction={async () => {
                  "use server";
                  await deleteNavigationItemAction(item.id);
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
