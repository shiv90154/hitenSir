import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { BottomTabBar } from "@/components/public/BottomTabBar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col pb-[calc(4rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <BottomTabBar />
    </div>
  );
}
