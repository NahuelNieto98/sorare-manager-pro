"use client";

import { useEffect, useState } from "react";
import { calculateMarketScore } from "@/lib/market-score";


export type MarketItem = {

id:string;

price:number;

Card:{
id:string;
playerName:string;
club:string|null;
scarcity:string;
marketValue:number|null;
pictureUrl:string|null;
};

};



export function useMarket(){


const [cards,setCards] =
useState<MarketItem[]>([]);


const [loading,setLoading] =
useState(true);


const [error,setError] =
useState<string|null>(null);



async function refresh(){


try{


setLoading(true);

setError(null);



const res =
await fetch("/api/market");



if(!res.ok){

throw new Error(
"Market request failed"
);

}



const data =
await res.json();



const sorted =
data

.filter(
(item:MarketItem)=>item.Card
)

.sort(
(a:MarketItem,b:MarketItem)=>{


const scoreA =
calculateMarketScore(
a.Card,
a.price
);


const scoreB =
calculateMarketScore(
b.Card,
b.price
);



return scoreB-scoreA;


}

);



setCards(sorted);



}catch(error){


console.error(error);


setError(
"Error loading market"
);



}finally{


setLoading(false);


}


}



function getOpportunity(
item:MarketItem
){


const value =
item.Card.marketValue;



if(!value){

return 0;

}



return (

(
value-item.price
)

/

item.price

)

*100;


}



function getScore(
item:MarketItem
){


return calculateMarketScore(
item.Card,
item.price
);

}



useEffect(()=>{


refresh();


},[]);



return {

cards,

loading,

error,

refresh,

getOpportunity,

getScore,

};


}