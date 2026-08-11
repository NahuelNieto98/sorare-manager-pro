"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import ConnectHero from "@/components/connect/ConnectHero";
import ConnectButton from "@/components/connect/ConnectButton";


export default function ConnectSorarePage(){


const t =
useTranslations("connect");

const [loading,setLoading] =
useState(false);



function connectSorare(){

setLoading(true);

window.location.href =
"/api/sorare/connect";

}



return (

<div className="space-y-8">



<ConnectHero

title={t("title")}

subtitle={t("subtitle")}

/>





<section

className="
rounded-3xl
border
border-white/10
bg-[#17112F]
p-8
"

>


<h2 className="text-2xl font-black text-white">

{t("connectAccount")}

</h2>


<p className="mt-3 text-zinc-400">

{t("connectDescription")}

</p>



<ConnectButton

loading={loading}

onConnect={connectSorare}

label={t("button")}

loadingLabel={t("connecting")}

/>



</section>



</div>

);

}