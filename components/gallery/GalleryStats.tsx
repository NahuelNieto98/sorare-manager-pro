"use client";


type Card = {

  playerName:string;

  marketValue:number|null;

  averageScore:number|null;

};



type Props = {

  cards:Card[];

  galleryValue:number;

  totalCards:number;

  inSeasonCards:number;

  classicCards:number;

  inSeasonValue:number;

  classicValue:number;

};



export default function GalleryStats({

  cards,

  galleryValue,

  totalCards,

  inSeasonCards,

  classicCards,

  inSeasonValue,

  classicValue,

}:Props){



const averageAA =

cards.length

?

cards.reduce(

(sum,card)=>

sum + (card.averageScore ?? 0),

0

)

/

cards.length

:

0;




const mostValuableCard =

[...cards].sort(

(a,b)=>

(b.marketValue ?? 0)

-

(a.marketValue ?? 0)

)[0];




return (

<div

className="
grid
gap-5
mb-8
md:grid-cols-2
xl:grid-cols-4
"

>



<div

className="
rounded-3xl
border
border-white/10
bg-[#17112F]
p-6
"

>

<p className="text-zinc-400">

💎 Valor colección

</p>


<h2 className="mt-3 text-3xl font-black text-green-400">

€{galleryValue.toFixed(2)}

</h2>


</div>





<div

className="
rounded-3xl
border
border-white/10
bg-[#17112F]
p-6
"

>

<p className="text-zinc-400">

🃏 Cartas

</p>


<h2 className="mt-3 text-3xl font-black text-white">

{totalCards}

</h2>


<p className="mt-2 text-sm text-zinc-500">

{inSeasonCards} In Season · {classicCards} Classic

</p>


</div>





<div

className="
rounded-3xl
border
border-white/10
bg-[#17112F]
p-6
"

>

<p className="text-zinc-400">

⭐ Media AA

</p>


<h2 className="mt-3 text-3xl font-black text-violet-300">

{averageAA.toFixed(1)}

</h2>


<p className="mt-2 text-sm text-zinc-500">

Media de rendimiento

</p>


</div>





<div

className="
rounded-3xl
border
border-white/10
bg-[#17112F]
p-6
"

>

<p className="text-zinc-400">

🏆 Carta estrella

</p>


<h2 className="mt-3 truncate text-xl font-black text-white">

{mostValuableCard?.playerName ?? "Sin datos"}

</h2>


<p className="mt-2 font-bold text-green-400">

€

{mostValuableCard?.marketValue?.toFixed(2) ?? "0.00"}

</p>


</div>





</div>

);

}