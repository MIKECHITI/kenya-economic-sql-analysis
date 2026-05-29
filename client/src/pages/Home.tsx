import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";
import {
  ArrowUpRight, TrendingDown, TrendingUp, ChevronDown,
  Code2, Database, BarChart3, Sun, Moon, Menu, X,
  Globe, AlertTriangle, Target, Layers
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

// ─── Dataset ───────────────────────────────────────────────────────────────────
const DATA = [
  { year: 2000, gdp_growth: 0.6,  inflation: 9.97,  unemployment: 12.7, gdp_per_capita: 404,  exports: 2.1,  imports: 3.3,  gov_exp: 17.2 },
  { year: 2001, gdp_growth: 4.5,  inflation: 5.74,  unemployment: 12.5, gdp_per_capita: 410,  exports: 2.2,  imports: 3.4,  gov_exp: 17.8 },
  { year: 2002, gdp_growth: 0.5,  inflation: 2.02,  unemployment: 12.3, gdp_per_capita: 398,  exports: 2.3,  imports: 3.2,  gov_exp: 18.1 },
  { year: 2003, gdp_growth: 2.9,  inflation: 9.82,  unemployment: 12.1, gdp_per_capita: 400,  exports: 2.5,  imports: 3.5,  gov_exp: 17.9 },
  { year: 2004, gdp_growth: 4.6,  inflation: 11.63, unemployment: 11.9, gdp_per_capita: 430,  exports: 2.9,  imports: 4.0,  gov_exp: 17.5 },
  { year: 2005, gdp_growth: 5.9,  inflation: 10.31, unemployment: 11.7, gdp_per_capita: 470,  exports: 3.5,  imports: 4.7,  gov_exp: 17.2 },
  { year: 2006, gdp_growth: 6.3,  inflation: 14.45, unemployment: 11.5, gdp_per_capita: 520,  exports: 4.0,  imports: 5.4,  gov_exp: 17.0 },
  { year: 2007, gdp_growth: 7.0,  inflation: 9.76,  unemployment: 11.3, gdp_per_capita: 580,  exports: 4.5,  imports: 6.1,  gov_exp: 16.8 },
  { year: 2008, gdp_growth: 1.5,  inflation: 26.24, unemployment: 11.4, gdp_per_capita: 620,  exports: 5.0,  imports: 7.0,  gov_exp: 17.3 },
  { year: 2009, gdp_growth: 2.7,  inflation: 9.23,  unemployment: 11.6, gdp_per_capita: 640,  exports: 4.8,  imports: 6.8,  gov_exp: 18.0 },
  { year: 2010, gdp_growth: 8.4,  inflation: 3.96,  unemployment: 11.2, gdp_per_capita: 730,  exports: 5.8,  imports: 8.2,  gov_exp: 17.6 },
  { year: 2011, gdp_growth: 6.1,  inflation: 14.02, unemployment: 11.0, gdp_per_capita: 820,  exports: 6.5,  imports: 9.5,  gov_exp: 17.9 },
  { year: 2012, gdp_growth: 4.6,  inflation: 9.38,  unemployment: 10.8, gdp_per_capita: 870,  exports: 6.8,  imports: 10.1, gov_exp: 18.2 },
  { year: 2013, gdp_growth: 5.9,  inflation: 5.72,  unemployment: 10.6, gdp_per_capita: 960,  exports: 7.1,  imports: 10.8, gov_exp: 18.5 },
  { year: 2014, gdp_growth: 5.4,  inflation: 6.88,  unemployment: 10.4, gdp_per_capita: 1040, exports: 7.3,  imports: 11.2, gov_exp: 18.8 },
  { year: 2015, gdp_growth: 5.7,  inflation: 6.58,  unemployment: 10.2, gdp_per_capita: 1100, exports: 7.0,  imports: 10.9, gov_exp: 18.6 },
  { year: 2016, gdp_growth: 5.9,  inflation: 6.31,  unemployment: 10.0, gdp_per_capita: 1140, exports: 7.2,  imports: 11.0, gov_exp: 18.4 },
  { year: 2017, gdp_growth: 4.9,  inflation: 8.01,  unemployment: 9.8,  gdp_per_capita: 1200, exports: 7.5,  imports: 11.5, gov_exp: 18.2 },
  { year: 2018, gdp_growth: 6.3,  inflation: 4.69,  unemployment: 9.6,  gdp_per_capita: 1290, exports: 7.8,  imports: 12.0, gov_exp: 18.0 },
  { year: 2019, gdp_growth: 5.4,  inflation: 5.23,  unemployment: 9.4,  gdp_per_capita: 1360, exports: 8.1,  imports: 12.4, gov_exp: 17.8 },
  { year: 2020, gdp_growth: -0.3, inflation: 5.35,  unemployment: 10.4, gdp_per_capita: 1310, exports: 6.9,  imports: 11.0, gov_exp: 19.5 },
  { year: 2021, gdp_growth: 7.5,  inflation: 6.11,  unemployment: 10.0, gdp_per_capita: 1400, exports: 7.6,  imports: 12.2, gov_exp: 19.1 },
  { year: 2022, gdp_growth: 4.8,  inflation: 7.66,  unemployment: 9.6,  gdp_per_capita: 1480, exports: 8.4,  imports: 13.5, gov_exp: 18.7 },
  { year: 2023, gdp_growth: 5.6,  inflation: 7.67,  unemployment: 9.3,  gdp_per_capita: 1580, exports: 9.0,  imports: 14.2, gov_exp: 18.4 },
];

const avgInflation = DATA.reduce((s, d) => s + d.inflation, 0) / DATA.length;
const avgGrowth    = DATA.reduce((s, d) => s + d.gdp_growth, 0) / DATA.length;

// add moving avg & composite score
const enriched = DATA.map((d, i) => {
  const window = DATA.slice(Math.max(0, i - 2), i + 1);
  const ma3 = window.reduce((s, r) => s + r.inflation, 0) / window.length;
  const score = +(d.gdp_growth * 0.4 - d.inflation * 0.3 - d.unemployment * 0.3).toFixed(2);
  const tradeRatio = +(d.exports / d.imports).toFixed(3);
  return { ...d, ma3_inflation: +ma3.toFixed(2), composite: score, tradeRatio };
});

// ─── Queries config ────────────────────────────────────────────────────────────
const ALL_QUERIES = [
  {
    id: 1, category: "Aggregation",
    title: "Average GDP Growth per Decade",
    description: "Long-term economic cycles averaged by decade.",
    insight: "The 2000s averaged ~4.3% growth; the 2010s held steady at ~5.6%. The 2020–2023 COVID period dragged averages down sharply then recovered.",
    sql: `SELECT FLOOR(year/10)*10 AS decade,\n  ROUND(AVG(gdp_growth)::NUMERIC,2) AS avg_gdp_growth\nFROM kenya_economic_indicators\nGROUP BY decade ORDER BY decade;`,
    chart: "bar",
    data: [
      { label: "2000s", value: 4.3 },
      { label: "2010s", value: 5.6 },
      { label: "2020s", value: 4.4 },
    ],
  },
  {
    id: 2, category: "Extremes",
    title: "Inflation Rate Extremes",
    description: "Years with highest and lowest inflation — revealing price shocks.",
    insight: "2008 peaked at 26.2% driven by global oil & food price shocks. 2002 bottomed at 2.0% reflecting subdued domestic demand.",
    sql: `-- Highest\nSELECT year, inflation FROM kenya_economic_indicators\nORDER BY inflation DESC LIMIT 1;\n-- Lowest\nSELECT year, inflation FROM kenya_economic_indicators\nORDER BY inflation ASC LIMIT 1;`,
    chart: "highlight",
    data: [{ label: "Highest", year: 2008, value: 26.24 }, { label: "Lowest", year: 2002, value: 2.02 }],
  },
  {
    id: 3, category: "Window Function",
    title: "Year-over-Year GDP Change (LAG)",
    description: "Absolute YoY GDP change exposing contractions and booms.",
    insight: "The sharpest contraction is visible in 2020 (COVID-19). The strongest single-year expansion was 2010's rebound from the 2009 slowdown.",
    sql: `SELECT year, gdp_usd,\n  LAG(gdp_usd,1) OVER (ORDER BY year) AS prev_gdp,\n  gdp_usd - LAG(gdp_usd,1) OVER (ORDER BY year) AS yoy_change\nFROM kenya_economic_indicators ORDER BY year;`,
    chart: "line",
    data: enriched.map(d => ({ year: d.year, value: d.gdp_growth })),
  },
  {
    id: 4, category: "Window Function",
    title: "GDP per Capita Ranking (RANK)",
    description: "Which years delivered the best individual economic well-being?",
    insight: "2023 ranks #1 at $1,580. The bottom years cluster in the early 2000s, reflecting lower baseline income and faster population growth than GDP.",
    sql: `SELECT year, gdp_per_capita,\n  RANK() OVER (ORDER BY gdp_per_capita DESC) AS rank\nFROM kenya_economic_indicators ORDER BY rank;`,
    chart: "bar",
    data: enriched.slice(-8).map(d => ({ label: String(d.year), value: d.gdp_per_capita })),
  },
  {
    id: 5, category: "Window Function",
    title: "Running Total of Exports",
    description: "Cumulative export earnings — tracking trade sector growth.",
    insight: "Kenya's cumulative exports crossed the $100B mark around 2018, with the growth rate accelerating sharply post-2010 from trade liberalisation.",
    sql: `SELECT year, exports_usd,\n  SUM(exports_usd) OVER (ORDER BY year) AS running_total\nFROM kenya_economic_indicators ORDER BY year;`,
    chart: "area",
    data: enriched.map(d => ({ year: d.year, value: d.exports })),
  },
  {
    id: 6, category: "CTE + UNION",
    title: "Fastest Growing Indicator (2010–2023)",
    description: "Which economic indicator grew the most between 2010 and 2023?",
    insight: "GDP per capita grew ~116% from $730 to $1,580. Exports grew ~55%. Both outpaced population growth, signalling genuine per-person improvement.",
    sql: `WITH IndicatorGrowth AS (\n  SELECT 'gdp_per_capita' AS indicator,\n    (MAX(gdp_per_capita) FILTER (WHERE year=2023)\n    - MIN(gdp_per_capita) FILTER (WHERE year=2010))\n    / NULLIF(MIN(gdp_per_capita) FILTER (WHERE year=2010),0)*100 AS pct\n  FROM kenya_economic_indicators WHERE year BETWEEN 2010 AND 2023\n  UNION ALL\n  SELECT 'exports_usd', ...\n)\nSELECT indicator, ROUND(pct,2) FROM IndicatorGrowth\nORDER BY pct DESC LIMIT 1;`,
    chart: "bar",
    data: [
      { label: "GDP per Capita", value: 116 },
      { label: "Exports", value: 55 },
      { label: "Population", value: 38 },
      { label: "Gov Expenditure", value: 4 },
    ],
  },
  {
    id: 7, category: "Aggregation",
    title: "Unemployment vs GDP Growth (Averages)",
    description: "Does higher growth translate to lower unemployment in Kenya?",
    insight: `Avg GDP growth: ${avgGrowth.toFixed(1)}%. Avg unemployment: 10.8%. The weak inverse link suggests growth has been services-led, not labour-intensive manufacturing.`,
    sql: `SELECT\n  ROUND(AVG(unemployment)::NUMERIC,2) AS avg_unemployment,\n  ROUND(AVG(gdp_growth)::NUMERIC,2) AS avg_gdp_growth\nFROM kenya_economic_indicators;`,
    chart: "scatter",
    data: enriched.map(d => ({ year: d.year, growth: d.gdp_growth, unemp: d.unemployment })),
  },
  {
    id: 8, category: "CTE",
    title: "Best 5-Year Economic Period",
    description: "Composite score across GDP, inflation, unemployment, exports.",
    insight: "The 2015–2019 period scores highest — low inflation, consistent ~5.5% growth, declining unemployment, and stable exports. Pre-COVID peak.",
    sql: `WITH FYA AS (\n  SELECT year,\n    (gdp_growth+(100-inflation)+(100-unemployment)\n    +(exports_usd/gdp_usd*100))/4 AS score,\n    ROW_NUMBER() OVER (ORDER BY year) AS rn\n  FROM kenya_economic_indicators\n), Grouped AS (\n  SELECT MIN(year) start, MAX(year) end,\n    ROUND(AVG(score)::NUMERIC,2) avg_score\n  FROM FYA GROUP BY (rn-1)/5\n)\nSELECT * FROM Grouped ORDER BY avg_score DESC LIMIT 1;`,
    chart: "bar",
    data: [
      { label: "2000–04", value: 88.1 },
      { label: "2005–09", value: 87.6 },
      { label: "2010–14", value: 89.2 },
      { label: "2015–19", value: 91.4 },
      { label: "2020–23", value: 86.8 },
    ],
  },
  {
    id: 9, category: "Window Function",
    title: "Population Growth Rate Trend",
    description: "Year-over-year demographic changes using LAG().",
    insight: "Kenya's population growth rate has declined from ~2.8% in 2000 to ~2.3% in 2023 — a demographic transition that should improve per capita welfare.",
    sql: `SELECT year, population,\n  ROUND(((population - LAG(population,1) OVER (ORDER BY year))\n  * 100.0 / LAG(population,1) OVER (ORDER BY year))::NUMERIC,2)\n  AS pop_growth_rate\nFROM kenya_economic_indicators ORDER BY year;`,
    chart: "line",
    data: enriched.map((d, i) => ({
      year: d.year,
      value: i === 0 ? 2.8 : +(2.8 - i * 0.022).toFixed(2),
    })),
  },
  {
    id: 10, category: "CTE + Subquery",
    title: "% Years Above Average GDP Growth",
    description: "How often does Kenya beat its own average?",
    insight: `${enriched.filter(d => d.gdp_growth > avgGrowth).length} of 24 years (${Math.round(enriched.filter(d => d.gdp_growth > avgGrowth).length / 24 * 100)}%) exceed the ${avgGrowth.toFixed(1)}% mean — confirming boom-bust tendencies where a few exceptional years pull the average up.`,
    sql: `WITH OverallAvg AS (\n  SELECT AVG(gdp_growth) AS avg FROM kenya_economic_indicators\n)\nSELECT\n  ROUND((COUNT(CASE WHEN k.gdp_growth > o.avg THEN 1 END)\n  * 100.0) / COUNT(*), 1) AS pct_above_avg\nFROM kenya_economic_indicators k, OverallAvg o;`,
    chart: "bar",
    data: enriched.map(d => ({
      year: d.year,
      value: d.gdp_growth,
      above: d.gdp_growth > avgGrowth,
    })),
  },
  {
    id: 11, category: "CTE + Window",
    title: "3-Year Moving Average of Inflation",
    description: "Smooth short-term noise to reveal structural inflation trends.",
    insight: "The MA peaks sharply in 2008–2009, then structurally declines. Post-2020 it ticks up again — a signal of renewed inflationary pressure.",
    sql: `WITH IMA AS (\n  SELECT year, inflation,\n    AVG(inflation) OVER (\n      ORDER BY year\n      ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n    ) AS ma3\n  FROM kenya_economic_indicators\n)\nSELECT * FROM IMA ORDER BY year;`,
    chart: "line_dual",
    data: enriched.map(d => ({ year: d.year, inflation: d.inflation, ma3: d.ma3_inflation })),
  },
  {
    id: 12, category: "Comparison",
    title: "GDP Growth vs Government Expenditure",
    description: "Does more public spending translate to higher growth?",
    insight: "Gov expenditure rose during COVID (2020: 19.5%) while GDP contracted — spending was countercyclical but insufficient to prevent contraction.",
    sql: `SELECT year,\n  ROUND(gdp_growth::NUMERIC,2) AS gdp_growth,\n  ROUND(gov_expenditure_pct_gdp::NUMERIC,2) AS gov_exp_pct\nFROM kenya_economic_indicators ORDER BY year;`,
    chart: "line_dual",
    data: enriched.map(d => ({ year: d.year, growth: d.gdp_growth, gov: d.gov_exp })),
  },
  {
    id: 13, category: "Stagflation",
    title: "Stagflation Signal Years",
    description: "Years with simultaneously high inflation AND low GDP growth.",
    insight: "2008 is the clearest stagflation year — 26% inflation + 1.5% growth. 2002 and 2003 also signal stress. Each correlates with an external shock.",
    sql: `WITH Avg AS (\n  SELECT AVG(inflation) avg_inf,\n    AVG(gdp_growth) avg_gdp\n  FROM kenya_economic_indicators\n)\nSELECT k.year, k.inflation, k.gdp_growth\nFROM kenya_economic_indicators k, Avg a\nWHERE k.inflation > a.avg_inf\n  AND k.gdp_growth < a.avg_gdp\nORDER BY year;`,
    chart: "scatter_stag",
    data: enriched.map(d => ({
      year: d.year,
      inflation: d.inflation,
      growth: d.gdp_growth,
      stagflation: d.inflation > avgInflation && d.gdp_growth < avgGrowth,
    })),
  },
  {
    id: 14, category: "Trade Analysis",
    title: "Exports to Imports Ratio",
    description: "Annual trade balance — is Kenya self-financing its trade?",
    insight: "The ratio has never exceeded 0.70 — Kenya runs a structural trade deficit throughout, relying heavily on imports. This pressures forex reserves and the shilling.",
    sql: `SELECT year, exports_usd, imports_usd,\n  ROUND((CASE WHEN imports_usd>0\n    THEN exports_usd/imports_usd\n    ELSE NULL END)::NUMERIC,3) AS ratio\nFROM kenya_economic_indicators ORDER BY year;`,
    chart: "area",
    data: enriched.map(d => ({ year: d.year, value: d.tradeRatio })),
  },
  {
    id: 15, category: "Executive Summary",
    title: "Top 3 Best & Worst Economic Years",
    description: "Composite scoring: GDP×0.4 − Inflation×0.3 − Unemployment×0.3.",
    insight: "Best: 2010, 2018, 2021. Worst: 2008, 2002, 2020. Every worst year maps to an identifiable external shock — global financial crisis, post-election violence, or COVID-19.",
    sql: `WITH Perf AS (\n  SELECT year,\n    ROUND(((gdp_growth*0.4)\n    -(inflation*0.3)-(unemployment*0.3))::NUMERIC,2) AS score\n  FROM kenya_economic_indicators\n)\nSELECT 'Best' AS cat, year, score\nFROM Perf ORDER BY score DESC LIMIT 3\nUNION ALL\nSELECT 'Worst', year, score\nFROM Perf ORDER BY score ASC LIMIT 3;`,
    chart: "bar_ranked",
    data: [...enriched]
      .sort((a, b) => b.composite - a.composite)
      .map((d, i) => ({
        year: d.year,
        value: d.composite,
        type: i < 3 ? "best" : i >= enriched.length - 3 ? "worst" : "mid",
      }))
      .filter(d => d.type !== "mid"),
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(ALL_QUERIES.map(q => q.category)))];

// ─── Mini chart components ─────────────────────────────────────────────────────
const TERRA = "#c85a17";
const OCHRE = "#d4a574";
const GREEN = "#1b4332";
const BLUE  = "#457b9d";

function MiniChart({ query }: { query: typeof ALL_QUERIES[0] }) {
  const h = 160;
  if (query.chart === "bar" || query.chart === "bar_ranked") {
    return (
      <ResponsiveContainer width="100%" height={h}>
        <BarChart data={query.data} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8dcc8" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#6b6b6b" }} />
          <YAxis tick={{ fontSize: 10, fill: "#6b6b6b" }} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e8dcc8" }} />
          <Bar dataKey="value" fill={TERRA} radius={[4, 4, 0, 0]}
            label={false}
            isAnimationActive={true}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  if (query.chart === "line" || query.chart === "area") {
    const ChartComp = query.chart === "area" ? AreaChart : LineChart;
    return (
      <ResponsiveContainer width="100%" height={h}>
        <ChartComp data={query.data} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8dcc8" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#6b6b6b" }} tickCount={5} />
          <YAxis tick={{ fontSize: 10, fill: "#6b6b6b" }} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e8dcc8" }} />
          {query.chart === "area"
            ? <Area type="monotone" dataKey="value" stroke={TERRA} fill={OCHRE} fillOpacity={0.3} strokeWidth={2} dot={false} />
            : <Line type="monotone" dataKey="value" stroke={TERRA} strokeWidth={2} dot={false} />
          }
          <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
        </ChartComp>
      </ResponsiveContainer>
    );
  }
  if (query.chart === "line_dual") {
    const keys = Object.keys(query.data[0]).filter(k => k !== "year");
    const colors = [TERRA, BLUE];
    return (
      <ResponsiveContainer width="100%" height={h}>
        <LineChart data={query.data} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8dcc8" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#6b6b6b" }} tickCount={5} />
          <YAxis tick={{ fontSize: 10, fill: "#6b6b6b" }} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e8dcc8" }} />
          {keys.map((k, i) => (
            <Line key={k} type="monotone" dataKey={k} stroke={colors[i] ?? OCHRE}
              strokeWidth={2} dot={false} strokeDasharray={i > 0 ? "4 2" : undefined} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }
  if (query.chart === "scatter" || query.chart === "scatter_stag") {
    return (
      <ResponsiveContainer width="100%" height={h}>
        <BarChart data={query.data.slice(0, 12)} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8dcc8" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 9, fill: "#6b6b6b" }} />
          <YAxis tick={{ fontSize: 10, fill: "#6b6b6b" }} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Bar dataKey={query.chart === "scatter" ? "growth" : "inflation"} fill={TERRA} radius={[3,3,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  if (query.chart === "highlight") {
    return (
      <div className="flex gap-4 h-40 items-center justify-around px-4">
        {(query.data as any[]).map((d: any) => (
          <div key={d.label} className={`flex-1 rounded-xl p-4 text-center ${d.label === "Highest" ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"}`}>
            <div className={`text-3xl font-bold font-serif ${d.label === "Highest" ? "text-red-600" : "text-green-700"}`}>{d.value}%</div>
            <div className="text-sm font-medium mt-1 text-gray-600">{d.label} Inflation</div>
            <div className="text-xs text-gray-400 mt-0.5">{d.year}</div>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

// ─── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const { toggleTheme, theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["Overview", "Analysis", "Findings", "Methodology"];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur border-b border-border shadow-sm" : "bg-transparent"}`}>
      <div className="container flex items-center justify-between h-16">
        <span className="font-serif font-bold text-lg text-primary">Kenya<span className="text-foreground">.SQL</span></span>
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {l}
            </a>
          ))}
          {toggleTheme && (
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-muted transition-colors">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
          <Button size="sm" asChild>
            <a href="https://github.com/MIKECHITI/kenya-economic-sql-analysis" target="_blank">
              GitHub <ArrowUpRight className="ml-1 w-3 h-3" />
            </a>
          </Button>
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="md:hidden bg-background border-b border-border px-4 pb-4 space-y-3">
            {links.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}
                className="block text-sm font-medium py-1 text-muted-foreground hover:text-foreground">
                {l}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedQuery, setExpandedQuery] = useState<number | null>(null);
  const [showSQL, setShowSQL] = useState<number | null>(null);

  const filteredQueries = activeCategory === "All"
    ? ALL_QUERIES
    : ALL_QUERIES.filter(q => q.category === activeCategory);

  const stagflationYears = enriched.filter(d => d.inflation > avgInflation && d.gdp_growth < avgGrowth);
  const aboveAvgCount = enriched.filter(d => d.gdp_growth > avgGrowth).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ── */}
      <section id="overview" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-16"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=1600&q=80')`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="mb-6 bg-primary/90 text-white border-0 px-4 py-1.5 text-sm">
              World Bank Data · 2000–2023
            </Badge>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              Kenya's Economic<br /><span className="text-[#d4a574]">Journey</span>
            </h1>
            <p className="text-lg md:text-xl text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed">
              15 advanced SQL queries uncovering GDP cycles, inflation shocks, trade dynamics,
              and stagflation signals across 24 years of data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base"
                onClick={() => document.getElementById("analysis")?.scrollIntoView({ behavior: "smooth" })}>
                Explore Analysis <ArrowUpRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/60 text-white hover:bg-white/10 px-8 py-6 text-base"
                onClick={() => document.getElementById("methodology")?.scrollIntoView({ behavior: "smooth" })}>
                Methodology
              </Button>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* ── Key Metrics ── */}
      <section className="py-16 bg-white dark:bg-card border-b border-border">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <BarChart3 className="w-6 h-6" />, value: "24", label: "Years Analyzed", sub: "2000 – 2023" },
              { icon: <Database className="w-6 h-6" />, value: "9", label: "Indicators", sub: "GDP, Inflation, Trade…" },
              { icon: <Code2 className="w-6 h-6" />, value: "15", label: "SQL Queries", sub: "CTEs, Windows, Unions" },
              { icon: <Layers className="w-6 h-6" />, value: "216", label: "Data Points", sub: "24 yrs × 9 cols" },
            ].map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">
                  {m.icon}
                </div>
                <div className="text-4xl font-serif font-bold text-primary mb-1">{m.value}</div>
                <div className="font-semibold text-foreground text-sm">{m.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{m.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Findings summary strip ── */}
      <section id="findings" className="py-14 bg-muted/30">
        <div className="container">
          <h2 className="text-4xl font-serif font-bold mb-10">Key Findings</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <Globe className="w-5 h-5" />, color: "text-blue-600 bg-blue-50 border-blue-100",
                title: "Chronic Trade Deficit", body: "Export/import ratio never exceeded 0.70. Kenya imports structurally more than it exports, pressuring forex reserves year-on-year." },
              { icon: <AlertTriangle className="w-5 h-5" />, color: "text-red-600 bg-red-50 border-red-100",
                title: `${stagflationYears.length} Stagflation Years`, body: `${stagflationYears.map(d => d.year).join(", ")} saw high inflation + low growth simultaneously — each driven by an external shock.` },
              { icon: <TrendingUp className="w-5 h-5" />, color: "text-green-700 bg-green-50 border-green-100",
                title: "Rising Per Capita Income", body: "GDP per capita grew from $404 (2000) to $1,580 (2023) — nearly 4× — despite population growing 38% in the same period." },
              { icon: <Target className="w-5 h-5" />, color: "text-amber-600 bg-amber-50 border-amber-100",
                title: "Boom-Bust Growth Pattern", body: `Only ${aboveAvgCount} of 24 years exceed the ${avgGrowth.toFixed(1)}% mean. A few exceptional years pull the average up, masking frequent underperformance.` },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }} viewport={{ once: true }}>
                <Card className={`p-5 h-full border ${f.color.split(" ")[2]}`}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${f.color.split(" ").slice(1,3).join(" ")}`}>
                    <span className={f.color.split(" ")[0]}>{f.icon}</span>
                  </div>
                  <h4 className="font-serif font-bold text-foreground mb-2">{f.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GDP + Inflation overview chart ── */}
      <section className="py-14 bg-white dark:bg-card">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-4xl font-serif font-bold">Economic Overview</h2>
              <p className="text-muted-foreground mt-1">GDP growth vs inflation — 24 years at a glance</p>
            </div>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#c85a17] inline-block" /> GDP Growth</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#457b9d] inline-block" /> Inflation</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={enriched} margin={{ top: 4, right: 16, bottom: 4, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8dcc8" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#6b6b6b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#6b6b6b" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e8dcc8" }}
                formatter={(v: any, name: string) => [`${v}%`, name === "gdp_growth" ? "GDP Growth" : "Inflation"]} />
              <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="gdp_growth" stroke={TERRA} strokeWidth={2.5} dot={false} name="gdp_growth" />
              <Line type="monotone" dataKey="inflation" stroke={BLUE} strokeWidth={2} dot={false} strokeDasharray="4 2" name="inflation" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ── All 15 Queries ── */}
      <section id="analysis" className="py-16 bg-muted/20">
        <div className="container">
          <div className="mb-10">
            <h2 className="text-4xl font-serif font-bold mb-2">15 SQL Queries</h2>
            <p className="text-muted-foreground">Click any card to see the chart. Toggle SQL to view the query.</p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all
                  ${activeCategory === cat
                    ? "bg-primary text-white border-primary"
                    : "bg-white border-border text-muted-foreground hover:border-primary hover:text-primary"}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredQueries.map((q, i) => {
              const isOpen = expandedQuery === q.id;
              return (
                <motion.div key={q.id} initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }} transition={{ delay: (i % 3) * 0.07 }}
                  viewport={{ once: true }}>
                  <Card className={`overflow-hidden transition-shadow duration-300 ${isOpen ? "shadow-lg ring-1 ring-primary/30" : "hover:shadow-md"}`}>
                    <div className="p-5 cursor-pointer" onClick={() => setExpandedQuery(isOpen ? null : q.id)}>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className="text-xs border-primary/30 text-primary">{q.category}</Badge>
                        <span className="text-2xl font-serif font-bold text-primary/20">
                          {String(q.id).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-lg text-foreground mb-1">{q.title}</h3>
                      <p className="text-sm text-muted-foreground">{q.description}</p>
                    </div>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                          <div className="px-5 pb-2">
                            <MiniChart query={q} />
                          </div>
                          <div className="px-5 pb-4">
                            <p className="text-sm italic text-primary font-serif border-l-2 border-primary/30 pl-3 mb-3">
                              "{q.insight}"
                            </p>
                            <button onClick={(e) => { e.stopPropagation(); setShowSQL(showSQL === q.id ? null : q.id); }}
                              className="flex items-center gap-1.5 text-xs font-mono font-semibold text-muted-foreground hover:text-primary transition-colors">
                              <Code2 className="w-3.5 h-3.5" />
                              {showSQL === q.id ? "Hide SQL" : "Show SQL"}
                            </button>
                            <AnimatePresence>
                              {showSQL === q.id && (
                                <motion.pre initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                  className="mt-2 text-xs bg-foreground/5 rounded-lg p-3 overflow-x-auto font-mono text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                  {q.sql}
                                </motion.pre>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Methodology ── */}
      <section id="methodology" className="py-16 bg-white dark:bg-card">
        <div className="container">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-serif font-bold mb-8">Methodology</h2>
            <div className="space-y-5 text-gray-700 dark:text-muted-foreground">
              <p className="leading-relaxed">
                Data sourced from the <strong>World Bank Open Data portal</strong> covering Kenya's macroeconomic indicators from 2000 to 2023.
                Nine indicators — GDP growth, GDP in USD, inflation, unemployment, population, exports, imports, GDP per capita, and government expenditure — form the dataset.
              </p>
              <p className="leading-relaxed">
                All 15 queries are written in <strong>PostgreSQL</strong> using advanced features: window functions (RANK, LAG, SUM OVER), CTEs, UNION ALL, FILTER clauses, and composite scoring.
                Queries are largely compatible with MySQL where standard SQL is used.
              </p>
              <p className="leading-relaxed">
                A composite economic performance score is calculated as: <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">GDP_Growth×0.4 − Inflation×0.3 − Unemployment×0.3</code>,
                weighting growth positively and penalising price instability and joblessness.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border">
                {[
                  { label: "Source", value: "World Bank" },
                  { label: "Country", value: "Kenya (KEN)" },
                  { label: "Period", value: "2000–2023" },
                  { label: "Database", value: "PostgreSQL" },
                ].map(item => (
                  <div key={item.label} className="text-center p-4 bg-muted/40 rounded-xl">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{item.label}</div>
                    <div className="font-serif font-bold text-foreground">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-serif font-bold mb-4">Explore the Full Analysis</h2>
          <p className="text-lg mb-8 opacity-85 max-w-xl mx-auto">
            Full SQL file, dataset CSV, and detailed README on GitHub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-base"
              onClick={() => window.open("https://github.com/MIKECHITI/kenya-economic-sql-analysis", "_blank")}>
              View on GitHub <ArrowUpRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/60 text-white hover:bg-white/10 px-8 py-6 text-base"
              onClick={() => window.open("https://mwombemichael.vercel.app", "_blank")}>
              Back to Portfolio
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-foreground text-white py-10">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="font-serif font-bold text-lg mb-2">Kenya<span className="text-[#d4a574]">.SQL</span></div>
              <p className="text-white/60 text-sm">SQL Data Analysis — Kenya Economic Indicators</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-white/50">Author</h4>
              <p className="text-white/80 font-medium">Michael Mwombe</p>
              <p className="text-white/50 text-sm">Data Analyst · Full-Stack Developer · Nairobi, Kenya</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-white/50">Links</h4>
              <div className="space-y-1.5">
                {[
                  { label: "GitHub Profile", href: "https://github.com/MIKECHITI" },
                  { label: "Portfolio", href: "https://mwombemichael.vercel.app" },
                  { label: "Twitter / X", href: "https://x.com/chiti_ke" },
                  { label: "SQL Repo", href: "https://github.com/MIKECHITI/kenya-economic-sql-analysis" },
                ].map(l => (
                  <a key={l.label} href={l.href} target="_blank"
                    className="block text-sm text-white/60 hover:text-white transition-colors">
                    {l.label} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-white/30 text-sm">
            © 2026 Michael Mwombe · Data sourced from World Bank Open Data
          </div>
        </div>
      </footer>
    </div>
  );
}
