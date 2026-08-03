"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

export default function SyncGalleryButton() {

  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState(
    "Sincronizar galería"
  );


  async function syncGallery() {

    setLoading(true);


    try {


      setStatus(
        "Sincronizando galería..."
      );


      const syncRes = await fetch(
        "/api/sync-gallery",
        {
          method: "POST",
        }
      );



      if (!syncRes.ok) {

        throw new Error(
          "Error sincronizando galería"
        );

      }





      setStatus(
        "Actualizando precios..."
      );





      const priceRes = await fetch(
        "/api/update-prices",
        {
          method: "POST",
        }
      );





      if (!priceRes.ok) {

        throw new Error(
          "Error actualizando precios"
        );

      }






      setStatus(
        "Galería actualizada ✅"
      );




      setTimeout(() => {

        window.location.reload();

      }, 800);






    } catch(error) {


      console.error(
        error
      );


      alert(
        "Error sincronizando la galería."
      );


      setStatus(
        "Sincronizar galería"
      );



    } finally {


      setLoading(false);


    }

  }





  return (

    <button
      onClick={syncGallery}
      disabled={loading}
      className="flex items-center gap-3 rounded-xl bg-purple-600 px-6 py-3 font-bold text-white transition hover:bg-purple-500 disabled:opacity-50"
    >

      <RefreshCw
        size={20}
        className={
          loading
            ? "animate-spin"
            : ""
        }
      />


      {loading
        ? status
        : "Sincronizar galería"
      }


    </button>

  );

}