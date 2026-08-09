import Link from "next/link";

type Props = {
  id:string;
  playerName:string;
  club:string|null;
  position:string|null;
  pictureUrl:string|null;
  scarcity:string;
  marketValue:number|null;
  season:number;
  averageScore:number|null;
  l5Score:number|null;
  l10Score:number|null;
  l15Score:number|null;
  l40Score:number|null;
};


function rarityLabel(
  scarcity:string
){
  return scarcity
    .replace("_"," ")
    .toUpperCase();
}


function positionLabel(
  position:string|null
){

  if(!position)
    return "—";

  return position
    .replace("_"," ")
    .toUpperCase();

}


function scoreColor(
  value:number|null
){

  if(value === null)
    return "text-white";

  if(value >= 60)
    return "text-green-400";

  if(value >= 40)
    return "text-yellow-400";

  return "text-red-400";

}



export default function CardItem({

id,
playerName,
club,
position,
pictureUrl,
scarcity,
marketValue,
season,
averageScore,
l5Score,
l10Score,
l15Score,
l40Score,

}:Props){


return (

<div

className="
group
overflow-hidden
rounded-3xl
border
border-white/10
bg-gradient-to-br
from-[#1b1535]
via-[#221a45]
to-[#120e25]
transition-all
duration-300
hover:-translate-y-2
hover:shadow-2xl
hover:shadow-violet-900/40
"

>


<div className="relative">


{
pictureUrl ?

(

<img

src={pictureUrl}

alt={playerName}

className="
h-full
w-full
object-contain
transition
duration-500
group-hover:scale-105
"

/>

)

:

(

<div className="p-10 text-center">
Sin imagen
</div>

)

}



<div

className="
absolute
inset-0
bg-gradient-to-t
from-[#120e25]
via-transparent
to-transparent
"

/>



<div

className="
absolute
right-4
top-4
rounded-2xl
border
border-white/10
bg-black/60
px-5
py-4
text-center
backdrop-blur
"

>

<p className="
text-xs
font-bold
text-white/70
">

AA15

</p>


<p className="
text-3xl
font-black
text-white
">

{averageScore ?? "-"}

</p>


</div>


</div>



<div className="p-5">


<h2 className="
text-xl
font-bold
text-white
">

{playerName}

</h2>



<p className="
mt-1
text-sm
text-white/60
">

{club ?? "Sin club"}

</p>



<div className="
mt-3
flex
gap-2
">

<span

className="
rounded-full
bg-violet-500/20
px-3
py-1
text-xs
font-bold
text-violet-300
"

>

{positionLabel(position)}

</span>



<span

className="
rounded-full
bg-white/10
px-3
py-1
text-xs
font-bold
text-white/60
"

>

{rarityLabel(scarcity)} · {season}

</span>


</div>



<div

className="
mt-5
grid
grid-cols-4
gap-2
rounded-xl
bg-black/20
p-3
"

>


<div>
<p className="text-xs text-white/40">L5</p>
<p className={scoreColor(l5Score)}>
{l5Score ?? "-"}
</p>
</div>


<div>
<p className="text-xs text-white/40">L10</p>
<p className={scoreColor(l10Score)}>
{l10Score ?? "-"}
</p>
</div>


<div>
<p className="text-xs text-white/40">L15</p>
<p className={scoreColor(l15Score)}>
{l15Score ?? "-"}
</p>
</div>


<div>
<p className="text-xs text-white/40">L40</p>
<p className={scoreColor(l40Score)}>
{l40Score ?? "-"}
</p>
</div>


</div>



<div

className="
mt-5
flex
items-center
justify-between
"

>


<div>

<p className="
text-xs
text-white/50
">

VALOR

</p>


<p className="
text-2xl
font-black
text-green-400
">

€{marketValue?.toFixed(2) ?? "0.00"}

</p>


</div>



<Link

href={`/gallery/${id}`}

className="
rounded-xl
bg-violet-600
px-5
py-2.5
text-sm
font-bold
text-white
transition
hover:bg-violet-500
"

>

Ver carta

</Link>


</div>


</div>


</div>


);

}