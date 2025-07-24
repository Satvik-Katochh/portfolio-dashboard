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
import { PieChart, Pie } from "recharts";
import { TrendingUp } from "lucide-react";
import React from "react";

interface ChartPieProps {
  data: any[];
  config: any;
  title: string;
  description?: string;
  footer?: React.ReactNode;
  dataKey?: string;
  nameKey?: string;
  className?: string;
}

export function ChartPie({
  data,
  config,
  title,
  description,
  footer,
  dataKey = "visitors",
  nameKey = "browser",
  className,
}: ChartPieProps) {
  return (
    <Card className={className ? className : "flex flex-col"}>
      <CardHeader className="items-start pb-0 min-h-[56px]">
        <CardTitle>{title}</CardTitle>
        {description && (
          <CardDescription className="mt-2">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={data} dataKey={dataKey} nameKey={nameKey} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      {footer && (
        <CardFooter className="flex-col gap-2 text-sm">{footer}</CardFooter>
      )}
    </Card>
  );
}
