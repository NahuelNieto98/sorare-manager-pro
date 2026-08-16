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

  }

  anyPlayer(
    slug:$playerSlug
  ) {

    slug
    displayName

    lowestPriceAnyCard(
      rarity:$rarity
    ) {
      assetId
      slug

      priceRange {
        min
        max
      }
    }

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

  config {

    exchangeRate {

      rates

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

    /*
     * =====================================================
     * IN-SEASON
     * =====================================================
     */

    if(isInSeason) {

      const card =
        data.data?.anyCards?.[0];

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

      /*
       * Fallback IN-SEASON:
       * ventas recientes de cartas 2026.
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
            (item:any) =>
              (
                item?.card?.slug ?? ""
              ).includes("-2026-")
          );

      console.log(
        "📊 VENTAS VÁLIDAS:",
        validTokenPrices.length,
        "IN-SEASON"
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
          "📊 MEDIANA IN-SEASON:",
          value,
          assetId,
          "VENTAS:",
          validTokenPrices.length
        );

        return value;

      }

    }

    /*
     * =====================================================
     * CLASSIC
     * =====================================================
     *
     * El precio Classic procede del floor actual:
     *
     * lowestPriceAnyCard
     * → priceRange.min
     * → WEI
     * → EUR
     */

    if(!isInSeason) {

      const lowestPrice =
        data.data?.anyPlayer
          ?.lowestPriceAnyCard;

      const minWei =
        lowestPrice
          ?.priceRange
          ?.min;

      const weiToEur =
        data.data
          ?.config
          ?.exchangeRate
          ?.rates
          ?.wei
          ?.eur;

      if(
        minWei !== null &&
        minWei !== undefined &&
        weiToEur !== null &&
        weiToEur !== undefined
      ) {

        const value =
          Number(
            (
              Number(minWei) *
              Number(weiToEur)
            ).toFixed(2)
          );

        console.log(
          "✅ PRECIO CLASSIC:",
          value,
          "WEI:",
          minWei,
          "EUR/WEI:",
          weiToEur,
          "FLOOR:",
          lowestPrice?.slug
        );

        return value;

      }

      console.log(
        "❌ SIN FLOOR CLASSIC:",
        assetId
      );

      return null;

    }

    /*
     * =====================================================
     * SIN PRECIO
     * =====================================================
     */

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