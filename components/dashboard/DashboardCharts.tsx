"use client";

import GalleryChart from "@/components/charts/GalleryChart";


type Card = {
  marketValue: number | null;
};



type Props = {
  cards: Card[];
};



export default function DashboardCharts({

cards,

}: Props){


return (

<section

className="
grid
gap-6
xl:grid-cols-1
"

>


<div

className="
rounded-3xl
border
border-white/10
bg-white/5
p-6
"

>


<GalleryChart

cards={cards}

/>


</div>


</section>

);

}