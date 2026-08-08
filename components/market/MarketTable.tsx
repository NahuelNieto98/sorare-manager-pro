type Props = {

cards:{
id:string;

price:number;

Card:{
playerName:string;
club:string|null;
scarcity:string;
marketValue:number|null;
};

score:number;

}[];

};



export default function MarketTable({

cards,

}:Props){


return (

<section

className="
rounded-3xl
border
border-white/10
bg-[#17112F]
overflow-hidden
"

>


<div className="p-8">

<h2 className="text-3xl font-black text-white">

Mercado completo

</h2>


<p className="mt-2 text-zinc-400">

Todas las oportunidades detectadas.

</p>


</div>



<div className="overflow-x-auto">


<table className="w-full">


<thead className="bg-white/5">

<tr>


<th className="px-6 py-4 text-left text-sm text-zinc-400">

Jugador

</th>


<th className="px-6 py-4 text-left text-sm text-zinc-400">

Rareza

</th>


<th className="px-6 py-4 text-left text-sm text-zinc-400">

Club

</th>


<th className="px-6 py-4 text-right text-sm text-zinc-400">

Precio

</th>


<th className="px-6 py-4 text-right text-sm text-zinc-400">

Score

</th>


</tr>

</thead>



<tbody>


{

cards.map((item)=>(


<tr

key={item.id}

className="
border-t
border-white/5
hover:bg-white/5
transition
"

>


<td className="
px-6
py-4
font-bold
text-white
">

{item.Card.playerName}

</td>



<td className="
px-6
py-4
text-zinc-300
">

{item.Card.scarcity}

</td>



<td className="
px-6
py-4
text-zinc-400
">

{item.Card.club ?? "-"}

</td>



<td className="
px-6
py-4
text-right
font-black
text-white
">

€{item.price.toFixed(2)}

</td>



<td className="
px-6
py-4
text-right
font-black
text-violet-400
">

🔥 {item.score}/100

</td>



</tr>


))

}


</tbody>


</table>


</div>


</section>

);

}