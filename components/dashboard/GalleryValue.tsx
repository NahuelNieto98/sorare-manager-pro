"use client";

import { useTranslations } from "next-intl";


export default function GalleryValue(){


const t = useTranslations("galleryValue");



return (

<div>




<div className="flex items-center justify-between">


<div>


<h2 className="text-2xl font-bold text-white">

{t("title")}

</h2>



<p className="text-zinc-400 mt-2">

{t("subtitle")}

</p>



</div>





<div className="
rounded-xl
bg-purple-600
px-4
py-2
text-sm
font-semibold
">

LIVE

</div>



</div>







<div className="text-6xl font-extrabold text-purple-400">

€0

</div>







<p className="mt-4 text-zinc-400">

{t("connect")}

</p>







<div
className="
mt-10
h-64
rounded-xl
border
border-dashed
border-purple-800
flex
items-center
justify-center
"
>


<p className="text-zinc-500">

{t("chartPlaceholder")}

</p>



</div>





</div>


);



}