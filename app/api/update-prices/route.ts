import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { getCardPrice, getAssetCardPrice } from "@/lib/sorare/getCardPrice";

import { calculateGalleryValue } from "@/lib/gallery";
import { savePortfolioSnapshot } from "@/lib/portfolio";



async function getPriceSafe(
  slug:string,
  accessToken:string,
  scarcity:string
) {

  try {

    return await getCardPrice(
      slug,
      accessToken,
      scarcity
    );

  } catch(error:any) {

    const status =
      error?.status;

    if(status === 403){

      console.log(
        "🚫 Sorare bloqueó las consultas de precios"
      );

      throw new Error(
        "SORARE_PRICE_BLOCKED"
      );

    }

    if(status === 429){

      console.log(
        "⏳ Sorare rate limit precios"
      );

      throw new Error(
        "SORARE_RATE_LIMIT"
      );

    }

    return null;

  }

}



export async function POST() {

  const session =
    await auth();


  if(!session?.user?.email){

    return NextResponse.json(
      {
        error:"No autorizado",
      },
      {
        status:401,
      }
    );

  }



  const user =
    await prisma.user.findUnique({

      where:{
        email:
          session.user.email,
      },

      include:{
        transactions:true,
        sorareAccount:true,
      },

    });



  if(!user){

    return NextResponse.json(
      {
        error:"Usuario no encontrado",
      },
      {
        status:404,
      }
    );

  }



  const sorareAccount = user.sorareAccount;

  if(!sorareAccount?.accessToken){

    return NextResponse.json(
      {
        error:"Cuenta de Sorare no conectada",
      },
      {
        status:400,
      }
    );

  }

  const accessToken: string =
    sorareAccount.accessToken;



  const cards =
    await prisma.card.findMany({

      where:{
        ownerId:user.id,
      },

    });



  console.log(
    "💰 Cartas totales:",
    cards.length
  );



  const now =
    new Date();



  const cardsToUpdate =
    cards.filter(card=>{

      if(!card.priceUpdatedAt){

        return true;

      }



      const hoursSinceUpdate =

        (
          now.getTime()
          -
          card.priceUpdatedAt.getTime()
        )
        /
        (
          1000 *
          60 *
          60
        );



      return true;

    });



  console.log(
    "🔄 Cartas a actualizar:",
    cardsToUpdate.length
  );



  let updated = 0;

  let failed = 0;

  const failedCards: {
    player: string;
    slug: string;
    reason: string;
  }[] = [];



  /*
   * ============================================================
   * CLASSIC
   *
   * Todas las temporadas anteriores a 2026 son CLASSIC.
   *
   * Mismo jugador + misma rareza = mismo precio.
   * ============================================================
   */

  const classicGroups =
    new Map<
      string,
      typeof cardsToUpdate
    >();



  /*
   * ============================================================
   * IN-SEASON
   *
   * Cada carta 2026 se consulta individualmente.
   *
   * NO agrupamos las cartas 2026 aunque sean del mismo jugador
   * y tengan la misma rareza.
   * ============================================================
   */

  const inSeasonCards =
    cardsToUpdate.filter(
      card =>
        card.season === 2026
    );



  const classicCards =
    cardsToUpdate.filter(
      card =>
        card.season !== 2026
    );



  /*
   * ============================
   * AGRUPAR CLASSIC
   * ============================
   */

  for(
    const card
    of classicCards
  ){

    const playerKey =
      card.playerSlug ??
      card.playerName
        .toLowerCase()
        .trim();



    const key =
      `${playerKey}|${card.scarcity}`;



    const group =
      classicGroups.get(key);



    if(group){

      group.push(card);

    }else{

      classicGroups.set(
        key,
        [card]
      );

    }

  }



  console.log(
    "📦 GRUPOS CLASSIC:",
    classicGroups.size,
    "para",
    classicCards.length,
    "cartas"
  );



  console.log(
    "📦 CARTAS IN-SEASON:",
    inSeasonCards.length
  );



  /*
   * ============================================================
   * ACTUALIZAR CLASSIC
   * ============================================================
   */

  let groupNumber = 0;



  for(
    const [key,group]
    of classicGroups
  ){

    groupNumber++;



    const firstCard =
      group[0];



    console.log(
      `🔥 CLASSIC ${groupNumber}/${classicGroups.size}:`,
      key,
      `→ ${group.length} cartas`
    );



    let price:number | null =
      null;



    try{

      price =
        await getAssetCardPrice(
          firstCard.assetId!,
          accessToken,
          firstCard.playerSlug!,
          firstCard.season,
          firstCard.scarcity
        );



    }catch(error:any){

      if(
        error.message ===
          "SORARE_PRICE_BLOCKED"
        ||
        error.message ===
          "SORARE_RATE_LIMIT"
      ){

        throw error;

      }



      console.error(
        "❌ ERROR CLASSIC:",
        key,
        error
      );

    }



    if(
      price === null ||
      price === undefined
    ){

      console.log(
        "❌ SIN PRECIO CLASSIC:",
        key
      );



      console.log(
        "⚠️ SIN VENTAS CLASSIC — CONSERVANDO PRECIO ANTERIOR:",
        key
      );



      continue;

    }



    await prisma.card.updateMany({

      where:{
        id:{
          in:
            group.map(
              card =>
                card.id
            )
        }
      },

      data:{
        marketValue:
          price,

        priceUpdatedAt:
          new Date(),
      },

    });



    updated +=
      group.length;



    console.log(
      "✅ CLASSIC ACTUALIZADO:",
      key,
      "| PRECIO:",
      price,
      "| CARTAS:",
      group.length
    );

  }



  /*
   * ============================================================
   * ACTUALIZAR IN-SEASON
   * ============================================================
   *
   * MUY IMPORTANTE:
   *
   * Una carta 2026 = una consulta de Sorare.
   *
   * No copiamos el precio entre cartas.
   * ============================================================
   */

  /*
   * ============================================================
   * ACTUALIZAR IN-SEASON
   * ============================================================
   *
   * Las cartas 2026 se consultan individualmente.
   *
   * Ejecutamos varias consultas en paralelo con una concurrencia
   * controlada para acelerar la sincronización sin saturar Sorare.
   * ============================================================
   */

  const CONCURRENCY = 3;

  console.log(
    "⚡ CONCURRENCIA IN-SEASON:",
    CONCURRENCY
  );

  for (
    let i = 0;
    i < inSeasonCards.length;
    i += CONCURRENCY
  ) {

    const batch =
      inSeasonCards.slice(
        i,
        i + CONCURRENCY
      );

    console.log(
      `🔥 IN-SEASON ${i + 1}-${Math.min(
        i + CONCURRENCY,
        inSeasonCards.length
      )}/${inSeasonCards.length}`
    );

    const results =
      await Promise.all(
        batch.map(
          async (card) => {

            try {

              const price =
                await getAssetCardPrice(
                  card.assetId!,
                  accessToken,
                  card.playerSlug!,
                  card.season,
                  card.scarcity
                );

              return {
                card,
                price,
              };

            } catch (error: any) {

              const reason =
                error?.message === "SORARE_RATE_LIMIT"
                  ? "429 RATE LIMIT"
                  : error?.message === "SORARE_PRICE_BLOCKED"
                    ? "403 PRICE BLOCKED"
                    : "ERROR";

              console.error(
                "❌ ERROR IN-SEASON:",
                card.slug,
                reason
              );

              failedCards.push({
                player: card.playerName,
                slug: card.slug,
                reason,
              });

              return {
                card,
                price: null,
              };

            }

          }
        )
      );

    await Promise.all(
      results.map(
        async ({
          card,
          price,
        }) => {

          if (
            price === null ||
            price === undefined
          ) {

            console.log(
              "❌ SIN PRECIO IN-SEASON:",
              card.slug
            );

            failed++;

            failedCards.push({
              player: card.playerName,
              slug: card.slug,
              reason: "SIN PRECIO IN-SEASON",
            });

            return;

          }

          await prisma.card.update({

            where: {
              id: card.id,
            },

            data: {
              marketValue:
                price,

              priceUpdatedAt:
                new Date(),
            },

          });

          updated++;

          console.log(
            "✅ IN-SEASON ACTUALIZADA:",
            card.slug,
            "| PRECIO:",
            price
          );

        }
      )
    );

  }

  console.log(
    "✅ Precios actualizados:",
    updated
  );



  console.log(
    "❌ Fallos:",
    failed
  );

  console.log(
    "🔎 FALLOS DETALLADOS:",
    failedCards
  );

  console.log(
    "🔎 FIN UPDATE PRICES — revisa las líneas ❌ anteriores para identificar los fallos"
  );



  /*
   * ============================================================
   * RECALCULAR PORTFOLIO
   * ============================================================
   */

  const updatedCards =
    await prisma.card.findMany({

      where:{
        ownerId:user.id,
      },

    });



  const galleryValue =
    calculateGalleryValue(
      updatedCards
    );



  const totalBought =
    user.transactions

      .filter(
        t =>
          t.type === "BUY"
      )

      .reduce(
        (
          sum,
          t
        ) =>
          sum + t.price,
        0
      );



  const totalSold =
    user.transactions

      .filter(
        t =>
          t.type === "SELL"
      )

      .reduce(
        (
          sum,
          t
        ) =>
          sum + t.price,
        0
      );



  const profit =
    galleryValue
    +
    totalSold
    -
    totalBought;



  const roi =
    totalBought === 0
      ?
      0
      :
      (
        profit /
        totalBought
      ) * 100;







  await savePortfolioSnapshot(
    user.id,
    galleryValue
  );

  return NextResponse.json({

    success:true,

    updated,

    failed,

    galleryValue,

    roi,

    profit,

  });

}