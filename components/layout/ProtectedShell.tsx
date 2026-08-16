"use client";

import { usePathname } from "next/navigation";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/common/Header";

export default function ProtectedShell({
  children,
  sorareSlug,
  totalCards,
  galleryValue,
}: {
  children: React.ReactNode;
  sorareSlug: string | null;
  totalCards: number;
  galleryValue: number;
}) {
  const pathname = usePathname();
  const isLineupBuilder = pathname.includes("/lineup-builder");

  return (
    <main className="flex min-h-screen flex-col bg-[#0F0B1F] text-white md:flex-row">
      {!isLineupBuilder && <Sidebar sorareSlug={sorareSlug} />}

      <div className="flex min-h-screen w-full flex-1 flex-col">
        <div className="sticky top-0 z-50">
          <Header
            sorareSlug={sorareSlug}
            avatarUrl={null}
            totalCards={totalCards}
            galleryValue={galleryValue}
          />
        </div>

        <section
          className={
            isLineupBuilder
              ? "flex-1 overflow-y-auto bg-[#0F0B1F]"
              : "flex-1 overflow-y-auto bg-[#0F0B1F] p-4 md:p-8"
          }
        >
          <div
            className={
              isLineupBuilder
                ? "w-full"
                : "mx-auto w-full max-w-[1600px]"
            }
          >
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
