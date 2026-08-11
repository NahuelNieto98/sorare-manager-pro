"use client";

import { useState } from "react";
import { createMarketTransaction } from "@/app/actions/create-market-transaction";

export default function AddTransactionButton({
  cardId,
}: {
  cardId: string;
}) {

  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);


  async function saveTransaction() {

    if (!price) return;


    try {

      setLoading(true);


      await createMarketTransaction(
        cardId,
        Number(price)
      );


      setOpen(false);
      setPrice("");


      window.location.reload();


    } catch (error) {

      alert(
        error instanceof Error
          ? error.message
          : "Error creando transacción"
      );

    } finally {

      setLoading(false);

    }

  }


  return (

    <>

      <button
        onClick={() => setOpen(true)}
        className="
          mt-10
          w-full
          rounded-xl
          bg-violet-600
          py-4
          font-bold
          text-white
          hover:bg-violet-500
        "
      >
        Añadir transacción
      </button>



      {
        open && (

          <div
            className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              bg-black/60
            "
          >

            <div
              className="
                w-[400px]
                rounded-2xl
                bg-[#17151f]
                p-6
              "
            >

              <h2
                className="
                  mb-5
                  text-xl
                  font-bold
                  text-white
                "
              >
                Nueva compra
              </h2>


              <input

                type="number"

                placeholder="Precio de compra (€)"

                value={price}

                onChange={(e)=>setPrice(e.target.value)}

                className="
                  mb-5
                  w-full
                  rounded-xl
                  bg-[#252231]
                  p-3
                  text-white
                  outline-none
                "

              />


              <div className="flex gap-3">


                <button

                  onClick={()=>setOpen(false)}

                  className="
                    flex-1
                    rounded-xl
                    bg-gray-700
                    py-3
                    text-white
                  "

                >
                  Cancelar

                </button>



                <button

                  onClick={saveTransaction}

                  disabled={loading}

                  className="
                    flex-1
                    rounded-xl
                    bg-violet-600
                    py-3
                    font-bold
                    text-white
                  "

                >

                  {
                    loading
                    ? "Guardando..."
                    : "Guardar"
                  }

                </button>


              </div>


            </div>


          </div>

        )
      }


    </>

  );

}