"use client";

import {
Bot,
Sparkles,
TrendingUp,
TrendingDown,
ShieldAlert,
Target,
Lock,
} from "lucide-react";

import { useTranslations } from "next-intl";



export default function ScoutCard(){


const t = useTranslations("scoutCard");



return (

<div>


<div
className="
absolute
-right-20
-top-20
h-64
w-64
rounded-full
bg-purple-500/20
blur-3xl
"
/>





<div className="relative">



<div className="flex items-start justify-between">



<div className="flex items-center gap-4">



<div
className="
flex
h-14
w-14
items-center
justify-center
rounded-2xl
bg-purple-500/20
"
>

<Bot
className="text-purple-300"
size={30}
/>


</div>





<div>


<h2 className="text-2xl font-black text-white">

{t("title")}

</h2>



<p className="mt-1 text-sm text-zinc-400">

{t("subtitle")}

</p>



</div>



</div>





<span
className="
rounded-full
bg-yellow-500/20
px-4
py-1
text-xs
font-bold
text-yellow-400
"
>

{t("beta")}

</span>



</div>







<p
className="
mt-8
text-zinc-400
leading-relaxed
"
>

{t("description")}

</p>








<div
className="
mt-8
space-y-3
"
>


<Feature
icon={<TrendingUp size={20}/>}
text={t("buyRecommendations")}
/>



<Feature
icon={<TrendingDown size={20}/>}
text={t("sellAlerts")}
/>



<Feature
icon={<Target size={20}/>}
text={t("lineupOptimization")}
/>



<Feature
icon={<ShieldAlert size={20}/>}
text={t("riskDetection")}
/>



</div>







<button
className="
mt-8
flex
w-full
items-center
justify-center
gap-3
rounded-2xl
bg-purple-600
py-4
font-bold
text-white
transition
hover:bg-purple-500
"
>


<Lock size={18}/>


{t("availableSoon")}


</button>








<div
className="
mt-6
flex
items-center
justify-center
gap-2
text-xs
text-zinc-500
"
>


<Sparkles size={14}/>


{t("automaticAnalysis")}



</div>





</div>



</div>


);


}






function Feature({
icon,
text,
}:{
icon:React.ReactNode;
text:string;
}){


return (

<div
className="
flex
items-center
gap-3
"
>


<div className="text-purple-300">

{icon}

</div>



<p className="font-medium text-white">

{text}

</p>



</div>

);


}