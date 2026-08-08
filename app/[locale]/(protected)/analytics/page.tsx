"use client";

import { useTranslations } from "next-intl";

import StatCard from "@/components/dashboard/StatCard";
import GalleryChart from "@/components/charts/GalleryChart";


export default function AnalyticsPage(){


const t = useTranslations("analytics");



return (

<div className="space-y-8">


<div>


<h1 className="text-3xl font-bold text-white">

{t("title")}

</h1>



<p className="mt-2 text-zinc-400">

{t("subtitle")}

</p>


</div>






<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">



<StatCard

title={t("roi")}

value="+18.42%"

subtitle={t("profitability")}

/>




<StatCard

title={t("profit")}

value="€356.90"

subtitle={t("sinceStart")}

/>




<StatCard

title={t("bought")}

value="€1,924"

subtitle={t("invested")}

/>




<StatCard

title={t("sold")}

value="€2,281"

subtitle={t("recovered")}

/>



</div>









<div className="mt-8 grid gap-6 xl:grid-cols-3">



<div className="xl:col-span-2">

<GalleryChart />

</div>






<div

className="
rounded-3xl
border
border-violet-700/30
bg-gradient-to-br
from-[#181530]
via-[#221B45]
to-[#141127]
p-6
"

>


<h2 className="mb-6 text-2xl font-bold text-white">

{t("distribution")}

</h2>





<div className="space-y-5">



<div className="flex justify-between">

<span className="text-zinc-400">

Limited

</span>


<span className="font-bold text-white">

87

</span>


</div>





<div className="flex justify-between">

<span className="text-zinc-400">

Rare

</span>


<span className="font-bold text-white">

32

</span>


</div>





<div className="flex justify-between">

<span className="text-zinc-400">

Super Rare

</span>


<span className="font-bold text-white">

8

</span>


</div>





<div className="flex justify-between">

<span className="text-zinc-400">

Unique

</span>


<span className="font-bold text-white">

1

</span>


</div>





</div>


</div>



</div>









<div

className="
mt-8
rounded-3xl
border
border-violet-700/30
bg-gradient-to-br
from-[#181530]
via-[#221B45]
to-[#141127]
p-8
"

>


<h2 className="text-2xl font-bold text-white">

{t("upcoming")}

</h2>






<div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">



<div className="rounded-2xl bg-white/5 p-6">

{t("roiEvolution")}

</div>




<div className="rounded-2xl bg-white/5 p-6">

{t("profitPlayer")}

</div>





<div className="rounded-2xl bg-white/5 p-6">

{t("cardRanking")}

</div>





<div className="rounded-2xl bg-white/5 p-6">

{t("buySell")}

</div>



</div>


</div>





</div>


);


}