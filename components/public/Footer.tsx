import Link from "next/link";
import { getSiteSettings } from "@/lib/db/settings";
import { Logo } from "@/components/public/Logo";

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
    links: [{ href: "/contact", label: "Contact Us" }],
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
          <Logo siteName={settings.siteName} variant="light" className="text-2xl" />
          <p className="mt-3 max-w-xs text-sm text-white/60">
            {settings.tagline || "Curated travel across Himachal Pradesh."}
          </p>
          {settings.contactEmail && (
            <p className="mt-4 text-sm text-white/70">{settings.contactEmail}</p>
          )}
          {settings.contactPhone && <p className="text-sm text-white/70">{settings.contactPhone}</p>}
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
            <ul className="mt-4 space-y-2.5">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-white/70 hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
      <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-white/50 lg:px-16">
        © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
      </div>
    </footer>
  );
}
