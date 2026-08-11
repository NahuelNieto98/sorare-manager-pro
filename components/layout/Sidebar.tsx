"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

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
];


const productLinks = [
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



export default function Sidebar({
  sorareSlug,
}: {
  sorareSlug: string | null;
}) {


  const pathname = usePathname();

  const t = useTranslations("sidebar");



  const locale =
    pathname.split("/")[1] || "es";





  const renderLink = (
    item: any
  ) => {


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

          {t(item.key)}

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

        {t("menu")}


      </h2>





      <nav className="space-y-2">


        {
          links.map(renderLink)
        }




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

          {t("product")}


        </p>





        {
          productLinks.map(renderLink)
        }




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



            <span

              className="
                font-bold
                text-white
              "

            >

              {t("system")}


            </span>



          </div>




          <p

            className="
              mt-3
              text-sm
              text-zinc-400
            "

          >

            🟢 {t("api")}


          </p>




          {
            sorareSlug && (

              <p

                className="
                  mt-2
                  text-sm
                  text-zinc-400
                "

              >

                {t("account")}:

                <span

                  className="
                    ml-1
                    text-white
                  "

                >

                  {sorareSlug}


                </span>


              </p>

            )
          }



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


          {t("settings")}


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



          <p

            className="
              mt-3
              font-bold
              text-white
            "

          >

            {t("trial")}


          </p>




          <p

            className="
              mt-1
              text-sm
              text-zinc-400
            "

          >

            {t("days")}


          </p>




        </div>




      </div>



    </aside>


  );

}