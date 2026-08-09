import { sorareRequest } from "../sorare";


const GET_USER_CARDS = `

query GetUserCards($after: String) {

currentUser {

cards(
first: 50,
after: $after,
rarities: [limited, rare, super_rare, unique]
) {

nodes {

assetId

slug

pictureUrl

displayRarity

seasonYear


anyPlayer {

displayName

slug

cardPositions


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


anyTeam {

name

}


}


pageInfo {

hasNextPage

endCursor

}


}

}

}

`;



function sleep(ms:number){

return new Promise(
resolve => setTimeout(resolve,ms)
);

}



async function requestWithRetry(
accessToken:string,
after:string|null
){

let attempts = 0;


while(attempts < 3){

try{

return await sorareRequest(
GET_USER_CARDS,
{
after,
},
accessToken
);


}catch(error:any){

attempts++;

console.log(
`⚠️ Sorare bloqueado intento ${attempts}/3`,
error.message
);


if(attempts >= 3){

throw error;

}


await sleep(
attempts * 10000
);


}

}


throw new Error(
"Error obteniendo cartas Sorare"
);

}




export async function getUserCards(
accessToken:string
){

console.log(
"🔥 OBTENIENDO GALERÍA CON OAUTH"
);



let allCards:any = [];

let after:string|null = null;

let previousCursor:string|null = null;

let page = 1;

let hasNextPage = true;



while(hasNextPage){


console.log(
`🔥 Página ${page}`
);



const data = await requestWithRetry(
accessToken,
after
);



if(data.errors){

console.error(
data.errors
);


throw new Error(
data.errors[0].message
);

}



const cards =
data.data.currentUser.cards.nodes;



if(page === 1){


console.log(
"🔎 PRIMERA CARTA DEBUG:",
JSON.stringify(
cards[0],
null,
2
)
);



console.log(
"📊 SCORES DEBUG:",
JSON.stringify(
{
player:
cards[0]?.anyPlayer?.displayName,

l5:
cards[0]?.anyPlayer?.l5,

l10:
cards[0]?.anyPlayer?.l10,

l15:
cards[0]?.anyPlayer?.l15,

l40:
cards[0]?.anyPlayer?.l40,

aa15:
cards[0]?.anyPlayer?.aa15,

},
null,
2
)
);



}



allCards.push(
...cards
);



hasNextPage =
data.data.currentUser.cards.pageInfo.hasNextPage;



after =
data.data.currentUser.cards.pageInfo.endCursor;



if(after === previousCursor){

console.log(
"⚠️ Cursor repetido"
);

break;

}



previousCursor = after;



page++;



if(hasNextPage){

await sleep(1500);

}


}



console.log(
"🔥 TOTAL CARTAS:",
allCards.length
);



return allCards.map(
(card:any)=>({


assetId:
card.assetId,


slug:
card.slug,


season:
card.seasonYear,


rarity:
card.displayRarity?.toLowerCase()
??
"limited",


marketValue:
null,


player:{


displayName:
card.anyPlayer?.displayName
??
"Desconocido",


slug:
card.anyPlayer?.slug
??
null,


position:
card.anyPlayer?.cardPositions?.[0]
??
null,


l5Score:
card.anyPlayer?.l5
??
null,


l10Score:
card.anyPlayer?.l10
??
null,


l15Score:
card.anyPlayer?.l15
??
null,


l40Score:
card.anyPlayer?.l40
??
null,


averageScore:
card.anyPlayer?.l15
??
null,


aaScore:
card.anyPlayer?.aa15
??
null,


club:
card.anyTeam?.name
??
null,


pictureUrl:
card.pictureUrl
??
null,


},


pictureUrl:
card.pictureUrl
??
null,


})

);

}