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
  Sparkles,
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

    <aside
      className="
      flex
      min-h-screen
      w-72
      flex-col
      border-r
      border-white/10
      bg-gradient-to-b
      from-[#17112F]
      via-[#120e25]
      to-[#0F0B1F]
      "
    >



      {/* LOGO */}

      <div
        className="
        border-b
        border-white/10
        p-8
        "
      >

        <div
          className="
          flex
          items-center
          gap-3
          "
        >

          <div
            className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            bg-violet-500/20
            "
          >
            <Sparkles
              className="text-violet-300"
              size={25}
            />
          </div>


          <div>

            <h1
              className="
              text-2xl
              font-black
              text-white
              "
            >
              Sorare
            </h1>


            <p
              className="
              text-sm
              text-violet-300
              "
            >
              Manager Pro
            </p>

          </div>


        </div>


      </div>





      {/* NAV */}

      <nav
        className="
        flex-1
        space-y-2
        p-5
        "
      >

        <p
          className="
          mb-4
          px-4
          text-xs
          font-bold
          uppercase
          tracking-[0.25em]
          text-zinc-500
          "
        >
          Menu
        </p>


        {links.map((item) => {

          const Icon = item.icon;

          const active = pathname === item.href;


          return (

            <Link
              key={item.href}
              href={item.href}
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
                  ? `
                  bg-violet-600
                  text-white
                  shadow-lg
                  shadow-violet-900/30
                  `
                  : `
                  text-zinc-400
                  hover:bg-white/5
                  hover:text-white
                  `
              }
              `}
            >

              <Icon
                size={21}
                className={`
                transition
                ${
                  active
                    ? "text-white"
                    : "text-zinc-500 group-hover:text-violet-300"
                }
                `}
              />


              <span className="font-semibold">
                {item.name}
              </span>


            </Link>

          );

        })}


      </nav>





      {/* FOOTER */}

      <div
        className="
        border-t
        border-white/10
        p-5
        "
      >

        <Link
          href="/settings"
          className="
          mb-4
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

          <Settings size={21}/>

          <span className="font-semibold">
            Settings
          </span>

        </Link>





        <div
          className="
          rounded-3xl
          border
          border-violet-500/20
          bg-gradient-to-br
          from-violet-500/10
          to-purple-900/20
          p-5
          "
        >

          <div className="flex items-center gap-3">


            <div
              className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-green-500/10
              "
            >

              <ShieldCheck
                className="text-green-400"
                size={22}
              />

            </div>



            <div>

              <p
                className="
                font-bold
                text-white
                "
              >
                Pro Trial
              </p>


              <p
                className="
                text-xs
                text-zinc-400
                "
              >
                14 días restantes
              </p>

            </div>


          </div>



          <div
            className="
            mt-4
            h-1.5
            overflow-hidden
            rounded-full
            bg-white/10
            "
          >

            <div
              className="
              h-full
              w-2/3
              rounded-full
              bg-gradient-to-r
              from-violet-500
              to-cyan-400
              "
            />

          </div>


        </div>


      </div>


    </aside>

  );
}