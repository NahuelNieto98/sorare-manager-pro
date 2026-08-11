import { prisma } from "@/lib/prisma";


async function main() {


  const cards = await prisma.card.findMany({

    where:{
      playerName:{
        contains:"Courtois",
        mode:"insensitive",
      },
    },

    include:{
      MarketTransaction:true,
    },

  });



  console.log(
    JSON.stringify(
      cards,
      null,
      2
    )
  );


}



main()
.then(()=>process.exit())
.catch((e)=>{
  console.error(e);
  process.exit(1);
});