"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { RadarChart, Radar, PolarAngleAxis, PolarGrid } from "recharts";
import { TrendingUp } from "lucide-react";
import React from "react";

interface ChartRadarProps {
  data: any[];
  config: any;
  title: string;
  description?: string;
  footer?: React.ReactNode;
  dataKey?: string;
  angleKey?: string;
  outerRadius?: number;
  labelFontSize?: number;
  className?: string;
}

export function ChartRadar({
  data,
  config,
  title,
  description,
  footer,
  dataKey = "desktop",
  angleKey = "month",
  outerRadius = 65,
  labelFontSize = 11,
  className,
}: ChartRadarProps) {
  return (
    <Card className={className ? className : undefined}>
      <CardHeader className="items-start pb-0 min-h-[56px]">
        <CardTitle>{title}</CardTitle>
        {description && (
          <CardDescription className="mt-2">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={data} outerRadius={outerRadius}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis
              dataKey={angleKey}
              tick={{ fontSize: labelFontSize }}
            />
            <PolarGrid />
            <Radar
              dataKey={dataKey}
              fill={`var(--color-${dataKey})`}
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      {footer && (
        <CardFooter className="flex-col gap-2 text-sm">{footer}</CardFooter>
      )}
    </Card>
  );
}
