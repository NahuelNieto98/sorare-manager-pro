"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import DashboardHero from "@/components/dashboard/DashboardHero";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import DashboardActivity from "@/components/dashboard/DashboardActivity";

import PortfolioCard from "@/components/dashboard/PortfolioCard";
import QuickStats from "@/components/dashboard/QuickStats";
import TopCards from "@/components/dashboard/TopCards";
import ScoutCard from "@/components/dashboard/ScoutCard";


type DashboardData = {

  galleryValue:number;

  average:number;

  totalCards:number;

  totalBought:number;

  totalSold:number;

  profit:number;

  roi:number;

  scarcity:{
    limited:number;
    rare:number;
    superRare:number;
    unique:number;
  };

  topCards:{
    playerName:string;
    marketValue:number|null;
  }[];

  recentTransactions:{
    id:string;
    type:string;
    playerName:string;
    rarity:string;
    price:number;
  }[];

  needsConnection?:boolean;

};



export default function DashboardPage(){


const router = useRouter();

const t =
useTranslations("dashboard");


const [data,setData] =
useState<DashboardData|null>(null);


const [loading,setLoading] =
useState(true);


const [error,setError] =
useState<string|null>(null);



useEffect(()=>{


async function loadDashboard(){


try {


const res =
await fetch("/api/dashboard");


if(!res.ok){

throw new Error(
`Dashboard API error: ${res.status}`
);

}


const json =
await res.json();


if(json.needsConnection){

router.push("/connect");

return;

}


setData(json);

setLoading(false);



}catch(error){


console.error(
"Dashboard loading error:",
error
);


setError(
"Error cargando el dashboard"
);


setLoading(false);


}


}


loadDashboard();


},[router]);



if(error){

return (

<div className="text-white">

{error}

</div>

);

}



if(loading || !data){

return (

<div
className="
flex
h-full
items-center
justify-center
text-2xl
text-white
"
>

{t("loading")}

</div>

);

}



return (

<div
className="
space-y-8
"
>


<DashboardHero

galleryValue={data.galleryValue}

totalCards={data.totalCards}

/>



<DashboardStats

galleryValue={data.galleryValue}

totalCards={data.totalCards}

roi={data.roi}

profit={data.profit}

average={data.average}

/>



<PortfolioCard

galleryValue={data.galleryValue}

profit={data.profit}

roi={data.roi}

/>



<DashboardCharts />



<div
className="
grid
gap-6
xl:grid-cols-2
"
>


<QuickStats

totalCards={data.totalCards}

average={data.average}

/>


<TopCards

cards={data.topCards}

/>


</div>



<DashboardActivity

totalBought={data.totalBought}

totalSold={data.totalSold}

transactions={data.recentTransactions}

/>



<ScoutCard />


</div>

);

}