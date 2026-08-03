"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Star,
  Clock,
  ChevronDown,
  Check,
} from "lucide-react";


type Props = {
  value: string;
  onChange: (value:string)=>void;
};



const options = [
  {
    value:"value",
    label:"Mayor valor",
    icon:TrendingUp,
  },
  {
    value:"lowValue",
    label:"Menor valor",
    icon:TrendingDown,
  },
  {
    value:"aa",
    label:"Mejor AA",
    icon:Star,
  },
  {
    value:"lowAA",
    label:"Peor AA",
    icon:Star,
  },
  {
    value:"recent",
    label:"Más reciente",
    icon:Clock,
  },
];



export default function SortDropdown({
  value,
  onChange,
}:Props){


  const [open,setOpen] = useState(false);


  const selected =
    options.find(
      (item)=>item.value===value
    )
    ??
    options[0];



  return (

    <div className="relative w-64">


      <button

        onClick={()=>setOpen(!open)}

        className="
        flex
        w-full
        items-center
        justify-between
        rounded-2xl
        border
        border-violet-500/50
        bg-[#17112F]
        px-5
        py-3
        text-white
        transition
        hover:bg-white/5
        "

      >


        <div className="
        flex
        items-center
        gap-3
        ">


          <selected.icon
            size={20}
            className="text-violet-400"
          />


          <span className="font-bold">
            {selected.label}
          </span>


        </div>


        <ChevronDown
          size={20}
          className={`
          transition
          ${open ? "rotate-180" : ""}
          `}
        />


      </button>




      {open && (

        <div
          className="
          absolute
          z-50
          mt-3
          w-full
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-[#17112F]
          shadow-2xl
          "
        >


          {options.map((item)=>{


            const Icon = item.icon;


            const active =
              item.value === value;



            return (

              <button

                key={item.value}

                onClick={()=>{
                  onChange(item.value);
                  setOpen(false);
                }}

                className={`
                flex
                w-full
                items-center
                justify-between
                px-5
                py-4
                transition

                ${
                  active
                  ?
                  "bg-violet-600/40 text-white"
                  :
                  "text-zinc-300 hover:bg-white/5"
                }

                `}
              >


                <div className="
                flex
                items-center
                gap-3
                ">

                  <Icon
                    size={20}
                    className="text-violet-400"
                  />


                  <span>
                    {item.label}
                  </span>


                </div>



                {active && (

                  <Check
                    size={20}
                    className="text-violet-300"
                  />

                )}



              </button>

            );


          })}


        </div>

      )}


    </div>

  );

}