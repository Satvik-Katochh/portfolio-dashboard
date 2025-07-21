"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";

import React, { useEffect, useState } from "react";
import portfolio from "./portfolio.json";

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const symbols = portfolio.map((stock) => stock.symbol).join(",");
    const apiUrl = `/api/stocks?symbols=${symbols}`;
    fetch(apiUrl)
      .then((res) => res.json())
      .then((apiData) => {
        // Merge by symbol
        const merged = portfolio.map((stock) => {
          const live =
            (apiData.data || []).find((item) => item.symbol === stock.symbol) ||
            {};
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
        setLoading(false);
      });
  }, []);

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
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive data={data} />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
