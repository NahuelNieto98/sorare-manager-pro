import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { getLastTokenPrice } from "@/lib/sorare/getTokenPrice";

import { calculateGalleryValue } from "@/lib/gallery";
import { savePortfolioSnapshot } from "@/lib/portfolio";


function sleep(ms:number) {

  return new Promise(
    resolve => setTimeout(resolve, ms)
  );

}



async function getPriceSafe(
  playerSlug:string,
  rarity:string,
  season:number
) {

  try {

    return await getLastTokenPrice(
      playerSlug,
      rarity,
      season
    );


  } catch(error:any) {


    const message =
      error?.message ?? "";



    if(message.includes("429")) {


      console.log(
        "⏳ Rate limit Sorare. Esperando 30 segundos..."
      );


      await sleep(30000);



      try {


        return await getLastTokenPrice(
          playerSlug,
          rarity,
          season
        );


      } catch {


        return null;

      }

    }



    return null;

  }

}




export async function POST() {


  const session =
    await auth();




  if(!session?.user?.email) {


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
        email:session.user.email,
      },

      include:{
        transactions:true,
      },

    });





  if(!user) {


    return NextResponse.json(
      {
        error:"Usuario no encontrado",
      },
      {
        status:404,
      }
    );

  }





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
    cards.filter(card => {


      if(!card.playerSlug){

        return false;

      }



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





      return hoursSinceUpdate > 24;


    });





  console.log(
    "🔄 Cartas a actualizar:",
    cardsToUpdate.length
  );





  let updated = 0;

  let failed = 0;





  const limit = 3;





  for(
    let i = 0;
    i < cardsToUpdate.length;
    i += limit
  ){



    const batch =
      cardsToUpdate.slice(
        i,
        i + limit
      );





    console.log(
      `🔥 Actualizando ${i + 1}-${i + batch.length}`
    );





    await Promise.all(

      batch.map(

        async(card)=>{



          const price =
            await getPriceSafe(

              card.playerSlug!,

              card.scarcity,

              card.season

            );





          if(price === null){


            console.log(
              "❌ SIN PRECIO:",
              card.playerName
            );


            failed++;

            return;

          }





          await prisma.card.update({

            where:{
              id:card.id,
            },

            data:{

              marketValue:
                price,

              priceUpdatedAt:
                new Date(),

            },

          });





          updated++;


        }

      )

    );





    await sleep(1000);


  }





  console.log(
    "✅ Precios actualizados:",
    updated
  );


  console.log(
    "❌ Fallos:",
    failed
  );







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
        t=>t.type==="BUY"
      )

      .reduce(
        (sum,t)=>sum+t.price,
        0
      );







  const totalSold =
    user.transactions

      .filter(
        t=>t.type==="SELL"
      )

      .reduce(
        (sum,t)=>sum+t.price,
        0
      );







  const profit =
    galleryValue +
    totalSold -
    totalBought;







  const roi =
    totalBought === 0

    ?

    0

    :

    (profit / totalBought) * 100;







  await savePortfolioSnapshot(

    user.id,

    galleryValue,

    roi,

    profit

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