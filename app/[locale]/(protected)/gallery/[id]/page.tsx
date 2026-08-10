import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { createMarketTransaction } from "@/app/actions/create-market-transaction";


export default async function CardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {


  const { id } = await params;


  const t = await getTranslations("card");



  const card =
    await prisma.card.findUnique({

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
        (tx)=>
          tx.type.includes("BUY") ||
          tx.type.includes("PURCHASE") ||
          tx.type.includes("AUCTION")
      )
      .sort(
        (a,b)=>
          new Date(b.date).getTime()
          -
          new Date(a.date).getTime()
      )[0];





  const purchasePrice =
    purchase?.price ?? null;



  const purchaseDate =
    purchase?.date ?? null;




  const roi =
    purchasePrice && card.marketValue

    ?

    (
      (
        (card.marketValue - purchasePrice)
        /
        purchasePrice
      )
      *
      100
    ).toFixed(1)

    :

    null;






return (

<div className="p-6">


<Link href="../">

{t("back")}

</Link>



<div className="mt-6">


{
card.pictureUrl ?

<img
src={card.pictureUrl}
alt={card.playerName}
className="w-full rounded-xl"
/>

:

<div>
{t("noImage")}
</div>

}




<h1 className="mt-6 text-3xl font-bold">

{card.playerName}

</h1>



<p className="text-gray-400">

{card.club ?? t("noClub")}

</p>




<div className="mt-6 grid gap-4">


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
title={t("purchasePrice")}
value={
purchasePrice
?
`€${purchasePrice.toFixed(2)}`
:
"-"
}
/>



<Info
title={t("purchaseDate")}
value={
purchaseDate
?
new Date(purchaseDate)
.toLocaleDateString("es-ES")
:
"-"
}
/>



<Info
title={t("roi")}
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





<form

action={async()=>{

"use server";


await createMarketTransaction(
card.id,
card.marketValue ?? 0
);


}}

>


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


</form>



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

<div className="rounded-xl bg-zinc-900 p-4">


<p className="text-sm text-gray-400">

{title}

</p>


<p className="text-xl font-bold">

{value}

</p>


</div>

);

}