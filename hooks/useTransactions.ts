"use client";

import { useEffect, useState } from "react";


export type Transaction = {

id:string;

type:string;

playerName:string;

rarity:string;

price:number;

date:string;

};



export function useTransactions(){


const [transactions,setTransactions] =
useState<Transaction[]>([]);


const [loading,setLoading] =
useState(true);


const [error,setError] =
useState<string|null>(null);



async function refresh(){


try{


setLoading(true);

setError(null);



const res =
await fetch("/api/transactions");



if(!res.ok){

throw new Error(
"Transactions request failed"
);

}



const data =
await res.json();



setTransactions(data);



}catch(error){


console.error(error);


setError(
"Error loading transactions"
);



}finally{


setLoading(false);


}


}



async function createTransaction({

type,

playerName,

rarity,

price,

}:{

type:string;

playerName:string;

rarity:string;

price:number;

}){


try{


const res =
await fetch(
"/api/transactions",
{

method:"POST",

headers:{
"Content-Type":"application/json",
},

body:JSON.stringify({

type,

playerName,

rarity,

price,

}),

}
);



if(!res.ok){

throw new Error(
"Transaction create failed"
);

}



await refresh();



}catch(error){


console.error(error);


setError(
"Error creating transaction"
);


}



}



useEffect(()=>{


refresh();


},[]);



return {

transactions,

loading,

error,

refresh,

createTransaction,

};


}