import { NextResponse } from "next/server";
import { sorareRequest } from "@/lib/sorare";

const QUERY = `
query TestTokenPrices(
  $playerSlug: String!
  $rarity: Rarity!
  $season: Int
) {

  anyPlayer(slug: $playerSlug) {

    slug

    displayName

    tokenPrices(
        first: 10
        rarity: $rarity
        season: $season
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

}
`;

export async function GET() {

  try {

    const data = await sorareRequest(
      QUERY,
      {
        playerSlug: "jorge-resurreccion-merodio",
        rarity: "limited",
        season: 2026,
      }
    );

    console.log(
      "💰 TOKEN PRICES KOKE:",
      JSON.stringify(data, null, 2)
    );

    return NextResponse.json(data);

  } catch (error: any) {

    console.error(
      "❌ ERROR TOKEN PRICES:",
      error
    );

    return NextResponse.json(
      {
        error: error.message
      },
      {
        status: 500
      }
    );

  }

}
