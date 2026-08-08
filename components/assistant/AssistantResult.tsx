import {
  CheckCircle,
  Sparkles,
} from "lucide-react";


type Props = {

analysis:string;

title:string;

empty:string;

};



export default function AssistantResult({

analysis,

title,

empty,

}:Props){


return (

<section

className="
rounded-3xl
border
border-white/10
bg-[#17112F]
p-8
"

>


<div className="flex items-center gap-3">


<div

className="
flex
h-12
w-12
items-center
justify-center
rounded-xl
bg-cyan-500/10
text-cyan-400
"

>

<Sparkles size={22}/>

</div>


<h2 className="text-2xl font-black text-white">

{title}

</h2>


</div>



<div className="mt-6">


{

analysis

?

<div

className="
rounded-2xl
bg-white/5
p-6
text-zinc-300
leading-7
"

>

<div className="mb-4 flex items-center gap-2 text-green-400">

<CheckCircle size={18}/>

<span className="font-bold">

Análisis completado

</span>

</div>


<p>

{analysis}

</p>


</div>


:

<div

className="
rounded-2xl
bg-white/5
p-6
text-zinc-400
"

>

{empty}

</div>


}



</div>


</section>

);

}