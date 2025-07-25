# 8byte Portfolio Dashboard

A modern, real-time portfolio dashboard for Indian investors, built with Next.js, React, shadcn/ui, and Tailwind v4.

---

## 🚀 Features

- **Live Stock Data:** Fetches real-time CMP from Yahoo Finance (unofficial API)
- **Mocked P/E & Earnings:** Google Finance data is mocked (no public API)
- **Premium UI:** shadcn/ui, Tailwind v4, dark/light mode, responsive
- **Portfolio Table:** All key columns, color-coded gain/loss, sector filter, rupee formatting
- **Charts:**
  - Area chart for Invested vs. Current, themeable (yellow/violet, etc.)
  - **Visualizations section (sidebar): Interactive Pie, Bar, and Radar charts**
- **Section Cards:** Best/Worst Performer, Overall Returns, Portfolio Value
- **Sector Summaries:** Filter and summary bar for sector-level totals
- **Live Polling:** Live updates every 15s (no caching; always fetches fresh data)
- **Error Handling:** User-friendly error messages and API disclaimers

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript
- **UI:** shadcn/ui, Tailwind CSS v4
- **Charts:** recharts
- **Backend:** Node.js API routes (no DB)

---

## 📦 Data & API Approach

- **portfolio.json:** Template for user holdings (symbol, name, sector, price, qty, etc.)
- **/api/stocks:**
  - Fetches live CMP from Yahoo Finance (via `yahoo-finance2`)
  - Mocks P/E Ratio and Earnings (Google Finance not public)
  - Merges static and live data, calculates all derived fields
  - No caching: always fetches fresh data every 15s for up-to-date prices

---

## 🖥️ UI/UX Approach

- **shadcn/ui:** All components styled for premium, minimal look
- - The sidebar now features a Visualizations section with interactive Pie, Bar, and Radar charts for sector analysis.
- **Tailwind v4:** Modern color tokens, responsive, dark/light mode
- **Charts:** Uses theme tokens for beautiful, consistent colors
- **Accessibility:** ARIA roles, keyboard nav, screen reader support

---

## 🧮 How Calculations Work

- **Investment:** purchasePrice × quantity
- **Present Value:** CMP × quantity
- **Gain/Loss:** Present Value – Investment
- **Portfolio %:** Proportional weight in portfolio
- **Sector Summaries:** Totals for investment, value, gain/loss

---

## ⚠️ Disclaimers & Limitations

- **Yahoo Finance:** Uses unofficial API, may be rate-limited or blocked
- **Google Finance:** No public API, so P/E and Earnings are mocked
- **No DB/Auth:** This is a demo; no persistent backend or user accounts

---

## 🏁 Getting Started

1. `pnpm i` (or `npm install`)
2. `pnpm dev` (or `npm run dev`)
3. Open [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

- `app/dashboard/page.tsx`: Main dashboard logic (polling, error handling, layout)
- `app/api/stocks/route.ts`: API route for live/merged data (no caching)
- `components/`: All UI components (table, cards, chart, sidebar, etc.)
- `app/dashboard/portfolio.json`: Portfolio template

---

## ✨ Credits

- UI: [shadcn/ui](https://ui.shadcn.com/)
- Charts: [recharts](https://recharts.org/)
- Data: [yahoo-finance2](https://www.npmjs.com/package/yahoo-finance2)

---

## 📝 Author

Satvik Katoch

---

> Built for the Octa Byte AI Full Stack Technical Assessment
