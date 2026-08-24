import { sorareRequest } from "../sorare";
import { getAssetPrice } from "./getAssetPrice";

const GET_CARD_INFO = `
query GetCardInfo($slug:String!) {

  anyCards(
    slugs:[$slug]
  ) {

    assetId
    slug
    seasonYear

    anyPlayer {
      slug
    }

  }

}
`;

function sleep(ms:number) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}

export async function getCardPrice(
  slug:string,
  accessToken:string,
  scarcity:string
) {

  let attempts = 0;

  while(attempts < 3) {

    try {

      const data =
        await sorareRequest(
          GET_CARD_INFO,
          {
            slug,
          },
          accessToken
        );

      console.log(
        "💰 DATOS CARTA:",
        JSON.stringify(
          data,
          null,
          2
        )
      );

      const card =
        data.data?.anyCards?.[0];

      if(!card?.assetId) {

        console.log(
          "❌ SIN ASSET ID:",
          slug
        );

        return null;

      }

      const playerSlug =
        card.anyPlayer?.slug;

      if(!playerSlug) {

        console.log(
          "❌ SIN PLAYER SLUG:",
          slug
        );

        return null;

      }

      const rarityMap:any = {
        "limited": "limited",
        "rare": "rare",
        "super rare": "super_rare",
        "unique": "unique",
      };

      const rarity =
        rarityMap[scarcity];

      if(!rarity) {

        console.log(
          "❌ RAREZA NO SOPORTADA:",
          scarcity,
          slug
        );

        return null;

      }

      console.log(
        "🎯 RAREZA PRECIO:",
        scarcity,
        "→",
        rarity,
        "SLUG:",
        slug
      );

      const price =
        await getAssetPrice(
          card.assetId,
          accessToken,
          playerSlug,
          card.seasonYear,
          rarity
        );

      if(
        price === null ||
        price === undefined
      ) {

        console.log(
          "❌ SIN PRECIO DE MERCADO:",
          slug
        );

        return null;

      }

      console.log(
        "✅ PRECIO DE MERCADO ENCONTRADO:",
        price,
        "SLUG:",
        slug
      );

      return price;

    } catch(error:any) {

      attempts++;

      console.error(
        `❌ ERROR PRECIO CARTA ${attempts}/3:`,
        error
      );

      if(
        error?.status === 429 &&
        attempts < 3
      ) {

        console.log(
          "⏳ Rate limit. Esperando antes de reintentar..."
        );

        await sleep(
          attempts * 10000
        );

        continue;

      }

      throw error;

    }

  }

  return null;

}


/*
 * Obtiene directamente el precio de una carta cuando ya conocemos
 * su assetId, evitando la consulta GET_CARD_INFO.
 */
export async function getAssetCardPrice(
  assetId:string,
  accessToken:string,
  playerSlug:string,
  seasonYear:number,
  scarcity:string
) {

  const rarityMap:any = {
    "limited": "limited",
    "rare": "rare",
    "super rare": "super_rare",
    "super_rare": "super_rare",
    "unique": "unique",
  };

  const rarity =
    rarityMap[scarcity];

  if(!rarity) {

    console.log(
      "❌ RAREZA NO SOPORTADA:",
      scarcity
    );

    return null;

  }

  return await getAssetPrice(
    assetId,
    accessToken,
    playerSlug,
    seasonYear,
    rarity
  );
}
