"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";


export default function AssistantPage(){


const t = useTranslations("assistant");



const [loading,setLoading] =
useState(false);


const [analysis,setAnalysis] =
useState("");





async function analyze(){


setLoading(true);



try{


const res =
await fetch("/api/assistant");



const data =
await res.json();



setAnalysis(data.analysis);



}finally{


setLoading(false);


}



}






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







<div

className="
rounded-3xl
border
border-violet-700/30
bg-[#17112F]
p-8
"

>


<h2 className="text-2xl font-bold text-white">

{t("analyzeTitle")}

</h2>



<p className="mt-3 text-zinc-400">

{t("description")}

</p>





<button


onClick={analyze}


disabled={loading}


className="
mt-8
rounded-xl
bg-violet-600
px-8
py-4
font-bold
text-white
transition
hover:bg-violet-500
disabled:opacity-50
"

>


{
loading

?

t("analyzing")

:

t("analyzeButton")

}



</button>



</div>







<div

className="
rounded-3xl
border
border-violet-700/30
bg-[#17112F]
p-8
"

>



<h2 className="mb-6 text-2xl font-bold text-white">

{t("result")}

</h2>





{

analysis

?

(

<pre

className="
whitespace-pre-wrap
text-zinc-300
leading-8
"

>

{analysis}

</pre>


)

:

(

<p className="text-zinc-500">

{t("empty")}

</p>


)


}





</div>





</div>


);


}