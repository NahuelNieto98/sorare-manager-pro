import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sorareRequest } from "@/lib/sorare";
import { getAssetPrice } from "@/lib/sorare/getAssetPrice";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const account =
      await prisma.sorareAccount.findFirst({
        where: {
          user: {
            email: session.user.email,
          },
        },
      });

    if (!account?.accessToken) {
      return NextResponse.json(
        {
          error: "No existe conexión Sorare",
        },
        { status: 400 }
      );
    }

    const query = `
      query {
        tokens {
          liveAuctions(first: 3) {
            nodes {
              id
              currentPrice
              endDate
              minNextBid

              anyCards {
                assetId
                slug
                name
                rarityTyped
              }
            }
          }
        }
      }
    `;

    const result = await sorareRequest(
      query,
      {},
      account.accessToken
    );

    const auctions =
      result.data?.tokens?.liveAuctions?.nodes ??
      [];

    const enriched = [];

    for (const auction of auctions) {
      const cards = [];

      for (const card of auction.anyCards ?? []) {
        const seasonMatch =
          card.slug.match(/-(20\d{2})-/);

        const season = seasonMatch
          ? Number(seasonMatch[1])
          : undefined;

        let marketValue = null;

        try {
          marketValue = await getAssetPrice(
            card.assetId,
            account.accessToken ?? undefined,
            card.slug.split("-2026-")[0],
            season,
            card.rarityTyped
          );
        } catch (error) {
          console.error(
            "Error obteniendo precio:",
            card.slug,
            error
          );
        }

        cards.push({
          assetId: card.assetId,
          slug: card.slug,
          name: card.name,
          rarity: card.rarityTyped,
          season,
          marketValue,
        });
      }

      enriched.push({
        auctionId: auction.id,
        currentPrice: auction.currentPrice,
        minNextBid: auction.minNextBid,
        endDate: auction.endDate,
        cards,
      });
    }

    return NextResponse.json({
      totalAuctions: enriched.length,
      auctions: enriched,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
