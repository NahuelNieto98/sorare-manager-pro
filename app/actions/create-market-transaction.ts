"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";


export async function createMarketTransaction(
  cardId:string,
  price:number
) {


  console.log(
    "INICIO CREAR TRANSACTION",
    {
      cardId,
      price,
    }
  );



  const session = await auth();



  if(!session?.user?.email){

    throw new Error(
      "No autorizado"
    );

  }




  const user =
    await prisma.user.findUnique({

      where:{
        email:session.user.email,
      },

    });



  if(!user){

    throw new Error(
      "Usuario no encontrado"
    );

  }





  const card =
    await prisma.card.findUnique({

      where:{
        id:cardId,
      },

    });





  if(!card){

    throw new Error(
      "Carta no encontrada"
    );

  }





  console.log(
    "CREANDO TRANSACTION",
    {
      player:card.playerName,
      price,
    }
  );






  const transaction =
    await prisma.marketTransaction.create({

      data:{

        playerName:card.playerName,

        rarity:card.scarcity,

        price,

        type:"BUY",

        cardId:card.id,

        userId:user.id,

      },

    });





  console.log(
    "TRANSACTION CREADA",
    transaction.id
  );





  return transaction;


}