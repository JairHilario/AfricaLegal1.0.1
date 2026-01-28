import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from "recharts";

function Analises({ temaAtual = "dark" }) {
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState("ultimos-30d");
  const [dados, setDados] = useState(null);

  const isDark = temaAtual === "dark";

  const gerarDadosFalsos = (periodoAtual) => {
    const base = {
      stats: {
        ganhos: 1250000,
        despesas: 850000,
        lucros: 400000,
        vendas: 45,
        contratosAtivos: 52,
        estoqueCritico: 450000,
      },
      fluxo: [
        { dia: "20/Jan", ganhos: 180000, despesas: 120000, vendas: 7 },
        { dia: "21/Jan", ganhos: 195000, despesas: 135000, vendas: 8 },
        { dia: "22/Jan", ganhos: 210000, despesas: 140000, vendas: 9 },
        { dia: "23/Jan", ganhos: 225000, despesas: 155000, vendas: 7 },
        { dia: "24/Jan", ganhos: 190000, despesas: 125000, vendas: 6 },
      ],
      clientes: [
        { nome: "João Manuel", faturamento: 320000, vendas: 12 },
        { nome: "Maria Fernandes", faturamento: 280000, vendas: 9 },
        { nome: "Pedro Santos", faturamento: 245000, vendas: 11 },
        { nome: "Ana Costa", faturamento: 210000, vendas: 6 },
      ],
      estoque: [
        { categoria: "Crítico (<30d)", valor: 450000, itens: 23 },
        { categoria: "Normal", valor: 1200000, itens: 156 },
        { categoria: "Amplo", valor: 650000, itens: 89 },
      ],
      contasBancarias: [
        { banco: "BPI", saldo: 850000, status: "positivo" },
        { banco: "Millennium", saldo: -120000, status: "negativo" },
        { banco: "Standard", saldo: 450000, status: "positivo" },
        { banco: "Moza Banco", saldo: 280000, status: "positivo" },
      ],
      fluxoClientes: [
        { categoria: "Positivos (Alta)", clientes: 23, vendas: 950000 },
        { categoria: "Negativos", clientes: 8, vendas: 150000 },
        { categoria: "Inativos (0 vendas)", clientes: 15, vendas: 0 },
      ],
      despesasCategoria: [
        { cat: "Logística", valor: 320000 },
        { cat: "Pessoal", valor: 250000 },
        { cat: "Fornecedores", valor: 180000 },
        { cat: "Manutenção", valor: 100000 },
      ],
      contratos: [
        { status: "Ativos", qtd: 45, valor: 2800000 },
        { status: "Expirar (7d)", qtd: 8, valor: 450000 },
        { status: "Expirados", qtd: 3, valor: 120000 },
      ],
      performance: [
        { tipo: "Positivos", valor: 23 },
        { tipo: "Neutros", valor: 45 },
        { tipo: "Negativos", valor: 12 },
      ],
      fornecedores: [
        { nome: "Fazenda Verde", entregas: 15, valor: 420000 },
        { nome: "Indústria Norte", entregas: 12, valor: 380000 },
        { nome: "Logística Sul", entregas: 18, valor: 290000 },
      ],
    };

    if (periodoAtual === "mes-atual") {
      base.stats.ganhos *= 4;
      base.stats.despesas *= 4;
      base.stats.lucros *= 4;
    } else if (periodoAtual === "ano-2026") {
      base.stats.ganhos *= 36;
      base.stats.despesas *= 36;
      base.stats.lucros *= 36;
    }

    return base;
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const gerados = gerarDadosFalsos(periodo);
      setDados(gerados);
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [periodo]);

  if (loading || !dados) {
    return (
      <div
        className={
          isDark
            ? "min-h-[calc(100vh-5rem)] bg-slate-950 flex items-center justify-center p-8"
            : "min-h-[calc(100vh-5rem)] bg-sky-50 flex items-center justify-center p-8"
        }
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p
            className={
              isDark
                ? "text-slate-400 font-mono text-sm"
                : "text-slate-600 font-mono text-sm"
            }
          >
            Gerando dados PostgreSQL...
          </p>
        </div>
      </div>
    );
  }

  const {
    stats,
    fluxo,
    clientes,
    estoque,
    fluxoClientes,
    despesasCategoria,
    contratos,
    performance,
    fornecedores,
  } = dados;

  const pageBg = isDark
    ? "min-h-[calc(100vh-5rem)] bg-slate-950 p-4 md:p-6 text-slate-100 space-y-4"
    : "min-h-[calc(100vh-5rem)] bg-sky-50 p-4 md:p-6 text-slate-900 space-y-4";

  return (
    <div className={pageBg}>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-800/60">
        <div>
          <h1
            className={
              isDark
                ? "text-2xl md:text-3xl font-black bg-gradient-to-r from-white via-emerald-400 to-slate-400 bg-clip-text"
                : "text-2xl md:text-3xl font-black text-slate-900"
            }
          >
            ERP Analytics
          </h1>
          <p className="text-xs font-mono text-emerald-500 uppercase tracking-widest mt-1">
            {periodo === "ultimos-30d"
              ? "Últimos 30 dias"
              : periodo.replace("-", " ")}{" "}
            | Demo
          </p>
        </div>
        <select
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          className={
            isDark
              ? "bg-slate-900/80 border border-white/20 px-4 py-2 rounded-lg text-sm font-mono text-slate-300 focus:border-emerald-500 self-start sm:self-center"
              : "bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-mono text-slate-700 focus:border-emerald-500 self-start sm:self-center"
          }
        >
          <option value="ultimos-30d">30 Dias</option>
          <option value="mes-atual">Mês Atual</option>
          <option value="ano-2026">Ano 2026</option>
        </select>
      </div>

      {/* KPIs PRINCIPAIS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard
          title="Lucro Líquido"
          value={`MT ${stats.lucros.toLocaleString()}`}
          trend="+12%"
          color="emerald"
          isDark={isDark}
        />
        <KpiCard
          title="Vendas"
          value={stats.vendas}
          trend="+8%"
          color="sky"
          isDark={isDark}
        />
        <KpiCard
          title="Contratos Ativos"
          value={contratos[0].qtd}
          trend="+3%"
          color="blue"
          isDark={isDark}
        />
        <KpiCard
          title="Estoque Crítico"
          value={`MT ${stats.estoqueCritico.toLocaleString()}`}
          trend="-5%"
          color="rose"
          isDark={isDark}
        />
        <KpiCard
          title="Contas Negativas"
          value="1"
          trend="⚠️"
          color="orange"
          isDark={isDark}
        />
        <KpiCard
          title="Clientes Positivos"
          value={fluxoClientes[0].clientes}
          trend="+18%"
          color="green"
          isDark={isDark}
        />
      </div>

      {/* 10 GRÁFICOS EM 2 LINHAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <ChartBox title="Financeiro" isDark={isDark}>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={[
                  { value: stats.ganhos, name: "Ganhos" },
                  { value: stats.despesas, name: "Despesas" },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={55}
              >
                <Cell fill="#10b981" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip
                contentStyle={
                  isDark
                    ? { backgroundColor: "#020617", border: "1px solid #1e293b" }
                    : { backgroundColor: "#fff", border: "1px solid #e5e7eb" }
                }
                formatter={(v) => `MT ${Number(v).toLocaleString()}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Contas Bancárias" isDark={isDark}>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={[
                  { value: 1580000, name: "Positivo" },
                  { value: 120000, name: "Negativo" },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={55}
              >
                <Cell fill="#10b981" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip
                contentStyle={
                  isDark
                    ? { backgroundColor: "#020617", border: "1px solid #1e293b" }
                    : { backgroundColor: "#fff", border: "1px solid #e5e7eb" }
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Fluxo Clientes" isDark={isDark}>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={fluxoClientes} layout="vertical">
              <XAxis type="number" hide />
              <YAxis
                dataKey="categoria"
                type="category"
                fontSize={9}
                width={65}
              />
              <Tooltip
                contentStyle={
                  isDark
                    ? { backgroundColor: "#020617", border: "1px solid #1e293b" }
                    : { backgroundColor: "#fff", border: "1px solid #e5e7eb" }
                }
              />
              <Bar dataKey="clientes" fill="#3b82f6" barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Despesas Cat." isDark={isDark}>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={despesasCategoria.slice(0, 3)} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="cat" type="category" fontSize={9} width={65} />
              <Tooltip
                contentStyle={
                  isDark
                    ? { backgroundColor: "#020617", border: "1px solid #1e293b" }
                    : { backgroundColor: "#fff", border: "1px solid #e5e7eb" }
                }
                formatter={(v) => `MT ${Number(v).toLocaleString()}`}
              />
              <Bar dataKey="valor" fill="#f59e0b" barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Contratos" isDark={isDark}>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={contratos}
                dataKey="qtd"
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={55}
              >
                <Cell fill="#10b981" />
                <Cell fill="#f59e0b" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip
                contentStyle={
                  isDark
                    ? { backgroundColor: "#020617", border: "1px solid #1e293b" }
                    : { backgroundColor: "#fff", border: "1px solid #e5e7eb" }
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <ChartBox title="Top Clientes" isDark={isDark}>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart layout="vertical" data={clientes}>
              <XAxis type="number" hide />
              <YAxis
                dataKey="nome"
                type="category"
                fontSize={9}
                width={65}
              />
              <Tooltip
                contentStyle={
                  isDark
                    ? { backgroundColor: "#020617", border: "1px solid #1e293b" }
                    : { backgroundColor: "#fff", border: "1px solid #e5e7eb" }
                }
              />
              <Bar dataKey="faturamento" fill="#3b82f6" barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Estoque" isDark={isDark}>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={estoque}
                dataKey="valor"
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={55}
              >
                <Cell fill="#ef4444" />
                <Cell fill="#f59e0b" />
                <Cell fill="#10b981" />
              </Pie>
              <Tooltip
                contentStyle={
                  isDark
                    ? { backgroundColor: "#020617", border: "1px solid #1e293b" }
                    : { backgroundColor: "#fff", border: "1px solid #e5e7eb" }
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Fluxo Diário" isDark={isDark}>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={fluxo}>
              <CartesianGrid
                stroke={isDark ? "#1e293b" : "#e5e7eb"}
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="dia"
                fontSize={9}
                axisLine={false}
                tick={{ fill: isDark ? "#cbd5f5" : "#4b5563" }}
              />
              <YAxis
                fontSize={9}
                width={35}
                tick={{ fill: isDark ? "#cbd5f5" : "#4b5563" }}
              />
              <Tooltip
                contentStyle={
                  isDark
                    ? { backgroundColor: "#020617", border: "1px solid #1e293b" }
                    : { backgroundColor: "#fff", border: "1px solid #e5e7eb" }
                }
              />
              <Line
                dataKey="ganhos"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 2 }}
              />
              <Line
                dataKey="despesas"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Performance" isDark={isDark}>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={performance}>
              <XAxis
                dataKey="tipo"
                fontSize={9}
                axisLine={false}
                tick={{ fill: isDark ? "#cbd5f5" : "#4b5563" }}
              />
              <YAxis
                fontSize={9}
                width={35}
                tick={{ fill: isDark ? "#cbd5f5" : "#4b5563" }}
              />
              <Tooltip
                contentStyle={
                  isDark
                    ? { backgroundColor: "#020617", border: "1px solid #1e293b" }
                    : { backgroundColor: "#fff", border: "1px solid #e5e7eb" }
                }
              />
              <Bar dataKey="valor" fill="#10b981" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox title="Fornecedores" isDark={isDark}>
          <ResponsiveContainer width="100%" height={140}>
            <RadarChart data={fornecedores} outerRadius={60}>
              <PolarGrid stroke={isDark ? "#1e293b" : "#e5e7eb"} />
              <PolarAngleAxis
                dataKey="nome"
                fontSize={9}
                tick={{ fill: isDark ? "#cbd5f5" : "#4b5563" }}
              />
              <Radar
                dataKey="entregas"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
              />
              <Tooltip
                contentStyle={
                  isDark
                    ? { backgroundColor: "#020617", border: "1px solid #1e293b" }
                    : { backgroundColor: "#fff", border: "1px solid #e5e7eb" }
                }
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartBox>
      </div>

      {/* ALERTAS CRÍTICOS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 p-1">
        <AlertCard
          title="Contratos Expirar"
          count={contratos[1].qtd}
          color="orange"
          isDark={isDark}
        />
        <AlertCard
          title="Estoque Crítico"
          count={estoque[0].itens}
          color="red"
          isDark={isDark}
        />
        <AlertCard
          title="Contas Negativas"
          count="1"
          color="rose"
          isDark={isDark}
        />
        <AlertCard
          title="Clientes Inativos"
          count={fluxoClientes[2].clientes}
          color="slate"
          isDark={isDark}
        />
      </div>
    </div>
  );
}

const KpiCard = ({ title, value, trend, color, isDark }) => (
  <div
    className={
      isDark
        ? "group bg-gradient-to-b from-slate-900/50 to-slate-900/20 border border-slate-700/50 hover:border-emerald-500/50 p-3 rounded-xl transition-all hover:scale-[1.02]"
        : "group bg-white border border-slate-200 hover:border-emerald-300 p-3 rounded-xl shadow-sm transition-all hover:scale-[1.02]"
    }
  >
    <p className="text-xs uppercase font-mono text-slate-500 mb-1 tracking-wider">
      {title}
    </p>
    <p
      className={
        isDark
          ? "text-lg font-black text-white mb-1"
          : "text-lg font-black text-slate-900 mb-1"
      }
    >
      {value}
    </p>
    <p
      className={`text-xs font-bold ${
        color === "rose"
          ? isDark
            ? "text-rose-300"
            : "text-rose-600"
          : isDark
          ? "text-emerald-300"
          : "text-emerald-600"
      }`}
    >
      {trend}
    </p>
  </div>
);

const ChartBox = ({ title, children, isDark }) => (
  <div
    className={
      isDark
        ? "bg-slate-900/40 backdrop-blur-sm border border-slate-700/60 rounded-xl p-3 hover:border-emerald-500/40 transition-all h-44 flex flex-col shadow-lg"
        : "bg-white border border-slate-200 rounded-xl p-3 hover:border-emerald-300 transition-all h-44 flex flex-col shadow-sm"
    }
  >
    <h3
      className={
        isDark
          ? "text-[10px] font-bold uppercase text-slate-400 mb-2 px-1 tracking-widest"
          : "text-[10px] font-bold uppercase text-slate-500 mb-2 px-1 tracking-widest"
      }
    >
      {title}
    </h3>
    <div className="flex-1 min-h-0">{children}</div>
  </div>
);

const AlertCard = ({ title, count, color, isDark }) => {
  const base = "p-4 rounded-xl border text-center shadow-lg";
  const bg =
    color === "red"
      ? isDark
        ? "bg-gradient-to-r from-rose-500/20 to-slate-900/50 border-rose-500/40"
        : "bg-rose-50 border-rose-200"
      : color === "orange"
      ? isDark
        ? "bg-gradient-to-r from-orange-500/20 to-slate-900/50 border-orange-500/40"
        : "bg-amber-50 border-amber-200"
      : color === "rose"
      ? isDark
        ? "bg-gradient-to-r from-rose-500/20 to-slate-900/50 border-rose-500/40"
        : "bg-rose-50 border-rose-200"
      : isDark
      ? "bg-gradient-to-r from-slate-700/30 to-slate-900/50 border-slate-600/50"
      : "bg-slate-50 border-slate-200";

  return (
    <div className={`${base} ${bg}`}>
      <h4
        className={
          isDark
            ? "text-xs font-bold uppercase mb-2 text-slate-300 tracking-wider"
            : "text-xs font-bold uppercase mb-2 text-slate-600 tracking-wider"
        }
      >
        {title}
      </h4>
      <p
        className={
          isDark
            ? "text-xl font-black text-white mb-2"
            : "text-xl font-black text-slate-900 mb-2"
        }
      >
        {count}
      </p>
      <button
        className={
          isDark
            ? "text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded font-bold text-slate-200 transition-all"
            : "text-xs bg-sky-100 hover:bg-sky-200 px-3 py-1 rounded font-bold text-slate-700 transition-all"
        }
      >
        Ação Rápida
      </button>
    </div>
  );
};

export default Analises;
