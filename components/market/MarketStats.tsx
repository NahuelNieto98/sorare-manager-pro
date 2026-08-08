type Props = {
  analyzed:number;
  opportunities:number;
  bestScore:number;
};


export default function MarketStats({

analyzed,

opportunities,

bestScore,

}:Props){


return (

<div className="grid gap-6 md:grid-cols-3">


<Card

title="Cartas analizadas"

value={String(analyzed)}

/>


<Card

title="Oportunidades"

value={String(opportunities)}

/>


<Card

title="Mejor Score"

value={`${bestScore}/100`}

/>


</div>

);

}



function Card({

title,

value,

}:{

title:string;

value:string;

}){


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


<p className="text-sm text-zinc-400">

{title}

</p>


<h2 className="mt-4 text-4xl font-black text-white">

{value}

</h2>


</div>

);

}