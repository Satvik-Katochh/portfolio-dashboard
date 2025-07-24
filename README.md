# 8byte Portfolio Dashboard

A modern, real-time portfolio dashboard for Indian investors, built with Next.js, React, shadcn/ui, and Tailwind v4.

---

## 🚀 Features

- **Live Stock Data:** Fetches real-time CMP from Yahoo Finance (unofficial API)
- **Mocked P/E & Earnings:** Google Finance data is mocked (no public API)
- **Premium UI:** shadcn/ui, Tailwind v4, dark/light mode, responsive
- **Portfolio Table:** All key columns, color-coded gain/loss, sector filter, rupee formatting
- **Charts:** Area chart for Invested vs. Current, themeable (yellow/violet, etc.)
- **Section Cards:** Best/Worst Performer, Overall Returns, Portfolio Value
- **Sector Summaries:** Filter and summary bar for sector-level totals
- **Polling & Caching:** Live updates every 15s, with backend and frontend caching
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
  - In-memory cache (15s) to reduce rate limiting

---

## 🖥️ UI/UX Approach

- **shadcn/ui:** All components styled for premium, minimal look
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
- `app/api/stocks/route.ts`: API route for live/merged data (with caching)
- `components/`: All UI components (table, cards, chart, sidebar, etc.)
- `app/dashboard/portfolio.json`: Portfolio template

---

## ✨ Credits

- UI: [shadcn/ui](https://ui.shadcn.com/)
- Charts: [recharts](https://recharts.org/)
- Data: [yahoo-finance2](https://www.npmjs.com/package/yahoo-finance2)

---

## �� Technical Approach (Story)

This dashboard was built as a technical assessment for Octa Byte AI, with a focus on pragmatic, modern engineering and a premium user experience.

### **Design Decisions & Challenges**

- **UI/UX:** I chose shadcn/ui and Tailwind v4 for their flexibility, accessibility, and beautiful defaults. The dashboard is fully responsive, dark/light mode, and uses a theme selector for instant color changes.
- **Data Model:** I started with a static `portfolio.json` to define the user’s holdings, then merged in live data from Yahoo Finance for CMP. All calculations (investment, present value, gain/loss, portfolio %) are done on the fly.
- **API Integration:** Yahoo Finance has no official API, so I used the `yahoo-finance2` library (unofficial, but widely used). Google Finance has no public API, so I mocked P/E and Earnings for demo purposes.
- **Polling & Caching:** The dashboard polls the API every 15 seconds for live updates. To avoid rate limits and improve performance, I added a simple in-memory cache to the API route (15s TTL per symbol batch).
- **Error Handling:** If the API fails (rate limit, network, etc.), the UI shows a clear error message and a disclaimer about unofficial APIs. No silent failures.
- **Charts:** I used recharts for the area chart, with theme tokens for color. The chart is minimal, with a premium tooltip and legend, and adapts to the selected theme.
- **Accessibility:** All interactive elements use ARIA roles and are keyboard/screen reader friendly.

### **Pragmatic Choices (Time Constraints)**

- Due to time constraints, I focused on the core dashboard experience and left out advanced features like export, drag-and-drop, or persistent backend.
- Google Finance data is mocked, as scraping or unofficial APIs are unreliable and not required for the assessment.
- The code is clean, modular, and ready for extension (e.g., more charts, export, auth) if needed.

### **How the Dashboard is Constructed**

- The main dashboard page (`page.tsx`) handles polling, error handling, and layout.
- All UI is built with shadcn/ui components for consistency and polish.
- The table, cards, and chart are all theme-aware and use rupee formatting for Indian context.
- The landing page (`/`) is a minimal, shadcn-style intro with a “Go to Dashboard” button.

---

## 📝 Author

Satvik Katoch

---

> Built for the Octa Byte AI Full Stack Technical Assessment
