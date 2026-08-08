"use client";

import { useState } from "react";
import { UserRound, CheckCircle } from "lucide-react";

type Props = {
  accountLabel: string;
  placeholder: string;
  buttonLabel: string;
  errorMessage: string;
  successMessage: string;
  currentAccount?: string | null;
};


export default function SorareAccountForm({

  accountLabel,
  placeholder,
  buttonLabel,
  errorMessage,
  successMessage,
  currentAccount,

}: Props){


const [slug,setSlug] =
useState("");

const [loading,setLoading] =
useState(false);

const [success,setSuccess] =
useState(false);



async function connect(){

try{

setLoading(true);

setSuccess(false);


const res =
await fetch(
"/api/connect-sorare",
{
method:"POST",
headers:{
"Content-Type":"application/json",
},
body:JSON.stringify({
slug,
}),
}
);



if(!res.ok){

alert(errorMessage);

return;

}


alert(successMessage);

setSuccess(true);

setSlug("");


}catch(error){

console.error(error);

alert(errorMessage);


}finally{

setLoading(false);

}

}



return (

<div
className="
rounded-3xl
border
border-white/10
bg-[#17112F]
p-8
"
>


<div className="flex items-center gap-3">

<UserRound
size={24}
className="text-violet-300"
/>


<h2 className="text-xl font-bold text-white">
{accountLabel}
</h2>


</div>



{
currentAccount && (

<div
className="
mt-6
flex
items-center
gap-3
rounded-xl
bg-green-500/10
p-4
text-green-400
"
>

<CheckCircle size={20}/>

Cuenta conectada:
<strong>
{currentAccount}
</strong>


</div>

)

}



<input

value={slug}

onChange={(e)=>
setSlug(e.target.value)
}

placeholder={placeholder}

className="
mt-6
w-full
rounded-xl
bg-[#221A40]
p-4
text-white
outline-none
"

/>



<button

onClick={connect}

disabled={loading}

className="
mt-6
w-full
rounded-xl
bg-purple-600
py-3
font-bold
text-white
transition
hover:bg-purple-500
disabled:opacity-50
"

>

{

loading

?

"Conectando..."

:

buttonLabel

}


</button>



{

success && (

<div
className="
mt-5
flex
items-center
gap-2
rounded-xl
bg-green-500/10
p-4
text-green-400
"
>

<CheckCircle size={20}/>

{successMessage}

</div>

)

}



</div>

);

}