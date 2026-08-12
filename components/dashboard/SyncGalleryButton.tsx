"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  RefreshCw,
  DollarSign,
  CheckCircle,
} from "lucide-react";


export default function SyncGalleryButton(){


const t =
useTranslations("sync");



const [syncLoading,setSyncLoading] =
useState(false);

const [priceLoading,setPriceLoading] =
useState(false);

const [message,setMessage] =
useState("");

const [syncError,setSyncError] =
useState(false);





async function syncGallery(){


setSyncLoading(true);

setSyncError(false);

setMessage("");



try{


const res =
await fetch(
"/api/sync-gallery",
{
method:"POST",
}
);



const data =
await res.json();



if(!res.ok){

throw new Error(
data.error
);

}



setSyncError(false);

setMessage(
`${data.cards ?? 0} ${t("cardsUpdated")}`
);



setTimeout(()=>{

window.location.reload();

},1500);



}catch(error:any){


console.error(
"Sync error:",
error
);



setSyncError(true);

setMessage(
error.message ?? t("errorSync")
);



}finally{


setSyncLoading(false);


}


}







async function updatePrices(){


setPriceLoading(true);

setMessage("");



try{


const res =
await fetch(
"/api/update-prices",
{
method:"POST",
}
);



const data =
await res.json();



if(!res.ok){

throw new Error();

}



setMessage(

`✅ ${t("updated")}: ${data.updated ?? 0} | ⏭️ ${t("skipped")}: ${data.skipped ?? 0} | ❌ ${t("failed")}: ${data.failed ?? 0}`

);



}catch(error){


console.error(
"Prices error:",
error
);



setMessage(
`❌ ${t("errorPrices")}`
);



}finally{


setPriceLoading(false);


}


}






return (

<div className="flex flex-col gap-4">


<div className="flex flex-wrap gap-4">


<button

onClick={syncGallery}

disabled={syncLoading || priceLoading}

className="
flex
items-center
gap-3
rounded-xl
bg-purple-600
px-6
py-3
font-bold
text-white
transition
hover:bg-purple-500
disabled:opacity-50
"

>


<RefreshCw

size={20}

className={
syncLoading
?
"animate-spin"
:
""
}

/>


{

syncLoading

?

t("syncing")

:

t("syncButton")

}



</button>





<button

onClick={updatePrices}

disabled={syncLoading || priceLoading}

className="
flex
items-center
gap-3
rounded-xl
bg-green-600
px-6
py-3
font-bold
text-white
transition
hover:bg-green-500
disabled:opacity-50
"

>


<DollarSign

size={20}

className={
priceLoading
?
"animate-spin"
:
""
}

/>



{

priceLoading

?

t("updating")

:

t("pricesButton")

}



</button>



</div>





{syncLoading && (

<div className="mt-2 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-5">

<div className="flex items-center gap-3">

<RefreshCw
size={20}
className="animate-spin text-violet-300"
/>

<div>

<p className="font-black text-white">
{t("syncStatusTitle")}
</p>

<p className="mt-1 text-sm leading-6 text-zinc-400">
{t("syncStatusDescription")}
</p>

</div>

</div>

<div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">

<div className="h-full w-2/3 animate-pulse rounded-full bg-violet-500" />

</div>

</div>

)}

{message && !syncLoading && (

<div
className={`mt-2 flex items-start gap-3 rounded-2xl border p-4 text-sm ${
syncError
? "border-red-500/20 bg-red-500/10 text-red-200"
: "border-green-500/20 bg-green-500/10 text-green-200"
}`}
>

<CheckCircle
size={18}
className={syncError ? "text-red-400" : "text-green-400"}
/>

<div>

<p className="font-bold">
{syncError
? t("syncStatusError")
: t("syncStatusSuccess")}
</p>

<p className="mt-1 text-xs leading-5 opacity-80">
{message}
</p>

{syncError && (

<button
type="button"
onClick={syncGallery}
className="mt-3 font-bold underline"
>
{t("syncStatusRetry")}
</button>

)}

</div>

</div>

)}



</div>

);

}