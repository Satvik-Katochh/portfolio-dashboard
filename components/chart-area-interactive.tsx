"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconClock } from "@tabler/icons-react";
import { useState, useEffect } from "react";

export function ChartAreaInteractive({
  data = [],
  lastUpdated,
}: {
  data: any[];
  lastUpdated: Date | null;
}) {
  // Prepare chart data: X = stock name, Y = investment/presentValue
  const chartData = data.map((row) => ({
    name: row.name,
    investment: row.investment ?? 0,
    presentValue: row.presentValue ?? 0,
    gainLoss: row.gainLoss ?? 0,
  }));

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 500);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <Card className="@container/card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg sm:text-xl">Portfolio Overview</CardTitle>
        {lastUpdated && (
          <div className="flex items-center gap-1.5">
            <div className="text-xs text-muted-foreground/70 flex items-center gap-1 hover:text-muted-foreground transition-colors">
              <span className="text-[11px] tracking-tight">Live</span>
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/70 animate-pulse" />
            </div>
            <div className="h-3 w-[1px] bg-border/40" />
            <div className="text-xs text-muted-foreground/60 flex items-center gap-1">
              <IconClock className="h-3 w-3" strokeWidth={1.5} />
              <span className="text-[11px] tracking-tight">
                {lastUpdated.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-2 pb-4">
        {chartData.length === 0 ? (
          <div className="text-muted-foreground text-center py-8">
            No data to display.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart
              data={chartData}
              margin={{ left: 8, right: 8, top: 16, bottom: 8 }}
            >
              <defs>
                <linearGradient id="areaInvested" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="areaCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="#333"
                strokeDasharray={undefined}
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={isMobile
                  ? false
                  : ({ x, y, payload }) => {
                      const label = String(payload.value);
                      const shortLabel =
                        label.length > 12 ? label.slice(0, 11) + "…" : label;
                      return (
                        <g>
                          <title>{label}</title>
                          <text
                            x={x}
                            y={y + 10}
                            textAnchor="end"
                            fontSize={11}
                            fill="#a1a1aa"
                            transform={`rotate(-10,${x},${y + 10})`}
                            style={{
                              cursor: label.length > 12 ? "pointer" : "default",
                            }}
                          >
                            {shortLabel}
                          </text>
                        </g>
                      );
                    }
                }
                interval={0}
                height={40}
                axisLine={{ stroke: "#333" }}
                tickLine={{ stroke: "#333" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#a1a1aa" }}
                tickFormatter={(v: number) => v.toLocaleString()}
                axisLine={{ stroke: "#333" }}
                tickLine={{ stroke: "#333" }}
              />
              <Tooltip
                formatter={(value: number) => value?.toLocaleString()}
                content={({
                  active,
                  payload,
                  label,
                }: {
                  active?: boolean;
                  payload?: any[];
                  label?: string;
                }) => {
                  if (!active || !payload || !payload.length) return null;
                  const invested =
                    payload.find((p: any) => p.dataKey === "investment")
                      ?.value ?? 0;
                  const current =
                    payload.find((p: any) => p.dataKey === "presentValue")
                      ?.value ?? 0;
                  const gainLoss = current - invested;
                  return (
                    <div
                      style={{
                        background: "#18181b",
                        borderRadius: 8,
                        padding: 12,
                        border: "none",
                        color: "#fff",
                      }}
                    >
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>
                        {label}
                      </div>
                      <div style={{ color: "#6366f1" }}>
                        Invested: {invested.toLocaleString()}
                      </div>
                      <div style={{ color: "#22c55e" }}>
                        Current: {current.toLocaleString()}
                      </div>
                      <div
                        style={{ color: gainLoss >= 0 ? "#22c55e" : "#ef4444" }}
                      >
                        Gain/Loss: {gainLoss >= 0 ? "+" : ""}
                        {gainLoss.toLocaleString()}
                      </div>
                    </div>
                  );
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={10}
                wrapperStyle={{
                  paddingBottom: 12,
                  fontSize: 13,
                  fontWeight: 500,
                }}
                formatter={(value: string) => {
                  if (value === "investment")
                    return (
                      <span style={{ color: "#6366f1", fontWeight: 600 }}>
                        Invested
                      </span>
                    );
                  if (value === "presentValue")
                    return (
                      <span style={{ color: "#22c55e", fontWeight: 600 }}>
                        Current
                      </span>
                    );
                  return value;
                }}
              />
              <Area
                type="monotone"
                dataKey="presentValue"
                stroke="#22c55e"
                fill="url(#areaCurrent)"
                strokeWidth={2}
                dot={false}
                activeDot={false}
                name="Current"
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="investment"
                stroke="#6366f1"
                fill="url(#areaInvested)"
                strokeWidth={2}
                dot={false}
                activeDot={false}
                name="Invested"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
