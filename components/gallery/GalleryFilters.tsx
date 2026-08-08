"use client";

import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { useTranslations } from "next-intl";

import SortDropdown from "@/components/ui/SortDropdown";


const rarityKeys = [
  { key:"all", value:"all" },
  { key:"limited", value:"limited" },
  { key:"rare", value:"rare" },
  { key:"superRare", value:"super_rare" },
  { key:"unique", value:"unique" },
];


const positionKeys = [
  { label:"Todas", value:"all" },
  { label:"GK", value:"GK" },
  { label:"DEF", value:"DEF" },
  { label:"MID", value:"MID" },
  { label:"FW", value:"FW" },
];



type Props = {

  search:string;

  setSearch:(value:string)=>void;


  rarity:string;

  setRarity:(value:string)=>void;


  position:string;

  setPosition:(value:string)=>void;


  sort:string;

  setSort:(value:string)=>void;


  onReset:()=>void;


};



export default function GalleryFilters({

  search,

  setSearch,

  rarity,

  setRarity,

  position,

  setPosition,

  sort,

  setSort,

  onReset,

}:Props){



const t =
useTranslations("gallery");



const hasFilters =
search !== ""
||
rarity !== "all"
||
position !== "all"
||
sort !== "value";



return (

<div

className="
mb-8
rounded-3xl
border
border-white/10
bg-[#17112F]
p-6
"

>



<div

className="
flex
items-center
justify-between
"

>


<div

className="
flex
items-center
gap-3
"

>


<SlidersHorizontal

className="text-violet-300"

size={22}

/>



<h2 className="text-xl font-black text-white">

{t("filters")}

</h2>


</div>





{

hasFilters && (

<button

onClick={onReset}

className="
flex
items-center
gap-2
rounded-xl
bg-red-500/10
px-4
py-2
text-sm
font-bold
text-red-300
transition
hover:bg-red-500/20
"

>

<X size={16}/>

Limpiar

</button>

)

}


</div>







<div

className="
mt-6
flex
flex-col
gap-4
xl:flex-row
"

>




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
outline-none
"

/>


</div>





<SortDropdown

value={sort}

onChange={setSort}

/>



</div>








<div className="mt-6">


<p className="mb-3 text-sm font-bold text-zinc-400">

Posición

</p>



<div

className="
flex
flex-wrap
gap-3
"

>


{
positionKeys.map((p)=>(


<button

key={p.value}

onClick={
()=>setPosition(p.value)
}

className={

position === p.value

?

"rounded-full bg-violet-600 px-5 py-2 text-white"

:

"rounded-full bg-white/5 px-5 py-2 text-zinc-400"

}

>

{p.label}

</button>


))

}


</div>


</div>









<div className="mt-6">


<p className="mb-3 text-sm font-bold text-zinc-400">

Rareza

</p>



<div

className="
flex
flex-wrap
gap-3
"

>


{
rarityKeys.map((r)=>(


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


))

}


</div>


</div>





</div>

);

}