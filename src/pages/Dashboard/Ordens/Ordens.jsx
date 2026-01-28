import React, { useState, useEffect } from "react";
import OrdensLista from "./OrdensLista";
import DevolucoesLista from "./DevolucoesLista";

function Ordens({ temaAtual = "dark" }) {
  const [activeTab, setActiveTab] = useState("ordens");
  const [clientes, setClientes] = useState([]);
  const [contas, setContas] = useState([]);

  const isDark = temaAtual === "dark";

  useEffect(() => {
    fetch("http://localhost:4000/clients")
      .then((r) => r.json())
      .then((data) => {
        console.log("CLIENTES API:", data);
        setClientes(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Erro /clients", err));

    fetch("http://localhost:4000/contas-bancarias")
      .then((r) => r.json())
      .then((data) => {
        console.log("CONTAS API:", data);
        setContas(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Erro /contas-bancarias", err));
  }, []);

  const tabs = [
    { key: "ordens", label: "Ordens" },
    { key: "devolucoes", label: "Devoluções" },
  ];

  const containerClasses = isDark
    ? "min-h-[calc(100vh-5rem)] bg-slate-950 text-slate-100"
    : "min-h-[calc(100vh-5rem)] bg-transparent text-slate-900";

  const tabsBorder = isDark
    ? "border-b border-slate-800"
    : "border-b border-sky-100";

  const baseTab =
    "inline-flex w-full justify-center items-center gap-1.5 px-3 py-2 border text-xs md:text-sm font-medium transition";

  const tabActive = isDark
    ? "bg-sky-900/40 border-sky-500 text-sky-200"
    : "bg-sky-50 border-sky-300 text-sky-700";

  const tabInactive = isDark
    ? "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600 hover:text-slate-50"
    : "bg-white border-slate-200 text-slate-600 hover:bg-sky-50 hover:border-sky-200 hover:text-slate-800";

  const contentClasses = "p-1 backdrop-blur-sm";

  return (
    <div className={containerClasses}>
      {/* ABAS FULL-WIDTH */}
      <div className={tabsBorder}>
        <nav className="flex flex-wrap text-[11px] md:text-xs">
          {tabs.map((tab) => (
            <div key={tab.key} className="flex-1 min-w-[120px]">
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
      <div className={contentClasses}>
        {activeTab === "ordens" && (
          <OrdensLista
            clientes={clientes}
            contas={contas}
            temaAtual={temaAtual}
          />
        )}
        {activeTab === "devolucoes" && (
          <DevolucoesLista
            clientes={clientes}
            contas={contas}
            temaAtual={temaAtual}
          />
        )}
      </div>
    </div>
  );
}

export default Ordens;
