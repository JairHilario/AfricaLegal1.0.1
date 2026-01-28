import React, { useState, useEffect } from "react";
import {
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  GiftIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";
import FinancialChart from "./FinancialChart";
import FinancialDonutChart from "./FinancialDonutChart";

const Dashboard = ({ temaAtual = "light" }) => {
  const isDark = temaAtual === "dark";

  const [stats, setStats] = useState({
    ganhos: 0,
    despesas: 0,
    lucros: 0,
    faturasAbertas: 0,
    faturasVencidas: 0,
    faturasPagas30d: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [top10, setTop10] = useState([]);
  const [alertas, setAlertas] = useState({
    faturas7d: 0,
    contratosPendentes: 0,
    processosHoje: 0,
    backupsNaoVerificados: 0,
  });

  const [contas, setContas] = useState([]);
  const [metas, setMetas] = useState({
    faturamento: 0,
    novosClientes: 0,
    inadimplencia: 0,
  });

  const [sectionsOpen, setSectionsOpen] = useState({
    alertas: true,
    contas: true,
    top10: true,
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const toggleSection = (key) => {
    setSectionsOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setErro("");

        // ATUALIZAÇÃO: URLs apontando para o novo módulo de relatórios
        const [respDash, respFluxo] = await Promise.all([
          fetch("http://localhost:4000/relatorios/dashboard/stats"),
          fetch("http://localhost:4000/relatorios/dashboard/fluxo"),
        ]);

        if (!respDash.ok || !respFluxo.ok) {
          throw new Error("Falha ao conectar com o servidor de relatórios.");
        }

        const dataDash = await respDash.json();
        const dataFluxo = await respFluxo.json();

        // Lógica de normalização dos meses para o gráfico (últimos 12 meses)
        const agora = new Date();
        const meses = [];

        for (let i = 11; i >= 0; i--) {
          const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
          const chave = d.toISOString().slice(0, 7); // "YYYY-MM"
          const label = d.toLocaleDateString("pt-PT", {
            month: "short",
            year: "2-digit",
          });
          meses.push({ chave, label });
        }

        const normalizado = meses.map(({ chave, label }) => {
          const found = (dataFluxo.series || []).find((r) => r.mes === chave);

          const ganhos = Number(found?.ganhos || 0);
          const despesas = Number(found?.despesas || 0);
          const lucros = found?.lucros != null ? Number(found.lucros) : ganhos - despesas;

          return {
            mes: label,
            ganhos,
            despesas,
            lucros,
          };
        });

        // Atualização dos estados com fallbacks seguros
        setStats(dataDash.stats || { ganhos: 0, despesas: 0, lucros: 0 });
        setTop10(dataDash.top10MaisVendidos || []);
        setAlertas(dataDash.alertas || {});
        setContas(dataDash.contasBancarias || []);
        setMetas(dataDash.metas || { faturamento: 0, novosClientes: 0, inadimplencia: 0 });
        setChartData(normalizado);
      } catch (err) {
        console.error("Dashboard error:", err);
        setErro("Erro ao carregar dados. Verifique a conexão com o backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const containerBg = isDark ? "bg-slate-950" : "bg-sky-50";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";
  const textError = "text-red-600";
  const cardBorder = isDark ? "border-slate-800" : "border-sky-100";
  const cardBg = isDark ? "bg-slate-900" : "bg-white";
  const cardTitle = isDark ? "text-slate-100" : "text-slate-800";
  const cardSub = isDark ? "text-slate-400" : "text-slate-600";
  const mainText = isDark ? "text-slate-50" : "text-slate-900";
  const linkAccent = "text-sky-600";

  return (
    <div className={`min-h-full ${containerBg}`}>
      <div className="px-6 pt-4">
        {loading && <p className={`mb-2 text-xs animate-pulse ${textMuted}`}>Atualizando indicadores...</p>}
        {erro && <p className={`mb-2 text-xs font-semibold ${textError}`}>{erro}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4 px-6 pt-2 md:grid-cols-3">
        <StatCard label="Ganhos" value={stats.ganhos != null ? `MT ${stats.ganhos.toLocaleString("pt-PT")}` : "MT 0"} isDark={isDark} />
        <StatCard label="Despesas" value={stats.despesas != null ? `MT ${stats.despesas.toLocaleString("pt-PT")}` : "MT 0"} isDark={isDark} />
        <StatCard label="Lucros" value={stats.lucros != null ? `MT ${stats.lucros.toLocaleString("pt-PT")}` : "MT 0"} isDark={isDark} />
        <StatCard label="Faturas Abertas" value={stats.faturasAbertas ?? "0"} isDark={isDark} />
        <StatCard label="Faturas Vencidas" value={stats.faturasVencidas ?? "0"} isDark={isDark} />
        <StatCard label="Pagas (30 dias)" value={stats.faturasPagas30d ?? "0"} isDark={isDark} />
      </div>

      <div className="space-y-6 px-6 pb-6 pt-4">
        <div className="grid items-stretch gap-4 md:grid-cols-3">
          <div className={`flex h-72 flex-col rounded-md border ${cardBorder} ${cardBg} p-4 shadow-sm md:col-span-2`}>
            <div className={`mb-2 flex items-center justify-between text-xs ${cardSub}`}>
              <span className="font-medium uppercase tracking-wider">Fluxo financeiro</span>
              <span className="opacity-80">Últimos 12 meses</span>
            </div>
            <div className="flex-1 min-h-0 w-full">
              {/* PROTEÇÃO: Só renderiza o gráfico se houver dados para evitar erro de width */}
              {chartData.length > 0 ? (
                <FinancialChart data={chartData} xKey="mes" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-xs text-slate-500">
                  Aguardando dados...
                </div>
              )}
            </div>
          </div>

          <div className={`flex flex-col rounded-md border ${cardBorder} ${cardBg} p-4 shadow-sm`}>
            <div className={`mb-2 flex items-center gap-2 text-xs ${cardSub}`}>
              <GiftIcon className="h-4 w-4 text-sky-500" />
              <span className="font-medium uppercase tracking-wider">Distribuição</span>
            </div>
            <div className="flex-1 min-h-0">
                <FinancialDonutChart totals={stats} />
            </div>
          </div>
        </div>

        {/* --- CARDS DE INFORMAÇÃO --- */}
        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard
            isDark={isDark}
            icon={ShieldCheckIcon}
            iconColor="text-amber-500"
            title={
              <div className="flex w-full items-center justify-between">
                <span>Alertas</span>
                <button type="button" className={`text-[10px] uppercase font-bold ${linkAccent}`} onClick={() => toggleSection("alertas")}>
                  {sectionsOpen.alertas ? "Recolher" : "Abrir"}
                </button>
              </div>
            }
          >
            {sectionsOpen.alertas && (
              <ul className={`list-inside list-disc space-y-2 text-xs mt-2 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <li>{alertas.faturas7d ?? 0} faturas vencem em 7 dias</li>
                <li>{alertas.contratosPendentes ?? 0} contratos pendentes</li>
                <li>{alertas.processosHoje ?? 0} prazos para hoje</li>
              </ul>
            )}
          </InfoCard>

          <InfoCard
            isDark={isDark}
            icon={DevicePhoneMobileIcon}
            iconColor="text-sky-500"
            title={
              <div className="flex w-full items-center justify-between">
                <span>Contas</span>
                <button type="button" className={`text-[10px] uppercase font-bold ${linkAccent}`} onClick={() => toggleSection("contas")}>
                  {sectionsOpen.contas ? "Recolher" : "Abrir"}
                </button>
              </div>
            }
          >
            {sectionsOpen.contas && (
              <div className="mt-2 space-y-2">
                {contas.length > 0 ? (
                  contas.map((conta) => (
                    <div key={conta.id} className="flex justify-between text-xs border-b border-slate-700/20 pb-1">
                      <span className={isDark ? "text-slate-400" : "text-slate-500"}>{conta.nome}</span>
                      <span className="font-mono font-bold italic">MT {conta.saldo?.toLocaleString("pt-PT")}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-center py-2 opacity-50">Nenhuma conta ativa.</p>
                )}
              </div>
            )}
          </InfoCard>

          <InfoCard isDark={isDark} icon={WrenchScrewdriverIcon} iconColor="text-emerald-500" title="Metas do Mês">
            <div className="mt-2 space-y-3">
              <MetricRow label="Faturamento" value={`${metas.faturamento}%`} color="text-emerald-500" isDark={isDark} />
              <MetricRow label="Novos Clientes" value={`${metas.novosClientes}%`} color="text-sky-500" isDark={isDark} />
              <MetricRow label="Inadimplência" value={`${metas.inadimplencia}%`} color="text-rose-500" isDark={isDark} />
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// --- COMPONENTES AUXILIARES ---

function StatCard({ label, value, isDark }) {
  return (
    <div className={`rounded-md border p-4 shadow-sm transition-all hover:scale-[1.02] ${
      isDark ? "border-slate-800 bg-slate-900" : "border-sky-100 bg-white"
    }`}>
      <p className={`mb-1 text-[10px] uppercase font-bold tracking-tight ${isDark ? "text-slate-500" : "text-slate-400"}`}>{label}</p>
      <p className={`text-lg font-black ${isDark ? "text-slate-50" : "text-slate-900"}`}>{value}</p>
    </div>
  );
}

function InfoCard({ icon: Icon, iconColor, title, children, isDark }) {
  return (
    <div className={`rounded-md border p-4 shadow-sm ${isDark ? "border-slate-800 bg-slate-900" : "border-sky-100 bg-white"}`}>
      <div className="mb-2 flex items-center gap-3">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <h3 className={`text-sm font-bold flex-1 ${isDark ? "text-slate-100" : "text-slate-800"}`}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function MetricRow({ label, value, color, isDark }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px] uppercase font-medium">
        <span className={isDark ? "text-slate-400" : "text-slate-500"}>{label}</span>
        <span className={`font-bold ${color}`}>{value}</span>
      </div>
      <div className={`h-1.5 w-full rounded-full ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
        <div className={`h-full rounded-full ${color.replace('text', 'bg')}`} style={{ width: value }}></div>
      </div>
    </div>
  );
}