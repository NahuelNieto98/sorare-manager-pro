import { prisma } from "@/lib/prisma";


async function main(){


const transactions =
await prisma.marketTransaction.findMany({

where:{
playerName:"Federico Valverde"
},

orderBy:{
createdAt:"asc"
}

});



console.log(
"Encontradas:",
transactions.length
);



if(transactions.length <= 1){

console.log("No hay duplicados");

return;

}



const keep = transactions[0];


const deleteIds =
transactions
.slice(1)
.map(t=>t.id);



console.log(
"Conservo:",
keep.id
);


console.log(
"Elimino:",
deleteIds
);



await prisma.marketTransaction.deleteMany({

where:{
id:{
in:deleteIds
}
}

});


console.log("Limpieza terminada");

}



main()
.finally(()=>prisma.$disconnect());