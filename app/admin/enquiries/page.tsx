import Link from "next/link";
import { prisma } from "@/lib/db/client";
import { deleteEnquiryAction } from "@/lib/db/enquiries-actions";
import { EnquiryRow } from "@/components/admin/EnquiryRow";

export const dynamic = "force-dynamic";

const statuses = ["NEW", "CONTACTED", "IN_PROGRESS", "CONVERTED", "CLOSED"] as const;

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = statuses.includes(status as (typeof statuses)[number]) ? status : undefined;

  const enquiries = await prisma.enquiry.findMany({
    where: activeStatus ? { status: activeStatus as (typeof statuses)[number] } : undefined,
    orderBy: { createdAt: "desc" },
    include: { destination: true, package: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold text-ink">Enquiries</h1>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Link
            href="/admin/enquiries"
            className={`rounded-full border px-3 py-1.5 font-medium ${
              !activeStatus ? "border-navy bg-navy text-white" : "border-border text-ink-soft hover:border-navy"
            }`}
          >
            All
          </Link>
          {statuses.map((s) => (
            <Link
              key={s}
              href={`/admin/enquiries?status=${s}`}
              className={`rounded-full border px-3 py-1.5 font-medium capitalize ${
                activeStatus === s ? "border-navy bg-navy text-white" : "border-border text-ink-soft hover:border-navy"
              }`}
            >
              {s.toLowerCase().replace("_", " ")}
            </Link>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-admin-surface text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Interested in</th>
              <th className="px-4 py-3">Received</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {enquiries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-soft">
                  No enquiries{activeStatus ? " with this status" : ""}.
                </td>
              </tr>
            )}
            {enquiries.map((enquiry) => (
              <EnquiryRow
                key={enquiry.id}
                enquiry={{
                  id: enquiry.id,
                  name: enquiry.name,
                  email: enquiry.email,
                  phone: enquiry.phone,
                  interestedIn: enquiry.package?.name ?? enquiry.destination?.name ?? "General enquiry",
                  travelDate: enquiry.travelDate,
                  peopleCount: enquiry.peopleCount,
                  message: enquiry.message,
                  adminNotes: enquiry.adminNotes,
                  receivedAt: enquiry.createdAt,
                  status: enquiry.status,
                }}
                deleteAction={async () => {
                  "use server";
                  await deleteEnquiryAction(enquiry.id);
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
