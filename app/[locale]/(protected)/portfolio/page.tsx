"use client";

import { usePortfolio } from "@/hooks/usePortfolio";

import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioStats from "@/components/portfolio/PortfolioStats";
import PortfolioHistoryChart from "@/components/portfolio/PortfolioHistoryChart";
import PortfolioAllocation from "@/components/portfolio/PortfolioAllocation";
import PortfolioInsights from "@/components/portfolio/PortfolioInsights";
import PortfolioTransactions from "@/components/portfolio/PortfolioTransactions";
import TopHoldings from "@/components/portfolio/TopHoldings";


export default function PortfolioPage(){


const {
data,
loading,
error
} = usePortfolio();



if(loading){

return (

<div className="text-center text-zinc-400">

Cargando Portfolio...

</div>

);

}



if(error || !data){

return (

<div className="text-white">

{error ?? "No hay datos del portfolio"}

</div>

);

}



return (

<div className="space-y-8">


<section
className="
rounded-3xl
border
border-white/10
bg-[#17112F]
p-8
"
>


<PortfolioHero

galleryValue={data.galleryValue}

roi={data.roi}

profit={data.profit}

totalCards={data.totalCards}

/>


</section>




<section
className="
rounded-3xl
border
border-white/10
bg-[#17112F]
p-8
"
>


<PortfolioStats

totalBought={data.totalBought}

totalSold={data.totalSold}

recoveredCapital={data.recoveredCapital}

portfolioHealth={data.portfolioHealth}

investmentStatus={data.investmentStatus}

average={data.average}

/>


</section>





<section
className="
rounded-3xl
border
border-white/10
bg-[#17112F]
p-8
"
>


<PortfolioHistoryChart

currentValue={data.galleryValue}

/>


</section>





<section
className="
rounded-3xl
border
border-white/10
bg-[#17112F]
p-8
"
>


<PortfolioAllocation

scarcity={data.scarcity}

/>


</section>





<section
className="
rounded-3xl
border
border-white/10
bg-[#17112F]
p-8
"
>


<PortfolioInsights

roi={data.roi}

profit={data.profit}

totalBought={data.totalBought}

totalSold={data.totalSold}

galleryValue={data.galleryValue}

/>


</section>





<section
className="
rounded-3xl
border
border-white/10
bg-[#17112F]
p-8
"
>


<PortfolioTransactions

transactions={data.recentTransactions}

/>


</section>





<section
className="
rounded-3xl
border
border-white/10
bg-[#17112F]
p-8
"
>


<TopHoldings

cards={data.topCards}

/>


</section>



</div>

);

}