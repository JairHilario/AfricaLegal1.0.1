import React from "react";

function RelDespesasHeader({
  totalDespesas = 0,
  valorTotal = 0,
  pagas = 0,
  emAberto = 0,
  emAtraso = 0,
  temaAtual = "dark",
}) {
  const isDark = temaAtual === "dark";

  const header = isDark
    ? "p-4 mb-4 border border-slate-800 rounded-md bg-slate-900 shadow-sm"
    : "p-4 mb-4 border border-sky-100 rounded-md bg-white shadow-sm";

  const titulo = isDark
    ? "text-xl font-bold mb-4 text-slate-100"
    : "text-xl font-bold mb-4 text-slate-900";

  const cardBase = "rounded-md p-3 text-center border";
  const cardTotal = isDark
    ? `${cardBase} border-slate-700 bg-slate-800 text-slate-100`
    : `${cardBase} border-sky-100 bg-sky-50 text-slate-900`;

  const cardValor = isDark
    ? `${cardBase} border-sky-700 bg-sky-900/40 text-sky-100`
    : `${cardBase} border-sky-200 bg-sky-50 text-sky-700`;

  const cardPagas = isDark
    ? `${cardBase} border-emerald-700 bg-emerald-900/40 text-emerald-100`
    : `${cardBase} border-emerald-100 bg-emerald-50 text-emerald-700`;

  const cardAberto = isDark
    ? `${cardBase} border-amber-700 bg-amber-900/40 text-amber-100`
    : `${cardBase} border-amber-100 bg-amber-50 text-amber-700`;

  const cardAtraso = isDark
    ? `${cardBase} border-rose-700 bg-rose-900/40 text-rose-100`
    : `${cardBase} border-rose-100 bg-rose-50 text-rose-700`;

  return (
    <header className={header}>
      <h1 className={titulo}>Relatórios de Despesas</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
        <div className={cardTotal}>
          <h3 className={isDark ? "text-slate-300" : "text-slate-500"}>
            Total despesas
          </h3>
          <p className="text-lg font-semibold">{totalDespesas}</p>
        </div>

        <div className={cardValor}>
          <h3 className="text-sky-400">Valor total</h3>
          <p className="text-lg font-semibold">
            {valorTotal.toLocaleString()}
          </p>
        </div>

        <div className={cardPagas}>
          <h3 className="text-emerald-400">Pagas</h3>
          <p className="text-lg font-semibold">
            {pagas.toLocaleString()}
          </p>
        </div>

        <div className={cardAberto}>
          <h3 className="text-amber-400">Em aberto</h3>
          <p className="text-lg font-semibold">
            {emAberto.toLocaleString()}
          </p>
        </div>

        <div className={cardAtraso}>
          <h3 className="text-rose-400">Em atraso</h3>
          <p className="text-lg font-semibold">
            {emAtraso.toLocaleString()}
          </p>
        </div>
      </div>
    </header>
  );
}

export default RelDespesasHeader;
