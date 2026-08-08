import { auth } from "@/auth";
import { redirect } from "next/navigation";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/common/Header";
import { prisma } from "@/lib/prisma";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }


  const user = await prisma.user.findUnique({
    where: {
      email: session.user?.email ?? "",
    },
    include: {
      sorareAccount: true,
      cards: true,
    },
  });


  const sorareSlug =
    user?.sorareAccount?.slug ?? null;


  const totalCards =
    user?.cards.length ?? 0;


  const galleryValue =
    user?.cards.reduce(
      (sum, card) => sum + (card.marketValue ?? 0),
      0
    ) ?? 0;


  return (

    <main
      className="
      flex
      min-h-screen
      bg-[#0F0B1F]
      text-white
      "
    >

      <Sidebar
        sorareSlug={sorareSlug}
      />


      <div
        className="
        flex
        min-h-screen
        flex-1
        flex-col
        "
      >


        <div
          className="
          sticky
          top-0
          z-50
          "
        >

          <Header
            sorareSlug={sorareSlug}
            avatarUrl={null}
            totalCards={totalCards}
            galleryValue={galleryValue}
          />

        </div>


        <section
          className="
          flex-1
          overflow-y-auto
          bg-[#0F0B1F]
          p-8
          "
        >

          <div
            className="
            mx-auto
            max-w-[1600px]
            "
          >

            {children}

          </div>

        </section>


      </div>

    </main>

  );
}