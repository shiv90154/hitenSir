import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/public/Logo";
import { getSiteSettings } from "@/lib/db/settings";

export const metadata = { title: "Admin Login" };

export default async function AdminLoginPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-6 font-sans">
      <div className="w-full max-w-sm rounded-xl border border-border bg-white p-8">
        <div className="flex items-baseline gap-2">
          <Logo siteName={settings.siteName} className="text-2xl" />
          <span className="text-sm font-medium text-ink-soft">Admin</span>
        </div>
        <p className="mt-1 text-sm text-ink-soft">Sign in to manage your site.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
