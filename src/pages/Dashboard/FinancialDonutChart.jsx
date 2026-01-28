import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#34d399", "#38bdf8", "#fb7185"];

const FinancialDonutChart = ({
  totals = { ganhos: 0, lucros: 0, despesas: 0 },
}) => {
  const realData = [
    { name: "Ganhos", value: totals.ganhos || 0 },
    { name: "Lucros", value: totals.lucros || 0 },
    { name: "Despesas", value: totals.despesas || 0 },
  ];

  const hasData = realData.some((d) => d.value > 0);

  // Se não tiver dados, usa um único slice “placeholder”
  const chartData = hasData
    ? realData
    : [{ name: "Sem dados", value: 1 }];

  return (
    <div className="w-full h-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={hasData ? 4 : 0}
            label={
              hasData
                ? ({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                : undefined
            }
          >
            {hasData
              ? chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))
              : // placeholder cinza claro só pra formar o círculo
                chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#1f2937" />
                ))}
          </Pie>

          {hasData && (
            <>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                }}
                formatter={(value) => `${Number(value).toLocaleString()} MT`}
              />
              <Legend />
            </>
          )}
        </PieChart>
      </ResponsiveContainer>

      {!hasData && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-slate-400">
          Sem dados ainda. Donut ilustrativo.
        </div>
      )}
    </div>
  );
};

export default FinancialDonutChart;
