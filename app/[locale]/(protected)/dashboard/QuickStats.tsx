"use client";

import { useTranslations } from "next-intl";


type Props = {
  bought: number;
  sold: number;
  profit: number;
};



export default function QuickStats({
  bought,
  sold,
  profit,
}: Props) {


const t = useTranslations("dashboardQuickStats");



return (

<div className="grid gap-6 md:grid-cols-3">



<div className="rounded-2xl bg-[#17112F] p-6 border border-purple-900">

<p className="text-zinc-400">
{t("bought")}
</p>


<h2 className="mt-3 text-3xl font-bold text-white">
€{bought.toFixed(2)}
</h2>


</div>





<div className="rounded-2xl bg-[#17112F] p-6 border border-purple-900">


<p className="text-zinc-400">
{t("sold")}
</p>


<h2 className="mt-3 text-3xl font-bold text-white">
€{sold.toFixed(2)}
</h2>


</div>





<div className="rounded-2xl bg-[#17112F] p-6 border border-purple-900">


<p className="text-zinc-400">
{t("profit")}
</p>


<h2 className="mt-3 text-3xl font-bold text-green-400">
€{profit.toFixed(2)}
</h2>


</div>



</div>

);


}