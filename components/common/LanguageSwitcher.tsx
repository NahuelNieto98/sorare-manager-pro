"use client";

import { usePathname, useRouter } from "next/navigation";


const languages = [
  {
    code: "es",
    label: "🇪🇸 ES",
  },
  {
    code: "en",
    label: "🇬🇧 EN",
  },
  {
    code: "fr",
    label: "🇫🇷 FR",
  },
];


export default function LanguageSwitcher() {

  const pathname = usePathname();

  const router = useRouter();


  const currentLocale =
    pathname.split("/")[1] || "es";



  function changeLanguage(
    locale: string
  ) {


    const parts =
      pathname.split("/");


    parts[1] = locale;


    router.push(
      parts.join("/")
    );

  }



  return (

    <div
      className="
        flex
        items-center
        gap-1
        rounded-xl
        border
        border-white/10
        bg-white/5
        p-1
      "
    >

      {
        languages.map((language)=>(

          <button

            key={language.code}

            onClick={() =>
              changeLanguage(language.code)
            }

            className={`
              rounded-lg
              px-2
              py-1
              text-xs
              font-bold
              transition

              ${
                currentLocale === language.code
                  ? "bg-violet-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }
            `}

          >

            {language.label}

          </button>

        ))
      }


    </div>

  );

}