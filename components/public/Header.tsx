import Link from "next/link";
import { getSiteSettings } from "@/lib/db/settings";
import { Logo } from "@/components/public/Logo";
import { NavLink } from "@/components/public/NavLink";
import { MobileNav } from "@/components/public/MobileNav";

const navLinks = [
  { href: "/destinations", label: "Destinations" },
  { href: "/places", label: "Places" },
  { href: "/packages", label: "Packages" },
  { href: "/things-to-do", label: "Things To Do" },
  { href: "/blog", label: "Blog" },
  { href: "/guides", label: "Guides" },
  { href: "/gallery", label: "Gallery" },
];

export async function Header() {
  const settings = await getSiteSettings();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-16">
        <Link href="/" className="shrink-0">
          <Logo siteName={settings.siteName} className="text-2xl" />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="hidden rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 lg:inline-block"
          >
            Enquire Now
          </Link>
          <MobileNav navLinks={navLinks} />
        </div>
      </div>
    </header>
  );
}
