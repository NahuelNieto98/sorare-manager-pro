"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";


type Props = {
  onSubmit: (data:{
    type:string;
    playerName:string;
    rarity:string;
    price:number;
  })=>Promise<void>;
};



export default function TransactionForm({
  onSubmit,
}:Props){


const t =
useTranslations("transactions");


const [type,setType] =
useState("BUY");

const [playerName,setPlayerName] =
useState("");

const [rarity,setRarity] =
useState("limited");

const [price,setPrice] =
useState("");



async function submit(
e:React.FormEvent
){

e.preventDefault();


await onSubmit({

type,

playerName,

rarity,

price:Number(price),

});


setPlayerName("");

setPrice("");

}



return (

<form

onSubmit={submit}

className="
rounded-3xl
border
border-white/10
bg-[#17112F]
p-8
space-y-5
"

>


<select

value={type}

onChange={
e=>setType(e.target.value)
}

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

onChange={
e=>setPlayerName(e.target.value)
}

/>




<select

value={rarity}

onChange={
e=>setRarity(e.target.value)
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

onChange={
e=>setPrice(e.target.value)
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
transition
hover:bg-purple-500
"

>

{t("save")}

</button>



</form>

);

}