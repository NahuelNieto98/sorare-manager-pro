import { sorareRequest } from "../sorare";

const GET_ASSET_PRICE = `
query GetAssetPrice(
  $assetIds:[String!]!
  $playerSlug:String!
  $rarity:Rarity!
  $season:Int
) {

  anyCards(
    assetIds:$assetIds
  ) {

    assetId
    slug

    liveSingleSaleOffer {
      receiverSide {
        amounts {
          eurCents
        }
      }
    }

    lowestPriceCard {
      assetId
      slug

      liveSingleSaleOffer {
        receiverSide {
          amounts {
            eurCents
          }
        }
      }
    }

    lowestPriceCardAnySeason {
      assetId
      slug

      liveSingleSaleOffer {
        receiverSide {
          amounts {
            eurCents
          }
        }
      }
    }

  }

  anyPlayer(
    slug:$playerSlug
  ) {

    slug
    displayName

    tokenPrices(
      first:10
      rarity:$rarity
      season:$season
      includePrivateSales:false
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

export async function getAssetPrice(
  assetId:string,
  accessToken?:string,
  playerSlug?:string,
  season?:number,
  rarity:string = "limited"
) {

  try {

    const isInSeason =
      season === 2026;

    console.log(
      "🏷️ TIPO DE CARTA:",
      isInSeason
        ? "IN-SEASON"
        : "CLASSIC",
      "TEMPORADA:",
      season,
      "RAREZA:",
      rarity
    );

    const data =
      await sorareRequest(
        GET_ASSET_PRICE,
        {
          assetIds:[
            assetId
          ],

          playerSlug:
            playerSlug ?? "",

          rarity:
            rarity as any,

          season:
            isInSeason
              ? 2026
              : null,
        },
        accessToken
      );

    const card =
      data.data?.anyCards?.[0];

    /*
     * =====================================================
     * IN-SEASON
     * =====================================================
     *
     * Solo utilizamos el mercado de la carta 2026.
     */

    if(isInSeason) {

      const directPrice =
        card?.lowestPriceCard
          ?.liveSingleSaleOffer
          ?.receiverSide
          ?.amounts
          ?.eurCents
        ??
        card?.liveSingleSaleOffer
          ?.receiverSide
          ?.amounts
          ?.eurCents
        ??
        null;

      if(
        directPrice !== null &&
        directPrice !== undefined
      ) {

        const value =
          Number(
            (
              Number(directPrice) / 100
            ).toFixed(2)
          );

        console.log(
          "✅ PRECIO IN-SEASON:",
          value,
          assetId
        );

        return value;

      }

    }

    /*
     * =====================================================
     * CLASSIC
     * =====================================================
     *
     * Todas las temporadas anteriores forman un único
     * mercado Classic.
     */

    if(!isInSeason) {

      const directPrice =
        card?.lowestPriceCardAnySeason
          ?.liveSingleSaleOffer
          ?.receiverSide
          ?.amounts
          ?.eurCents
        ??
        null;

      if(
        directPrice !== null &&
        directPrice !== undefined
      ) {

        const value =
          Number(
            (
              Number(directPrice) / 100
            ).toFixed(2)
          );

        console.log(
          "✅ PRECIO CLASSIC:",
          value,
          assetId
        );

        return value;

      }

    }

    /*
     * =====================================================
     * HISTÓRICO
     * =====================================================
     */

    const tokenPrices =
      data.data?.anyPlayer
        ?.tokenPrices
        ?.nodes ?? [];

    const validTokenPrices =
      tokenPrices
        .filter(
          (item:any) =>
            item?.amounts?.eurCents !== null &&
            item?.amounts?.eurCents !== undefined
        )
        .filter(
          (item:any) => {

            const itemSlug =
              item?.card?.slug ?? "";

            if(isInSeason) {

              return itemSlug.includes(
                "-2026-"
              );

            }

            return !itemSlug.includes(
              "-2026-"
            );

          }
        );

    console.log(
      "📊 VENTAS VÁLIDAS:",
      validTokenPrices.length,
      isInSeason
        ? "IN-SEASON"
        : "CLASSIC"
    );

    if(
      validTokenPrices.length > 0
    ) {

      const prices =
        validTokenPrices
          .map(
            (item:any) =>
              Number(
                item.amounts.eurCents
              )
          )
          .sort(
            (a:number,b:number) =>
              a - b
          );

      const middle =
        Math.floor(
          prices.length / 2
        );

      const median =
        prices.length % 2 === 0
          ?
          (
            prices[middle - 1] +
            prices[middle]
          ) / 2
          :
          prices[middle];

      const value =
        Number(
          (
            median / 100
          ).toFixed(2)
        );

      console.log(
        "📊 MEDIANA:",
        value,
        isInSeason
          ? "IN-SEASON"
          : "CLASSIC",
        assetId,
        "VENTAS:",
        validTokenPrices.length
      );

      return value;

    }

    console.log(
      "❌ SIN PRECIO DE MERCADO:",
      assetId
    );

    return null;

  } catch(error:any) {

    console.error(
      "❌ ERROR PRECIO ASSET:",
      error
    );

    throw error;

  }

}
