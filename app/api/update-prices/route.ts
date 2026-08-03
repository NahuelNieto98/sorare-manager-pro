import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { getLastTokenPrice } from "@/lib/sorare/getTokenPrice";

import { calculateGalleryValue } from "@/lib/gallery";
import { savePortfolioSnapshot } from "@/lib/portfolio";


export async function POST() {


  const session = await auth();



  if (!session?.user?.email) {

    return NextResponse.json(
      {
        error: "No autorizado",
      },
      {
        status: 401,
      }
    );

  }




  const user = await prisma.user.findUnique({

    where: {
      email: session.user.email,
    },

    include: {
      transactions: true,
    },

  });





  if (!user) {

    return NextResponse.json(
      {
        error: "Usuario no encontrado",
      },
      {
        status: 404,
      }
    );

  }






  const cards = await prisma.card.findMany({

    where: {

      ownerId: user.id,

    },

  });






  console.log(
    "💰 Actualizando precios:",
    cards.length
  );





  const priceCache = new Map<string, number | null>();



  let updated = 0;






  for (const card of cards) {



    if (!card.playerSlug) {
      continue;
    }




    const key =
      `${card.playerSlug}-${card.scarcity}`;





    let price = priceCache.get(key);





    if (price === undefined) {



      price = await getLastTokenPrice(

        card.playerSlug,

        card.scarcity

      );



      priceCache.set(
        key,
        price
      );

    }






    if (price !== null) {


      await prisma.card.update({

        where: {
          id: card.id,
        },


        data: {

          marketValue: price,

        },

      });



      updated++;

    }



  }





  const updatedCards = await prisma.card.findMany({

    where: {
      ownerId: user.id,
    },

  });






  const galleryValue =
    calculateGalleryValue(updatedCards);





  const totalBought =
    user.transactions
      .filter((t) => t.type === "BUY")
      .reduce(
        (sum, t) => sum + t.price,
        0
      );





  const totalSold =
    user.transactions
      .filter((t) => t.type === "SELL")
      .reduce(
        (sum, t) => sum + t.price,
        0
      );





  const profit =
    galleryValue + totalSold - totalBought;





  const roi =
    totalBought === 0
      ? 0
      :
      (profit / totalBought) * 100;






  await savePortfolioSnapshot(
    user.id,
    galleryValue,
    roi,
    profit
  );







  return NextResponse.json({

    success: true,

    updated,

    galleryValue,

    roi,

    profit,

  });


}