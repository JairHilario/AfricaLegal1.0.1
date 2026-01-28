import React from "react";

function DepositoTable({ depositos = [] }) {
  return (
    <div className="rounded-md border border-sky-100 bg-white p-4 md:p-6 shadow-sm text-slate-800 text-sm">
      <div className="mb-3 flex items-center justify-between text-xs text-slate-600">
        <span>Depósitos</span>
        <span className="text-slate-500">
          Total: <strong>{depositos.length}</strong>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs md:text-sm">
          <thead className="border-b border-slate-100 text-slate-600 uppercase tracking-wide text-[11px] bg-sky-50">
            <tr>
              <th className="px-3 py-2">Data</th>
              <th className="px-3 py-2">Conta</th>
              <th className="px-3 py-2">Método</th>
              <th className="px-3 py-2 text-right">Montante</th>
              <th className="px-3 py-2">Moeda</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {depositos.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-6 text-center text-slate-400 text-xs"
                >
                  Nenhum depósito registado.
                </td>
              </tr>
            )}

            {depositos.map((dep) => (
              <tr
                key={dep.id}
                className="border-b border-slate-100 hover:bg-sky-50 transition-colors"
              >
                <td className="px-3 py-2 text-[11px] md:text-xs text-slate-600">
                  {dep.data}
                </td>
                <td className="px-3 py-2 font-mono text-[11px] md:text-xs text-slate-800">
                  {dep.conta}
                </td>
                <td className="px-3 py-2 text-slate-800">
                  {dep.metodo || dep.metodoPagamento}
                </td>
                <td className="px-3 py-2 text-right text-slate-800">
                  {Number(dep.montante ?? dep.valor ?? 0).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </td>
                <td className="px-3 py-2 text-slate-800">
                  {dep.moeda || "MZN"}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border",
                      dep.status === "Confirmado" ||
                      dep.status === "confirmado"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : dep.status === "Pendente" ||
                          dep.status === "pendente"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-slate-50 text-slate-700 border-slate-200",
                    ].join(" ")}
                  >
                    {dep.status || "Pendente"}
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

export default DepositoTable;
