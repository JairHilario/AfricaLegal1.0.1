import {
  LineChart,
  BarChart,
  AreaChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useMemo, useState } from "react";

const chartColors = {
  ganhos: "#16a34a",
  lucros: "#0284c7",
  despesas: "#ea580c",
};

const chartTypeOptions = [
  { id: "line", label: "Linha" },
  { id: "bar", label: "Barras" },
  { id: "area", label: "Área" },
];

const seriesMeta = [
  { key: "ganhos", label: "Ganhos", color: chartColors.ganhos },
  { key: "lucros", label: "Lucros", color: chartColors.lucros },
  { key: "despesas", label: "Despesas", color: chartColors.despesas },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "MZN",
    maximumFractionDigits: 2,
  }).format(value);

const formatCompact = (value) =>
  new Intl.NumberFormat("pt-PT", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

const FinancialChart = ({ data = [], xKey = "mes" }) => {
  const [chartType, setChartType] = useState("line");
  const [visible, setVisible] = useState({
    ganhos: true,
    lucros: true,
    despesas: true,
  });

  const hasData = data && data.length > 0;

  const ChartComponent = useMemo(
    () =>
      ({
        line: LineChart,
        bar: BarChart,
        area: AreaChart,
      }[chartType] || LineChart),
    [chartType]
  );

  const toggleSeries = (key) => {
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderSeries = (type, key, label, color) => {
    if (!visible[key]) return null;

    const commonProps = {
      dataKey: key,
      name: label,
      stroke: color,
      fill: color + "33",
      strokeWidth: 2,
      dot: { r: 3 },
      activeDot: { r: 5 },
      isAnimationActive: true,
      animationDuration: 500,
    };

    if (type === "bar") return <Bar {...commonProps} />;
    if (type === "area") return <Area {...commonProps} type="monotone" />;
    return <Line {...commonProps} type="monotone" />;
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* Controles */}
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Visualização:</span>
          {chartTypeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setChartType(opt.id)}
              aria-label={`Alternar visualização para ${opt.label}`}
              title={`Visualizar como ${opt.label}`}
              className={`rounded px-2 py-1 transition ${
                chartType === opt.id
                  ? "bg-sky-500 text-white shadow-sm"
                  : "bg-slate-800 text-slate-200 hover:bg-slate-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex flex-wrap gap-2">
          {seriesMeta.map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => toggleSeries(key)}
              aria-pressed={visible[key]}
              className={`flex items-center gap-1 rounded px-2 py-1 text-[11px] transition border ${
                visible[key]
                  ? "bg-slate-800 text-slate-100 border-slate-600"
                  : "bg-slate-900 text-slate-500 border-slate-700"
              }`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              {visible[key] ? label : `Mostrar ${label}`}
            </button>
          ))}
        </div>
      </div>

      {/* Gráfico */}
      <div className="relative flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent
            data={hasData ? data : []}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1f293333" />
            <XAxis
              dataKey={xKey}
              stroke="#9ca3af"
              tick={{ fontSize: 11 }}
              tickMargin={6}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fontSize: 11 }}
              tickFormatter={formatCompact}
            />
            <Tooltip
              formatter={(value, name) => [
                formatCurrency(value),
                seriesMeta.find((s) => s.key === name)?.label || name,
              ]}
              labelFormatter={(label) => `Mês: ${label}`}
              labelStyle={{ color: "#e5e7eb", fontSize: 11 }}
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid #4b5563",
                borderRadius: 6,
                padding: 8,
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11 }}
              formatter={(value) => (
                <span className="text-slate-200">{value}</span>
              )}
            />
            {hasData &&
              seriesMeta.map(({ key, label, color }) =>
                renderSeries(chartType, key, label, color)
              )}
          </ChartComponent>
        </ResponsiveContainer>

        {!hasData && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-sm text-slate-500">
            <svg
              className="mb-2 h-8 w-8 text-slate-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17v-6h6v6m2 4H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-center leading-tight">
              Sem dados disponíveis no momento.
              <br />
              Adicione vendas ou recibos para visualizar o gráfico.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialChart;