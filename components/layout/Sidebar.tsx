import {
  LayoutDashboard,
  Trophy,
  BarChart3,
  Wallet,
  Settings,
  Boxes,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-72 min-h-screen bg-[#1A1333] border-r border-purple-900 flex flex-col">
      <div className="p-8 border-b border-purple-900">
        <h1 className="text-2xl font-bold text-purple-400">
          Sorare Manager Pro
        </h1>

        <p className="text-sm text-zinc-400 mt-1">Season 2026/27</p>
      </div>

      <nav className="flex-1 p-5 space-y-2">
        <button className="flex items-center gap-3 w-full rounded-xl bg-purple-600 px-4 py-3 font-medium">
          <LayoutDashboard size={20} />
          Dashboard
        </button>

        <button className="flex items-center gap-3 w-full rounded-xl px-4 py-3 hover:bg-[#241845] transition">
          <Boxes size={20} />
          Gallery
        </button>

        <button className="flex items-center gap-3 w-full rounded-xl px-4 py-3 hover:bg-[#241845] transition">
          <Wallet size={20} />
          Market
        </button>

        <button className="flex items-center gap-3 w-full rounded-xl px-4 py-3 hover:bg-[#241845] transition">
          <Trophy size={20} />
          Rewards
        </button>

        <button className="flex items-center gap-3 w-full rounded-xl px-4 py-3 hover:bg-[#241845] transition">
          <BarChart3 size={20} />
          Analytics
        </button>
      </nav>

      <div className="p-5 border-t border-purple-900">
        <button className="flex items-center gap-3 w-full rounded-xl px-4 py-3 hover:bg-[#241845] transition">
          <Settings size={20} />
          Settings
        </button>
      </div>
    </aside>
  );
}
