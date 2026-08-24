import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sorareRequest } from "@/lib/sorare";

function normalizeRarity(
  rarity: string | null | undefined
) {
  if (!rarity) {
    return "";
  }

  return rarity
    .toLowerCase()
    .replace(/-/g, "_")
    .replace(/\s+/g, "_");
}

function toSorareRarity(
  rarity: string | null | undefined
) {
  const normalized =
    normalizeRarity(rarity);

  switch (normalized) {
    case "limited":
      return "limited";

    case "rare":
      return "rare";

    case "super_rare":
      return "super_rare";

    case "unique":
      return "unique";

    default:
      return "limited";
  }
}

function rarityPriority(
  rarity: string | null | undefined
) {
  switch (
    normalizeRarity(rarity)
  ) {
    case "limited":
      return 4;

    case "rare":
      return 3;

    case "super_rare":
      return 2;

    case "unique":
      return 1;

    default:
      return 0;
  }
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T) => Promise<R>
) {
  const results: R[] = new Array(
    items.length
  );

  let nextIndex = 0;

  async function worker() {
    while (true) {
      const index = nextIndex++;

      if (index >= items.length) {
        return;
      }

      results[index] =
        await mapper(items[index]);
    }
  }

  const workers = Array.from(
    {
      length: Math.min(
        concurrency,
        items.length
      ),
    },
    () => worker()
  );

  await Promise.all(workers);

  return results;
}

type AuctionCardEntry = {
  auction: any;
  card: any;
};

async function getLiveAuctions(
  accessToken: string
) {
  const auctions: any[] = [];

  let before:
    | string
    | null = null;

  const maxPages = 5;

  for (
    let page = 0;
    page < maxPages;
    page++
  ) {
    const query = `
      query MarketLiveAuctions(
        $before: String
      ) {
        tokens {
          liveAuctions(
            last: 100
            before: $before
          ) {
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

            pageInfo {
              startCursor
              hasPreviousPage
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
        query,
        {
          before,
        },
        accessToken
      );

    const connection =
      result.data
        ?.tokens
        ?.liveAuctions;

    const nodes =
      connection?.nodes ?? [];

    auctions.push(...nodes);

    const pageInfo =
      connection?.pageInfo;

    console.log(
      `SORARE MARKET PAGE ${page + 1}:`,
      nodes.length
    );

    if (
      !pageInfo?.hasPreviousPage ||
      !pageInfo?.startCursor ||
      nodes.length === 0
    ) {
      break;
    }

    before =
      pageInfo.startCursor;
  }

  return {
    auctions,
  };
}

export async function GET() {
  try {
    const session =
      await auth();

    if (
      !session?.user?.email
    ) {
      return NextResponse.json(
        {
          error:
            "No autenticado",
        },
        {
          status: 401,
        }
      );
    }

    const transactions =
      await prisma.marketTransaction.findMany(
        {
          where: {
            type: {
              in: [
                "BUY",
                "SINGLE_SALE_OFFER",
              ],
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
        }
      );

    const normalizedTransactions =
      transactions.filter(
        (
          transaction
        ) =>
          transaction.Card !==
          null
      );

    const user =
      await prisma.user.findUnique(
        {
          where: {
            email:
              session.user.email,
          },
        }
      );

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Usuario no encontrado",
        },
        {
          status: 404,
        }
      );
    }

    const account =
      await prisma.sorareAccount.findUnique(
        {
          where: {
            userId:
              user.id,
          },
        }
      );

    if (
      !account?.accessToken
    ) {
      return NextResponse.json(
        normalizedTransactions
      );
    }

    const accessToken =
      account.accessToken;

    const {
      auctions,
    } =
      await getLiveAuctions(
        accessToken
      );

    const exchangeQuery = `
      query MarketExchangeRate {
        config {
          exchangeRate {
            rates
          }
        }
      }
    `;

    const exchangeResult =
      await sorareRequest(
        exchangeQuery,
        {},
        accessToken
      );

    const weiToEur =
      Number(
        exchangeResult.data
          ?.config
          ?.exchangeRate
          ?.rates
          ?.wei
          ?.eur ?? 0
      );

    if (!weiToEur) {
      console.error(
        "❌ No se pudo obtener el cambio WEI → EUR"
      );

      return NextResponse.json(
        normalizedTransactions
      );
    }

    console.log(
      "SORARE MARKET TOTAL AUCTIONS:",
      auctions.length
    );

    const auctionCards: AuctionCardEntry[] =
      auctions.flatMap(
        (auction: any) =>
          (
            auction.anyCards ??
            []
          ).map(
            (card: any) => ({
              auction,
              card,
            })
          )
      );

    const auctionSlugs =
      Array.from(
        new Set<string>(
          auctionCards
            .map(
              ({
                card,
              }: AuctionCardEntry) =>
                card.slug as
                  | string
                  | undefined
            )
            .filter(
              (
                slug
              ): slug is string =>
                Boolean(slug)
            )
        )
      );

    const dbCards =
      auctionSlugs.length > 0
        ? await prisma.card.findMany(
            {
              where: {
                slug: {
                  in: auctionSlugs,
                },
              },
            }
          )
        : [];

    const dbCardsBySlug =
      new Map(
        dbCards.map(
          (card) => [
            card.slug,
            card,
          ]
        )
      );

    const sorareRequests =
      new Map<
        string,
        {
          playerSlug: string;
          rarity: string;
          assetId: string;
        }
      >();

    for (
      const {
        card,
      } of auctionCards
    ) {
      if (
        dbCardsBySlug.has(
          card.slug
        )
      ) {
        continue;
      }

      const normalizedRarity =
        normalizeRarity(
          card.rarityTyped
        );

      const playerSlug =
        card.slug
          ?.split(
            "-2026-"
          )[0];

      if (!playerSlug) {
        continue;
      }

      const rarity =
        toSorareRarity(
          normalizedRarity
        );

      const key =
        `${playerSlug}:${rarity}`;

      if (
        !sorareRequests.has(
          key
        )
      ) {
        sorareRequests.set(
          key,
          {
            playerSlug,
            rarity,
            assetId:
              card.assetId,
          }
        );
      }
    }

    const sorareResults =
      new Map<
        string,
        any
      >();

    const requestEntries =
      Array.from(
        sorareRequests.entries()
      );

    await mapWithConcurrency(
      requestEntries,
      6,
      async (
        [
          key,
          request,
        ]
      ) => {
        try {
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
                assetIds: [
                  "${request.assetId}"
                ]
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
                playerSlug:
                  request.playerSlug,

                rarity:
                  request.rarity,
              },
              accessToken
            );

          sorareResults.set(
            key,
            playerResult
          );
        } catch (error) {
          console.error(
            "❌ Error consultando jugador Sorare:",
            request.playerSlug,
            request.rarity,
            error
          );

          sorareResults.set(
            key,
            null
          );
        }
      }
    );

    const cardInfoByAuction =
      new Map<
        string,
        any[]
      >();

    for (
      const auction of auctions
    ) {
      cardInfoByAuction.set(
        auction.id,
        []
      );
    }

    for (
      const {
        auction,
        card,
      } of auctionCards
    ) {
      const existingCard =
        dbCardsBySlug.get(
          card.slug
        );

      if (existingCard) {
        if (
          existingCard.marketValue !==
            null &&
          existingCard.marketValue !==
            undefined
        ) {
          cardInfoByAuction
            .get(
              auction.id
            )
            ?.push({
              id:
                existingCard.id,

              playerName:
                existingCard.playerName,

              club:
                existingCard.club,

              scarcity:
                normalizeRarity(
                  existingCard.scarcity
                ),

              marketValue:
                existingCard.marketValue,

              pictureUrl:
                existingCard.pictureUrl,
            });
        }

        continue;
      }

      const normalizedRarity =
        normalizeRarity(
          card.rarityTyped
        );

      const playerSlug =
        card.slug
          ?.split(
            "-2026-"
          )[0];

      if (!playerSlug) {
        continue;
      }

      const rarity =
        toSorareRarity(
          normalizedRarity
        );

      const key =
        `${playerSlug}:${rarity}`;

      const playerResult =
        sorareResults.get(
          key
        );

      const player =
        playerResult?.data
          ?.anyPlayer;

      if (!player) {
        continue;
      }

      const tokenPrices =
        player.tokenPrices
          ?.nodes ?? [];

      const validPrices =
        tokenPrices
          .filter(
            (item: any) =>
              item?.amounts
                ?.eurCents !==
                null &&
              item?.amounts
                ?.eurCents !==
                undefined
          )
          .filter(
            (item: any) =>
              (
                item?.card
                  ?.slug ??
                ""
              ).includes(
                "-2026-"
              )
          )
          .map(
            (item: any) =>
              Number(
                item.amounts
                  .eurCents
              )
          )
          .filter(
            (price: number) =>
              price > 0
          )
          .sort(
            (
              a: number,
              b: number
            ) =>
              a - b
          );

      if (
        validPrices.length === 0
      ) {
        continue;
      }

      const middle =
        Math.floor(
          validPrices.length /
            2
        );

      const median =
        validPrices.length %
            2 ===
          0
          ? (
              validPrices[
                middle - 1
              ] +
              validPrices[
                middle
              ]
            ) / 2
          : validPrices[
              middle
            ];

      const marketValue =
        Number(
          (
            median / 100
          ).toFixed(2)
        );

      const sorareCard =
        playerResult.data
          ?.anyCards?.[0];

      cardInfoByAuction
        .get(
          auction.id
        )
        ?.push({
          id:
            card.assetId,

          playerName:
            player.displayName ??
            card.name,

          club:
            player.activeClub
              ?.name ??
            null,

          scarcity:
            normalizedRarity,

          marketValue,

          pictureUrl:
            sorareCard
              ?.pictureUrl ??
            card.pictureUrl ??
            null,
        });
    }

    const auctionItems: any[] =
      [];

    for (
      const auction of auctions
    ) {
      const currentPriceWei =
        Number(
          auction.currentPrice ??
            0
        );

      if (
        !currentPriceWei
      ) {
        continue;
      }

      const auctionPrice =
        Number(
          (
            currentPriceWei *
            weiToEur
          ).toFixed(2)
        );

      if (
        !auctionPrice
      ) {
        continue;
      }

      const cardsWithValue =
        cardInfoByAuction.get(
          auction.id
        ) ?? [];

      if (
        cardsWithValue.length ===
        0
      ) {
        continue;
      }

      const lotValue =
        cardsWithValue.reduce(
          (
            total,
            card
          ) =>
            total +
            (
              card.marketValue ??
              0
            ),
          0
        );

      const opportunity =
        lotValue > 0
          ? (
              (
                lotValue -
                auctionPrice
              ) /
              lotValue
            ) *
            100
          : 0;

      const mainRarity =
        [
          ...cardsWithValue,
        ]
          .sort(
            (a, b) =>
              rarityPriority(
                b.scarcity
              ) -
              rarityPriority(
                a.scarcity
              )
          )[0]
          ?.scarcity ?? "";

      const mainCard =
        [
          ...cardsWithValue,
        ]
          .sort(
            (a, b) =>
              (
                b.marketValue ??
                0
              ) -
              (
                a.marketValue ??
                0
              )
          )[0];

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

        rarityPriority:
          rarityPriority(
            mainRarity
          ),

        Card:
          mainCard,
      });
    }

    auctionItems.sort(
      (a, b) => {
        if (
          b.rarityPriority !==
          a.rarityPriority
        ) {
          return (
            b.rarityPriority -
            a.rarityPriority
          );
        }

        return (
          b.opportunity -
          a.opportunity
        );
      }
    );

    const finalData = [
      ...normalizedTransactions,
      ...auctionItems,
    ];

    const rarityCounts: Record<
      string,
      number
    > = {};

    for (
      const item of finalData
    ) {
      const rarity =
        normalizeRarity(
          item?.Card?.scarcity
        ) || "unknown";

      rarityCounts[
        rarity
      ] =
        (
          rarityCounts[
            rarity
          ] ?? 0
        ) + 1;
    }

    console.log(
      "📊 MARKET RAREZAS:",
      rarityCounts
    );

    console.log(
      "📊 MARKET TOTAL:",
      finalData.length
    );

    return NextResponse.json(
      finalData
    );
  } catch (error: any) {
    console.error(
      "❌ MARKET API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ??
          "Error cargando mercado",
      },
      {
        status: 500,
      }
    );
  }
}
