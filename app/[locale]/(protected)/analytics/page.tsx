"use client";

import { useTranslations } from "next-intl";

import { useAnalytics } from "@/hooks/useAnalytics";

import AnalyticsStats from "@/components/analytics/AnalyticsStats";
import AnalyticsDistribution from "@/components/analytics/AnalyticsDistribution";
import AnalyticsCharts from "@/components/analytics/AnalyticsCharts";
import AnalyticsInsights from "@/components/analytics/AnalyticsInsights";


export default function AnalyticsPage(){


const t =
useTranslations("analytics");


const {
data,
loading,
error,

} = useAnalytics();



if(loading){

return (

<div className="text-center text-zinc-400">

{t("loading")}

</div>

);

}



if(error || !data){

return (

<div className="text-white">

{error ?? "No hay datos de analytics"}

</div>

);

}



return (

<div className="space-y-8">


<section
className="
rounded-3xl
border
border-white/10
bg-[#17112F]
p-8
"
>


<h1 className="text-5xl font-black text-white">

{t("title")}

</h1>


<p className="mt-3 text-lg text-zinc-400">

{t("subtitle")}

</p>


</section>





<AnalyticsStats

roi={data.roi}

profit={data.profit}

totalBought={data.totalBought}

totalSold={data.totalSold}

recoveredCapital={data.recoveredCapital}

/>





<AnalyticsDistribution

scarcity={data.scarcity}

/>





<AnalyticsCharts

transactionsHistory={data.transactionsHistory}

buySellData={data.buySellData}

/>





<AnalyticsInsights

roi={data.roi}

profit={data.profit}

totalBought={data.totalBought}

totalSold={data.totalSold}

galleryValue={data.galleryValue}

/>



</div>

);

}