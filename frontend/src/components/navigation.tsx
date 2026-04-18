"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/signup", label: "Sign Up" },
  { href: "/login", label: "Login" },
  { href: "/profile", label: "Profile" },
  { href: "/explorer", label: "Features" },
  { href: "/response", label: "Session" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Smart Hostel</p>
            <p className="text-lg font-semibold text-white">Student Portal</p>
          </div>
          <p className="text-xs text-slate-300">Frontend aligned with your backend features</p>
        </div>
        <nav className="flex flex-wrap gap-2">
        {ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
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
      </div>
    </header>
  );
}
