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



  const limit = 10;



  for (
    let i = 0;
    i < cards.length;
    i += limit
  ) {


    const batch = cards.slice(
      i,
      i + limit
    );



    console.log(
      `🔥 GUARDANDO ${i + 1}-${i + batch.length}`
    );



    await Promise.all(

      batch.map(async(card:any)=>{


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
              card.player?.displayName
              ??
              "Desconocido",


            playerSlug:
              card.player?.slug
              ??
              null,


            club:
              card.player?.club
              ??
              null,


            position:
              card.player?.position
              ??
              null,


            averageScore:
              card.player?.l10Score
              ??
              null,


            l5Score:
              card.player?.l5Score
              ??
              null,


            l10Score:
              card.player?.l10Score
              ??
              null,


            l15Score:
              card.player?.l15Score
              ??
              null,


            l40Score:
              card.player?.l40Score
              ??
              null,


            pictureUrl:
              card.pictureUrl
              ??
              null,


            marketValue:
              card.marketValue
              ??
              null,


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
              card.player?.displayName
              ??
              "Desconocido",


            playerSlug:
              card.player?.slug
              ??
              null,


            club:
              card.player?.club
              ??
              null,


            position:
              card.player?.position
              ??
              null,


            averageScore:
              card.player?.l10Score
              ??
              null,


            l5Score:
              card.player?.l5Score
              ??
              null,


            l10Score:
              card.player?.l10Score
              ??
              null,


            l15Score:
              card.player?.l15Score
              ??
              null,


            l40Score:
              card.player?.l40Score
              ??
              null,


            pictureUrl:
              card.pictureUrl
              ??
              null,


            marketValue:
              card.marketValue
              ??
              null,


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