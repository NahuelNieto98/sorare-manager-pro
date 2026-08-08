"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Search, SlidersHorizontal } from "lucide-react";

import { useGallery } from "@/hooks/useGallery";

import CardItem from "@/components/gallery/CardItem";
import GalleryChart from "@/components/charts/GalleryChart";
import CollectionDistribution from "@/components/gallery/CollectionDistribution";
import SortDropdown from "@/components/ui/SortDropdown";


const rarityKeys = [
  { key: "all", value: "all" },
  { key: "limited", value: "limited" },
  { key: "rare", value: "rare" },
  { key: "superRare", value: "super_rare" },
  { key: "unique", value: "unique" },
];



export default function GalleryPage(){


const t =
useTranslations("gallery");


const {
cards,
loading,
error
} = useGallery();



const [search,setSearch] =
useState("");

const [rarity,setRarity] =
useState("all");

const [sort,setSort] =
useState("value");



const currentSeason =
cards.length
?
Math.max(...cards.map(c=>c.season))
:
0;



const galleryValue =
cards.reduce(
(s,c)=>s+(c.marketValue ?? 0),
0
);



const average =
cards.length
?
cards.reduce(
(s,c)=>s+(c.averageScore ?? 0),
0
)
/cards.length
:
0;



const inSeasonCards =
cards.filter(
c=>c.season===currentSeason
);



const classicCards =
cards.filter(
c=>c.season!==currentSeason
);



const inSeasonValue =
inSeasonCards.reduce(
(s,c)=>s+(c.marketValue ?? 0),
0
);



const classicValue =
classicCards.reduce(
(s,c)=>s+(c.marketValue ?? 0),
0
);



const filteredCards =
useMemo(()=>{


const q =
search.toLowerCase();



return [...cards]

.filter(
c=>
(
c.playerName.toLowerCase().includes(q)
||
(c.club ?? "").toLowerCase().includes(q)
)
&&
(
rarity==="all"
||
c.scarcity===rarity
)

)


.sort((a,b)=>{


switch(sort){


case "value":
return (b.marketValue ?? 0)
-
(a.marketValue ?? 0);


case "lowValue":
return (a.marketValue ?? 0)
-
(b.marketValue ?? 0);


case "aa":
return (b.averageScore ?? 0)
-
(a.averageScore ?? 0);


case "lowAA":
return (a.averageScore ?? 0)
-
(b.averageScore ?? 0);


default:
return 0;

}


});


},[
cards,
search,
rarity,
sort
]);



if(error){

return (

<div className="text-white">

{error}

</div>

);

}



return (

<>

<div
className="
mb-8
grid
grid-cols-1
gap-5
md:grid-cols-3
"
>


<div className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-6">

<h3 className="text-zinc-400">
In Season
</h3>

<p className="text-3xl font-black text-white">
€{inSeasonValue.toFixed(2)}
</p>

<p className="text-zinc-400">
{inSeasonCards.length} cartas
</p>

</div>



<div className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-6">

<h3 className="text-zinc-400">
Classic
</h3>

<p className="text-3xl font-black text-white">
€{classicValue.toFixed(2)}
</p>

<p className="text-zinc-400">
{classicCards.length} cartas
</p>

</div>



<div className="rounded-3xl border border-green-500/20 bg-green-500/10 p-6">

<h3 className="text-zinc-400">
Total
</h3>

<p className="text-3xl font-black text-white">
€{galleryValue.toFixed(2)}
</p>

<p className="text-zinc-400">
{cards.length} cartas
</p>

</div>


</div>




<div className="mb-8 rounded-3xl border border-white/10 bg-[#17112F] p-6">


<div className="flex items-center gap-3">

<SlidersHorizontal
className="text-violet-300"
size={22}
/>


<h2 className="text-xl font-black text-white">

{t("filters")}

</h2>


</div>



<div className="mt-6 flex flex-col gap-4 xl:flex-row">


<div className="relative flex-1">


<Search
size={18}
className="
absolute
left-4
top-1/2
-translate-y-1/2
text-zinc-500
"
/>



<input

value={search}

onChange={
e=>setSearch(e.target.value)
}

placeholder={
t("search")
}

className="
w-full
rounded-2xl
border
border-white/10
bg-white/5
py-3
pl-11
pr-4
text-white
"

/>


</div>



<SortDropdown

value={sort}

onChange={setSort}

/>


</div>



<div className="mt-5 flex flex-wrap gap-3">


{rarityKeys.map(r=>(


<button

key={r.value}

onClick={
()=>setRarity(r.value)
}

className={
rarity===r.value
?
"rounded-full bg-violet-600 px-5 py-2 text-white"
:
"rounded-full bg-white/5 px-5 py-2 text-zinc-400"
}

>


{t(r.key)}


</button>


))}


</div>


</div>




{!loading && (

<>

<GalleryChart cards={cards}/>


<div className="my-8">

<CollectionDistribution cards={cards}/>

</div>


</>

)}





{loading ? (

<div className="text-center text-zinc-400">

{t("loading")}

</div>


) : (


<div
className="
grid
gap-6
md:grid-cols-2
xl:grid-cols-3
2xl:grid-cols-4
"
>


{filteredCards.map(card=>(


<CardItem

key={card.id}

{...card}

/>


))}


</div>


)}



</>

);

}