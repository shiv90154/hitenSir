export interface AdminNavLink {
  href: string;
  label: string;
}

export interface AdminNavGroup {
  title: string;
  links: AdminNavLink[];
}

export const adminNavGroups: AdminNavGroup[] = [
  { title: "", links: [{ href: "/admin", label: "Dashboard" }] },
  {
    title: "Content",
    links: [
      { href: "/admin/destinations", label: "Destinations" },
      { href: "/admin/places", label: "Places" },
      { href: "/admin/packages", label: "Packages" },
      { href: "/admin/blog", label: "Blogs" },
      { href: "/admin/guides", label: "Guides" },
      { href: "/admin/activities", label: "Things To Do" },
      { href: "/admin/categories", label: "Categories" },
    ],
  },
  {
    title: "Media",
    links: [
      { href: "/admin/media", label: "Media Library" },
      { href: "/admin/galleries", label: "Galleries" },
    ],
  },
  {
    title: "Website",
    links: [
      { href: "/admin/homepage", label: "Homepage" },
      { href: "/admin/navigation", label: "Navigation" },
      { href: "/admin/faqs", label: "FAQs" },
      { href: "/admin/testimonials", label: "Testimonials" },
    ],
  },
  { title: "Leads", links: [{ href: "/admin/enquiries", label: "Enquiries" }] },
  {
    title: "SEO & Settings",
    links: [
      { href: "/admin/seo", label: "Global SEO" },
      { href: "/admin/settings", label: "Settings" },
    ],
  },
];

const flatLinks = adminNavGroups.flatMap((group) => group.links);

/**
 * Finds the nav link whose href is the longest matching prefix of the given
 * pathname (so "/admin/destinations/abc/edit" still highlights "Destinations").
 * "/admin" only matches the dashboard exactly, otherwise every page would
 * highlight "Dashboard" as a prefix match.
 */
export function getActiveNavLabel(pathname: string): string | null {
  let best: AdminNavLink | null = null;

  for (const link of flatLinks) {
    if (link.href === "/admin") {
      if (pathname === "/admin") return link.label;
      continue;
    }
    if (pathname === link.href || pathname.startsWith(`${link.href}/`)) {
      if (!best || link.href.length > best.href.length) {
        best = link;
      }
    }
  }

  return best?.label ?? "Dashboard";
}

export function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}
