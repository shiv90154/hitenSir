"use client";

import { usePathname } from "next/navigation";
import { getActiveNavLabel } from "@/components/admin/admin-nav";

export function TopBarTitle() {
  const pathname = usePathname();
  return <p className="font-display text-lg font-semibold text-ink">{getActiveNavLabel(pathname)}</p>;
}
