"use client";

import { useTranslations } from "next-intl";

import { useTransactions } from "@/hooks/useTransactions";

import TransactionForm from "@/components/transactions/TransactionForm";
import TransactionTable from "@/components/transactions/TransactionTable";


export default function TransactionsPage(){


const t =
useTranslations("transactions");


const {
transactions,
loading,
error,
createTransaction,

} = useTransactions();



if(loading){

return (

<div className="text-center text-zinc-400">

Cargando transacciones...

</div>

);

}



if(error){

return (

<div className="text-white">

{error}

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


<h1 className="text-5xl font-black text-white">

{t("title")}

</h1>


<p className="mt-3 text-lg text-zinc-400">

{t("subtitle")}

</p>


</section>





<TransactionForm

onSubmit={createTransaction}

/>





<TransactionTable

transactions={transactions}

/>



</div>

);

}