import { prisma } from "@/lib/db/client";
import { deleteTestimonialAction } from "@/lib/db/testimonials-actions";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { TestimonialRow } from "@/components/admin/TestimonialRow";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-semibold text-ink">Testimonials</h1>

      <div className="rounded-lg border border-border bg-white p-5">
        <TestimonialForm />
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-admin-surface text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Quote</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {testimonials.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-ink-soft">
                  No testimonials yet.
                </td>
              </tr>
            )}
            {testimonials.map((testimonial) => (
              <TestimonialRow
                key={testimonial.id}
                testimonial={testimonial}
                deleteAction={async () => {
                  "use server";
                  await deleteTestimonialAction(testimonial.id);
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
