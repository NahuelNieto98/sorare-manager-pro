import { prisma } from "@/lib/prisma";


async function main() {


  const transactions =
    await prisma.transaction.findMany({

      where:{
        cardId:null
      }

    });



  console.log(
    "Transacciones pendientes:",
    transactions.length
  );



  for(const transaction of transactions){


    const card =
      await prisma.card.findFirst({

        where:{

          ownerId: transaction.userId,

          playerName:{
            contains: transaction.playerName,
            mode:"insensitive"
          },


          scarcity:
            transaction.rarity

        }

      });



    if(card){


      await prisma.transaction.update({

        where:{
          id:transaction.id
        },


        data:{
          cardId:card.id
        }

      });


      console.log(
        "✅ Enlazada:",
        transaction.playerName
      );


    } else {


      console.log(
        "❌ No encontrada:",
        transaction.playerName
      );


    }


  }


}



main()
.then(()=>{

  console.log(
    "FIN"
  );

  process.exit(0);

})
.catch(error=>{

  console.error(error);

  process.exit(1);

});