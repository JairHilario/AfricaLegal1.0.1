import React from "react";

function PosTable({ vendas = [] }) {
  return (
    <div className="rounded-md border border-sky-100 bg-white p-4 md:p-6 shadow-sm text-slate-800 text-sm">
      <div className="mb-3 flex items-center justify-between text-xs text-slate-600">
        <span>Vendas POS</span>
        <span className="text-slate-500">
          Total: <strong>{vendas.length}</strong>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs md:text-sm">
          <thead className="border-b border-slate-100 text-slate-600 uppercase tracking-wide text-[11px] bg-sky-50">
            <tr>
              <th className="px-3 py-2">Referência</th>
              <th className="px-3 py-2">Cliente</th>
              <th className="px-3 py-2">Data</th>
              <th className="px-3 py-2 text-right">Valor</th>
              <th className="px-3 py-2">Moeda</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Acção</th>
            </tr>
          </thead>
          <tbody>
            {vendas.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-6 text-center text-slate-400 text-xs"
                >
                  Nenhuma venda registada.
                </td>
              </tr>
            )}

            {vendas.map((v) => (
              <tr
                key={v.id || v.referencia}
                className={`border-b border-slate-100 hover:bg-sky-50 transition-colors ${
                  v.nova ? "bg-sky-50/80" : ""
                }`}
              >
                <td className="px-3 py-2 text-[11px] md:text-xs font-mono text-slate-800">
                  {v.referencia}
                </td>
                <td className="px-3 py-2 text-slate-800">{v.cliente}</td>
                <td className="px-3 py-2 text-[11px] md:text-xs text-slate-600">
                  {v.data}</td>
                <td className="px-3 py-2 text-right text-slate-800">
                  {v.valor?.toLocaleString("pt-MZ", {
                    style: "currency",
                    currency: v.moeda || "MZN",
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="px-3 py-2 text-slate-800">{v.moeda || "MZN"}</td>
                <td className="px-3 py-2">
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border",
                      v.status === "Concluída"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200",
                    ].join(" ")}
                  >
                    {v.status}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    className="rounded-md border border-slate-200 bg-white hover:bg-slate-50 px-2 py-1 text-[10px] text-slate-700"
                    onClick={() =>
                      console.log("Ver venda", v.id || v.referencia)
                    }
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PosTable;
