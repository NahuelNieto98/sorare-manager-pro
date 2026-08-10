"use client";

import { useState } from "react";
import { createMarketTransaction } from "@/app/actions/create-market-transaction";


export default function AddTransactionButton({
  cardId,
  price,
}: {
  cardId: string;
  price: number;
}) {


  const [loading, setLoading] = useState(false);



  async function handleClick() {

    try {

      setLoading(true);


      await createMarketTransaction(
        cardId,
        price
      );


      window.location.reload();


    } catch (error) {

      console.error(error);

      alert("Error creando transacción");


    } finally {

      setLoading(false);

    }

  }




  return (

    <button

      onClick={handleClick}

      disabled={loading}

      className="
      mt-10
      w-full
      rounded-xl
      bg-violet-600
      py-4
      font-bold
      text-white
      hover:bg-violet-500
      disabled:opacity-50
      "

    >

      {
        loading
          ?
          "Guardando..."
          :
          "Añadir transacción"
      }


    </button>

  );

}