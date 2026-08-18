"use client";

import { useEffect, useState } from "react";

export type AnalyticsData = {
  season: string;

  trackingStartedAt: string | null;

  startingGalleryValue: number | null;

  galleryValue: number;

  roi: number;

  profit: number;

  totalBought: number;

  totalSold: number;

  recoveredCapital: number;

  scarcity: {
    limited: number;
    rare: number;
    superRare: number;
    unique: number;
  };

  buySellData: {
    name: string;
    value: number;
  }[];

  transactionsHistory: {
    date: string;
    bought: number;
    sold: number;
  }[];

  portfolioHistory: {
    date: string;
    roi: number;
    galleryValue: number;
    profit: number;
  }[];
};

export function useAnalytics(
  season: string
) {
  const [data, setData] =
    useState<AnalyticsData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  async function refresh() {
    try {
      setLoading(true);

      setError(null);

      const query =
        season === "all"
          ? ""
          : `?season=${encodeURIComponent(season)}`;

      const res =
        await fetch(
          `/api/analytics${query}`
        );

      if (!res.ok) {
        throw new Error(
          "Analytics request failed"
        );
      }

      const json =
        await res.json();

      setData(json);

    } catch (error) {
      console.error(error);

      setError(
        "Error loading analytics"
      );

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [season]);

  return {
    data,
    loading,
    error,
    refresh,
  };
}
