"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";


type Card = {
  marketValue: number | null;
};



type Snapshot = {
  id: string;
  galleryValue: number;
  roi: number;
  profit: number;
  createdAt: string;
};



type Props = {
  cards: Card[];
};



export default function GalleryChart({
  cards,
}: Props){


const t =
useTranslations("galleryChart");


const [history,setHistory] =
useState<Snapshot[]>([]);




useEffect(()=>{

loadHistory();

},[]);




async function loadHistory(){


try {


const res =
await fetch("/api/portfolio-history");



if(!res.ok){

setHistory([]);

return;

}




const data =
await res.json();



if(!Array.isArray(data)){

setHistory([]);

return;

}




const formatted =
data.map((item:Snapshot)=>({


...item,


day:

new Date(item.createdAt)

.toLocaleDateString(

"es-ES",

{

day:"2-digit",

month:"2-digit",

}

),


}));



setHistory(formatted);



}catch(error){


console.error(
"GalleryChart error:",
error
);


setHistory([]);


}



}





const currentValue =
cards.reduce(

(sum,card)=>

sum + (card.marketValue ?? 0),

0

);




return (

<div>


<h2 className="text-2xl font-bold text-white">

{t("title")}

</h2>



<p className="mt-2 text-zinc-400">

{t("subtitle")}

</p>




<div className="mt-8 h-80">


{

history.length === 0 ? (


<div

className="
flex
h-full
items-center
justify-center
rounded-2xl
border
border-white/10
bg-white/5
text-zinc-400
"

>

Sin datos históricos todavía.

<br />

Valor actual: {currentValue.toFixed(2)}€

</div>


) : (



<ResponsiveContainer

width="100%"

height="100%"

>


<AreaChart data={history}>


<XAxis

dataKey="day"

stroke="#888"

/>


<YAxis

stroke="#888"

/>


<Tooltip />



<Area

type="monotone"

dataKey="galleryValue"

stroke="#8b5cf6"

fill="#8b5cf6"

fillOpacity={0.25}

/>



</AreaChart>


</ResponsiveContainer>



)

}



</div>


</div>

);

}