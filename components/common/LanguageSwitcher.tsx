"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe2 } from "lucide-react";

const languages = [
  {
    code: "es",
    label: "ES",
  },
  {
    code: "en",
    label: "EN",
  },
  {
    code: "fr",
    label: "FR",
  },
];

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const currentLocale =
    pathname.split("/")[1] || "es";

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
        rounded-2xl
        border
        border-white/10
        bg-[#141126]
        p-1
        shadow-lg
        shadow-black/20
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
        <Globe2 size={15} />
      </div>

      <div className="flex items-center gap-0.5">
        {languages.map((language) => {
          const active =
            currentLocale === language.code;

          return (
            <button
              key={language.code}
              type="button"
              onClick={() =>
                changeLanguage(language.code)
              }
              className={`
                min-w-[38px]
                rounded-xl
                px-2.5
                py-2
                text-[11px]
                font-black
                tracking-wide
                transition-all
                duration-200

                ${
                  active
                    ? `
                      bg-violet-600
                      text-white
                      shadow-md
                      shadow-violet-900/40
                    `
                    : `
                      text-zinc-500
                      hover:bg-white/5
                      hover:text-zinc-200
                    `
                }
              `}
            >
              {language.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}