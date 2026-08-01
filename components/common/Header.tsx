"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Bell, Search, LogOut } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-purple-900 bg-[#17112F] px-8 py-6">
      <div className="relative w-[420px]">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
        />

        <input
          placeholder="Buscar jugador, club o carta..."
          className="w-full rounded-xl border border-purple-900 bg-[#221A40] py-3 pl-11 pr-4 text-white outline-none transition focus:border-purple-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#221A40] hover:bg-[#2C2352] transition">
          <Bell size={20} />
        </button>

        <Link
          href="/connect-sorare"
          className="rounded-xl bg-purple-600 px-5 py-3 font-semibold transition hover:bg-purple-500"
        >
          Conectar Sorare
        </Link>

        <button
          onClick={() => signOut()}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 hover:bg-red-500 transition"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
