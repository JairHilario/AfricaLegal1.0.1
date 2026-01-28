import React from "react";

function TransferenciaTable({ transferencias = [] }) {
  return (
    <div className="rounded-md border border-sky-100 bg-white p-4 md:p-6 shadow-sm text-slate-800 text-sm">
      <div className="mb-3 flex items-center justify-between text-xs text-slate-600">
        <span>Transferências</span>
        <span className="text-slate-500">
          Total: <strong>{transferencias.length}</strong>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs md:text-sm">
          <thead className="border-b border-slate-100 text-slate-600 uppercase tracking-wide text-[11px] bg-sky-50">
            <tr>
              <th className="px-3 py-2">Data</th>
              <th className="px-3 py-2">Origem</th>
              <th className="px-3 py-2">Destino</th>
              <th className="px-3 py-2">Referência</th>
              <th className="px-3 py-2 text-right">Valor</th>
              <th className="px-3 py-2">Moeda</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {transferencias.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-6 text-center text-slate-400 text-xs"
                >
                  Nenhuma transferência registada.
                </td>
              </tr>
            )}

            {transferencias.map((t) => (
              <tr
                key={t.id}
                className="border-b border-slate-100 hover:bg-sky-50 transition-colors"
              >
                <td className="px-3 py-2 text-[11px] md:text-xs text-slate-600">
                  {t.data}
                </td>
                <td className="px-3 py-2 text-slate-800">{t.origem}</td>
                <td className="px-3 py-2 text-slate-800">{t.destino}</td>
                <td className="px-3 py-2 text-[11px] md:text-xs font-mono text-slate-800">
                  {t.referencia}
                </td>
                <td className="px-3 py-2 text-right text-slate-800">
                  {Number(t.valor || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-3 py-2 text-slate-800">
                  {t.moeda || "MZN"}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border",
                      (t.status || "").toLowerCase() === "confirmada"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : (t.status || "").toLowerCase() === "pendente"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-slate-50 text-slate-700 border-slate-200",
                    ].join(" ")}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransferenciaTable;
