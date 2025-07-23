import {
  IconTrendingDown,
  IconTrendingUp,
  IconStar,
  IconBriefcase,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Accept data prop for live portfolio data
export function SectionCards({ data = [] }: { data: any[] }) {
  // Compute Best Performer (highest gain %)
  let bestPerformer = null;
  let bestGainPct = 0;
  if (data.length > 0) {
    bestPerformer = data.reduce((best, curr) => {
      const currGainPct = curr.investment
        ? ((curr.presentValue - curr.investment) / curr.investment) * 100
        : 0;
      const bestGainPct = best.investment
        ? ((best.presentValue - best.investment) / best.investment) * 100
        : 0;
      return currGainPct > bestGainPct ? curr : best;
    }, data[0]);
    bestGainPct = bestPerformer.investment
      ? ((bestPerformer.presentValue - bestPerformer.investment) /
          bestPerformer.investment) *
        100
      : 0;
  }

  // Compute Worst Performer (highest loss %)
  let worstPerformer = null;
  let worstGainPct = 0;
  if (data.length > 0) {
    worstPerformer = data.reduce((worst, curr) => {
      const currGainPct = curr.investment
        ? ((curr.presentValue - curr.investment) / curr.investment) * 100
        : 0;
      const worstGainPct = worst.investment
        ? ((worst.presentValue - worst.investment) / worst.investment) * 100
        : 0;
      return currGainPct < worstGainPct ? curr : worst;
    }, data[0]);
    worstGainPct = worstPerformer.investment
      ? ((worstPerformer.presentValue - worstPerformer.investment) /
          worstPerformer.investment) *
        100
      : 0;
  }

  // Compute Total Returns
  let totalInvested = 0;
  let totalCurrentValue = 0;
  let totalGainLoss = 0;
  if (data.length > 0) {
    totalInvested = data.reduce((sum, item) => sum + item.investment, 0);
    totalCurrentValue = data.reduce((sum, item) => sum + item.presentValue, 0);
    totalGainLoss = totalCurrentValue - totalInvested;
  }
  const totalReturnPct =
    totalInvested > 0 ? (totalCurrentValue / totalInvested - 1) * 100 : 0;

  // Compute Largest Position
  let largestPosition = null;
  if (data.length > 0) {
    largestPosition = data.reduce((max, curr) => {
      const currPortfolioPct =
        totalInvested > 0 ? (curr.presentValue / totalInvested) * 100 : 0;
      const maxPortfolioPct =
        max.presentValue > 0 ? (max.presentValue / totalInvested) * 100 : 0;
      return currPortfolioPct > maxPortfolioPct ? curr : max;
    }, data[0]);
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Best Performer Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Best Performer</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {bestPerformer
              ? `${bestGainPct >= 0 ? "+" : ""}${bestGainPct.toFixed(2)}%`
              : "--"}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="size-4" />
              Best
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {bestPerformer ? bestPerformer.symbol : "--"}
          </div>
          <div className="text-muted-foreground">
            {bestPerformer ? bestPerformer.name : "--"}
          </div>
        </CardFooter>
      </Card>

      {/* Worst Performer Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Worst Performer</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {worstPerformer
              ? `${worstGainPct >= 0 ? "+" : ""}${worstGainPct.toFixed(2)}%`
              : "--"}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown className="size-4" />
              Worst
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {worstPerformer ? worstPerformer.symbol : "--"}
          </div>
          <div className="text-muted-foreground">
            {worstPerformer ? worstPerformer.name : "--"}
          </div>
        </CardFooter>
      </Card>

      {/* Overall Returns Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Overall Returns</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalReturnPct >= 0 ? "+" : ""}
            {totalReturnPct.toFixed(2)}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconBriefcase className="size-4" />
              Portfolio
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">Portfolio</div>
          <div className="text-muted-foreground">
            ₹
            {totalGainLoss.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}{" "}
            (₹
            {totalInvested.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}{" "}
            → ₹
            {totalCurrentValue.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
            )
          </div>
        </CardFooter>
      </Card>

      {/* Largest Position Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Largest Position</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {largestPosition
              ? `₹${largestPosition.presentValue?.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}`
              : "--"}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconStar className="size-4" />
              Top
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {largestPosition ? largestPosition.symbol : "--"}
          </div>
          <div className="text-muted-foreground">
            {largestPosition ? largestPosition.name : "--"}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
