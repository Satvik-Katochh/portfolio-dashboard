import { NextRequest } from "next/server";
import yahooFinance from "yahoo-finance2";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbols = searchParams.get("symbols")?.split(",") || [];

  const results = await Promise.all(
    symbols.map(async (symbol, idx) => {
      try {
        const quote = await yahooFinance.quote(symbol);

        // Mock Google Finance data
        const peRatio = Math.random() * 30; // Replace with real data if possible
        const latestEarnings = Math.random() * 10; // Replace with real data if possible

        return {
          id: symbol, // or idx, or any unique value
          symbol,
          cmp: quote.regularMarketPrice,
          currency: quote.currency,
          name: quote.shortName,
          peRatio: peRatio.toFixed(2),
          latestEarnings: latestEarnings.toFixed(2),
        };
      } catch (error) {
        return {
          id: symbol,
          symbol,
          error: "Failed to fetch data",
        };
      }
    })
  );

  return Response.json({
    data: results,
    disclaimer:
      "P/E Ratio and Earnings are mock data. Google Finance does not provide a public API.",
  });
}
