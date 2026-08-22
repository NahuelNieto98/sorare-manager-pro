import { prisma } from "@/lib/prisma";

import { getUserSales } from "@/lib/sorare/getUserSales";
import { getUserPurchases } from "@/lib/sorare/getUserPurchases";

import { mapSaleToTransaction } from "@/lib/sorare/mapSaleToTransaction";
import { mapPurchaseToTransaction } from "@/lib/sorare/mapPurchaseToTransaction";

async function main() {

  const account = await prisma.sorareAccount.findFirst({
    include: {
      user: true,
    },
  });

  if (!account) {
    console.log("NO SO​RARE ACCOUNT");
    return;
  }

  const user = account.user;

  const sales = await getUserSales(user.id);
  const purchases = await getUserPurchases(user.id);

  console.log("SALES SORARE:", sales.length);
  console.log("PURCHASES SORARE:", purchases.length);

  console.log("\n--- SALES ---");

  for (const sale of sales.slice(0, 10)) {

    const mapped = mapSaleToTransaction(sale);

    const existing =
      await prisma.transaction.findUnique({
        where: {
          id: mapped.id,
        },
      });

    console.log({
      sorareId: sale.id,
      mappedId: mapped.id,
      type: mapped.type,
      playerName: mapped.playerName,
      price: mapped.price,
      date: mapped.date,
      existing: existing
        ? {
            type: existing.type,
            playerName: existing.playerName,
            price: existing.price,
          }
        : null,
    });
  }

  console.log("\n--- PURCHASES ---");

  for (const purchase of purchases.slice(0, 5)) {

    const mapped =
      mapPurchaseToTransaction(purchase);

    const existing =
      await prisma.transaction.findUnique({
        where: {
          id: mapped.id,
        },
      });

    console.log({
      sorareId: purchase.id,
      mappedId: mapped.id,
      type: mapped.type,
      playerName: mapped.playerName,
      price: mapped.price,
      date: mapped.date,
      existing: existing
        ? {
            type: existing.type,
            playerName: existing.playerName,
            price: existing.price,
          }
        : null,
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
