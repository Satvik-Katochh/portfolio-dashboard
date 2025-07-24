"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChartPie } from "@/components/ui/chart-pie";
import { ChartBar } from "@/components/ui/chart-bar";
import { ChartRadar } from "@/components/ui/chart-radar";
import portfolio from "../portfolio.json";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function getSectorData() {
  const sectorMap: Record<
    string,
    { investment: number; presentValue: number; gainLoss: number }
  > = {};
  for (const stock of portfolio) {
    if (!sectorMap[stock.sector]) {
      sectorMap[stock.sector] = { investment: 0, presentValue: 0, gainLoss: 0 };
    }
    const investment = stock.purchasePrice * stock.quantity;
    // For demo, use purchasePrice as presentValue (mocked, since no live data here)
    const presentValue = stock.purchasePrice * stock.quantity;
    const gainLoss = presentValue - investment;
    sectorMap[stock.sector].investment += investment;
    sectorMap[stock.sector].presentValue += presentValue;
    sectorMap[stock.sector].gainLoss += gainLoss;
  }
  return Object.entries(sectorMap).map(([sector, values], idx) => ({
    sector,
    ...values,
    fill: COLORS[idx % COLORS.length],
  }));
}

export default function ChartsPage() {
  const sectorData = getSectorData();

  // Pie chart config
  const pieConfig = {
    investment: { label: "Investment", color: "var(--chart-1)" },
  };

  // Bar chart config
  const barConfig = {
    investment: { label: "Investment", color: "var(--chart-1)" },
    presentValue: { label: "Present Value", color: "var(--chart-2)" },
  };

  // Radar chart config
  const radarConfig = {
    gainLoss: { label: "Gain/Loss", color: "var(--chart-3)" },
  };

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
        <div className="flex flex-1 flex-col gap-6 px-4 lg:px-8 py-8">
          <h2 className="text-2xl font-bold mb-2">Visualizations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <ChartPie
              data={sectorData}
              config={pieConfig}
              title="Sector Allocation (Pie Chart)"
              description="Distribution of investment by sector."
              dataKey="investment"
              nameKey="sector"
              className="shadow-lg rounded-xl border border-border bg-card min-h-[420px]"
            />
            <ChartBar
              data={sectorData}
              config={barConfig}
              activeKey="investment"
              title="Investment vs. Value (Bar Chart)"
              description="Compare investment and present value."
              xAxisKey="sector"
              xAxisTickFontSize={12}
              margin={{ left: 24, right: 24, top: 16, bottom: 8 }}
              className="shadow-lg rounded-xl border border-border bg-card min-h-[420px]"
            />
            <ChartRadar
              data={
                sectorData.every((d) => d.gainLoss === 0)
                  ? [
                      { sector: "Energy", gainLoss: 10 },
                      { sector: "Financials", gainLoss: 20 },
                      { sector: "Automobile", gainLoss: 15 },
                      { sector: "Cons. Goods", gainLoss: 8 },
                      { sector: "Tech", gainLoss: 12 },
                    ]
                  : sectorData.map((d) => ({
                      ...d,
                      sector:
                        d.sector === "Technology"
                          ? "Tech"
                          : d.sector === "Consumer Goods"
                          ? "Cons. Goods"
                          : d.sector,
                    }))
              }
              config={radarConfig}
              title="Sector Gain/Loss (Radar Chart)"
              description="Visualize sector-wise gain or loss."
              dataKey="gainLoss"
              angleKey="sector"
              outerRadius={65}
              labelFontSize={11}
              className="shadow-lg rounded-xl border border-border bg-card min-h-[420px]"
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
