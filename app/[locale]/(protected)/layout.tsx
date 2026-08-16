import { auth } from "@/auth";
import { redirect } from "next/navigation";

import ProtectedShell from "@/components/layout/ProtectedShell";
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
    <ProtectedShell
      sorareSlug={sorareSlug}
      totalCards={totalCards}
      galleryValue={galleryValue}
    >
      {children}
    </ProtectedShell>
  );}