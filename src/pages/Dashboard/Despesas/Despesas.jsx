import React, { useState, useEffect } from "react";
import ListaDespesas from "./ListaDespesas";
import CategoriasDespesas from "./CategoriasDespesas";

function Despesas({ temaAtual = "light" }) {
  const [activeTab, setActiveTab] = useState("despesas");
  const [contas, setContas] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [categoriasDespesas, setCategoriasDespesas] = useState([]);

  const isDark = temaAtual === "dark";

  useEffect(() => {
    async function load() {
      try {
        const savedAuth = localStorage.getItem("africaLegalUser");
        const token = savedAuth ? JSON.parse(savedAuth).token : null;

        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const [cRes, fRes, catRes] = await Promise.all([
          fetch("http://localhost:4000/contas-bancarias", { headers }),
          fetch("http://localhost:4000/fornecedores", { headers }),
          fetch("http://localhost:4000/categorias-despesas", { headers }),
        ]);

        if (!cRes.ok) throw new Error("Erro ao carregar contas");
        if (!fRes.ok) throw new Error("Erro ao carregar fornecedores");
        if (!catRes.ok) throw new Error("Erro ao carregar categorias");

        const [cData, fData, catData] = await Promise.all([
          cRes.json(),
          fRes.json(),
          catRes.json(),
        ]);

        setContas(Array.isArray(cData) ? cData : []);
        setFornecedores(Array.isArray(fData) ? fData : []);
        setCategoriasDespesas(Array.isArray(catData) ? catData : []);
      } catch (err) {
        console.error("Erro ao carregar dados de despesas:", err);
        setContas([]);
        setFornecedores([]);
        setCategoriasDespesas([]);
      }
    }

    load();
  }, []);

  const containerClasses = isDark
    ? "min-h-[calc(100vh-5rem)] bg-slate-950 text-slate-100 px-1 sm:px-2"
    : "min-h-[calc(100vh-5rem)] bg-transparent text-slate-900 px-1 sm:px-2";

  const tabsBorder = isDark
    ? "border-b border-slate-800"
    : "border-b border-slate-200";

  const baseTab =
    "inline-flex w-full justify-center items-center gap-1.5 px-3 py-2 border text-xs md:text-sm font-medium transition";

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
        <nav className="flex flex-wrap text-[11px] md:text-xs">
          <div className="flex-1 min-w-[120px]">
            <button
              type="button"
              onClick={() => setActiveTab("despesas")}
              className={[
                baseTab,
                activeTab === "despesas" ? tabActive : tabInactive,
              ].join(" ")}
            >
              <span className="truncate">Despesas</span>
            </button>
          </div>

          <div className="flex-1 min-w-[120px]">
            <button
              type="button"
              onClick={() => setActiveTab("categorias")}
              className={[
                baseTab,
                activeTab === "categorias" ? tabActive : tabInactive,
              ].join(" ")}
            >
              <span className="truncate">Categorias</span>
            </button>
          </div>
        </nav>
      </div>

      {/* CONTEÚDO */}
      <div className={isDark ? "p-1 text-slate-200" : "p-1 text-slate-900"}>
        {activeTab === "despesas" && (
          <ListaDespesas
            contas={contas}
            fornecedores={fornecedores}
            categoriasDespesas={categoriasDespesas}
            temaAtual={temaAtual}
          />
        )}
        {activeTab === "categorias" && (
          <CategoriasDespesas
            temaAtual={temaAtual}
            onCategoriasChange={setCategoriasDespesas}
          />
        )}
      </div>
    </div>
  );
}

export default Despesas;
