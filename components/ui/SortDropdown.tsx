"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import {
  TrendingUp,
  TrendingDown,
  Star,
  Clock,
  ChevronDown,
  Trophy,
  ArrowDownAZ,
} from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};


const options = [
  {
    value: "value",
    key: "highest",
    icon: TrendingUp,
  },
  {
    value: "lowValue",
    key: "lowest",
    icon: TrendingDown,
  },
  {
    value: "aa",
    key: "bestAA",
    icon: Star,
  },
  {
    value: "lowAA",
    key: "worstAA",
    icon: Star,
  },
  {
    value: "l10",
    key: "bestL10",
    icon: Trophy,
  },
  {
    value: "l40",
    key: "bestL40",
    icon: Trophy,
  },
  {
    value: "name",
    key: "nameAZ",
    icon: ArrowDownAZ,
  },
  {
    value: "recent",
    key: "recent",
    icon: Clock,
  },
];


export default function SortDropdown({
  value,
  onChange,
}: Props) {

  const t = useTranslations("sort");

  const [open, setOpen] = useState(false);


  const selected =
    options.find(
      (item) => item.value === value
    ) ?? options[0];


  const SelectedIcon = selected.icon;


  return (

    <div className="relative w-full">

      <button
        onClick={() => setOpen(!open)}
        className="
        flex
        w-full
        items-center
        justify-between
        rounded-2xl
        border
        border-violet-500/50
        bg-[#17112F]
        px-4
        py-2.5
        text-sm
        text-white
        transition
        hover:bg-white/5
        md:px-5
        md:py-3
        md:text-base
        "
      >

        <div className="flex items-center gap-3">

          <SelectedIcon
            size={18}
            className="text-violet-400 md:size-5"
          />

          <span>
            {t(selected.key)}
          </span>

        </div>


        <ChevronDown
          size={18}
          className={`
          transition
          ${open ? "rotate-180" : ""}
          `}
        />

      </button>



      {
        open && (

          <div
            className="
            absolute
            right-0
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

            {
              options.map((item)=>{

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
                    px-4
                    py-3
                    text-sm
                    transition
                    md:px-5
                    md:py-4

                    ${
                      active
                      ?
                      "bg-violet-600/40 text-white"
                      :
                      "text-zinc-300 hover:bg-white/5"
                    }
                    `}
                  >

                    <span className="flex items-center gap-3">

                      <Icon size={17}/>

                      {t(item.key)}

                    </span>


                    {
                      active && (
                        <span className="text-violet-300">
                          ✓
                        </span>
                      )
                    }


                  </button>

                );

              })
            }


          </div>

        )
      }


    </div>

  );
}