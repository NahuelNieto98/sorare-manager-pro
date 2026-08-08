"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  RefreshCw,
  DollarSign,
  CheckCircle
} from "lucide-react";


export default function SyncGalleryButton(){


const t = useTranslations("sync");



const [syncLoading,setSyncLoading] =
useState(false);


const [priceLoading,setPriceLoading] =
useState(false);


const [message,setMessage] =
useState("");







async function syncGallery(){


setSyncLoading(true);

setMessage("");



try{


const res =
await fetch(
"/api/sync-gallery",
{
method:"POST",
}
);



if(!res.ok){

throw new Error();

}




setMessage(
`✅ ${t("successSync")}`
);



setTimeout(()=>{

window.location.reload();

},1500);





}catch{


setMessage(
`❌ ${t("errorSync")}`
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



if(!res.ok){

throw new Error();

}




const data =
await res.json();




setMessage(

`✅ ${t("updated")}: ${data.updated ?? 0} | ⏭️ ${t("skipped")}: ${data.skipped ?? 0} | ❌ ${t("failed")}: ${data.failed ?? 0}`

);





}catch{


setMessage(
`❌ ${t("errorPrices")}`
);



}finally{


setPriceLoading(false);


}


}








return (


<div className="flex flex-col gap-3">





<div className="flex gap-4">





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








{

message && (


<div

className="
flex
items-center
gap-2
text-sm
text-zinc-300
"

>


<CheckCircle size={16}/>


{message}


</div>


)

}



</div>


);


}