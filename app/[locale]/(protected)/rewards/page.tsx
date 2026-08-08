"use client";

import { useTranslations } from "next-intl";


export default function RewardsPage(){


const t = useTranslations("rewards");



return (

<div className="space-y-6">


<div>


<h1 className="text-3xl font-bold text-white">

{t("title")}

</h1>



<p className="mt-4 text-zinc-400">

{t("subtitle")}

</p>


</div>


</div>

);


}