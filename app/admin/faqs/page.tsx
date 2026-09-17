import { prisma } from "@/lib/db/client";
import { deleteFaqAction } from "@/lib/db/faqs-actions";
import { FaqForm, type FaqContextOptions } from "@/components/admin/FaqForm";
import { FaqRow } from "@/components/admin/FaqRow";

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  const [faqs, packages, destinations, guides] = await Promise.all([
    prisma.faq.findMany({ orderBy: [{ context: "asc" }, { sortOrder: "asc" }] }),
    prisma.package.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.destination.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.blog.findMany({
      where: { postType: "GUIDE" },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
  ]);

  const contextOptions: FaqContextOptions = {
    PACKAGE: packages,
    DESTINATION: destinations,
    GUIDE: guides.map((g) => ({ id: g.id, name: g.title })),
  };

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-semibold text-ink">FAQs</h1>

      <div className="rounded-lg border border-border bg-white p-5">
        <FaqForm contextOptions={contextOptions} />
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-admin-surface text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3">Question</th>
              <th className="px-4 py-3">Context</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {faqs.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-ink-soft">
                  No FAQs yet.
                </td>
              </tr>
            )}
            {faqs.map((faq) => (
              <FaqRow
                key={faq.id}
                faq={faq}
                contextOptions={contextOptions}
                deleteAction={async () => {
                  "use server";
                  await deleteFaqAction(faq.id);
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
