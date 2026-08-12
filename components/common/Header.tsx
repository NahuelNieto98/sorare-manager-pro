"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

import {
  Bell,
  Settings,
  UserCircle,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Boxes,
  ArrowLeftRight,
  Bot,
  BarChart3,
  Rocket,
  Newspaper,
  ChartCandlestick,
} from "lucide-react";

import LanguageSwitcher from "@/components/common/LanguageSwitcher";

type HeaderProps = {
  sorareSlug: string | null;
  avatarUrl: string | null;
  totalCards: number;
  galleryValue: number;
};

const menuItems = [
  {
    key: "dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    key: "gallery",
    href: "/gallery",
    icon: Boxes,
  },
  {
    key: "market",
    href: "/market",
    icon: ChartCandlestick,
  },
  {
    key: "transactions",
    href: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    key: "assistant",
    href: "/assistant",
    icon: Bot,
  },
  {
    key: "analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    key: "roadmap",
    href: "/roadmap",
    icon: Rocket,
  },
  {
    key: "changelog",
    href: "/changelog",
    icon: Newspaper,
  },
];

export default function Header({
  sorareSlug,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const t = useTranslations("header");
  const sidebarT = useTranslations("sidebar");

  const [menuOpen, setMenuOpen] = useState(false);

  const locale =
    pathname.split("/")[1] || "es";

  async function handleLogout() {
    await signOut({
      callbackUrl: `/${locale}`,
    });
  }

  function navigateTo(href: string) {
    setMenuOpen(false);
    router.push(`/${locale}${href}`);
  }

  return (
    <header
      className="
        relative
        flex
        items-center
        justify-between
        border-b
        border-white/10
        bg-[#09090F]/80
        px-3
        py-3
        backdrop-blur-xl
        md:px-8
        md:py-5
      "
    >
      {/* Zona izquierda */}
      <div
        className="
          flex
          min-w-0
          items-center
          gap-2
          md:gap-0
        "
      >
        {/* Menú móvil */}
        <button
          type="button"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="
            flex
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-white/10
            bg-white/5
            p-2.5
            text-zinc-300
            transition
            hover:bg-white/10
            hover:text-white
            md:hidden
          "
        >
          {menuOpen ? (
            <X size={19} />
          ) : (
            <Menu size={19} />
          )}
        </button>

        {/* Marca */}
        <div className="min-w-0">
          <p
            className="
              whitespace-nowrap
              text-xs
              font-black
              uppercase
              tracking-widest
              text-violet-300
              md:text-sm
            "
          >
            <span className="md:hidden">
              Sorare
            </span>

            <span className="hidden md:inline">
              Sorare Manager Pro
            </span>
          </p>

          <p
            className="
              mt-1
              hidden
              text-xs
              text-zinc-400
              md:block
            "
          >
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Acciones */}
      <div
        className="
          flex
          shrink-0
          items-center
          gap-1.5
          md:gap-3
        "
      >
        <LanguageSwitcher />

        {/* Cuenta conectada - escritorio */}
        <div
          className="
            hidden
            rounded-xl
            border
            border-white/10
            bg-white/5
            px-4
            py-2
            md:block
          "
        >
          <p className="text-xs text-zinc-400">
            {t("connectedAccount")}
          </p>

          <p className="font-bold text-white">
            {sorareSlug ?? t("user")}
          </p>
        </div>

        {/* Notificaciones - solo escritorio */}
        <button
          type="button"
          aria-label={t("notifications")}
          className="
            hidden
            rounded-xl
            border
            border-white/10
            bg-white/5
            p-2.5
            text-zinc-300
            transition
            hover:bg-white/10
            hover:text-white
            md:block
            md:p-3
          "
        >
          <Bell size={19} />
        </button>

        {/* Configuración */}
        <button
          type="button"
          aria-label={t("settings")}
          onClick={() =>
            router.push(`/${locale}/settings`)
          }
          className="
            rounded-xl
            border
            border-white/10
            bg-white/5
            p-2.5
            text-zinc-300
            transition
            hover:bg-white/10
            hover:text-white
            md:p-3
          "
        >
          <Settings size={19} />
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          aria-label={t("logout")}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-red-500/20
            bg-red-500/10
            p-2.5
            text-red-300
            transition
            hover:bg-red-500/20
            md:px-3
            md:py-2
          "
        >
          <LogOut size={19} />

          <span className="hidden md:block">
            {t("logout")}
          </span>
        </button>

        {/* Usuario - solo escritorio */}
        <div
          className="
            hidden
            items-center
            gap-2
            rounded-xl
            border
            border-violet-500/20
            bg-violet-500/10
            px-3
            py-2
            md:flex
          "
        >
          <UserCircle
            size={24}
            className="text-violet-300"
          />
        </div>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div
          className="
            absolute
            left-3
            right-3
            top-full
            z-50
            mt-2
            rounded-2xl
            border
            border-white/10
            bg-[#17112F]
            p-3
            shadow-2xl
            shadow-black/40
            md:hidden
          "
        >
          <div className="mb-2 px-3 py-2">
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-widest
                text-zinc-500
              "
            >
              {sidebarT("menu")}
            </p>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const active =
                pathname ===
                `/${locale}${item.href}`;

              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() =>
                    navigateTo(item.href)
                  }
                  className={`
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    text-left
                    transition
                    ${
                      active
                        ? "bg-violet-600 text-white"
                        : "text-zinc-300 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <Icon size={20} />

                  <span className="font-semibold">
                    {sidebarT(item.key)}
                  </span>
                </button>
              );
            })}

            <div className="my-2 border-t border-white/10" />

            <button
              type="button"
              onClick={() =>
                navigateTo("/settings")
              }
              className={`
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-left
                transition
                ${
                  pathname ===
                  `/${locale}/settings`
                    ? "bg-violet-600 text-white"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <Settings size={20} />

              <span className="font-semibold">
                {sidebarT("settings")}
              </span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}