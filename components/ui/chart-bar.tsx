"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis } from "recharts";
import React from "react";

interface ChartBarProps {
  data: any[];
  config: any;
  activeKey: string;
  title: string;
  description?: string;
  xAxisKey?: string;
  xAxisTickFontSize?: number;
  margin?: { left?: number; right?: number; top?: number; bottom?: number };
  className?: string;
}

export function ChartBar({
  data,
  config,
  activeKey,
  title,
  description,
  xAxisKey = "date",
  xAxisTickFontSize = 12,
  margin = { left: 24, right: 24, top: 16, bottom: 8 },
  className,
}: ChartBarProps) {
  return (
    <Card className={className ? className : "py-0"}>
      <CardHeader className="items-start pb-0 min-h-[56px]">
        <CardTitle>{title}</CardTitle>
        {description && (
          <CardDescription className="mt-2">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={config}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart data={data} margin={margin}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tick={{ fontSize: xAxisTickFontSize }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent className="w-[150px]" nameKey="views" />
              }
            />
            <Bar dataKey={activeKey} fill={`var(--color-${activeKey})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
