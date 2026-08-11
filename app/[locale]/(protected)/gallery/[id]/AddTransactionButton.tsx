"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createMarketTransaction } from "@/app/actions/create-market-transaction";


export default function AddTransactionButton({
  cardId,
  currentPrice,
}: {
  cardId: string;
  currentPrice?: number | null;
}) {


  const router = useRouter();


  const [open, setOpen] = useState(false);

  const [price, setPrice] = useState(
    currentPrice
      ? currentPrice.toString()
      : ""
  );

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);



  function openModal(){

    setPrice(
      currentPrice
        ? currentPrice.toString()
        : ""
    );

    setOpen(true);

  }




  async function saveTransaction(){


    if(loading) return;



    const value = Number(price);



    if(!value || value <= 0){

      alert(
        "Introduce un precio válido"
      );

      return;

    }




    try{


      setLoading(true);



      await createMarketTransaction(
        cardId,
        value
      );



      setSuccess(true);



      setTimeout(()=>{


        setOpen(false);

        setSuccess(false);


        router.refresh();



      },800);



    }catch(error){


      alert(
        error instanceof Error
        ? error.message
        : "Error guardando compra"
      );


    }finally{


      setLoading(false);


    }


  }





  return (

    <>


      <button

        onClick={openModal}

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

        {
          currentPrice
          ? "Editar compra"
          : "Añadir compra"
        }


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

                {
                  currentPrice
                  ? "Editar compra"
                  : "Nueva compra"
                }


              </h2>





              {
                success ? (


                  <div

                    className="
                      rounded-xl
                      bg-green-600
                      p-4
                      text-center
                      font-bold
                      text-white
                    "

                  >

                    Compra guardada ✓


                  </div>


                )

                :

                (

                <>


                  <input


                    type="number"


                    placeholder="Precio de compra (€)"


                    value={price}


                    onChange={(e)=>
                      setPrice(e.target.value)
                    }


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


                      disabled={loading}


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
                        disabled:opacity-50
                      "

                    >

                      {
                        loading
                        ? "Guardando..."
                        : "Guardar"
                      }


                    </button>



                  </div>


                </>

                )
              }



            </div>


          </div>

        )
      }


    </>

  );

}