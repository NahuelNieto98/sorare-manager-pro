"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe2 } from "lucide-react";

const languages = [
  {
    code: "es",
    short: "ES",
    flag: "🇪🇸",
  },
  {
    code: "en",
    short: "EN",
    flag: "🇬🇧",
  },
  {
    code: "fr",
    short: "FR",
    flag: "🇫🇷",
  },
];

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const currentLocale = pathname.split("/")[1] || "es";

  function changeLanguage(locale: string) {
    const parts = pathname.split("/");

    parts[1] = locale;

    router.push(parts.join("/"));
  }

  return (
    <div
      className="
        flex
        items-center
        gap-1
        rounded-2xl
        border
        border-white/10
        bg-[#17112F]/90
        p-1.5
        shadow-lg
        shadow-black/20
        backdrop-blur-xl
      "
    >
      <div
        className="
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-xl
          text-zinc-500
        "
      >
        <Globe2 size={16} />
      </div>

      {languages.map((language) => {
        const active = currentLocale === language.code;

        return (
          <button
            key={language.code}
            type="button"
            onClick={() => changeLanguage(language.code)}
            aria-label={`Switch to ${language.short}`}
            className={`
              flex
              items-center
              gap-1.5
              rounded-xl
              px-2.5
              py-1.5
              text-xs
              font-black
              transition-all
              duration-200

              ${
                active
                  ? "bg-violet-600 text-white shadow-md shadow-violet-900/30"
                  : "text-zinc-500 hover:bg-white/5 hover:text-white"
              }
            `}
          >
            <span className="text-sm">
              {language.flag}
            </span>

            <span>
              {language.short}
            </span>
          </button>
        );
      })}
    </div>
  );
}