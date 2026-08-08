import { sorareRequest } from "../sorare";


const QUERY = `

query {

__type(name:"Player") {

name

fields {

name

type {

kind

name

ofType {

name

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

"PLAYER FIELDS:",

JSON.stringify(

data,

null,

2

)

);



return data;

}