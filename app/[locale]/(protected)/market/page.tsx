"use client";

import { useEffect, useState } from "react";
import { calculateMarketScore } from "@/lib/market-score";


export default function MarketPage(){


const [cards,setCards] = useState<any[]>([]);



useEffect(()=>{


fetch("/api/market")

.then(res=>res.json())

.then(data=>{


const sorted = data
.filter((item:any)=>item.Card)
.sort((a:any,b:any)=>{


const scoreA =
calculateMarketScore(
a.Card,
a.price
);


const scoreB =
calculateMarketScore(
b.Card,
b.price
);


return scoreB-scoreA;


});


setCards(sorted);


});


},[]);





function getOpportunity(item:any){


const value =
item.Card?.marketValue;


if(!value){

return 0;

}


return (

(
value - item.price
)

/

item.price

)

*

100;


}




function getLabel(score:number){


if(score >= 80){

return {
text:"🟢 COMPRA",
style:"bg-green-500/20 text-green-400"
};

}


if(score >= 60){

return {
text:"🟡 VIGILAR",
style:"bg-yellow-500/20 text-yellow-400"
};

}


return {

text:"🔴 CARA",

style:"bg-red-500/20 text-red-400"

};


}





const opportunities =
cards.filter((item)=>{

return getOpportunity(item)>0;

});





return (


<div className="space-y-10">



<div>


<h1 className="
text-4xl
font-black
text-white
">

Sorare Market Scanner

</h1>


<p className="
mt-3
text-zinc-400
">

Detecta oportunidades de compra antes que el mercado.

</p>


</div>





<div className="
grid
grid-cols-1
md:grid-cols-3
gap-5
">



<div className="
rounded-2xl
border
border-white/10
bg-white/5
p-6
">


<p className="text-zinc-400">

Cartas analizadas

</p>


<h2 className="
mt-3
text-4xl
font-black
text-white
">

{cards.length}

</h2>


</div>





<div className="
rounded-2xl
border
border-green-500/20
bg-green-500/10
p-6
">


<p className="text-zinc-400">

Oportunidades

</p>


<h2 className="
mt-3
text-4xl
font-black
text-green-400
">

{opportunities.length}

</h2>


</div>





<div className="
rounded-2xl
border
border-purple-500/20
bg-purple-500/10
p-6
">


<p className="text-zinc-400">

Mejor score

</p>


<h2 className="
mt-3
text-4xl
font-black
text-purple-300
">

{
cards.length
?
calculateMarketScore(
cards[0].Card,
cards[0].price
)
:
0
}

/100

</h2>


</div>



</div>







<div>


<h2 className="
mb-5
text-2xl
font-black
text-white
">

🔥 TOP OPORTUNIDADES HOY

</h2>



<div className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-6
">



{
cards.slice(0,5).map((item)=>{


const card=item.Card;


const score =
calculateMarketScore(
card,
item.price
);


const opportunity =
getOpportunity(item);


const label =
getLabel(score);



return (


<div

key={item.id}

className="
rounded-3xl
border
border-purple-900
bg-[#17112F]
p-6
"

>



{
card.pictureUrl && (

<img

src={card.pictureUrl}

className="
w-full
rounded-2xl
mb-5
"

/>

)

}




<div className="
flex
justify-between
items-start
">


<div>


<h3 className="
text-xl
font-black
text-white
">

{card.playerName}

</h3>


<p className="
text-zinc-400
">

{card.club}

</p>


</div>



<span className={`
rounded-xl
px-3
py-1
text-xs
font-bold
${label.style}
`}>

{label.text}

</span>


</div>





<div className="
mt-5
space-y-3
text-sm
">



<div className="flex justify-between">

<span className="text-zinc-400">

Rareza

</span>


<span className="text-white">

{card.scarcity}

</span>


</div>





<div className="flex justify-between">

<span className="text-zinc-400">

Precio compra

</span>


<span className="text-green-400 font-bold">

{item.price.toFixed(2)}€

</span>


</div>




<div className="flex justify-between">

<span className="text-zinc-400">

Valor estimado

</span>


<span className="text-white">

{card.marketValue?.toFixed(2) ?? 0}€

</span>


</div>




</div>





<div className="
mt-6
flex
justify-between
rounded-2xl
bg-black/20
p-4
">


<div>

<p className="text-zinc-400 text-xs">

Oportunidad

</p>


<p className="text-green-400 font-black text-xl">

+{opportunity.toFixed(1)}%

</p>


</div>



<div className="text-right">

<p className="text-zinc-400 text-xs">

Score

</p>


<p className="text-purple-300 font-black text-xl">

{score}/100

</p>


</div>



</div>



</div>


);


})

}



</div>


</div>





<div>


<h2 className="
mb-5
text-2xl
font-black
text-white
">

Mercado completo

</h2>




<div className="space-y-4">


{

cards.map((item)=>{


const score =
calculateMarketScore(
item.Card,
item.price
);



return (


<div

key={item.id}

className="
flex
items-center
justify-between
rounded-2xl
border
border-white/10
bg-white/5
p-5
"

>


<div>

<h3 className="font-bold text-white">

{item.Card.playerName}

</h3>


<p className="text-sm text-zinc-400">

{item.Card.scarcity} · {item.Card.club}

</p>


</div>



<div className="text-right">


<p className="text-green-400 font-bold">

{item.price.toFixed(2)}€

</p>


<p className="text-purple-300">

🔥 {score}/100

</p>


</div>



</div>


);


})

}


</div>


</div>




</div>


);


}