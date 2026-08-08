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



function rarityStyle(
  scarcity:string
){

  switch(
    scarcity.toLowerCase()
  ){

    case "limited":
      return {
        badge:"bg-yellow-400 text-black",
        border:"hover:border-yellow-400/50",
      };


    case "rare":
      return {
        badge:"bg-red-500 text-white",
        border:"hover:border-red-400/50",
      };


    case "super_rare":
      return {
        badge:"bg-blue-500 text-white",
        border:"hover:border-blue-400/50",
      };


    case "unique":
      return {
        badge:"bg-black text-yellow-300 border border-yellow-400",
        border:"hover:border-yellow-400/60",
      };


    default:
      return {
        badge:"bg-purple-600 text-white",
        border:"hover:border-purple-400/50",
      };

  }

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



const style =
rarityStyle(scarcity);



const isInSeason =
season === 2026;




return (

<div

className={`

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
${style.border}

`}

>



<div className="relative h-[360px] overflow-hidden">


{
pictureUrl ? (

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

<div className="flex h-full items-center justify-center text-zinc-500">

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





<span

className={`

absolute
left-4
top-4
rounded-full
px-4
py-1.5
text-xs
font-black
uppercase
${style.badge}

`}

>

{scarcity.replace("_"," ")}

</span>





<span

className={`

absolute
left-4
top-14
rounded-full
px-4
py-1.5
text-xs
font-black

${
isInSeason

?

"bg-green-500 text-black"

:

"bg-yellow-300 text-black"

}

`}

>

{
isInSeason

?

"🟢 IN SEASON 26/27"

:

"🟡 CLASSIC"

}

</span>






<div

className="
absolute
right-4
top-4
rounded-2xl
bg-black/40
px-4
py-3
backdrop-blur
"

>

<p className="text-xs text-zinc-400">

AA

</p>


<p className="text-2xl font-black text-white">

{averageScore ?? "-"}

</p>


</div>



</div>







<div className="p-6">



<h2 className="truncate text-2xl font-black text-white">

{playerName}

</h2>




<div className="mt-2 flex items-center gap-2">


<p className="text-zinc-400">

{club ?? "Sin club"}

</p>



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



<div className="text-center">

<p className="text-[10px] text-zinc-500">
L5
</p>

<p className="font-bold text-white">
{l5Score ?? "-"}
</p>

</div>




<div className="text-center">

<p className="text-[10px] text-zinc-500">
L10
</p>

<p className="font-bold text-white">
{l10Score ?? "-"}
</p>

</div>





<div className="text-center">

<p className="text-[10px] text-zinc-500">
L15
</p>

<p className="font-bold text-white">
{l15Score ?? "-"}
</p>

</div>





<div className="text-center">

<p className="text-[10px] text-zinc-500">
L40
</p>

<p className="font-bold text-white">
{l40Score ?? "-"}
</p>

</div>


</div>







<div className="mt-6 flex items-end justify-between">



<div>

<p className="text-xs uppercase text-zinc-500">

Valor

</p>


<p className="text-3xl font-black text-green-400">

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