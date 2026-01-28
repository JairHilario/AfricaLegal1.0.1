import React from "react";

function PosHeader({
  total = 0,
  porPOS = 0,
  canceladas = 0,
  valorTotal = 0,
}) {
  return (
    <header className="p-4 mb-4 border border-sky-100 rounded-md bg-white shadow-sm">
      <h1 className="text-xl font-bold mb-4 text-slate-900">Vendas POS</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
        <div className="rounded-md p-3 text-center border border-sky-100 bg-sky-50">
          <h3 className="text-slate-500">Total</h3>
          <p className="text-lg font-semibold text-slate-900">{total}</p>
        </div>

        <div className="rounded-md p-3 text-center border border-indigo-100 bg-indigo-50">
          <h3 className="text-indigo-600">Via POS</h3>
          <p className="text-lg font-semibold text-indigo-700">{porPOS}</p>
        </div>

        <div className="rounded-md p-3 text-center border border-rose-100 bg-rose-50">
          <h3 className="text-rose-600">Canceladas</h3>
          <p className="text-lg font-semibold text-rose-700">{canceladas}</p>
        </div>

        <div className="rounded-md p-3 text-center border border-emerald-100 bg-emerald-50">
          <h3 className="text-emerald-600">Valor Total</h3>
          <p className="text-lg font-semibold text-emerald-700">
            {valorTotal.toLocaleString("pt-MZ", {
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

export default PosHeader;
