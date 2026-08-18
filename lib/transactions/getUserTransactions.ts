import { prisma } from "@/lib/prisma";

export type UnifiedTransaction = {
  id: string;

  type: "BUY" | "SELL";

  playerName: string;

  rarity: string;

  price: number | null;

  date: string | Date;

  source?: string;
};


export async function getUserTransactions(
  userId: string
): Promise<UnifiedTransaction[]> {

  const transactions =
    await prisma.transaction.findMany({

      where: {
        userId,
      },

      orderBy: {
        date: "desc",
      },

    });


  return transactions.map(
    (transaction) => ({

      id: transaction.id,

      type:
        transaction.type === "SELL"
          ? "SELL"
          : "BUY",

      playerName:
        transaction.playerName,

      rarity:
        transaction.rarity,

      price:
        transaction.price,

      date:
        transaction.date,

      source:
        "SORARE",

    })
  );

}
