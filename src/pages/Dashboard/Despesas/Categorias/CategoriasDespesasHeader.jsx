import React from "react";
function CategoriasDespesasHeader({ totalCategorias = 0, temaAtual = "light" }) {
  const isDark = temaAtual === "dark";

  const headerClasses = isDark
    ? "p-6 mb-4 border border-white/10 rounded-lg bg-slate-900/70 backdrop-blur-sm text-slate-100"
    : "p-6 mb-4 border border-slate-200 rounded-lg bg-white text-slate-900";

  const cardBase = "rounded p-4 text-center";
  const cardTotal = isDark
    ? "bg-white/10"
    : "bg-slate-100";
  const cardAtivas = isDark
    ? "bg-blue-600/30 text-blue-50"
    : "bg-blue-50 text-blue-700";
  const cardUsadas = isDark
    ? "bg-emerald-600/30 text-emerald-50"
    : "bg-emerald-50 text-emerald-700";
  const cardSemUso = isDark
    ? "bg-yellow-500/30 text-yellow-50"
    : "bg-yellow-50 text-yellow-700";
  const cardArquivadas = isDark
    ? "bg-red-600/30 text-red-50"
    : "bg-red-50 text-red-700";

  return (
    <header className={headerClasses}>
      <h1 className="text-2xl font-bold mb-4">
        Gestão de Categorias de Despesas
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-xs">
        <div className={`${cardBase} ${cardTotal}`}>
          <h3 className={isDark ? "opacity-90" : "text-slate-600"}>Total</h3>
          <p className="text-xl font-semibold">{totalCategorias}</p>
        </div>

        <div className={`${cardBase} ${cardAtivas}`}>
          <h3>Ativas</h3>
          <p className="text-xl font-semibold">{totalCategorias}</p>
        </div>

        <div className={`${cardBase} ${cardUsadas}`}>
          <h3>Usadas</h3>
          <p className="text-xl font-semibold">0</p>
        </div>

        <div className={`${cardBase} ${cardSemUso}`}>
          <h3>Sem uso</h3>
          <p className="text-xl font-semibold">0</p>
        </div>

        <div className={`${cardBase} ${cardArquivadas}`}>
          <h3>Arquivadas</h3>
          <p className="text-xl font-semibold">0</p>
        </div>
      </div>
    </header>
  );
}


export default CategoriasDespesasHeader;
