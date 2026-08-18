import { sorareRequest } from "@/lib/sorare";
import { prisma } from "@/lib/prisma";
import { refreshSorareAccessToken } from "@/lib/sorare/refreshAccessToken";

export async function getUserPurchases(userId: string) {
  const account =
    await prisma.sorareAccount.findUnique({
      where: { userId },
    });

  if (!account?.refreshToken) {
    throw new Error("Cuenta de Sorare no conectada");
  }

  let token = account.accessToken ?? "";

  async function request(accessToken: string) {
    const purchases: any[] = [];

    let after: string | null = null;
    let hasNextPage = true;
    let pageCount = 0;

    const seasonStart =
      new Date("2026-07-21T00:00:00.000Z");

    while (hasNextPage) {
      pageCount++;

      console.log(
        "📄 Página wonTokenAuctions:",
        pageCount
      );

      if (pageCount > 10) {
        console.warn(
          "⚠️ Límite de 10 páginas alcanzado"
        );
        break;
      }

      const q = `
        query {
          currentUser {
            wonTokenAuctions(
              first: 50
              after: ${after ? JSON.stringify(after) : "null"}
            ) {
              nodes {
                id
                endDate
                bestBid {
                  amounts {
                    eurCents
                  }
                }
                anyCards {
                  assetId
                  slug
                  rarityTyped
                  name
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        }
      `;

      const result =
        await sorareRequest(
          q,
          {},
          accessToken
        );

      const connection =
        result.data?.currentUser?.wonTokenAuctions;

      if (!connection) {
        throw new Error(
          "No se pudo obtener las subastas ganadas de Sorare"
        );
      }

      let reachedSeasonStart = false;

      for (const auction of connection.nodes ?? []) {
        const auctionDate =
          new Date(auction.endDate);

        if (auctionDate < seasonStart) {
          reachedSeasonStart = true;
          continue;
        }

        const card =
          auction.anyCards?.[0];

        const eurCents =
          auction.bestBid?.amounts?.eurCents;

        if (
          !card ||
          typeof eurCents !== "number"
        ) {
          continue;
        }

        purchases.push({
          id: auction.id,
          type: "SINGLE_BUY_OFFER",
          status: "accepted",
          transactionDate: auction.endDate,

          senderSide: {
            amounts: {
              eurCents,
            },
          },

          receiverSide: {
            anyCards: [
              {
                slug: card.slug,
              },
            ],
          },
        });
      }

      if (reachedSeasonStart) {
        hasNextPage = false;
        break;
      }

      hasNextPage =
        connection.pageInfo?.hasNextPage === true;

      const nextCursor =
        connection.pageInfo?.endCursor ?? null;

      if (
        !hasNextPage ||
        !nextCursor ||
        nextCursor === after
      ) {
        break;
      }

      after = nextCursor;
    }

    console.log(
      "🛒 COMPRAS 26/27 ENCONTRADAS:",
      purchases.length
    );

    return purchases;
  }

  try {
    return await request(token);
  } catch (error: any) {
    if (
      String(error?.message ?? "")
        .includes("Unauthorized")
    ) {
      token =
        await refreshSorareAccessToken(
          userId,
          account.refreshToken
        );

      return await request(token);
    }

    throw error;
  }
}
