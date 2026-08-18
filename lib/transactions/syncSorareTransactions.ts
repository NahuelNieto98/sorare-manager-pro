import { prisma } from "@/lib/prisma";

import { getUserPurchases } from "@/lib/sorare/getUserPurchases";
import { getUserSales } from "@/lib/sorare/getUserSales";

import { mapPurchaseToTransaction } from "@/lib/sorare/mapPurchaseToTransaction";
import { mapSaleToTransaction } from "@/lib/sorare/mapSaleToTransaction";


export async function syncSorareTransactions(
  userId: string
) {

  let purchases: any[] = [];
  let sales: any[] = [];


  try {

    purchases =
      await getUserPurchases(userId);

  } catch (error) {

    console.error(
      "❌ ERROR REAL SINCRONIZANDO COMPRAS:",
      error
    );

  }


  try {

    sales =
      await getUserSales(userId);

  } catch (error) {

    console.error(
      "Error sincronizando ventas de Sorare:",
      error
    );

  }


  const mappedPurchases =
    purchases
      .map(mapPurchaseToTransaction)
      .filter(
        (transaction) =>
          transaction.type === "BUY" &&
          typeof transaction.price === "number" &&
          transaction.price > 0 &&
          transaction.playerName
      );


  const mappedSales =
    sales
      .map(mapSaleToTransaction)
      .filter(
        (transaction) =>
          transaction.type === "SELL" &&
          typeof transaction.price === "number" &&
          transaction.price > 0 &&
          transaction.playerName
      );


  const transactions = [
    ...mappedPurchases,
    ...mappedSales,
  ];


  console.log(
    "📊 SYNC SORARE:",
    {
      purchasesFromSorare: purchases.length,
      salesFromSorare: sales.length,
      validPurchases: mappedPurchases.length,
      validSales: mappedSales.length,
      totalValid: transactions.length,
    }
  );


  let created = 0;
  let skipped = 0;

  const transactionIds =
    transactions.map(
      (transaction) => transaction.id
    );

  const existingTransactions =
    transactionIds.length > 0
      ? await prisma.transaction.findMany({
          where: {
            id: {
              in: transactionIds,
            },
          },
          select: {
            id: true,
          },
        })
      : [];

  const existingIds =
    new Set(
      existingTransactions.map(
        (transaction) => transaction.id
      )
    );

  skipped =
    existingTransactions.length;

  const transactionsToCreate =
    transactions.filter(
      (transaction) =>
        !existingIds.has(transaction.id)
    );

  if (transactionsToCreate.length > 0) {
    await prisma.transaction.createMany({
      data:
        transactionsToCreate.map(
          (transaction) => ({
            id: transaction.id,

            type:
              transaction.type === "SELL"
                ? "SELL"
                : "BUY",

            playerName:
              transaction.playerName,

            rarity:
              transaction.rarity ?? "",

            price:
              transaction.price as number,

            date:
              new Date(transaction.date),

            userId,
          })
        ),
      skipDuplicates: true,
    });

    created =
      transactionsToCreate.length;
  }


  console.log(
    "✅ SYNC COMPLETADO:",
    {
      total: transactions.length,
      created,
      skipped,
    }
  );


  return {

    total:
      transactions.length,

    created,

    skipped,

  };

}
