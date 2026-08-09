import { sorareRequest } from "../sorare";


const QUERY = `

query TestPlayer($scoreType: AveragePlayerScore!) {

  currentUser {

    cards(
      first:1
      rarities:[limited,rare,super_rare,unique]
    ) {

      nodes {

        anyPlayer {

          displayName

          averageScore(
            type:$scoreType
          )

        }

      }

    }

  }

}

`;



export async function testPlayerFields(
  accessToken:string
){


  const data = await sorareRequest(

    QUERY,

    {
      scoreType:"LAST_FIFTEEN_SO5_AVERAGE_SCORE"
    },

    accessToken

  );


  console.log(

    "PLAYER TEST:",

    JSON.stringify(
      data,
      null,
      2
    )

  );


  return data;


}