import React from "react";

function EntregaTable({ entregas = [], temaAtual = "light" }) {
  const isDark = temaAtual === "dark";

  const containerClasses =
    "rounded-md border p-4 md:p-6 shadow-sm text-sm " +
    (isDark
      ? "border-slate-800 bg-slate-900 text-slate-100"
      : "border-sky-100 bg-white text-slate-800");

  const headerRowClasses =
    "border-b uppercase tracking-wide text-[11px] " +
    (isDark
      ? "border-slate-800 text-slate-300 bg-slate-800"
      : "border-slate-100 text-slate-600 bg-sky-50");

  const bodyRowBase =
    "border-b transition-colors " +
    (isDark
      ? "border-slate-800 hover:bg-slate-800/60"
      : "border-slate-100 hover:bg-sky-50");

  const emptyTextClasses =
    "px-3 py-6 text-center text-xs " +
    (isDark ? "text-slate-500" : "text-slate-500");

  const dateCell =
    "px-3 py-2 text-[11px] md:text-xs " +
    (isDark ? "text-slate-400" : "text-slate-600");

  const monoCell =
    "px-3 py-2 text-[11px] md:text-xs font-mono " +
    (isDark ? "text-slate-100" : "text-slate-800");

  const normalCell =
    "px-3 py-2 " + (isDark ? "text-slate-100" : "text-slate-800");

  const actionButton =
    "rounded-md border px-2 py-1 text-[10px] " +
    (isDark
      ? "border-slate-600 bg-slate-900 text-slate-200 hover:bg-slate-800"
      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50");

  return (
    <div className={containerClasses}>
      <div className="mb-3 flex items-center justify-between text-xs">
        <span className={isDark ? "text-slate-300" : "text-slate-600"}>
          Entregas
        </span>
        <span className={isDark ? "text-slate-400" : "text-slate-500"}>
          Total: <strong>{entregas.length}</strong>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs md:text-sm">
          <thead className={headerRowClasses}>
            <tr>
              <th className="px-3 py-2">Data da Entrega</th>
              <th className="px-3 py-2">Guia de Entrega nº</th>
              <th className="px-3 py-2">Nome do cliente</th>
              <th className="px-3 py-2">Local de Entrega</th>
              <th className="px-3 py-2">Motorista</th>
              <th className="px-3 py-2">Acção</th>
            </tr>
          </thead>
          <tbody>
            {entregas.length === 0 && (
              <tr>
                <td colSpan={6} className={emptyTextClasses}>
                  Nenhuma entrega registada.
                </td>
              </tr>
            )}

            {entregas.map((e) => (
              <tr
                key={e.id || e.referencia}
                className={
                  bodyRowBase +
                  (e.nova
                    ? isDark
                      ? " bg-sky-900/20"
                      : " bg-sky-50/80"
                    : "")
                }
              >
                <td className={dateCell}>{e.data}</td>
                <td className={monoCell}>{e.referencia}</td>
                <td className={normalCell}>{e.cliente}</td>
                <td className={normalCell}>{e.localEntrega || e.destino}</td>
                <td className={normalCell}>{e.motoristaNome || e.motorista}</td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    className={actionButton}
                    onClick={() =>
                      console.log("Ver entrega", e.id || e.referencia)
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

export default EntregaTable;
