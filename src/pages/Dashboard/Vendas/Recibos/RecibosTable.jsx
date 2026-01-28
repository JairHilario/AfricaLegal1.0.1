import React from "react";

function RecibosTable({ recibos = [], temaAtual = "light" }) {
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
    (isDark ? "text-slate-500" : "text-slate-400");

  const monoCell =
    "px-3 py-2 text-[11px] md:text-xs font-mono " +
    (isDark ? "text-slate-100" : "text-slate-800");

  const normalCell =
    "px-3 py-2 " + (isDark ? "text-slate-100" : "text-slate-800");

  const mutedCell =
    "px-3 py-2 text-[11px] md:text-xs " +
    (isDark ? "text-slate-400" : "text-slate-600");

  const moneyCell =
    "px-3 py-2 text-right " + (isDark ? "text-slate-100" : "text-slate-800");

  const actionButton =
    "rounded-md border px-2 py-1 text-[10px] " +
    (isDark
      ? "border-slate-600 bg-slate-900 text-slate-200 hover:bg-slate-800"
      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50");

  const badgeBase =
    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border";

  const getStatusClasses = (status) => {
    if (status === "Pago") {
      return (
        badgeBase +
        " " +
        (isDark
          ? "bg-emerald-900/30 text-emerald-300 border-emerald-700"
          : "bg-emerald-50 text-emerald-700 border-emerald-200")
      );
    }
    if (status === "Cancelado") {
      return (
        badgeBase +
        " " +
        (isDark
          ? "bg-rose-900/30 text-rose-300 border-rose-700"
          : "bg-rose-50 text-rose-700 border-rose-200")
      );
    }
    return (
      badgeBase +
      " " +
      (isDark
        ? "bg-amber-900/30 text-amber-300 border-amber-700"
        : "bg-amber-50 text-amber-700 border-amber-200")
    );
  };

  return (
    <div className={containerClasses}>
      <div className="mb-3 flex items-center justify-between text-xs">
        <span className={isDark ? "text-slate-300" : "text-slate-600"}>
          Recibos
        </span>
        <span className={isDark ? "text-slate-400" : "text-slate-500"}>
          Total: <strong>{recibos.length}</strong>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs md:text-sm">
          <thead className={headerRowClasses}>
            <tr>
              <th className="px-3 py-2">Nº Recibo</th>
              <th className="px-3 py-2">Cliente</th>
              <th className="px-3 py-2">Data</th>
              <th className="px-3 py-2 text-right">Valor</th>
              <th className="px-3 py-2">Moeda</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Acção</th>
            </tr>
          </thead>
          <tbody>
            {recibos.length === 0 && (
              <tr>
                <td colSpan={7} className={emptyTextClasses}>
                  Nenhum recibo registado.
                </td>
              </tr>
            )}

            {recibos.map((r) => (
              <tr
                key={r.id || r.numero}
                className={
                  bodyRowBase +
                  (r.novo
                    ? isDark
                      ? " bg-sky-900/20"
                      : " bg-sky-50/80"
                    : "")
                }
              >
                <td className={monoCell}>{r.numero}</td>
                <td className={normalCell}>{r.cliente}</td>
                <td className={mutedCell}>{r.data}</td>
                <td className={moneyCell}>
                  {r.valor?.toLocaleString("pt-MZ", {
                    style: "currency",
                    currency: r.moeda || "MZN",
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className={normalCell}>{r.moeda || "MZN"}</td>
                <td className="px-3 py-2">
                  <span className={getStatusClasses(r.status)}>
                    {r.status}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    className={actionButton}
                    onClick={() =>
                      console.log("Ver recibo", r.id || r.numero)
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

export default RecibosTable;
