"use client";

import MarketSummary from "@/components/dashboard/MarketSummary";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import Notifications from "@/components/dashboard/Notifications";


type DashboardActivityProps = {

  totalBought:number;

  totalSold:number;

  transactions:{
    id:string;
    type:string;
    playerName:string;
    rarity:string;
    price:number;
  }[];

};



export default function DashboardActivity({

  totalBought,

  totalSold,

  transactions,

}: DashboardActivityProps) {


return (

<div
className="
space-y-6
"
>


<div
className="
grid
gap-6
xl:grid-cols-2
"
>


<MarketSummary

bought={totalBought}

sold={totalSold}

/>


<Notifications />


</div>




<RecentTransactions

transactions={transactions}

/>



</div>

);

}