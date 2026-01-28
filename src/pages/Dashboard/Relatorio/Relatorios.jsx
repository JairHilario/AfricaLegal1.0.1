import React, { useState } from "react";
import RelClientes from "./RelClientes";
import RelDespesas from "./RelDespesas";
import RelPendentes from "./RelPendentes";

const tabs = [
  { key: "clientes", label: "Rel. de clientes" },
  { key: "despesas", label: "Rel. de despesas" },
  { key: "pendentes", label: "Pendentes dos clientes" },
];

function Relatorios({ temaAtual = "dark" }) {
  const [activeTab, setActiveTab] = useState("clientes");

  const isDark = temaAtual === "dark";

  const containerClasses = isDark
    ? "min-h-[calc(100vh-5rem)] bg-slate-950 text-slate-100"
    : "min-h-[calc(100vh-5rem)] bg-transparent text-slate-900";

  const tabsBorder = isDark
    ? "border-b border-slate-800"
    : "border-b border-sky-100";

  const baseTab =
    "inline-flex w-full justify-center items-center gap-1.5 px-3 py-2 border text-[11px] md:text-sm font-medium transition";

  const tabActive = isDark
    ? "bg-sky-900/40 border-sky-500 text-sky-200"
    : "bg-sky-50 border-sky-300 text-sky-700";

  const tabInactive = isDark
    ? "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600 hover:text-slate-50"
    : "bg-white border-slate-200 text-slate-600 hover:bg-sky-50 hover:border-sky-200 hover:text-slate-800";

  return (
    <div className={containerClasses}>
      {/* ABAS FULL-WIDTH */}
      <div className={tabsBorder}>
        <nav className="flex flex-wrap">
          {tabs.map((tab) => (
            <div key={tab.key} className="flex-1 min-w-[140px]">
              <button
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={[
                  baseTab,
                  activeTab === tab.key ? tabActive : tabInactive,
                ].join(" ")}
              >
                <span className="truncate">{tab.label}</span>
              </button>
            </div>
          ))}
        </nav>
      </div>

      {/* CONTEÚDO */}
      <div className="p-1 backdrop-blur-sm">
        {activeTab === "clientes" && <RelClientes temaAtual={temaAtual} />}
        {activeTab === "despesas" && <RelDespesas temaAtual={temaAtual} />}
        {activeTab === "pendentes" && <RelPendentes temaAtual={temaAtual} />}
      </div>
    </div>
  );
}

export default Relatorios;
