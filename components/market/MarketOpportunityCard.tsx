import { calculateMarketScore } from "@/lib/market-score";


type Props = {

item:{
id:string;

price:number;

Card:{
playerName:string;
club:string|null;
scarcity:string;
marketValue:number|null;
pictureUrl:string|null;
};

};

};



export default function MarketOpportunityCard({

item,

}:Props){


const card =
item.Card;



const score =
calculateMarketScore(
card,
item.price
);



const opportunity =

card.marketValue

?

(
(card.marketValue - item.price)
/
item.price
) * 100

:

0;



const label =

score >= 80

?

{
text:"🟢 COMPRA",
style:"bg-green-500/20 text-green-400"
}

:

score >= 60

?

{
text:"🟡 VIGILAR",
style:"bg-yellow-500/20 text-yellow-400"
}

:

{
text:"🔴 CARA",
style:"bg-red-500/20 text-red-400"
};



return (

<div

className="
rounded-3xl
border
border-white/10
bg-[#17112F]
p-6
"

>


{card.pictureUrl && (

<img

src={card.pictureUrl}

className="
mb-5
w-full
rounded-2xl
"

/>

)}



<div className="flex items-center justify-between">


<h3 className="text-xl font-black text-white">

{card.playerName}

</h3>


<span

className={`
rounded-xl
px-3
py-1
text-xs
font-bold
${label.style}
`}

>

{label.text}

</span>


</div>




<p className="mt-2 text-zinc-400">

{card.club ?? "-"}

</p>




<div className="mt-6 grid grid-cols-2 gap-4">


<Info

title="Rareza"

value={card.scarcity}

/>


<Info

title="Score"

value={`${score}/100`}

/>


<Info

title="Precio"

value={`€${item.price.toFixed(2)}`}

/>


<Info

title="Valor"

value={`€${(card.marketValue ?? 0).toFixed(2)}`}

/>


</div>



<div

className="
mt-6
rounded-2xl
bg-green-500/10
p-4
"

>


<p className="text-sm text-zinc-400">

Oportunidad

</p>


<p className="text-2xl font-black text-green-400">

+{opportunity.toFixed(1)}%

</p>


</div>



</div>

);

}




function Info({

title,

value,

}:{

title:string;

value:string;

}){


return (

<div>


<p className="text-xs text-zinc-500">

{title}

</p>


<p className="mt-1 font-bold text-white">

{value}

</p>


</div>

);

}