"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, FilePlus2, History } from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid, exact: true },
  { href: "/dashboard/new", label: "New screening", icon: FilePlus2, exact: false },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-surface lg:flex lg:flex-col">
      <div className="flex h-16 items-center px-6">
        <Link href="/" aria-label="Aptiv home">
          <Logo size="md" />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-gradient-to-r from-coral-500/10 to-indigo-500/10 text-indigo-700"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2 rounded-xl bg-surface-muted px-3 py-2.5 text-xs text-muted-foreground">
          <History className="h-4 w-4" />
          History is stored on this device only
        </div>
      </div>
    </aside>
  );
}
