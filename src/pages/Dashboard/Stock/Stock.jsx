import React, { useState } from "react";
import StockTab from "./StockTab";
import EntriesTab from "./EntriesTab";
import SettingsTab from "./SettingsTab";

function Stock({ temaAtual = "light" }) {
  const [activeTab, setActiveTab] = useState("stock");
  const isDark = temaAtual === "dark";

  const tabs = [
    { key: "stock", label: "Estoque", component: <StockTab temaAtual={temaAtual} /> },
    { key: "entries", label: "Entradas", component: <EntriesTab temaAtual={temaAtual} /> },
    { key: "settings", label: "Definições", component: <SettingsTab temaAtual={temaAtual} /> },
  ];

  const containerClasses = isDark
    ? "min-h-[calc(100vh-5rem)] bg-slate-950 text-slate-100"
    : "min-h-[calc(100vh-5rem)] bg-transparent text-slate-900";

  const tabsBorder = isDark
    ? "border-b border-slate-800"
    : "border-b border-sky-100";

  const baseTab =
    "inline-flex w-full justify-center items-center gap-1.5 px-3 py-2 border text-xs md:text-sm font-medium transition";

  const activeTabClasses = isDark
    ? "bg-sky-900/40 border-sky-500 text-sky-200"
    : "bg-sky-50 border-sky-300 text-sky-700";

  const inactiveTabClasses = isDark
    ? "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600 hover:text-slate-50"
    : "bg-white border-slate-200 text-slate-600 hover:bg-sky-50 hover:border-sky-200 hover:text-slate-800";

  return (
    <div className={containerClasses}>
      {/* TABS FULL-WIDTH */}
      <div className={tabsBorder}>
        <nav className="flex flex-wrap text-[11px] md:text-xs">
          {tabs.map((tab) => (
            <div key={tab.key} className="flex-1 min-w-[120px]">
              <button
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={[
                  baseTab,
                  activeTab === tab.key ? activeTabClasses : inactiveTabClasses,
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
        {tabs.find((tab) => tab.key === activeTab)?.component}
      </div>
    </div>
  );
}

export default Stock;
