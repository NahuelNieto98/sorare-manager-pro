
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { date: "asc" },
  });

  console.log("TOTAL:", transactions.length);

  const buys = transactions.filter(t => t.type === "BUY");
  const sells = transactions.filter(t => t.type === "SELL");

  console.log("COMPRAS:", buys.length);
  console.log("VENTAS:", sells.length);

  console.log("\n--- 2026/27 ---");

  const seasonStart = new Date("2026-07-21T00:00:00.000Z");
  const seasonEnd = new Date("2027-07-21T00:00:00.000Z");

  const season = transactions.filter(
    t => t.date >= seasonStart && t.date < seasonEnd
  );

  console.log("OPERACIONES:", season.length);

  console.log(
    "COMPRAS:",
    season
      .filter(t => t.type === "BUY")
      .reduce((sum, t) => sum + t.price, 0)
  );

  console.log(
    "VENTAS:",
    season
      .filter(t => t.type === "SELL")
      .reduce((sum, t) => sum + t.price, 0)
  );

  console.log("\nOPERACIONES 2026/27:");

  for (const t of season) {
    console.log(
      t.type,
      "|",
      t.price,
      "|",
      t.playerName,
      "|",
      t.date.toISOString()
    );
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
