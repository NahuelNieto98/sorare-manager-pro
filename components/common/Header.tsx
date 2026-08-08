"use client";

import { useRouter } from "next/navigation";

import {
  Bell,
  Settings,
  UserCircle,
} from "lucide-react";

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

      {/* Logo */}

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
          Tu centro de gestión Sorare
        </p>

      </div>



      {/* User actions */}


      <div
        className="
        flex
        items-center
        gap-4
        "
      >


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

          <p
            className="
            text-xs
            text-zinc-400
            "
          >
            Cuenta conectada
          </p>


          <p
            className="
            font-bold
            text-white
            "
          >
            {sorareSlug ?? "Usuario"}
          </p>


        </div>




        <button
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

          <Bell size={20}/>

        </button>





        <button
          onClick={() => router.push("/settings")}
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

          <Settings size={20}/>

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