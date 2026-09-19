import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/db/settings";
import { getSeoDefaults } from "@/lib/db/seo-settings";
import { StructuredData } from "@/components/shared/StructuredData";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const [settings, seo] = await Promise.all([getSiteSettings(), getSeoDefaults()]);

  return {
    title: {
      default: `${settings.siteName} — ${settings.tagline}`,
      template: `%s | ${seo.defaultTitleSuffix}`,
    },
    description: seo.defaultDescription,
    metadataBase: new URL(SITE_URL),
    applicationName: settings.siteName,
    alternates: { canonical: "./" },
    openGraph: { siteName: settings.siteName, type: "website", locale: "en_IN" },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();
  const sameAs = [settings.socialFacebook, settings.socialInstagram, settings.socialTwitter, settings.socialYoutube].filter(Boolean);
  const phones = [settings.contactPhone, settings.contactPhone2].filter(Boolean);

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${workSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@graph": [
              { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: settings.siteName, alternateName: "Bharat Trip", inLanguage: "en-IN" },
              {
                "@type": "TravelAgency",
                "@id": `${SITE_URL}/#organization`,
                name: settings.siteName,
                url: `${SITE_URL}/`,
                logo: `${SITE_URL}/logo.png`,
                image: `${SITE_URL}/logo.png`,
                ...(settings.contactEmail ? { email: settings.contactEmail } : {}),
                ...(phones.length ? { telephone: phones } : {}),
                ...(sameAs.length ? { sameAs } : {}),
              },
            ],
          }}
        />
        {children}
      </body>
    </html>
  );
}
