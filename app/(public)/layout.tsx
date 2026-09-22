import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { BottomTabBar } from "@/components/public/BottomTabBar";
import { FloatingSideWidget } from "@/components/public/FloatingSideWidget";
import { QuotePopupModal } from "@/components/public/QuotePopupModal";
import { CtaPopupWidget } from "@/components/public/CtaPopupWidget";
import { getSiteSettings } from "@/lib/db/settings";
import { getQuotePopupSettings } from "@/lib/db/quote-popup";
import { getCtaPopupSettings } from "@/lib/db/cta-popup";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, quotePopup, ctaPopup] = await Promise.all([
    getSiteSettings(),
    getQuotePopupSettings(),
    getCtaPopupSettings(),
  ]);

  return (
    <div className="flex min-h-full flex-col pb-[calc(4rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <BottomTabBar />
      <FloatingSideWidget phone={settings.contactPhone} />
      <QuotePopupModal
        enabled={quotePopup.enabled}
        heading={quotePopup.heading}
        subheading={quotePopup.subheading}
        imageUrls={quotePopup.imageUrls}
        delaySeconds={quotePopup.delaySeconds}
      />
      <CtaPopupWidget
        enabled={ctaPopup.enabled}
        quotePopupEnabled={quotePopup.enabled}
        heading={ctaPopup.heading}
        message={ctaPopup.message}
        delaySeconds={ctaPopup.delaySeconds}
        buttons={ctaPopup.buttons}
        phone={settings.contactPhone}
      />
    </div>
  );
}
