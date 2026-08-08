import { sorareRequest } from "../sorare";


const QUERY = `

query {

__type(name:"AveragePlayerScore") {

name

kind

inputFields {

name

type {

kind

name

ofType {

kind

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

"AVERAGE PLAYER SCORE TYPE:",

JSON.stringify(

data,

null,

2

)

);



return data;


}