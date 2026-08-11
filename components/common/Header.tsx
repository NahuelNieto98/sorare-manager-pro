"use client";

import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

import {
  Bell,
  Settings,
  UserCircle,
  LogOut,
} from "lucide-react";

import LanguageSwitcher from "@/components/common/LanguageSwitcher";

type HeaderProps = {
  sorareSlug: string | null;
  avatarUrl: string | null;
  totalCards: number;
  galleryValue: number;
};

export default function Header({
  sorareSlug,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const t = useTranslations("header");

  const locale =
    pathname.split("/")[1] || "es";

  async function handleLogout() {
    await signOut({
      callbackUrl: `/${locale}`,
    });
  }

  return (
    <header
      className="
        flex
        items-center
        justify-between
        border-b
        border-white/10
        bg-[#09090F]/80
        px-8
        py-5
        backdrop-blur-xl
      "
    >
      <div>
        <p
          className="
            text-sm
            font-black
            uppercase
            tracking-widest
            text-violet-300
          "
        >
          Sorare Manager Pro
        </p>

        <p
          className="
            mt-1
            text-xs
            text-zinc-400
          "
        >
          {t("subtitle")}
        </p>
      </div>

      <div
        className="
          flex
          items-center
          gap-3
        "
      >
        <LanguageSwitcher />

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

        <button
          type="button"
          aria-label={t("notifications")}
          className="
            rounded-xl
            border
            border-white/10
            bg-white/5
            p-3
            text-zinc-300
            transition
            hover:bg-white/10
            hover:text-white
          "
        >
          <Bell size={20} />
        </button>

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
            p-3
            text-zinc-300
            transition
            hover:bg-white/10
            hover:text-white
          "
        >
          <Settings size={20} />
        </button>

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
            px-3
            py-2
            text-red-300
            transition
            hover:bg-red-500/20
          "
        >
          <LogOut size={20} />

          <span className="hidden md:block">
            {t("logout")}
          </span>
        </button>

        <div
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-violet-500/20
            bg-violet-500/10
            px-3
            py-2
          "
        >
          <UserCircle
            size={24}
            className="text-violet-300"
          />
        </div>
      </div>
    </header>
  );
}