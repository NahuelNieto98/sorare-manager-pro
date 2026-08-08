"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { useDashboard } from "@/hooks/useDashboard";

import DashboardHero from "@/components/dashboard/DashboardHero";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardPortfolio from "@/components/dashboard/DashboardPortfolio";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import DashboardActivity from "@/components/dashboard/DashboardActivity";
import TopCards from "@/components/dashboard/TopCards";
import QuickStats from "@/components/dashboard/QuickStats";

import MarketSummary from "@/components/dashboard/MarketSummary";
import ScoutCard from "@/components/dashboard/ScoutCard";
import SystemStatus from "@/components/dashboard/SystemStatus";



export default function DashboardPage(){


const router = useRouter();


const t =
useTranslations("dashboard");



const {
data,
loading,
error
} = useDashboard();







if(error){

return (

<div className="text-red-400">

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







if(data.needsConnection){

router.push("/connect");

return null;

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

average={data.average}

topCard={data.topCards[0]}

/>







<QuickStats

totalCards={data.totalCards}

average={data.average}

/>







<DashboardStats

galleryValue={data.galleryValue}

totalCards={data.totalCards}

roi={data.roi}

profit={data.profit}

average={data.average}

/>







<DashboardPortfolio

galleryValue={data.galleryValue}

profit={data.profit}

roi={data.roi}

totalCards={data.totalCards}

average={data.average}

/>







<DashboardCharts

cards={data.topCards}

/>







<TopCards

cards={data.topCards}

/>







<MarketSummary

bought={data.totalBought}

sold={data.totalSold}

/>







<ScoutCard />







<SystemStatus />







<DashboardActivity

totalBought={data.totalBought}

totalSold={data.totalSold}

transactions={data.recentTransactions}

/>






</div>

);

}