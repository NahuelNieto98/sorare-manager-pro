import {
TrendingUp,
TrendingDown,
Wallet,
ShieldCheck,
AlertTriangle,
} from "lucide-react";


type Props = {

roi:number;

profit:number;

totalBought:number;

totalSold:number;

galleryValue:number;

};



export default function AnalyticsInsights({

roi,
profit,
totalBought,
totalSold,
galleryValue,

}:Props){


const recovered =

totalBought===0

?

0

:

(totalSold / totalBought) * 100;



const roiColor =

roi >= 20

?

"text-green-400"

:

roi >= 0

?

"text-yellow-400"

:

"text-red-400";



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


<h2 className="text-2xl font-black text-white">

Analytics Insights

</h2>


<p className="mt-2 text-zinc-400">

Análisis automático de tu portfolio.

</p>



<div className="mt-8 space-y-5">


<Insight

icon={<TrendingUp size={22}/>}

color={roiColor}

title="ROI"

description={

roi >= 20

?

`Excelente rendimiento con un ROI del ${roi.toFixed(2)}%.`

:

roi >= 0

?

`Portfolio positivo con un ROI del ${roi.toFixed(2)}%.`

:

`ROI negativo del ${roi.toFixed(2)}%.`

}

/>



<Insight

icon={<Wallet size={22}/>}

color="text-cyan-400"

title="Capital recuperado"

description={

`${recovered.toFixed(1)}% del capital invertido ya ha sido recuperado.`

}

/>



<Insight

icon={<ShieldCheck size={22}/>}

color="text-green-400"

title="Valor actual"

description={

`Tu colección tiene un valor estimado de €${galleryValue.toFixed(2)}.`

}

/>



<Insight

icon={<AlertTriangle size={22}/>}

color="text-yellow-400"

title="Movimiento económico"

description={

`Has realizado €${totalBought.toFixed(2)} en compras y €${totalSold.toFixed(2)} en ventas.`

}

/>


</div>


</div>

);

}



function Insight({

icon,

title,

description,

color,

}:{

icon:React.ReactNode;

title:string;

description:string;

color:string;

}){


return (

<div className="flex gap-4">


<div

className={`
flex
h-12
w-12
items-center
justify-center
rounded-xl
bg-white/5
${color}
`}

>

{icon}

</div>



<div>

<h3 className="font-bold text-white">

{title}

</h3>


<p className="mt-2 text-sm text-zinc-400">

{description}

</p>


</div>


</div>

);

}