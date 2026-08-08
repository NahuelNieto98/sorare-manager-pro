"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";


export default function MarketFilters({
transactions
}:{
transactions:any
}){


const t = useTranslations("marketFilters");



const [search,setSearch] = useState("");

const [rarity,setRarity] = useState("all");

const [price,setPrice] = useState("all");

const [sort,setSort] = useState("recent");



let filtered = [...transactions];



if(search){

filtered =
filtered.filter((tx)=>
tx.playerName
.toLowerCase()
.includes(
search.toLowerCase()
)
);

}



if(rarity !== "all"){

filtered =
filtered.filter(
tx=>tx.rarity===rarity
);

}



if(price !== "all"){


if(price==="cheap"){

filtered =
filtered.filter(
tx=>tx.price < 10
);

}



if(price==="medium"){

filtered =
filtered.filter(
tx=>tx.price >=10 && tx.price <=50
);

}



if(price==="expensive"){

filtered =
filtered.filter(
tx=>tx.price >50
);

}


}



if(sort==="low"){

filtered.sort(
(a,b)=>a.price-b.price
);

}



if(sort==="high"){

filtered.sort(
(a,b)=>b.price-a.price
);

}





return (

<>



<div
className="
flex
flex-col
md:flex-row
gap-3
mb-8
"
>



<input

className="
bg-[#211941]
border
border-purple-900
rounded-xl
px-4
py-3
text-white
flex-1
"

placeholder={t("search")}

value={search}

onChange={
e=>setSearch(e.target.value)
}

/>





<select

className="
bg-[#211941]
border
border-purple-900
rounded-xl
px-4
text-white
"

onChange={
e=>setRarity(e.target.value)
}

>


<option value="all">

{t("allRarities")}

</option>


<option value="common">
Common
</option>


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







<select

className="
bg-[#211941]
border
border-purple-900
rounded-xl
px-4
text-white
"

onChange={
e=>setPrice(e.target.value)
}

>


<option value="all">

{t("price")}

</option>


<option value="cheap">

{t("cheap")}

</option>


<option value="medium">

{t("medium")}

</option>


<option value="expensive">

{t("expensive")}

</option>



</select>







<select

className="
bg-[#211941]
border
border-purple-900
rounded-xl
px-4
text-white
"

onChange={
e=>setSort(e.target.value)
}

>


<option value="recent">

{t("recent")}

</option>



<option value="low">

{t("lowest")}

</option>



<option value="high">

{t("highest")}

</option>



</select>






</div>









<div
className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-5
"
>



{filtered.map((tx)=>(



<div

key={tx.id}

className="
rounded-xl
border
border-purple-900
bg-[#211941]
p-5
"

>


<h2 className="text-white font-semibold">

{tx.playerName}

</h2>



<p className="text-green-400 text-2xl font-bold mt-4">

{tx.price.toFixed(2)}€

</p>




<p className="text-zinc-400 text-sm mt-2">

{tx.type}

</p>



</div>



))}



</div>



</>

);



}