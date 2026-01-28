import React, { useState } from "react";
import ConfigGerais from "./ConfigGerais";
import ConfigFinancas from "./ConfigFinancas";

function Configuracoes({ temaAtual = "light" }) {
  const [aba, setAba] = useState("config"); // "config" | "financas"
  const isDark = temaAtual === "dark";

  const container = isDark
    ? "space-y-6 min-h-[calc(100vh-5rem)] px-6 pb-8 pt-6 bg-slate-950 text-slate-100"
    : "space-y-6 min-h-[calc(100vh-5rem)] px-6 pb-8 pt-6 bg-transparent text-slate-900";

  const borderTabs = isDark
    ? "mb-4 border-b border-slate-800"
    : "mb-4 border-b border-sky-100";

  const baseTab =
    "px-4 py-2 rounded-t-lg border-b-2 transition-colors text-sm";

  const activeTab = isDark
    ? "border-sky-500 text-sky-300 bg-slate-900"
    : "border-sky-500 text-sky-700 bg-white";

  const inactiveTab = isDark
    ? "border-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-800"
    : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-sky-50";

  const card = isDark
    ? "rounded-md border border-slate-800 bg-slate-900 p-4 text-sm"
    : "rounded-md border border-sky-100 bg-white p-4 text-sm";

  return (
    <div className={container}>
      {/* Cabeçalho */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Configurações</h2>
          <p className="text-sm opacity-70">
            Personalize as configurações gerais e financeiras do sistema.
          </p>
        </div>
      </div>

      {/* Tabs locais */}
      <div className={borderTabs}>
        <nav className="flex gap-2 text-sm">
          <button
            type="button"
            onClick={() => setAba("config")}
            className={[baseTab, aba === "config" ? activeTab : inactiveTab].join(" ")}
          >
            Configurações
          </button>

          <button
            type="button"
            onClick={() => setAba("financas")}
            className={[baseTab, aba === "financas" ? activeTab : inactiveTab].join(" ")}
          >
            Finanças
          </button>
        </nav>
      </div>

      {/* Conteúdo de cada "caminho" */}
      {aba === "config" && (
        <div className={card}>
          <ConfigGerais temaAtual={temaAtual} />
        </div>
      )}

      {aba === "financas" && (
        <div className={card}>
          <ConfigFinancas temaAtual={temaAtual} />
        </div>
      )}
    </div>
  );
}

export default Configuracoes;
