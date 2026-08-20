import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sorareRequest } from "@/lib/sorare";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    /*
     * =====================================================
     * 1. MERCADO ACTUAL
     * =====================================================
     */

    const transactions =
      await prisma.marketTransaction.findMany({
        where: {
          type: {
            in: ["BUY", "SINGLE_SALE_OFFER"],
          },
          Card: {
            marketValue: {
              not: null,
            },
          },
        },
        include: {
          Card: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    /*
     * =====================================================
     * 2. CUENTA SORARE
     * =====================================================
     */

    const user =
      await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const account =
      await prisma.sorareAccount.findUnique({
        where: {
          userId: user.id,
        },
      });

    /*
     * Si no hay conexión con Sorare,
     * devolvemos solamente el mercado existente.
     */

    if (!account?.accessToken) {
      return NextResponse.json(
        transactions
      );
    }

    /*
     * =====================================================
     * 3. SUBASTAS ACTIVAS
     * =====================================================
     */

    const auctionsQuery = `
      query {
        tokens {
          liveAuctions(first: 20) {
            nodes {
              id
              currentPrice
              minNextBid
              endDate

              anyCards {
                assetId
                slug
                name
                rarityTyped
                pictureUrl
              }
            }
          }
        }

        config {
          exchangeRate {
            rates
          }
        }
      }
    `;

    const result =
      await sorareRequest(
        auctionsQuery,
        {},
        account.accessToken
      );

    const auctions =
      result.data?.tokens?.liveAuctions?.nodes ??
      [];

    /*
     * =====================================================
     * 4. CONVERSIÓN WEI → EUR
     * =====================================================
     */

    const weiToEur =
      Number(
        result.data?.config?.exchangeRate?.rates
          ?.wei?.eur ?? 0
      );

    if (!weiToEur) {
      console.error(
        "❌ No se pudo obtener el cambio WEI → EUR"
      );

      return NextResponse.json(
        transactions
      );
    }

    /*
     * =====================================================
     * 5. CONSTRUIR SUBASTAS
     * =====================================================
     */

    const auctionItems: any[] = [];

    for (const auction of auctions) {
      const currentPriceWei =
        Number(
          auction.currentPrice ?? 0
        );

      if (!currentPriceWei) {
        continue;
      }

      const auctionPrice =
        Number(
          (
            currentPriceWei *
            weiToEur
          ).toFixed(2)
        );

      if (!auctionPrice) {
        continue;
      }

      const cardsWithValue: any[] = [];

      for (
        const auctionCard of
          auction.anyCards ?? []
      ) {
        /*
         * =================================================
         * 5A. BUSCAR CARTA EN PRISMA
         * =================================================
         */

        const dbCard =
          await prisma.card.findUnique({
            where: {
              slug:
                auctionCard.slug,
            },
          });

        /*
         * =================================================
         * 5B. SI EXISTE EN PRISMA
         * =================================================
         */

        if (dbCard) {
          /*
           * Necesitamos un valor de mercado.
           */

          if (
            dbCard.marketValue !== null &&
            dbCard.marketValue !== undefined
          ) {
            cardsWithValue.push({
              id: dbCard.id,
              playerName:
                dbCard.playerName,
              club:
                dbCard.club,
              scarcity:
                dbCard.scarcity,
              marketValue:
                dbCard.marketValue,
              pictureUrl:
                dbCard.pictureUrl,
            });
          }

          continue;
        }

        /*
         * =================================================
         * 5C. CARTA NUEVA
         * =================================================
         *
         * La carta todavía no existe en nuestra BD.
         *
         * Consultamos Sorare para obtener:
         *
         * - jugador
         * - club
         * - imagen
         * - precio de mercado
         */

        const playerSlug =
          auctionCard.slug
            ?.split("-2026-")[0];

        if (!playerSlug) {
          continue;
        }

        const playerQuery = `
          query(
            $playerSlug: String!,
            $rarity: Rarity!
          ) {
            anyPlayer(
              slug: $playerSlug
            ) {
              slug
              displayName

              activeClub {
                name
              }

              tokenPrices(
                last: 20
                rarity: $rarity
                season: 2026
                includePrivateSales: false
              ) {
                nodes {
                  amounts {
                    eurCents
                  }

                  date

                  card {
                    assetId
                    slug
                  }
                }
              }
            }

            anyCards(
              assetIds: ["${auctionCard.assetId}"]
            ) {
              assetId
              slug
              pictureUrl
            }
          }
        `;

        const playerResult =
          await sorareRequest(
            playerQuery,
            {
              playerSlug,
              rarity:
                auctionCard.rarityTyped,
            },
            account.accessToken
          );

        const player =
          playerResult.data?.anyPlayer;

        if (!player) {
          continue;
        }

        /*
         * =================================================
         * 5D. PRECIO DE MERCADO
         * =================================================
         */

        const tokenPrices =
          player.tokenPrices?.nodes ?? [];

        const validPrices =
          tokenPrices
            .filter(
              (item: any) =>
                item?.amounts?.eurCents !==
                  null &&
                item?.amounts?.eurCents !==
                  undefined
            )
            .filter(
              (item: any) =>
                (
                  item?.card?.slug ?? ""
                ).includes("-2026-")
            )
            .map(
              (item: any) =>
                Number(
                  item.amounts.eurCents
                )
            )
            .sort(
              (
                a: number,
                b: number
              ) => a - b
            );

        if (
          validPrices.length === 0
        ) {
          continue;
        }

        /*
         * Mediana.
         */

        const middle =
          Math.floor(
            validPrices.length / 2
          );

        const median =
          validPrices.length % 2 === 0
            ? (
                validPrices[
                  middle - 1
                ] +
                validPrices[middle]
              ) / 2
            : validPrices[middle];

        const marketValue =
          Number(
            (
              median / 100
            ).toFixed(2)
          );

        /*
         * =================================================
         * 5E. IMAGEN
         * =================================================
         */

        const sorareCard =
          playerResult.data
            ?.anyCards?.[0];

        /*
         * =================================================
         * 5F. CARTA VIRTUAL
         * =================================================
         *
         * No la guardamos en Prisma.
         */

        cardsWithValue.push({
          id:
            auctionCard.assetId,

          playerName:
            player.displayName ??
            auctionCard.name,

          club:
            player.activeClub?.name ??
            null,

          scarcity:
            auctionCard.rarityTyped,

          marketValue,

          pictureUrl:
            sorareCard?.pictureUrl ??
            null,
        });
      }

      /*
       * =====================================================
       * 6. COMPROBAR VALOR DEL LOTE
       * =====================================================
       */

      if (
        cardsWithValue.length === 0
      ) {
        continue;
      }

      /*
       * =====================================================
       * 7. VALOR TOTAL DEL LOTE
       * =====================================================
       */

      const lotValue =
        cardsWithValue.reduce(
          (
            total,
            card
          ) =>
            total +
            (card.marketValue ?? 0),
          0
        );

      /*
       * =====================================================
       * 8. OPORTUNIDAD
       * =====================================================
       */

      const opportunity =
        auctionPrice > 0
          ? (
              (
                lotValue -
                auctionPrice
              ) /
              auctionPrice
            ) * 100
          : 0;

      /*
       * =====================================================
       * 9. CARTA PRINCIPAL
       * =====================================================
       */

      const mainCard =
        [...cardsWithValue]
          .sort(
            (a, b) =>
              (b.marketValue ?? 0) -
              (a.marketValue ?? 0)
          )[0];

      /*
       * =====================================================
       * 10. MARKET ITEM
       * =====================================================
       */

      auctionItems.push({
        id:
          `auction:${auction.id}`,

        price:
          auctionPrice,

        type:
          "AUCTION",

        auctionId:
          auction.id,

        endDate:
          auction.endDate,

        lotValue,

        lotCards:
          cardsWithValue,

        opportunity,

        Card:
          mainCard,
      });
    }

    /*
     * =====================================================
     * 11. ORDENAR POR OPORTUNIDAD
     * =====================================================
     */

    auctionItems.sort(
      (a, b) =>
        b.opportunity -
        a.opportunity
    );

    /*
     * =====================================================
     * 12. RESPUESTA FINAL
     * =====================================================
     */

    return NextResponse.json([
      ...transactions,
      ...auctionItems,
    ]);

  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error.message,
      },
      {
        status: 500,
      }
    );
  }
}