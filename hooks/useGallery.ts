"use client";

import { useEffect, useState } from "react";


export type GalleryCard = {

  id:string;

  playerName:string;

  playerSlug:string|null;

  club:string|null;

  position:string|null;

  scarcity:string;

  season:number;

  averageScore:number|null;

  l5Score:number|null;

  l10Score:number|null;

  l15Score:number|null;

  l40Score:number|null;

  marketValue:number|null;

  pictureUrl:string|null;

};



export function useGallery(){


  const [cards,setCards] =
    useState<GalleryCard[]>([]);



  const [loading,setLoading] =
    useState(true);



  const [error,setError] =
    useState<string|null>(null);




  async function refresh(){


    try {


      setLoading(true);

      setError(null);



      const res =
        await fetch("/api/cards");



      if(!res.ok){

        throw new Error(
          "Gallery request failed"
        );

      }



      const data =
        await res.json();



      setCards(data);



    }catch(error){



      console.error(error);



      setError(
        "Error loading gallery"
      );



    }finally{


      setLoading(false);


    }


  }





  useEffect(()=>{


    refresh();


  },[]);




  return {


    cards,

    loading,

    error,

    refresh,


  };


}