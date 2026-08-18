import { sorareRequest } from "@/lib/sorare";
import { prisma } from "@/lib/prisma";
import { refreshSorareAccessToken } from "@/lib/sorare/refreshAccessToken";

export async function getUserSales(userId: string) {
  const account =
    await prisma.sorareAccount.findUnique({
      where: { userId },
    });

  if (!account?.refreshToken) {
    throw new Error("Cuenta de Sorare no conectada");
  }

  let token: string;

  if (account.accessToken) {
    token = account.accessToken;
  } else {
    token = await refreshSorareAccessToken(
      userId,
      account.refreshToken
    );
  }

  async function request(accessToken: string) {
    const sales: any[] = [];
    let after: string | null = null;
    let hasNextPage = true;

    while (hasNextPage) {
      const q = `
        query {
          currentUser {
            tokenOffers(
              direction: SENT
              first: 50
              after: ${after ? JSON.stringify(after) : "null"}
            ) {
              edges {
                cursor
                node {
                  id
                  type
                  status
                  transactionDate
                  senderSide {
                    amounts {
                      eurCents
                    }
                    anyCards {
                      slug
                    }
                  }
                  receiverSide {
                    amounts {
                      eurCents
                    }
                    anyCards {
                      slug
                    }
                  }
                }
              }
              pageInfo {
                hasNextPage
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
        result.data?.currentUser?.tokenOffers;

      if (!connection) {
        throw new Error(
          "No se pudo obtener el historial de ventas de Sorare"
        );
      }

      for (const edge of connection.edges ?? []) {
        const node = edge.node;

        if (
          node?.status === "accepted" &&
          (
            node?.type === "SINGLE_BUY_OFFER" ||
            node?.type === "DIRECT_OFFER"
          )
        ) {
          sales.push(node);
        }

        after = edge.cursor;
      }

      hasNextPage =
        connection.pageInfo?.hasNextPage === true;

      if (!connection.edges?.length) {
        break;
      }
    }

    return sales;
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
