"use client";

import { useEffect, useState } from "react";

export type DashboardData = {
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

export function useDashboard() {

  const [data, setData] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  async function refresh() {

    try {

      setLoading(true);

      setError(null);

      const res =
        await fetch("/api/dashboard");

      if (!res.ok) {

        throw new Error();

      }

      const json =
        await res.json();

      setData(json);

    } catch {

      setError("Error loading dashboard");

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    refresh();

  }, []);

  return {
    data,
    loading,
    error,
    refresh,
  };

}