import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  calculateGalleryValue,
  countScarcity,
} from "@/lib/gallery";


export async function GET(){

const session = await auth();


if(!session?.user?.email){

return NextResponse.json(
{error:"No autorizado"},
{status:401}
);

}



const user =
await prisma.user.findUnique({

where:{
email:session.user.email,
},

include:{
cards:true,
transactions:{
orderBy:{
date:"asc",
},
},
},

});



if(!user){

return NextResponse.json(
{error:"Usuario no encontrado"},
{status:404}
);

}



const galleryValue =
calculateGalleryValue(user.cards);



const scarcity =
countScarcity(user.cards);



const totalBought =
user.transactions

.filter(
(t)=>t.type==="BUY"
)

.reduce(
(sum,t)=>sum+t.price,
0
);



const totalSold =
user.transactions

.filter(
(t)=>t.type==="SELL"
)

.reduce(
(sum,t)=>sum+t.price,
0
);



const profit =
galleryValue +
totalSold -
totalBought;



const roi =
totalBought===0
?
0
:
(profit / totalBought) * 100;



const recoveredCapital =
totalBought===0
?
0
:
(totalSold / totalBought) * 100;



const buySellData = [

{
name:"Compras",
value:totalBought,
},

{
name:"Ventas",
value:totalSold,
},

];



const transactionsHistory =
user.transactions.map(
(transaction)=>({

date:
transaction.date.toISOString()
.slice(5,10),

bought:
transaction.type==="BUY"
?
transaction.price
:
0,

sold:
transaction.type==="SELL"
?
transaction.price
:
0,

})
);



return NextResponse.json({

galleryValue,

roi,

profit,

totalBought,

totalSold,

recoveredCapital,

scarcity,

buySellData,

transactionsHistory,

});

}