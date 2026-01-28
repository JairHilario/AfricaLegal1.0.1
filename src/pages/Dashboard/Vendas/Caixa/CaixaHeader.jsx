import React from "react";

function CaixaHeader({ total = 0, entradas = 0, saidas = 0, saldo = 0 }) {
  return (
    <header className="p-4 mb-4 border border-sky-100 rounded-md bg-white shadow-sm">
      <h1 className="text-xl font-bold mb-4 text-slate-900">Caixa</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
        <div className="rounded-md p-3 text-center border border-sky-100 bg-sky-50">
          <h3 className="text-slate-500">Movimentos</h3>
          <p className="text-lg font-semibold text-slate-900">{total}</p>
        </div>

        <div className="rounded-md p-3 text-center border border-emerald-100 bg-emerald-50">
          <h3 className="text-emerald-600">Entradas</h3>
          <p className="text-lg font-semibold text-emerald-700">{entradas}</p>
        </div>

        <div className="rounded-md p-3 text-center border border-rose-200 bg-rose-50">
          <h3 className="text-rose-600">Saídas</h3>
          <p className="text-lg font-semibold text-rose-700">{saidas}</p>
        </div>

        <div className="rounded-md p-3 text-center border border-sky-200 bg-sky-50">
          <h3 className="text-sky-600">Saldo</h3>
          <p className="text-lg font-semibold text-sky-700">
            {saldo.toLocaleString("pt-MZ", {
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

export default CaixaHeader;
