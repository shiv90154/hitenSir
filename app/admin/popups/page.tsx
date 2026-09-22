import { getQuotePopupSettings } from "@/lib/db/quote-popup";
import { getCtaPopupSettings } from "@/lib/db/cta-popup";
import { prisma } from "@/lib/db/client";
import { QuotePopupForm } from "@/components/admin/QuotePopupForm";
import { CtaPopupForm } from "@/components/admin/CtaPopupForm";

export const dynamic = "force-dynamic";

export default async function AdminPopupsPage() {
  const [quotePopup, ctaPopup, media] = await Promise.all([
    getQuotePopupSettings(),
    getCtaPopupSettings(),
    prisma.media.findMany({
      select: { id: true, url: true, altText: true, title: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Popups</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Manage the popups shown to visitors on the public site — the quote-request form and the quick
          call-to-action popup.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">Quote Popup</h2>
        <QuotePopupForm popup={quotePopup} media={media} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">CTA Popup</h2>
        <CtaPopupForm popup={ctaPopup} />
      </section>
    </div>
  );
}
