import { prisma } from "@/lib/prisma";

export async function getUserCards(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      cards: {
        orderBy: {
          playerName: "asc",
        },
      },
    },
  });

  return user?.cards ?? [];
}
