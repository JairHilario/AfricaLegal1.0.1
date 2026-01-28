import React from "react";

function HeaderRelClientes({
  total = 0,
  ativos = 0,
  inativos = 0,
  emRisco = 0,
  novos = 0,
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

  const cardAtivos = isDark
    ? `${cardBase} border-emerald-700 bg-emerald-900/40`
    : `${cardBase} border-emerald-100 bg-emerald-50`;

  const cardInativos = isDark
    ? `${cardBase} border-slate-700 bg-slate-800`
    : `${cardBase} border-slate-200 bg-slate-50`;

  const cardRisco = isDark
    ? `${cardBase} border-amber-700 bg-amber-900/40`
    : `${cardBase} border-amber-100 bg-amber-50`;

  const cardNovos = isDark
    ? `${cardBase} border-sky-700 bg-sky-900/40`
    : `${cardBase} border-sky-200 bg-sky-50`;

  return (
    <header className={header}>
      <h1 className={titulo}>Relatórios de Clientes</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
        <div className={cardTotal}>
          <h3 className={isDark ? "text-slate-300" : "text-slate-500"}>Total</h3>
          <p className="text-lg font-semibold">{total}</p>
        </div>

        <div className={cardAtivos}>
          <h3 className="text-emerald-400">Ativos</h3>
          <p className="text-lg font-semibold text-emerald-300">{ativos}</p>
        </div>

        <div className={cardInativos}>
          <h3 className={isDark ? "text-slate-300" : "text-slate-600"}>
            Inativos
          </h3>
          <p className={isDark ? "text-lg font-semibold text-slate-200" : "text-lg font-semibold text-slate-700"}>
            {inativos}
          </p>
        </div>

        <div className={cardRisco}>
          <h3 className="text-amber-400">Em risco</h3>
          <p className="text-lg font-semibold text-amber-300">{emRisco}</p>
        </div>

        <div className={cardNovos}>
          <h3 className="text-sky-400">Novos</h3>
          <p className="text-lg font-semibold text-sky-300">{novos}</p>
        </div>
      </div>
    </header>
  );
}

export default HeaderRelClientes;
