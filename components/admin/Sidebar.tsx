"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/auth/actions";
import { adminNavGroups, isNavLinkActive } from "@/components/admin/admin-nav";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex h-full w-64 -translate-x-full flex-col bg-admin-sidebar text-white/80 transition-transform duration-200 peer-checked:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0">
      <div className="px-6 py-6">
        <p className="font-sans text-lg font-semibold text-white">
          Bharat<span className="text-orange">Trip</span>{" "}
          <span className="font-normal text-white/60">Admin</span>
        </p>
      </div>
      <nav aria-label="Admin sections" className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
        {adminNavGroups.map((group) => (
          <div key={group.title || "root"}>
            {group.title && (
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-white/40">
                {group.title}
              </p>
            )}
            <div className="mt-1 space-y-0.5">
              {group.links.map((link) => {
                const active = isNavLinkActive(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => {
                      // Close the mobile drawer after navigating (the layout
                      // persists across client-side route changes, so the
                      // checkbox otherwise stays checked).
                      const toggle = document.getElementById(
                        "admin-sidebar-toggle"
                      ) as HTMLInputElement | null;
                      if (toggle) toggle.checked = false;
                    }}
                    className={`block rounded-md border-l-2 px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-admin-sidebar ${
                      active
                        ? "border-orange bg-white/10 text-white"
                        : "border-transparent text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <form action={logoutAction} className="border-t border-white/10 p-3">
        <button className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-admin-sidebar">
          Log out
        </button>
      </form>
    </aside>
  );
}
