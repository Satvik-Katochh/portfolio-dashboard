import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-lg mx-auto flex flex-col items-center shadow-none border-none bg-transparent">
        <CardContent className="flex flex-col items-center gap-6 pt-8 pb-4">
          <h1 className="text-3xl font-bold tracking-tight text-center">
            8byte Portfolio Dashboard
          </h1>
          <p className="text-muted-foreground text-center text-base max-w-md">
            A modern, real-time portfolio dashboard for Indian investors.
            <br />
            Built with Next.js, React, shadcn/ui, and Tailwind v4.
          </p>
          <ul className="text-muted-foreground text-sm flex flex-col gap-1 w-full max-w-md list-disc list-inside">
            <li>Live stock data (Yahoo Finance, unofficial API)</li>
            <li>Mocked P/E & Earnings (Google Finance)</li>
            <li>Premium shadcn UI, dark/light mode</li>
            <li>Color-coded, sector-filtered portfolio table</li>
            <li>Area chart, summary cards, sector summaries</li>
            <li>
              Interactive Visualizations (Pie, Bar, Radar charts) in sidebar
            </li>
            <li>Polling, caching, error handling</li>
          </ul>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4 w-full pb-8">
          <Link href="/dashboard" className="w-full flex justify-center">
            <Button
              size="lg"
              className="w-full max-w-xs text-base font-semibold"
            >
              Go to Dashboard
            </Button>
          </Link>
          <div className="text-xs text-muted-foreground text-center max-w-md mt-2">
            Built for the Octa Byte AI Full Stack Technical Assessment.
            <br />
            <span className="font-mono">by Satvik Katoch</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
