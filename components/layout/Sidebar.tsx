"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Boxes,
  ArrowLeftRight,
  Bot,
  BarChart3,
  ChartCandlestick,
  Settings,
  ShieldCheck,
  Activity,
  Rocket,
  Newspaper,
} from "lucide-react";

const links = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    key: "gallery",
    label: "Galería",
    href: "/gallery",
    icon: Boxes,
  },
  {
    key: "market",
    label: "Market",
    href: "/market",
    icon: ChartCandlestick,
  },
  {
    key: "transactions",
    label: "Transacciones",
    href: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    key: "assistant",
    label: "Scout IA",
    href: "/assistant",
    icon: Bot,
  },
  {
    key: "analytics",
    label: "Analítica",
    href: "/analytics",
    icon: BarChart3,
  },
];

const productLinks = [
  {
    key: "roadmap",
    label: "Roadmap",
    href: "/roadmap",
    icon: Rocket,
  },
  {
    key: "changelog",
    label: "Novedades",
    href: "/changelog",
    icon: Newspaper,
  },
];

export default function Sidebar({
  sorareSlug,
}: {
  sorareSlug: string | null;
}) {
  const pathname = usePathname();

  const locale = pathname.split("/")[1] || "es";

  const renderLink = (item: any) => {
    const Icon = item.icon;

    const active =
      pathname === `/${locale}${item.href}`;

    return (
      <Link
        key={item.href}
        href={`/${locale}${item.href}`}
        className={`
        group
        flex
        items-center
        gap-4
        rounded-2xl
        px-4
        py-3.5
        transition-all

        ${
          active
            ? "bg-violet-600 text-white shadow-lg shadow-violet-900/30"
            : "text-zinc-400 hover:bg-white/5 hover:text-white"
        }
        `}
      >
        <Icon
          size={21}
          className={`
          ${
            active
              ? "text-white"
              : "text-zinc-500 group-hover:text-violet-300"
          }
          `}
        />

        <span>
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <aside
      className="
      hidden
      md:flex
      w-72
      flex-col
      border-r
      border-white/10
      bg-[#0F0B1F]
      p-6
      "
    >
      <h2
        className="
        mb-8
        text-xl
        font-black
        text-white
        "
      >
        Menú
      </h2>

      <nav className="space-y-2">

        {links.map(renderLink)}

        <div
          className="
          my-6
          border-t
          border-white/10
          "
        />

        <p
          className="
          mb-3
          px-4
          text-xs
          font-bold
          uppercase
          tracking-widest
          text-zinc-500
          "
        >
          Producto
        </p>

        {productLinks.map(renderLink)}

      </nav>

      <div
        className="
        mt-auto
        space-y-4
        "
      >

        <div
          className="
          rounded-2xl
          border
          border-white/10
          bg-white/5
          p-4
          "
        >

          <div
            className="
            flex
            items-center
            gap-3
            "
          >

            <Activity
              size={21}
              className="text-green-400"
            />

            <span className="font-bold text-white">
              Sistema activo
            </span>

          </div>

          <p className="mt-3 text-sm text-zinc-400">
            🟢 API conectada
          </p>


          {sorareSlug && (
            <p className="mt-2 text-sm text-zinc-400">
              Cuenta:

              <span className="ml-1 text-white">
                {sorareSlug}
              </span>

            </p>
          )}

        </div>


        <Link
          href={`/${locale}/settings`}
          className="
          flex
          items-center
          gap-4
          rounded-2xl
          px-4
          py-3.5
          text-zinc-400
          transition
          hover:bg-white/5
          hover:text-white
          "
        >

          <Settings size={22} />

          Configuración

        </Link>


        <div
          className="
          rounded-2xl
          border
          border-purple-500/20
          bg-purple-500/10
          p-4
          "
        >

          <ShieldCheck
            className="text-green-400"
            size={22}
          />

          <p className="mt-3 font-bold text-white">
            Prueba Pro
          </p>

          <p className="mt-1 text-sm text-zinc-400">
            14 días restantes
          </p>

        </div>

      </div>

    </aside>
  );
}