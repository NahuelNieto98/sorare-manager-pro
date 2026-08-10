import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function CardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  const t = await getTranslations("card");


  const card = await prisma.card.findUnique({

    where:{
      id,
    },

    include:{
      MarketTransaction:true,
    },

  });



  if(!card){
    notFound();
  }



  const purchase =
    card.MarketTransaction
      .filter(
        (transaction)=>
          transaction.userId === card.ownerId
      )
      .sort(
        (a,b)=>
          new Date(a.date).getTime()
          -
          new Date(b.date).getTime()
      )[0];



  const roi =
    purchase && card.marketValue
    ?
    (
      (
        (card.marketValue - purchase.price)
        /
        purchase.price
      )
      *
      100
    ).toFixed(1)
    :
    null;



return (

<div className="space-y-8">


<Link

href="/es/gallery"

className="
inline-flex
rounded-xl
bg-white/5
px-5
py-3
text-sm
font-bold
text-zinc-300
hover:bg-white/10
"

>

{t("back")}

</Link>




<div
className="
grid
gap-8
xl:grid-cols-2
"
>



<div

className="
overflow-hidden
rounded-3xl
border
border-white/10
bg-gradient-to-br
from-[#181530]
via-[#221B45]
to-[#141127]
p-8
"

>


<div className="flex justify-center">


{
card.pictureUrl
?

<img

src={card.pictureUrl}

alt={card.playerName}

className="
h-[500px]
object-contain
"

/>

:

<div className="text-zinc-500">

{t("noImage")}

</div>

}


</div>


</div>







<div

className="
rounded-3xl
border
border-white/10
bg-[#17112F]
p-8
"

>



<h1

className="
text-5xl
font-black
text-white
"

>

{card.playerName}

</h1>




<p

className="
mt-3
text-xl
text-zinc-400
"

>

{card.club ?? t("noClub")}

</p>







<div

className="
mt-10
grid
gap-5
md:grid-cols-2
"

>



<Info

title={t("rarity")}

value={card.scarcity}

/>



<Info

title={t("position")}

value={card.position ?? "-"}

/>



<Info

title={t("aa")}

value={
card.averageScore?.toString()
??
"-"
}

/>



<Info

title={t("marketValue")}

value={
`€${card.marketValue?.toFixed(2) ?? "0.00"}`
}

/>



<Info

title="Precio compra"

value={
purchase
?
`€${purchase.price.toFixed(2)}`
:
"-"
}

/>



<Info

title="Fecha compra"

value={
purchase
?
new Date(
purchase.date
)
.toLocaleDateString(
"es-ES"
)
:
"-"
}

/>



<Info

title="ROI"

value={
roi
?
`${roi}%`
:
"-"
}

/>



<Info

title={t("season")}

value={
card.season.toString()
}

/>



</div>







<h2

className="
mt-10
mb-4
text-xl
font-black
text-white
"

>

{t("performance")}

</h2>





<div

className="
grid
grid-cols-4
gap-3
"

>


<Score

title="L5"

value={card.l5Score}

/>


<Score

title="L10"

value={card.l10Score}

/>


<Score

title="L15"

value={card.l15Score}

/>


<Score

title="L40"

value={card.l40Score}

/>


</div>





<button

className="
mt-10
w-full
rounded-xl
bg-violet-600
py-4
font-bold
text-white
hover:bg-violet-500
"

>

{t("addTransaction")}

</button>



</div>


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

}) {


return (

<div

className="
rounded-2xl
bg-white/5
p-5
"

>

<p className="text-sm text-zinc-500">

{title}

</p>


<p

className="
mt-2
text-2xl
font-black
text-white
"

>

{value}

</p>


</div>

);

}






function Score({

title,

value,

}:{

title:string;

value:number|null;

}) {


return (

<div

className="
rounded-xl
bg-black/20
p-3
text-center
"

>

<p className="text-xs text-zinc-500">

{title}

</p>


<p

className="
mt-1
font-black
text-white
"

>

{value ?? "-"}

</p>


</div>

);

}