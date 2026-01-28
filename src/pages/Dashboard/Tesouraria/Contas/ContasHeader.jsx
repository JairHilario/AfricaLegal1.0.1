import React from "react";

function ContasHeader({ stats }) {
  const {
    total = 0,
    ativas = 0,
    inativas = 0,
    saldoTotal = 0,
  } = stats || {};

  return (
    <header className="p-4 mb-4 border border-sky-100 rounded-md bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h1 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">
        Contas Bancárias
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="rounded-md p-3 text-center border border-sky-100 bg-sky-50 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="text-slate-500 dark:text-slate-300">
            Total de Contas
          </h3>
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            {total}
          </p>
        </div>

        <div className="rounded-md p-3 text-center border border-emerald-100 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/30">
          <h3 className="text-emerald-600 dark:text-emerald-300">Ativas</h3>
          <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-200">
            {ativas}
          </p>
        </div>

        <div className="rounded-md p-3 text-center border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="text-slate-600 dark:text-slate-300">Desativadas</h3>
          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {inativas}
          </p>
        </div>

        <div className="rounded-md p-3 text-center border border-sky-100 bg-sky-50 dark:border-sky-700 dark:bg-sky-900/30">
          <h3 className="text-sky-700 dark:text-sky-300">Saldo Total</h3>
          <p className="text-lg font-semibold text-sky-700 dark:text-sky-200">
            {saldoTotal.toLocaleString("pt-MZ", {
              style: "currency",
              currency: "MZN",
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    </header>
  );
}

export default ContasHeader;
