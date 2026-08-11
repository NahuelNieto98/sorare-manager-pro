import { prisma } from "@/lib/prisma";


async function main(){

  const transactions =
    await prisma.marketTransaction.findMany({

      orderBy:{
        createdAt:"desc"
      },

      take:20,

    });


  console.log(
    JSON.stringify(
      transactions,
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