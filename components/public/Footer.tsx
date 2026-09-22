import Link from "next/link";
import Image from "next/image";
import { getSiteSettings } from "@/lib/db/settings";
import { Logo } from "@/components/public/Logo";
import { SocialIcon } from "@/components/public/SocialIcon";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/destinations", label: "Destinations" },
      { href: "/packages", label: "Packages" },
      { href: "/things-to-do", label: "Things To Do" },
      { href: "/gallery", label: "Gallery" },
    ],
  },
  {
    title: "Read",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/guides", label: "Travel Guides" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/contact", label: "Contact Us" },
      { href: "/contact#fraud-notice", label: "Beware of Fraud" },
    ],
  },
];

export async function Footer() {
  const settings = await getSiteSettings();

  const socialLinks = [
    { label: "Facebook", href: settings.socialFacebook },
    { label: "Instagram", href: settings.socialInstagram },
    { label: "Twitter / X", href: settings.socialTwitter },
    { label: "YouTube", href: settings.socialYoutube },
  ].filter((s) => s.href);

  return (
    <footer className="mt-24 bg-navy-dark text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-16">
        <div>
          <Logo siteName={settings.siteName} variant="light" className="h-14" />
          <p className="mt-3 max-w-xs text-sm text-white/60">
            {settings.tagline || "Curated travel across Himachal Pradesh."}
          </p>
          <div className="mt-4 space-y-1.5">
            {settings.contactEmail && (
              <p className="text-sm text-white/70">
                <a href={`mailto:${settings.contactEmail}`} className="hover:underline">
                  {settings.contactEmail}
                </a>
              </p>
            )}
            {settings.contactPhone && (
              <p className="text-sm text-white/70">
                <a href={`tel:${settings.contactPhone}`} className="hover:underline">
                  {settings.contactPhone}
                </a>
              </p>
            )}
            {settings.contactPhone2 && (
              <p className="text-sm text-white/70">
                <a href={`tel:${settings.contactPhone2}`} className="hover:underline">
                  {settings.contactPhone2}
                </a>
              </p>
            )}
            {settings.address && <p className="max-w-xs text-sm text-white/70">{settings.address}</p>}
          </div>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/50">
              {column.title}
            </p>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/70 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        {socialLinks.length > 0 && (
          <nav aria-label="Social media">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Follow</p>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.label}
                    title={link.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 hover:border-white/30 hover:text-white"
                  >
                    <SocialIcon label={link.label} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
      <div className="border-t border-white/10 px-6 py-8 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-wrap items-start justify-center gap-8">
          <div className="flex flex-col items-center gap-2.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Accredited By</p>
            <div className="flex h-16 items-center rounded-xl bg-white px-5">
              <Image
                src="/accreditation-logos.png"
                alt="Ministry of Tourism (Government of India), PATA, ATOAI, TAAI and Incredible India"
                width={281}
                height={136}
                className="h-10 w-auto"
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/50">We Accept</p>
            <div className="flex h-16 items-center rounded-xl bg-white px-5">
              <Image
                src="/payment-methods.png"
                alt="We accept Visa, Mastercard, PayPal, American Express, Maestro and Electron"
                width={276}
                height={27}
                className="h-6 w-auto"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-white/50 lg:px-16">
        © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
      </div>
    </footer>
  );
}
