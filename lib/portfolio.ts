import { prisma } from "@/lib/prisma";

export async function savePortfolioSnapshot(
  userId: string,
  galleryValue: number,
  roi: number,
  profit: number,
) {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const alreadyExists = await prisma.portfolioSnapshot.findFirst({
    where: {
      userId,
      createdAt: {
        gte: today,
      },
    },
  });

  if (alreadyExists) {
    return;
  }

  await prisma.portfolioSnapshot.create({
    data: {
      userId,
      galleryValue,
      roi,
      profit,
    },
  });
}