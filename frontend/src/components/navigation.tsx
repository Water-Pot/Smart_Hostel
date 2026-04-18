"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/auth", label: "Auth" },
  { href: "/upload", label: "Image Upload" },
  { href: "/explorer", label: "API Explorer" },
  { href: "/response", label: "Response" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <aside className="w-full rounded-2xl border border-white/10 bg-slate-900/70 p-4 backdrop-blur lg:sticky lg:top-4 lg:w-64 lg:self-start">
      <p className="mb-4 text-lg font-semibold text-white">Smart Hostel UI</p>
      <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                active ? "bg-cyan-400 text-slate-950" : "bg-white/5 text-slate-200 hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
