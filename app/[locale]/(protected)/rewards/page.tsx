"use client";

import { useTranslations } from "next-intl";

import RewardsHero from "@/components/rewards/RewardsHero";
import RewardsGrid from "@/components/rewards/RewardsGrid";


export default function RewardsPage(){


const t =
useTranslations("rewards");



return (

<div className="space-y-8">



<RewardsHero

title={t("title")}

subtitle={t("subtitle")}

/>





<RewardsGrid />



</div>

);

}