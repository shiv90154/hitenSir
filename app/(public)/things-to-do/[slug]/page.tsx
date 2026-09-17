import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBySlug, listPublished } from "@/lib/db/activities";
import { DifficultyBadge } from "@/components/public/DifficultyBadge";

export const revalidate = 3600;

export async function generateStaticParams() {
  const activities = await listPublished();
  return activities.map((activity) => ({ slug: activity.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const activity = await getBySlug(slug);
  if (!activity) return {};

  const seo = (activity.seo as Record<string, string> | null) ?? {};
  return {
    title: seo.title ?? activity.name,
    description: seo.description ?? activity.description ?? undefined,
  };
}

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const activity = await getBySlug(slug);

  if (!activity || activity.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 lg:px-16">
      <nav aria-label="Breadcrumb" className="text-xs text-ink-soft">
        <Link href="/things-to-do" className="hover:underline">
          Things To Do
        </Link>{" "}
        / <span aria-current="page">{activity.name}</span>
      </nav>

      <h1 className="mt-3 font-display text-4xl font-semibold text-ink">{activity.name}</h1>
      <Link
        href={`/destinations/${activity.destination.slug}`}
        className="mt-1 inline-block text-sm text-navy hover:underline"
      >
        {activity.destination.name}
      </Link>

      <div className="mt-4 flex flex-wrap gap-2">
        {activity.duration && (
          <span className="rounded-full border border-border px-3 py-1 text-xs text-ink-soft">
            {activity.duration}
          </span>
        )}
        {activity.difficulty && <DifficultyBadge difficulty={activity.difficulty} />}
        {activity.bestSeason && (
          <span className="rounded-full border border-border px-3 py-1 text-xs text-ink-soft">
            Best: {activity.bestSeason}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        {activity.priceFrom && (
          <p className="text-lg font-semibold text-orange">From ₹{activity.priceFrom.toString()}</p>
        )}
        <Link
          href={`/contact?activityId=${activity.id}&activityName=${encodeURIComponent(activity.name)}`}
          className="rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white"
        >
          Enquire
        </Link>
      </div>

      {activity.description && (
        <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
          {activity.description}
        </p>
      )}

      {activity.safetyInfo && (
        <div className="mt-8 rounded-lg border border-border bg-surface p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Safety information
          </p>
          <p className="mt-1 text-sm text-ink-soft">{activity.safetyInfo}</p>
        </div>
      )}
    </div>
  );
}
