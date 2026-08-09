import { sorareRequest } from "../sorare";


const QUERY = `

query TestPlayer {

  currentUser {

    cards(
      first:1
      rarities:[limited,rare,super_rare,unique]
    ) {

      nodes {

        anyPlayer {

          displayName

          l5: averageScore(
            type: LAST_FIVE_SO5_AVERAGE_SCORE
          )

          l10: averageScore(
            type: LAST_TEN_PLAYED_SO5_AVERAGE_SCORE
          )

          l15: averageScore(
            type: LAST_FIFTEEN_SO5_AVERAGE_SCORE
          )

          l40: averageScore(
            type: LAST_FORTY_SO5_AVERAGE_SCORE
          )

          aa15: averageScore(
            type: LAST_FIFTEEN_AVERAGE_ALL_AROUND_SCORE
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

{},

accessToken

);



console.log(

"PLAYER SCORES TEST:",

JSON.stringify(
data,
null,
2
)

);


return data;


}