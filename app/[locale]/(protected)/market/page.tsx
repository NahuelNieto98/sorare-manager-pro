"use client";

import { useMarket } from "@/hooks/useMarket";

import MarketStats from "@/components/market/MarketStats";
import MarketList from "@/components/market/MarketList";
import MarketTable from "@/components/market/MarketTable";
import MarketEmpty from "@/components/market/MarketEmpty";


export default function MarketPage(){


const {

cards,

loading,

error,

getOpportunity,

getScore,

} = useMarket();





if(loading){

return (

<div className="text-center text-zinc-400">

Cargando mercado...

</div>

);

}





if(error){

return (

<div className="text-white">

{error}

</div>

);

}






if(cards.length === 0){

return (

<MarketEmpty />

);

}






const opportunities =

cards.filter(
(item)=>getOpportunity(item)>0
);





const bestScore =

cards.length

?

getScore(cards[0])

:

0;






const tableCards =

cards.map((item)=>({

...item,

score:getScore(item),

}));







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


<span

className="
rounded-full
border
border-violet-500/30
bg-violet-500/10
px-4
py-2
text-xs
font-bold
uppercase
tracking-widest
text-violet-300
"

>

Market Intelligence

</span>



<h1

className="
mt-6
text-5xl
font-black
text-white
"

>

Sorare Market Scanner

</h1>



<p

className="
mt-3
text-lg
text-zinc-400
"

>

Detecta oportunidades de compra antes que el mercado.

</p>



</section>







<MarketStats

analyzed={cards.length}

opportunities={opportunities.length}

bestScore={bestScore}

/>







<MarketList

cards={cards}

/>







<MarketTable

cards={tableCards}

/>






</div>

);

}