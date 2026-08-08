"use client";

import { useEffect, useState } from "react";


export type PortfolioData = {

galleryValue:number;

average:number;

totalCards:number;

totalBought:number;

totalSold:number;

profit:number;

roi:number;

recoveredCapital:number;

portfolioHealth:string;

investmentStatus:string;


scarcity:{
limited:number;
rare:number;
superRare:number;
unique:number;
};


topCards:{
id:string;
playerName:string;
club:string|null;
rarity:string;
marketValue:number|null;
averageScore:number|null;
pictureUrl:string|null;
}[];


recentTransactions:{
id:string;
type:string;
playerName:string;
rarity:string;
price:number;
}[];

};



export function usePortfolio(){


const [data,setData] =
useState<PortfolioData|null>(null);


const [loading,setLoading] =
useState(true);


const [error,setError] =
useState<string|null>(null);



async function refresh(){


try{


setLoading(true);

setError(null);



const res =
await fetch("/api/portfolio");



if(!res.ok){

throw new Error(
"Portfolio request failed"
);

}



const json =
await res.json();



setData(json);



}catch(error){


console.error(error);


setError(
"Error loading portfolio"
);



}finally{


setLoading(false);


}


}



useEffect(()=>{


refresh();


},[]);



return {

data,

loading,

error,

refresh,

};


}