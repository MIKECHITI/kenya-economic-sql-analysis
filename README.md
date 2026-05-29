# 🇰🇪 Kenya's Economic Journey — SQL Analysis Portfolio

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-SQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Recharts](https://img.shields.io/badge/Recharts-2.x-FF6B6B?style=for-the-badge)](https://recharts.org)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Author](https://img.shields.io/badge/Author-Michael%20Mwombe-c85a17?style=for-the-badge&logo=github)](https://github.com/MIKECHITI)

> An interactive data storytelling portfolio built with React + TypeScript, visualising **15 advanced SQL queries** on Kenya's macroeconomic indicators (2000–2023) sourced from the World Bank.

**[🔗 Live Site](#)** · **[📊 SQL Analysis Repo](https://github.com/MIKECHITI/kenya-economic-sql-analysis)** · **[👤 Portfolio](https://mwombemichael.vercel.app)**

---

## 📸 Screenshots

### Hero — Landing Section
![Hero section showing Kenya's Economic Journey title over a background image with navigation and CTA buttons](screenshots/01-hero.jpg)

### Key Findings
![Four finding cards: Chronic Trade Deficit, 6 Stagflation Years, Rising Per Capita Income, Boom-Bust Growth Pattern](screenshots/02-findings.jpg)

### Economic Overview Chart
![Dual-line Recharts graph showing GDP Growth vs Inflation from 2000 to 2023 with interactive tooltip](screenshots/03-overview-chart.jpg)

### 15 SQL Queries Grid
![Filterable grid of all 15 SQL query cards with category badges, expandable charts, and SQL toggle](screenshots/04-queries-grid.jpg)

### Methodology Section
![Methodology section with data source description, composite score formula, and four stat boxes](screenshots/05-methodology.jpg)

---

## ✨ Features

- **Interactive query cards** — click any of the 15 cards to expand a live Recharts visualisation
- **SQL toggle** — reveal the formatted PostgreSQL query for each analysis inline
- **Category filter** — filter queries by type: Aggregation, Window Function, CTE, Stagflation, Trade Analysis, Executive Summary
- **Economic Overview chart** — full-width dual-line chart of GDP growth vs inflation across 24 years
- **Key Findings strip** — 4 data-driven insight cards computed live from the dataset
- **Dark / Light mode** — switchable via the navbar toggle, persisted to localStorage
- **Sticky navbar** — frosted glass on scroll with smooth section anchors
- **Fully responsive** — mobile-first layout, hamburger menu on small screens
- **Framer Motion** — staggered entrance animations and smooth card expand/collapse

---

## 📊 The Analysis

15 SQL queries covering the full spectrum of advanced PostgreSQL techniques:

| # | Query | Technique |
|---|---|---|
| 01 | Average GDP Growth per Decade | `GROUP BY`, `AVG`, `FLOOR` |
| 02 | Inflation Rate Extremes | `ORDER BY`, `LIMIT` |
| 03 | Year-over-Year GDP Change | `LAG()` window function |
| 04 | GDP per Capita Ranking | `RANK()` window function |
| 05 | Running Total of Exports | `SUM() OVER` window function |
| 06 | Fastest Growing Indicator (2010–2023) | CTE + `UNION ALL` + `FILTER` |
| 07 | Unemployment vs GDP Growth | `AVG` aggregation |
| 08 | Best 5-Year Economic Period | CTE + composite scoring |
| 09 | Population Growth Rate Trend | `LAG()` + percentage change |
| 10 | % Years Above Average GDP Growth | CTE + subquery + `CASE` |
| 11 | 3-Year Moving Average of Inflation | `AVG() OVER ROWS BETWEEN` |
| 12 | GDP Growth vs Government Expenditure | Multi-column comparison |
| 13 | Stagflation Signal Years | CTE + cross-join filter |
| 14 | Exports to Imports Ratio | `CASE WHEN` ratio |
| 15 | Top 3 Best & Worst Economic Years | CTE + `UNION ALL` + composite score |

---

## 🔑 Key Findings

| Finding | Detail |
|---|---|
| 🌍 **Chronic Trade Deficit** | Export/import ratio never exceeded 0.70 across 24 years |
| ⚠️ **6 Stagflation Years** | 2000, 2003, 2004, 2008, 2009, 2012 — each driven by an external shock |
| 📈 **Rising Per Capita Income** | GDP per capita grew from $404 (2000) to $1,580 (2023) — nearly 4× |
| 🎯 **Boom-Bust Pattern** | Only 15 of 24 years exceed the 4.7% mean growth average |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript 5.6 |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS v4 |
| **Charts** | Recharts 2.x |
| **Animations** | Framer Motion |
| **UI Components** | shadcn/ui + Radix UI |
| **Routing** | Wouter |
| **Database** | PostgreSQL (analysis) |
| **Fonts** | Merriweather + Lato + IBM Plex Mono |

---

## 📁 Project Structure

```
kenya-portfolio/
├── client/
│   └── src/
│       ├── pages/
│       │   └── Home.tsx          # Main page — all 15 queries, charts, sections
│       ├── contexts/
│       │   └── ThemeContext.tsx   # Dark/light mode
│       ├── components/ui/        # shadcn/ui components
│       └── index.css             # Tailwind + theme tokens
├── server/
│   └── index.ts                  # Express dev server
├── screenshots/                  # Portfolio screenshots
└── shared/
    └── const.ts
```

---

## 🚀 Running Locally

```bash
# Clone the repo
git clone https://github.com/MIKECHITI/kenya-economic-sql-analysis-portfolio.git
cd kenya-economic-sql-analysis-portfolio

# Install dependencies
npm install --legacy-peer-deps

# Start dev server
npm run dev
```

Open `http://localhost:3000`

---

## 🔗 Related

- **[SQL Analysis Repo](https://github.com/MIKECHITI/kenya-economic-sql-analysis)** — the full PostgreSQL query file, dataset CSV, and findings README
- **[Portfolio](https://mwombemichael.vercel.app)** — main portfolio site

---

## 👤 Author

**Michael Mwombe** — Data Analyst & Full-Stack Developer | Nairobi, Kenya 🇰🇪

[![GitHub](https://img.shields.io/badge/GitHub-MIKECHITI-181717?style=flat-square&logo=github)](https://github.com/MIKECHITI)
[![Portfolio](https://img.shields.io/badge/Portfolio-mwombemichael.vercel.app-c85a17?style=flat-square)](https://mwombemichael.vercel.app)
[![Twitter](https://img.shields.io/badge/Twitter-@chiti__ke-1DA1F2?style=flat-square&logo=x)](https://x.com/chiti_ke)

---

## 📄 License

MIT License — free to use and adapt with attribution.

---

<p align="center"><b>⭐ Star this repo if you found it useful!</b></p>
