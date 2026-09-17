import { getCurrentAdmin } from "@/lib/auth/session";
import { Sidebar } from "@/components/admin/Sidebar";
import { TopBarTitle } from "@/components/admin/TopBarTitle";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();

  // The /admin/login route renders its own full-page layout with no sidebar.
  if (!admin) {
    return <div className="min-h-full bg-admin-surface font-sans">{children}</div>;
  }

  return (
    <div className="flex min-h-full bg-admin-surface font-sans">
      {/* CSS-only mobile sidebar toggle: no JS needed. The checkbox is a
          sibling of <Sidebar>'s root element, so peer-checked: on it (inside
          Sidebar.tsx) controls the drawer; the label can toggle it from
          anywhere, including deep inside the header below. */}
      <input type="checkbox" id="admin-sidebar-toggle" className="peer hidden" />
      <label
        htmlFor="admin-sidebar-toggle"
        aria-hidden="true"
        className="fixed inset-0 z-30 hidden bg-black/40 peer-checked:block lg:!hidden"
      />
      <Sidebar />
      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center gap-3 border-b border-border bg-white px-4 sm:px-8">
          <label
            htmlFor="admin-sidebar-toggle"
            aria-label="Toggle menu"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border text-ink lg:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </label>
          <div className="flex flex-1 items-center justify-between gap-3">
            <TopBarTitle />
            <p className="truncate text-sm font-medium text-ink-soft">Signed in as {admin.email}</p>
          </div>
        </header>
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
