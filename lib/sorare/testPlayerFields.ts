import { sorareRequest } from "../sorare";


const QUERY = `

query TestPlayer {

currentUser {

cards(
first:1
rarities:[limited,rare,super_rare,unique]
){

nodes {

anyPlayer {

displayName

averageScore(
type:{
last:15
}
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

"PLAYER TEST:",

JSON.stringify(

data,

null,

2

)

);



return data;


}