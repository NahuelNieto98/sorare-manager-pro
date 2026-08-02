"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  ArrowLeftRight,
  Bot,
  BarChart3,
  Settings,
  ShieldCheck,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Gallery",
    href: "/gallery",
    icon: Boxes,
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    name: "Scout IA",
    href: "/assistant",
    icon: Bot,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-72 flex-col border-r border-violet-700/30 bg-[#17112F]">
      <div className="border-b border-violet-700/30 p-8">
        <h1 className="text-3xl font-extrabold text-violet-400">Sorare</h1>

        <p className="mt-1 text-sm text-zinc-400">Manager Pro</p>
      </div>

      <nav className="flex-1 space-y-2 p-5">
        {links.map((item) => {
          const Icon = item.icon;

          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-all ${
                active
                  ? "bg-violet-600 text-white font-semibold shadow-lg"
                  : "text-zinc-400 hover:bg-[#221A40] hover:text-white"
              }`}
            >
              <Icon size={20} />

              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-violet-700/30 p-5">
        <Link
          href="/settings"
          className="mb-3 flex items-center gap-4 rounded-xl px-4 py-3 text-zinc-400 transition hover:bg-[#221A40] hover:text-white"
        >
          <Settings size={20} />
          Settings
        </Link>

        <div className="rounded-2xl border border-violet-700/30 bg-[#221A40] p-5">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-green-400" size={22} />

            <div>
              <p className="font-semibold text-white">Pro Trial</p>

              <p className="text-xs text-zinc-400">14 días restantes</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
