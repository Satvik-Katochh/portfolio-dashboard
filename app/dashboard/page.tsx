"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { IconClock } from "@tabler/icons-react";

import React, { useEffect, useState } from "react";
import portfolio from "./portfolio.json";

export default function Page() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Separate effect for initial loading state
  useEffect(() => {
    if (data.length > 0) {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    const symbols = portfolio.map((stock) => stock.symbol).join(",");
    const apiUrl = `/api/stocks?symbols=${symbols}`;

    const fetchData = async () => {
      try {
        const res = await fetch(apiUrl);
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
        const totalInvestment = merged.reduce(
          (sum, s) => sum + s.investment,
          0
        );
        const withPortfolioPct = merged.map((s) => ({
          ...s,
          portfolioPct: totalInvestment
            ? ((s.investment / totalInvestment) * 100).toFixed(2)
            : "0.00",
        }));

        setData(withPortfolioPct);
        setLastUpdated(new Date()); // Update timestamp when new data arrives
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling interval (15 seconds)
    const intervalId = setInterval(fetchData, 15000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array as we don't need to track any values

  if (loading) return <div>Loading...</div>;
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
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards data={data} />

              <div className="px-4 lg:px-6">
                <ChartAreaInteractive data={data} lastUpdated={lastUpdated} />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
