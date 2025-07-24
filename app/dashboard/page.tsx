"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { IconClock } from "@tabler/icons-react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

import React, { useEffect, useState, useRef, useCallback, memo } from "react";
import portfolio from "./portfolio.json";
import { Button } from "@/components/ui/button";

// Memoized heavy components
const MemoSectionCards = memo(SectionCards);
const MemoChartAreaInteractive = memo(ChartAreaInteractive);
const MemoDataTable = memo(DataTable);

export default function Page() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<{ [key: string]: any }>({});

  // Accessibility: focus main content on load
  const mainRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!loading && mainRef.current) {
      mainRef.current.setAttribute("tabIndex", "-1");
      mainRef.current.focus();
    }
  }, [loading]);

  // Separate effect for initial loading state
  useEffect(() => {
    if (data.length > 0) {
      setLoading(false);
    }
  }, [data]);

  const fetchData = useCallback(async () => {
    const symbols = portfolio.map((stock) => stock.symbol).join(",");
    const apiUrl = `/api/stocks?symbols=${symbols}`;
    try {
      setError(null);
      // Caching: check cache first
      if (cacheRef.current[apiUrl]) {
        setData(cacheRef.current[apiUrl].data);
        setLastUpdated(cacheRef.current[apiUrl].lastUpdated);
        return;
      }
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Failed to fetch stock data");
      const apiData = await res.json();

      // Merge by symbol
      const merged = portfolio.map((stock) => {
        const live =
          (apiData.data || []).find(
            (i: { symbol: string }) => i.symbol === stock.symbol
          ) || {};

        // Calculate derived fields
        const investment = stock.purchasePrice * stock.quantity;
        const presentValue = (live.cmp || 0) * stock.quantity;
        const gainLoss = presentValue - investment;

        return {
          ...stock,
          ...live,
          investment,
          presentValue,
          gainLoss,
        };
      });

      // Calculate total investment for Portfolio %
      const totalInvestment = merged.reduce((sum, s) => sum + s.investment, 0);
      const withPortfolioPct = merged.map((s) => ({
        ...s,
        portfolioPct: totalInvestment
          ? ((s.investment / totalInvestment) * 100).toFixed(2)
          : "0.00",
      }));

      setData(withPortfolioPct);
      setLastUpdated(new Date());
      // Cache result
      cacheRef.current[apiUrl] = {
        data: withPortfolioPct,
        lastUpdated: new Date(),
      };
    } catch (error: any) {
      setError(
        error?.message ||
          "Failed to fetch data. Please try again later or check your connection."
      );
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchData();
    // Set up polling interval (15 seconds)
    const intervalId = setInterval(fetchData, 15000);
    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [fetchData]);

  if (loading)
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col items-center gap-4">
          <Progress value={70} className="w-64 h-3" />
          <span className="text-muted-foreground text-sm font-medium tracking-wide">
            Loading dashboard...
          </span>
        </div>
      </div>
    );

  if (error)
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
        role="alert"
        aria-live="assertive"
      >
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <span className="text-destructive text-lg font-semibold">
            {error}
          </span>
          <span className="text-muted-foreground text-xs">
            This dashboard uses unofficial APIs (Yahoo/Google Finance). Data may
            be delayed, rate-limited, or inaccurate. Please refresh or try again
            later.
          </span>
        </div>
      </div>
    );
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div
          className="flex flex-1 flex-col"
          ref={mainRef}
          tabIndex={-1}
          aria-label="Main dashboard content"
        >
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <MemoSectionCards data={data} />
              <div className="px-4 lg:px-6">
                <MemoChartAreaInteractive
                  data={data}
                  lastUpdated={lastUpdated}
                />
              </div>
              <MemoDataTable data={data} />
              <div className="flex justify-end px-4 lg:px-6 mt-4">
                <Link href="/dashboard/charts">
                  <Button variant="outline" size="sm">
                    More Visualizations
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
