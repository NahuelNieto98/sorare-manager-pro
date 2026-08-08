import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sorareRequest } from "@/lib/sorare";


export async function GET() {

  try {

    const session = await auth();


    if (!session?.user?.email) {

      return NextResponse.json(
        {
          error:"No autenticado"
        },
        {
          status:401
        }
      );

    }



    const account =
      await prisma.sorareAccount.findFirst({

        where:{
          user:{
            email:session.user.email
          }
        }

      });



    if(!account?.accessToken){

      return NextResponse.json(
        {
          error:"No existe conexión Sorare"
        },
        {
          status:400
        }
      );

    }



    const query = `

    query {

      currentUser {

        cards {

          nodes {

            ... on AnyCardInterface {

              id

              name

              slug

              rarityTyped


              tokenOwner {

                id

                transferType

                amounts {

                  eurCents

                }

              }

            }

          }

        }

      }

    }

    `;



    const result =
      await sorareRequest(
        query,
        {},
        account.accessToken
      );



    const cards =
      result.data.currentUser.cards.nodes;



    const marketCards =
      cards.filter(
        (card:any)=>
          card.tokenOwner &&
          card.tokenOwner.amounts?.eurCents
      );



    const saved = [];



    for(const card of marketCards){



      let existingCard = null;



      /*
        1º Intentamos por slug
      */

      existingCard =
        await prisma.card.findUnique({

          where:{
            slug:card.slug
          }

        });



      /*
        2º Fallback por nombre + rareza + temporada
      */

      if(!existingCard){


        const playerName =
          card.name
            .split(" • ")[0];


        const seasonMatch =
          card.name.match(/20\d{2}/);


        const season =
          seasonMatch
            ? Number(seasonMatch[0])
            : undefined;



        existingCard =
          await prisma.card.findFirst({

            where:{

              playerName:{
                contains:playerName,
                mode:"insensitive"
              },


              scarcity:
                card.rarityTyped,


              ...(season && {
                season
              })

            }

          });


      }



      const transaction =
        await prisma.marketTransaction.upsert({


          where:{
            marketId:card.id
          },


          update:{


            price:
              card.tokenOwner.amounts.eurCents / 100,


            type:
              card.tokenOwner.transferType,


            rarity:
              card.rarityTyped,


            cardId:
              existingCard?.id ?? null


          },


          create:{


            playerName:
              card.name,


            rarity:
              card.rarityTyped,


            price:
              card.tokenOwner.amounts.eurCents / 100,


            type:
              card.tokenOwner.transferType,


            marketId:
              card.id,


            cardId:
              existingCard?.id ?? null,


            userId:
              account.userId


          },


          include:{

            Card:true

          }


        });



      saved.push(transaction);


    }



    return NextResponse.json({

      total:
        saved.length,


      transactions:
        saved

    });



  } catch(error:any){


    console.error(error);


    return NextResponse.json(
      {
        error:error.message
      },
      {
        status:500
      }
    );


  }

}