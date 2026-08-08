import RewardCard from "./RewardCard";


export default function RewardsGrid(){


const rewards = [

{
title:"Primer análisis IA",
description:
"Genera tu primer análisis completo de tu colección con Scout IA.",

status:"available" as const,

reward:"Badge Scout IA"
},


{
title:"Coleccionista inicial",

description:
"Consigue tus primeras cartas sincronizadas en Sorare Manager Pro.",

status:"completed" as const,

reward:"Coleccionista"
},


{
title:"Portfolio Elite",

description:
"Alcanza un valor de colección superior para desbloquear este logro.",

status:"locked" as const,

reward:"Insignia Elite"
},


{
title:"Market Hunter",

description:
"Detecta oportunidades de mercado y mejora tus inversiones.",

status:"locked" as const,

reward:"Market Badge"
}

];



return (

<section>


<div className="mb-6">


<h2 className="text-3xl font-black text-white">

Tus recompensas

</h2>


<p className="mt-2 text-zinc-400">

Logros y objetivos dentro de Sorare Manager Pro.

</p>


</div>




<div

className="
grid
gap-6
md:grid-cols-2
xl:grid-cols-4
"

>


{

rewards.map((reward)=>(


<RewardCard

key={reward.title}

{...reward}

/>


))

}


</div>


</section>

);

}