"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";


export default function ConnectSorarePage(){


const t = useTranslations("connect");


const [loading,setLoading] =
useState(false);




function connectSorare(){


setLoading(true);


window.location.href =
"/api/sorare/connect";


}





return (

<div className="max-w-xl">



<h1 className="text-4xl font-bold text-white">

{t("title")}

</h1>





<p className="mt-3 text-zinc-400">

{t("subtitle")}

</p>







<button


onClick={connectSorare}


disabled={loading}


className="
mt-8
rounded-xl
bg-purple-600
px-8
py-4
font-bold
text-white
hover:bg-purple-500
disabled:opacity-50
"



>


{

loading

?

t("connecting")

:

t("button")

}



</button>





</div>

);


}