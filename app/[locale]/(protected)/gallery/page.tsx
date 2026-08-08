"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { useGallery } from "@/hooks/useGallery";

import GalleryStats from "@/components/gallery/GalleryStats";
import GalleryFilters from "@/components/gallery/GalleryFilters";
import CardItem from "@/components/gallery/CardItem";
import GalleryChart from "@/components/charts/GalleryChart";
import CollectionDistribution from "@/components/gallery/CollectionDistribution";
import GalleryEmpty from "@/components/gallery/GalleryEmpty";


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
(sum,card)=>
sum + (card.marketValue ?? 0),
0
);





const inSeasonCards =
cards.filter(
card =>
card.season === currentSeason
);





const classicCards =
cards.filter(
card =>
card.season !== currentSeason
);





const inSeasonValue =
inSeasonCards.reduce(
(sum,card)=>
sum + (card.marketValue ?? 0),
0
);





const classicValue =
classicCards.reduce(
(sum,card)=>
sum + (card.marketValue ?? 0),
0
);







const filteredCards =
useMemo(()=>{


const q =
search.toLowerCase();




return [...cards]

.filter(card =>

(
card.playerName
.toLowerCase()
.includes(q)

||

(card.club ?? "")
.toLowerCase()
.includes(q)

)

&&

(
rarity === "all"

||

card.scarcity === rarity

)

)



.sort((a,b)=>{


switch(sort){


case "value":

return (

(b.marketValue ?? 0)

-

(a.marketValue ?? 0)

);



case "lowValue":

return (

(a.marketValue ?? 0)

-

(b.marketValue ?? 0)

);



case "aa":

return (

(b.averageScore ?? 0)

-

(a.averageScore ?? 0)

);



case "lowAA":

return (

(a.averageScore ?? 0)

-

(b.averageScore ?? 0)

);



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






if(!loading && cards.length === 0){

return (

<GalleryEmpty />

);

}






return (

<>


<GalleryStats

inSeasonValue={inSeasonValue}

inSeasonCards={inSeasonCards.length}

classicValue={classicValue}

classicCards={classicCards.length}

galleryValue={galleryValue}

totalCards={cards.length}

/>





<GalleryFilters

search={search}

setSearch={setSearch}

rarity={rarity}

setRarity={setRarity}

sort={sort}

setSort={setSort}

/>






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