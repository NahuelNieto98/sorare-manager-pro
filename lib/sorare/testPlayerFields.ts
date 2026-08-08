import { sorareRequest } from "../sorare";


const QUERY = `

query {

__type(name:"Card") {

name

fields {

name

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

"CARD FIELDS:",

JSON.stringify(

data,

null,

2

)

);



return data;


}