import {
  Lock,
  Gift,
  CheckCircle,
} from "lucide-react";


type Props = {

title:string;

description:string;

status:"available" | "locked" | "completed";

reward:string;

};



export default function RewardCard({

title,

description,

status,

reward,

}:Props){


const config = {

available:{
label:"Disponible",
color:"text-green-400",
bg:"bg-green-500/10",
icon:<Gift size={22}/>
},

locked:{
label:"Bloqueada",
color:"text-zinc-400",
bg:"bg-white/5",
icon:<Lock size={22}/>
},

completed:{
label:"Completada",
color:"text-yellow-400",
bg:"bg-yellow-500/10",
icon:<CheckCircle size={22}/>
}

};



const current =
config[status];



return (

<div

className="
rounded-3xl
border
border-white/10
bg-[#17112F]
p-6
transition
hover:border-violet-500/40
"

>


<div className="flex items-center justify-between">


<div

className={`
flex
h-12
w-12
items-center
justify-center
rounded-xl
${current.bg}
${current.color}
`}

>

{current.icon}

</div>


<span

className={`
rounded-full
px-3
py-1
text-xs
font-bold
${current.bg}
${current.color}
`}

>

{current.label}

</span>


</div>




<h3 className="mt-6 text-xl font-black text-white">

{title}

</h3>




<p className="mt-3 text-sm leading-6 text-zinc-400">

{description}

</p>




<div

className="
mt-6
rounded-2xl
bg-white/5
p-4
"

>


<p className="text-xs text-zinc-500">

Recompensa

</p>


<p className="mt-1 font-bold text-violet-300">

{reward}

</p>


</div>



</div>

);

}