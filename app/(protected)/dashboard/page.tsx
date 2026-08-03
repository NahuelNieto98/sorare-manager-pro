"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import StatCard from "@/components/dashboard/StatCard";
import PortfolioCard from "@/components/dashboard/PortfolioCard";
import GalleryChart from "@/components/charts/GalleryChart";
import QuickStats from "@/components/dashboard/QuickStats";
import TopCards from "@/components/dashboard/TopCards";
import MarketSummary from "@/components/dashboard/MarketSummary";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import ScoutCard from "@/components/dashboard/ScoutCard";
import SyncGalleryButton from "@/components/dashboard/SyncGalleryButton";
import SystemStatus from "@/components/dashboard/SystemStatus";


type DashboardData = {
  galleryValue: number;
  average: number;
  totalCards: number;

  totalBought: number;
  totalSold: number;
  profit: number;
  roi: number;

  scarcity: {
    limited: number;
    rare: number;
    superRare: number;
    unique: number;
  };

  topCards: {
    playerName: string;
    marketValue: number | null;
  }[];

  recentTransactions: {
    id: string;
    type: string;
    playerName: string;
    rarity: string;
    price: number;
  }[];

  needsConnection?: boolean;
};



export default function DashboardPage() {


  const router = useRouter();

  const [data, setData] = useState<DashboardData | null>(null);



  useEffect(() => {

    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((json) => {

        if (json.needsConnection) {

          router.push("/connect");
          return;

        }

        setData(json);

      });

  }, [router]);





  if (!data) {

    return (

      <div
        className="
        flex
        h-full
        items-center
        justify-center
        text-2xl
        text-white
        "
      >
        Cargando dashboard...
      </div>

    );

  }





  return (

    <div className="space-y-10">


      <section
        className="
        flex
        flex-col
        gap-6
        rounded-3xl
        border
        border-white/10
        bg-gradient-to-br
        from-[#1b1535]
        via-[#221a45]
        to-[#120e25]
        p-8
        shadow-xl
        lg:flex-row
        lg:items-center
        lg:justify-between
        "
      >

        <div>

          <h1 className="text-5xl font-black tracking-tight text-white">
            Dashboard
          </h1>


          <p className="mt-3 text-lg text-zinc-400">
            Gestiona tu portfolio Sorare desde un solo lugar.
          </p>


          <p className="mt-2 text-sm text-violet-300">
            Sorare Manager Pro
          </p>

        </div>


        <SyncGalleryButton />

      </section>





      <section
        className="
        grid
        gap-6
        xl:grid-cols-4
        "
      >

        <StatCard
          title="Valor galería"
          value={`€${data.galleryValue.toFixed(2)}`}
          subtitle={`${data.totalCards} cartas`}
        />


        <StatCard
          title="ROI"
          value={`${data.roi.toFixed(2)}%`}
          subtitle="Rentabilidad"
        />


        <StatCard
          title="Beneficio"
          value={`€${data.profit.toFixed(2)}`}
          subtitle="Resultado actual"
        />


        <StatCard
          title="Essence"
          value={data.average.toFixed(1)}
          subtitle="AA Medio"
        />

      </section>





      <PortfolioCard
        galleryValue={data.galleryValue}
        profit={data.profit}
        roi={data.roi}
      />





      <section
        className="
        grid
        gap-6
        xl:grid-cols-3
        "
      >

        <div className="xl:col-span-2">

          <GalleryChart />

        </div>


        <QuickStats
          totalCards={data.totalCards}
          average={data.average}
        />

      </section>





      <section
        className="
        grid
        gap-6
        xl:grid-cols-2
        "
      >

        <TopCards
          cards={data.topCards}
        />


        <MarketSummary
          bought={data.totalBought}
          sold={data.totalSold}
        />

      </section>





      <section
        className="
        grid
        gap-6
        xl:grid-cols-2
        "
      >

        <RecentTransactions
          transactions={data.recentTransactions}
        />


        <ScoutCard />

      </section>





      <SystemStatus />


    </div>

  );

}