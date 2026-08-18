"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { useAnalytics } from "@/hooks/useAnalytics";

import AnalyticsStats from "@/components/analytics/AnalyticsStats";
import AnalyticsDistribution from "@/components/analytics/AnalyticsDistribution";
import AnalyticsCharts from "@/components/analytics/AnalyticsCharts";
import AnalyticsInsights from "@/components/analytics/AnalyticsInsights";
import AnalyticsEmpty from "@/components/analytics/AnalyticsEmpty";


export default function AnalyticsPage() {

  const t =
    useTranslations("analytics");


  const [season, setSeason] =
    useState("2026-27");


  const {
    data,
    loading,
    error,
  } =
    useAnalytics(season);


  if (loading) {

    return (
      <div className="text-center text-zinc-400">
        {t("loading")}
      </div>
    );

  }


  if (error) {

    return (
      <div className="text-white">
        {error}
      </div>
    );

  }


  if (
    !data ||
    (
      data.totalBought === 0 &&
      data.totalSold === 0 &&
      data.galleryValue === 0
    )
  ) {

    return (
      <AnalyticsEmpty />
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

        <div
          className="
          flex
          flex-col
          gap-6
          lg:flex-row
          lg:items-end
          lg:justify-between
          "
        >

          <div>

            <h1
              className="
              text-5xl
              font-black
              text-white
              "
            >
              {t("title")}
            </h1>

            <p
              className="
              mt-3
              text-lg
              text-zinc-400
              "
            >
              {t("subtitle")}
            </p>

          </div>


          <div className="min-w-[220px]">

            <label
              className="
              mb-2
              block
              text-sm
              font-bold
              text-zinc-400
              "
            >
              {t("season")}
            </label>

            <select
              value={season}
              onChange={(event) =>
                setSeason(
                  event.target.value
                )
              }
              className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-[#221A40]
              px-4
              py-3
              font-bold
              text-white
              outline-none
              transition
              focus:border-purple-500
              "
            >

              <option value="all">
                {t("allTime")}
              </option>

              <option value="2026-27">
                2026/27
              </option>

              <option value="2025-26">
                2025/26
              </option>

              <option value="2024-25">
                2024/25
              </option>

              <option value="2023-24">
                2023/24
              </option>

            </select>

          </div>

        </div>

      </section>


      <AnalyticsStats

        roi={data.roi}

        profit={data.profit}

        totalBought={
          data.totalBought
        }

        totalSold={
          data.totalSold
        }

        recoveredCapital={
          data.recoveredCapital
        }

      />


      <AnalyticsDistribution

        scarcity={
          data.scarcity
        }

      />


      <AnalyticsCharts

        transactionsHistory={
          data.transactionsHistory
        }

        buySellData={
          data.buySellData
        }

        portfolioHistory={
          data.portfolioHistory
        }

      />


      <AnalyticsInsights

        roi={data.roi}

        profit={data.profit}

        totalBought={
          data.totalBought
        }

        totalSold={
          data.totalSold
        }

        galleryValue={
          data.galleryValue
        }

      />

    </div>

  );

}
