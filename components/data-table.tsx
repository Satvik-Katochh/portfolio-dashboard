"use client";

import * as React from "react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrendingUp,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Remove drag handle for extra minimalism
const columns = [
  {
    key: "name",
    header: "Particulars",
    cell: (row: any) => <span className="font-medium">{row.name}</span>,
  },
  {
    key: "sector",
    header: "Sector",
    cell: (row: any) => <span className="block text-center">{row.sector}</span>,
  },
  {
    key: "purchasePrice",
    header: "Purchase Price",
    cell: (row: any) => (
      <span className="block text-right font-mono tabular-nums rounded bg-muted/20 px-2 py-1">
        {row.purchasePrice}
      </span>
    ),
  },
  {
    key: "quantity",
    header: "Qty",
    cell: (row: any) => (
      <span className="block text-right font-mono tabular-nums rounded bg-muted/20 px-2 py-1">
        {row.quantity}
      </span>
    ),
  },
  {
    key: "investment",
    header: "Investment",
    cell: (row: any) => (
      <span className="block text-right font-mono tabular-nums rounded bg-muted/20 px-2 py-1">
        ₹{row.investment?.toLocaleString()}
      </span>
    ),
  },
  {
    key: "portfolioPct",
    header: "Portfolio (%)",
    cell: (row: any) => (
      <span className="block text-right font-mono tabular-nums rounded bg-muted/20 px-2 py-1">
        {row.portfolioPct}
      </span>
    ),
  },
  {
    key: "exchange",
    header: "NSE/BSE",
    cell: (row: any) => (
      <div className="w-16 text-center font-mono">{row.exchange}</div>
    ),
  },
  {
    key: "cmp",
    header: "CMP",
    cell: (row: any) => (
      <span className="block text-right font-mono tabular-nums rounded bg-muted/20 px-2 py-1">
        {row.cmp?.toFixed ? row.cmp.toFixed(2) : row.cmp}
      </span>
    ),
  },
  {
    key: "presentValue",
    header: "Present Value",
    cell: (row: any) => (
      <span className="block text-right font-mono tabular-nums rounded bg-muted/20 px-2 py-1">
        ₹{row.presentValue?.toLocaleString()}
      </span>
    ),
  },
  {
    key: "gainLoss",
    header: "Gain/Loss",
    cell: (row: any) => {
      const value = row.gainLoss;
      const color =
        value > 0 ? "text-green-500" : value < 0 ? "text-red-500" : "";
      return (
        <span
          className={`block text-right font-mono tabular-nums rounded bg-muted/20 px-2 py-1 ${color}`}
        >
          ₹
          {value?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      );
    },
  },
  {
    key: "peRatio",
    header: "P/E Ratio",
    cell: (row: any) => (
      <span className="block text-right font-mono tabular-nums rounded bg-muted/20 px-2 py-1">
        {row.peRatio}
      </span>
    ),
  },
  {
    key: "latestEarnings",
    header: "Latest Earnings",
    cell: (row: any) => (
      <span className="block text-right font-mono tabular-nums rounded bg-muted/20 px-2 py-1">
        {row.latestEarnings}
      </span>
    ),
  },
];

export function DataTable({ data }: { data: any[] }) {
  // Sector filter state
  const [selectedSector, setSelectedSector] = React.useState<string>("All");
  const sectors = React.useMemo(() => {
    const unique = Array.from(new Set(data.map((row) => row.sector)));
    return ["All", ...unique];
  }, [data]);
  const filteredData = React.useMemo(() => {
    if (selectedSector === "All") return data;
    return data.filter((row) => row.sector === selectedSector);
  }, [data, selectedSector]);

  // Calculate summary values for filtered data
  const summary = React.useMemo(() => {
    const investment = filteredData.reduce(
      (sum, s) => sum + (s.investment || 0),
      0
    );
    const presentValue = filteredData.reduce(
      (sum, s) => sum + (s.presentValue || 0),
      0
    );
    const gainLoss = filteredData.reduce(
      (sum, s) => sum + (s.gainLoss || 0),
      0
    );
    return { investment, presentValue, gainLoss };
  }, [filteredData]);

  return (
    <div className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6 mb-6 mt-2">
        <Select value={selectedSector} onValueChange={setSelectedSector}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by sector" />
          </SelectTrigger>
          <SelectContent>
            {sectors.map((sector) => (
              <SelectItem key={sector} value={sector}>
                {sector}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            className="font-mono cursor-default select-none"
            tabIndex={-1}
            type="button"
            asChild={false}
          >
            Investment: ₹{summary.investment.toLocaleString()}
          </Button>
          <Button
            variant="outline"
            className="font-mono cursor-default select-none"
            tabIndex={-1}
            type="button"
            asChild={false}
          >
            Value: ₹{summary.presentValue.toLocaleString()}
          </Button>
          <Button
            variant="outline"
            className="font-mono cursor-default select-none"
            tabIndex={-1}
            type="button"
            asChild={false}
          >
            Gain/Loss:{" "}
            <span
              className={
                summary.gainLoss > 0
                  ? "text-green-500"
                  : summary.gainLoss < 0
                  ? "text-red-500"
                  : ""
              }
            >
              ₹{summary.gainLoss.toLocaleString()}
            </span>
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto px-4 lg:px-6">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row, idx) => (
              <TableRow key={row.id || idx}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.cell ? col.cell(row) : row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

function TableCellViewer({ item }: { item: any }) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.header}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.header}</DrawerTitle>
          <DrawerDescription>
            Showing total visitors for the last 6 months
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    type="monotone"
                    dataKey="presentValue"
                    stroke="#22c55e"
                    fill="url(#areaCurrent)"
                    strokeWidth={2.5} // thinner line
                    dot={{ r: 3, stroke: "#22c55e", fill: "#fff" }}
                    activeDot={{ r: 5 }}
                    name="Current"
                    isAnimationActive={true}
                  />
                  <Area
                    type="monotone"
                    dataKey="investment"
                    stroke="#6366f1"
                    fill="url(#areaInvested)"
                    strokeWidth={2.5} // thinner line
                    dot={{ r: 3, stroke: "#6366f1", fill: "#fff" }}
                    activeDot={{ r: 5 }}
                    name="Invested"
                    isAnimationActive={true}
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  Trending up by 5.2% this month{" "}
                  <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Showing total visitors for the last 6 months. This is just
                  some random text to test the layout. It spans multiple lines
                  and should wrap around.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Header</Label>
              <Input id="header" defaultValue={item.header} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="type">Type</Label>
                <Select defaultValue={item.type}>
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Table of Contents">
                      Table of Contents
                    </SelectItem>
                    <SelectItem value="Executive Summary">
                      Executive Summary
                    </SelectItem>
                    <SelectItem value="Technical Approach">
                      Technical Approach
                    </SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Capabilities">Capabilities</SelectItem>
                    <SelectItem value="Focus Documents">
                      Focus Documents
                    </SelectItem>
                    <SelectItem value="Narrative">Narrative</SelectItem>
                    <SelectItem value="Cover Page">Cover Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={item.status}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Done">Done</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="target">Target</Label>
                <Input id="target" defaultValue={item.target} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="limit">Limit</Label>
                <Input id="limit" defaultValue={item.limit} />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="reviewer">Reviewer</Label>
              <Select defaultValue={item.reviewer}>
                <SelectTrigger id="reviewer" className="w-full">
                  <SelectValue placeholder="Select a reviewer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
                  <SelectItem value="Jamik Tashpulatov">
                    Jamik Tashpulatov
                  </SelectItem>
                  <SelectItem value="Emily Whalen">Emily Whalen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
