import { prisma } from "@/lib/prisma";

type Props = {
  userId: string;
  galleryValue: number;
  roi: number;
  profit: number;
};

export async function saveSnapshot({
  userId,
  galleryValue,
  roi,
  profit,
}: Props) {
  await prisma.portfolioSnapshot.create({
    data: {
      userId,
      galleryValue,
      roi,
      profit,
    },
  });
}
