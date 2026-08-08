"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";


type Transaction = {
id:string;
type:string;
playerName:string;
rarity:string;
price:number;
date:string;
};



export default function TransactionsPage(){


const t = useTranslations("transactions");



const [transactions,setTransactions] =
useState<Transaction[]>([]);



const [type,setType] =
useState("BUY");


const [playerName,setPlayerName] =
useState("");


const [rarity,setRarity] =
useState("limited");


const [price,setPrice] =
useState("");





async function loadTransactions(){


const res =
await fetch("/api/transactions");


const data =
await res.json();


setTransactions(data);


}





useEffect(()=>{


loadTransactions();


},[]);






async function saveTransaction(
e:React.FormEvent
){


e.preventDefault();



const res =
await fetch(
"/api/transactions",
{
method:"POST",

headers:{
"Content-Type":"application/json",
},

body:JSON.stringify({

type,

playerName,

rarity,

price:Number(price),

}),


}

);



if(!res.ok){

alert(t("error"));

return;

}



setPlayerName("");

setPrice("");

await loadTransactions();


}






return (


<div className="space-y-8">


<div>


<h1 className="text-3xl font-bold text-white">

{t("title")}

</h1>



<p className="text-zinc-400 mt-2">

{t("subtitle")}

</p>


</div>






<form

onSubmit={saveTransaction}

className="
rounded-2xl
bg-[#17112F]
p-8
border
border-purple-900
space-y-5
"

>



<select

value={type}

onChange={(e)=>setType(e.target.value)}

className="
w-full
rounded-xl
bg-[#221A40]
p-3
text-white
"

>

<option value="BUY">

{t("buy")}

</option>


<option value="SELL">

{t("sell")}

</option>


</select>






<input

className="
w-full
rounded-xl
bg-[#221A40]
p-3
text-white
"

placeholder={t("player")}

value={playerName}

onChange={(e)=>
setPlayerName(e.target.value)
}

/>






<select

value={rarity}

onChange={(e)=>
setRarity(e.target.value)
}

className="
w-full
rounded-xl
bg-[#221A40]
p-3
text-white
"

>


<option value="limited">
Limited
</option>

<option value="rare">
Rare
</option>

<option value="super_rare">
Super Rare
</option>

<option value="unique">
Unique
</option>


</select>







<input

type="number"

step="0.01"

className="
w-full
rounded-xl
bg-[#221A40]
p-3
text-white
"

placeholder={t("price")}

value={price}

onChange={(e)=>
setPrice(e.target.value)
}

/>





<button

className="
w-full
rounded-xl
bg-purple-600
py-3
font-bold
text-white
"

>

{t("save")}

</button>



</form>







<div

className="
rounded-2xl
bg-[#17112F]
border
border-purple-900
overflow-hidden
"

>


<table className="w-full text-white">


<thead className="bg-[#221A40]">


<tr>

<th className="p-4 text-left">

{t("type")}

</th>


<th className="p-4 text-left">

{t("player")}

</th>


<th className="p-4 text-left">

{t("rarity")}

</th>


<th className="p-4 text-left">

{t("price")}

</th>


</tr>


</thead>





<tbody>


{

transactions.map((item)=>(


<tr

key={item.id}

className="
border-t
border-purple-900
"

>


<td className="p-4">


{
item.type==="BUY"

?

t("purchase")

:

t("sale")

}


</td>



<td className="p-4">

{item.playerName}

</td>



<td className="p-4">

{item.rarity}

</td>



<td className="p-4">

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