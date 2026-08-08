"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
} from "recharts";


type Snapshot = {
  id: string;
  galleryValue: number;
  createdAt: string;
};



export default function PortfolioChart(){


const t = useTranslations("portfolioChart");



const [history,setHistory] =
useState<Snapshot[]>([]);




useEffect(()=>{

fetch("/api/portfolio-history")

.then((res)=>res.json())

.then(setHistory);

},[]);





const data =
history.map((item)=>({

date:
new Date(item.createdAt)
.toLocaleDateString(),

value:item.galleryValue,

}));







return (

<div>



<h2 className="text-2xl font-bold text-white">

{t("title")}

</h2>





<p className="mt-2 text-zinc-400">

{t("subtitle")}

</p>







<div className="mt-8 h-80">


<ResponsiveContainer
width="100%"
height="100%"
>


<AreaChart data={data}>


<XAxis
dataKey="date"
/>



<Tooltip />





<Area

type="monotone"

dataKey="value"

stroke="#8b5cf6"

fill="#8b5cf6"

fillOpacity={0.25}

/>



</AreaChart>



</ResponsiveContainer>



</div>


</div>


);



}