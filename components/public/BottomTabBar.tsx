"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/",
    label: "Home",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 11.5 12 4l9 7.5M5.5 10v9.5A1.5 1.5 0 0 0 7 21h3.5v-5.5a1.5 1.5 0 0 1 1.5-1.5h0a1.5 1.5 0 0 1 1.5 1.5V21H17a1.5 1.5 0 0 0 1.5-1.5V10"
      />
    ),
  },
  {
    href: "/destinations",
    label: "Explore",
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11Z" />
        <circle cx="12" cy="10" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    href: "/packages",
    label: "Packages",
    icon: (
      <>
        <rect x="3.5" y="7.5" width="17" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" />
      </>
    ),
  },
  {
    href: "/things-to-do",
    label: "Things To Do",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.5 9.5-1.8 4.2-4.2 1.8 1.8-4.2 4.2-1.8Z" />
      </>
    ),
  },
  {
    href: "/contact",
    label: "Enquire",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 5.5h16A1.5 1.5 0 0 1 21.5 7v9A1.5 1.5 0 0 1 20 17.5H8l-4.5 3.5V7A1.5 1.5 0 0 1 4 5.5Z"
      />
    ),
  },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {tabs.map((tab) => {
        const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
              active ? "text-orange" : "text-ink-soft"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={active ? 2 : 1.75}
              className="h-6 w-6"
              aria-hidden="true"
            >
              {tab.icon}
            </svg>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
