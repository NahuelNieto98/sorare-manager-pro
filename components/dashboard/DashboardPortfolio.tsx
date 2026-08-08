"use client";

import PortfolioCard from "@/components/dashboard/PortfolioCard";
import QuickStats from "@/components/dashboard/QuickStats";


type DashboardPortfolioProps = {

  galleryValue:number;

  profit:number;

  roi:number;

  totalCards:number;

  average:number;

};



export default function DashboardPortfolio({

  galleryValue,

  profit,

  roi,

  totalCards,

  average,

}: DashboardPortfolioProps){


return (

<div
className="
space-y-6
"
>


<PortfolioCard

galleryValue={galleryValue}

profit={profit}

roi={roi}

/>



<QuickStats

totalCards={totalCards}

average={average}

/>



</div>

);

}