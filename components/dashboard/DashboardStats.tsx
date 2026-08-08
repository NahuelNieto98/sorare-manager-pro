"use client";

import { useTranslations } from "next-intl";

import StatCard from "@/components/dashboard/StatCard";


type DashboardStatsProps = {

  galleryValue:number;

  totalCards:number;

  roi:number;

  profit:number;

  average:number;

};



export default function DashboardStats({

  galleryValue,

  totalCards,

  roi,

  profit,

  average,

}: DashboardStatsProps) {


const t =
useTranslations("dashboard");


return (

<div
className="
grid
gap-6
xl:grid-cols-4
"
>


<StatCard

title={t("galleryValue")}

value={`€${galleryValue.toFixed(2)}`}

subtitle={`${totalCards} ${t("cards")}`}

/>



<StatCard

title={t("roi")}

value={`${roi.toFixed(2)}%`}

subtitle={t("profitability")}

/>



<StatCard

title={t("profit")}

value={`€${profit.toFixed(2)}`}

subtitle={t("currentResult")}

/>



<StatCard

title={t("essence")}

value={average.toFixed(1)}

subtitle={t("average")}

/>


</div>

);

}