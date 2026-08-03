import { prisma } from "@/lib/prisma";


export async function importGallery(
  userId: string,
  cards: any[]
) {


  console.log(
    "🔥 IMPORTANDO CARTAS:",
    cards.length
  );



  const sorareIds = cards.map(
    (card:any) => card.assetId
  );



  const deleted = await prisma.card.deleteMany({

    where: {

      ownerId: userId,

      sorareId: {
        notIn: sorareIds,
      },

    },

  });



  console.log(
    "🧹 CARTAS ELIMINADAS:",
    deleted.count
  );




  const chunkSize = 100;



  for (
    let i = 0;
    i < cards.length;
    i += chunkSize
  ) {



    const chunk = cards.slice(
      i,
      i + chunkSize
    );



    console.log(
      `🔥 BLOQUE ${i + 1}-${i + chunk.length}`
    );



    await Promise.all(

      chunk.map(async (card:any) => {


        const marketValue =
          card.marketValue ?? null;



        await prisma.card.upsert({


          where: {
            sorareId: card.assetId,
          },



          update: {

            slug:
              card.slug,

            season:
              card.season,


            scarcity:
              card.rarity,


            playerName:
              card.player.displayName,


            club:
              card.player.club,


            position:
              card.player.position,


            averageScore:
              card.player.l10Score,


            l5Score:
              card.player.l5Score,


            l10Score:
              card.player.l10Score,


            l15Score:
              card.player.l15Score,


            l40Score:
              card.player.l40Score,


            pictureUrl:
              card.pictureUrl,


            marketValue,


            ownerId:
              userId,

          },



          create: {


            sorareId:
              card.assetId,


            slug:
              card.slug,


            season:
              card.season,


            scarcity:
              card.rarity,


            playerName:
              card.player.displayName,


            club:
              card.player.club,


            position:
              card.player.position,


            averageScore:
              card.player.l10Score,


            l5Score:
              card.player.l5Score,


            l10Score:
              card.player.l10Score,


            l15Score:
              card.player.l15Score,


            l40Score:
              card.player.l40Score,


            pictureUrl:
              card.pictureUrl,


            marketValue,


            ownerId:
              userId,

          },


        });


      })

    );


  }





  console.log(
    "🔥 IMPORTACIÓN TERMINADA"
  );


}