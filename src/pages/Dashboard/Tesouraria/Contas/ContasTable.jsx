import React from "react";
import { numeroPorExtensoMeticais } from "../../../../context/numeroPorExtenso";

function ContasTable({ contas = [] }) {
  const totalGeral = contas.reduce(
    (sum, conta) =>
      sum + (Number(conta.saldo || conta.saldoInicial || 0) || 0),
    0
  );

  return (
    <div className="rounded-md border border-sky-100 bg-white p-4 md:p-6 shadow-sm text-slate-800 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <div className="mb-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
        <span>Contas Bancárias</span>
        <span className="text-slate-500 dark:text-slate-400">
          Total: <strong>{contas.length}</strong>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs md:text-sm">
          <thead className="border-b border-slate-100 text-slate-600 uppercase tracking-wide text-[11px] bg-sky-50 dark:border-slate-800 dark:text-slate-300 dark:bg-slate-800">
            <tr>
              <th className="px-3 py-2">Banco</th>
              <th className="px-3 py-2">Nº Conta</th>
              <th className="px-3 py-2">Tipo</th>
              <th className="px-3 py-2 text-right">Saldo</th>
              <th className="px-3 py-2">Moeda</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {contas.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-6 text-center text-slate-400 text-xs dark:text-slate-500"
                >
                  Nenhuma conta cadastrada.
                </td>
              </tr>
            )}

            {contas.map((conta) => (
              <tr
                key={conta.id}
                className="border-b border-slate-100 hover:bg-sky-50 transition-colors dark:border-slate-800 dark:hover:bg-slate-800/60"
              >
                <td className="px-3 py-2 text-slate-800 dark:text-slate-100">
                  {conta.banco}
                </td>
                <td className="px-3 py-2 font-mono text-[11px] md:text-xs text-slate-800 dark:text-slate-100">
                  {conta.numero}
                </td>
                <td className="px-3 py-2 text-slate-800 dark:text-slate-100">
                  {conta.tipo}
                </td>
                <td className="px-3 py-2 text-right text-slate-800 dark:text-slate-100">
                  {Number(
                    conta.saldo || conta.saldoInicial || 0
                  ).toLocaleString("pt-MZ", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-3 py-2 text-slate-800 dark:text-slate-100">
                  {conta.moeda || "MZN"}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border",
                      conta.status === "Ativa"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-700"
                        : conta.status === "Inativa"
                        ? "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600"
                        : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-700",
                    ].join(" ")}
                  >
                    {conta.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-xs text-slate-700 flex flex-col md:flex-row md:items-center md:justify-between gap-1 dark:text-slate-200">
        <span>
          Total em contas:{" "}
          <strong className="text-orange-600 dark:text-orange-300">
            {Number(totalGeral).toLocaleString("pt-MZ", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </strong>
        </span>
        <span className="italic text-slate-500 dark:text-slate-400">
          ({numeroPorExtensoMeticais(totalGeral)})
        </span>
      </div>
    </div>
  );
}

export default ContasTable;
