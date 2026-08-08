"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Bell,
  Search,
  LogOut,
  Sparkles,
} from "lucide-react";

export default function Header() {
  return (
    <header
      className="
      flex
      items-center
      justify-between
      border-b
      border-white/10
      bg-[#120e25]/80
      px-8
      py-5
      backdrop-blur-xl
      "
    >

      {/* BUSCADOR */}

      <div
        className="
        relative
        w-[460px]
        "
      >

        <Search
          size={19}
          className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-zinc-500
          "
        />


        <input
          placeholder="Buscar jugador, club o carta..."
          className="
          w-full
          rounded-2xl
          border
          border-white/10
          bg-white/5
          py-3.5
          pl-12
          pr-5
          text-sm
          text-white
          outline-none
          placeholder:text-zinc-500
          transition
          focus:border-purple-500/60
          focus:bg-white/10
          "
        />

      </div>




      {/* ACCIONES */}

      <div
        className="
        flex
        items-center
        gap-4
        "
      >


        {/* NOTIFICACIONES */}

        <button
          className="
          group
          relative
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          border
          border-white/10
          bg-white/5
          transition
          hover:bg-white/10
          "
        >

          <Bell
            size={20}
            className="
            text-zinc-300
            transition
            group-hover:text-white
            "
          />


          <span
            className="
            absolute
            right-3
            top-3
            h-2
            w-2
            rounded-full
            bg-purple-400
            "
          />

        </button>





        {/* CONECTAR SORARE */}

        <Link
          href="/connect-sorare"
          className="
          flex
          items-center
          gap-2
          rounded-2xl
          bg-gradient-to-r
          from-purple-600
          to-violet-500
          px-6
          py-3
          font-bold
          text-white
          shadow-lg
          shadow-purple-900/30
          transition
          hover:scale-105
          hover:from-purple-500
          hover:to-violet-400
          "
        >

          <Sparkles size={18}/>

          Conectar Sorare

        </Link>





        {/* LOGOUT */}

        <button
          onClick={() => signOut()}
          className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          border
          border-red-500/20
          bg-red-500/10
          text-red-400
          transition
          hover:bg-red-500/20
          hover:text-red-300
          "
        >

          <LogOut size={20}/>

        </button>


      </div>


    </header>
  );
}