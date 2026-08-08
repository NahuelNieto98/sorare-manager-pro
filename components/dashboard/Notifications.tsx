"use client";

import { useTranslations } from "next-intl";


export default function Notifications(){


const t = useTranslations("notifications");



const notifications = [

{
title:t("syncTitle"),
description:t("syncDescription"),
color:"bg-blue-500",
},

{
title:t("scoutTitle"),
description:t("scoutDescription"),
color:"bg-purple-500",
},

{
title:t("portfolioTitle"),
description:t("portfolioDescription"),
color:"bg-green-500",
},

];





return (

<div>


<h2 className="text-2xl font-bold text-white">

{t("title")}

</h2>





<div className="mt-6 space-y-4">


{

notifications.map((item,index)=>(


<div

key={index}

className="
flex
items-start
gap-4
rounded-2xl
bg-[#221A40]
p-4
"

>


<div

className={`
mt-1
h-3
w-3
rounded-full
${item.color}
`}

/>




<div>


<p className="font-semibold text-white">

{item.title}

</p>




<p className="mt-1 text-sm text-zinc-400">

{item.description}

</p>




</div>



</div>


))


}


</div>


</div>


);


}