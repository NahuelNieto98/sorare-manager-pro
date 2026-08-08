import MarketOpportunityCard from "./MarketOpportunityCard";


type Props = {

cards:{
id:string;

price:number;

Card:{
playerName:string;
club:string|null;
scarcity:string;
marketValue:number|null;
pictureUrl:string|null;
};

}[];

};



export default function MarketList({

cards,

}:Props){


return (

<section>


<h2

className="
mb-6
text-3xl
font-black
text-white
"

>

🔥 TOP OPORTUNIDADES HOY

</h2>



<div

className="
grid
gap-6
md:grid-cols-2
xl:grid-cols-3
"

>


{

cards
.slice(0,5)
.map((item)=>(

<MarketOpportunityCard

key={item.id}

item={item}

/>

))

}


</div>


</section>

);

}