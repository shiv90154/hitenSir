import { listAll } from "@/lib/db/categories";
import { deleteCategoryAction } from "@/lib/db/categories-actions";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { CategoryRow } from "@/components/admin/CategoryRow";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await listAll();

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-semibold text-ink">Categories</h1>

      <div className="rounded-lg border border-border bg-white p-5">
        <CategoryForm />
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-admin-surface text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Applies to</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-ink-soft">
                  No categories yet.
                </td>
              </tr>
            )}
            {categories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                deleteAction={async () => {
                  "use server";
                  await deleteCategoryAction(category.id);
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
