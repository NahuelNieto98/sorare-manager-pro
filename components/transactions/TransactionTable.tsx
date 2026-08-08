"use client";

import { useTranslations } from "next-intl";

import type { Transaction } from "@/hooks/useTransactions";


type Props = {
  transactions: Transaction[];
};



export default function TransactionTable({

transactions,

}:Props){


const t =
useTranslations("transactions");



return (

<div

className="
rounded-3xl
border
border-white/10
bg-[#17112F]
overflow-hidden
"

>


<div
className="
border-b
border-white/10
p-6
"
>

<h2 className="text-2xl font-black text-white">

{t("title")}

</h2>


<p className="mt-2 text-zinc-400">

Historial completo de movimientos.

</p>


</div>




<div className="overflow-x-auto">


<table className="w-full">


<thead className="bg-white/5">

<tr>


<th className="px-6 py-4 text-left text-sm text-zinc-400">

{t("type")}

</th>


<th className="px-6 py-4 text-left text-sm text-zinc-400">

{t("player")}

</th>


<th className="px-6 py-4 text-left text-sm text-zinc-400">

{t("rarity")}

</th>


<th className="px-6 py-4 text-right text-sm text-zinc-400">

{t("price")}

</th>


</tr>

</thead>




<tbody>


{
transactions.length===0
?

<tr>

<td
colSpan={4}
className="
px-6
py-8
text-center
text-zinc-400
"
>

No hay transacciones todavía.

</td>

</tr>

:

transactions.map((item)=>(

<tr

key={item.id}

className="
border-t
border-white/5
hover:bg-white/5
transition
"

>


<td className="px-6 py-4">

<span
className={`
rounded-full
px-3
py-1
text-xs
font-bold
${
item.type==="BUY"
?
"bg-red-500/10 text-red-400"
:
"bg-green-500/10 text-green-400"
}
`}
>

{
item.type==="BUY"
?
t("purchase")
:
t("sale")
}

</span>

</td>



<td className="px-6 py-4 font-bold text-white">

{item.playerName}

</td>



<td className="px-6 py-4 text-zinc-300">

{item.rarity}

</td>



<td className="px-6 py-4 text-right font-black text-white">

€{item.price.toFixed(2)}

</td>



</tr>

))

}



</tbody>


</table>


</div>


</div>

);

}