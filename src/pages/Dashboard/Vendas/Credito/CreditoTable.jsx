import React from "react";

const formatMoney = (v) =>
  Number(v || 0).toLocaleString("pt-MZ", {
    style: "currency",
    currency: "MZN",
    minimumFractionDigits: 2,
  });

function CreditoTable({ creditos = [], temaAtual = "light" }) {
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
    if (status === "Liquidado") {
      return (
        badgeBase +
        " " +
        (isDark
          ? "bg-emerald-900/30 text-emerald-300 border-emerald-700"
          : "bg-emerald-50 text-emerald-700 border-emerald-200")
      );
    }
    if (status === "Vencido") {
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
        ? "bg-sky-900/30 text-sky-300 border-sky-700"
        : "bg-sky-50 text-sky-700 border-sky-200")
    );
  };

  return (
    <div className={containerClasses}>
      <div className="mb-3 flex items-center justify-between text-xs">
        <span className={isDark ? "text-slate-300" : "text-slate-600"}>
          Créditos
        </span>
        <span className={isDark ? "text-slate-400" : "text-slate-500"}>
          Total: <strong>{creditos.length}</strong>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs md:text-sm">
          <thead className={headerRowClasses}>
            <tr>
              <th className="px-3 py-2">Data do Crédito</th>
              <th className="px-3 py-2">Crédito nº</th>
              <th className="px-3 py-2">Nome do cliente</th>
              <th className="px-3 py-2">Factura nº</th>
              <th className="px-3 py-2 text-right">Valor s/IVA</th>
              <th className="px-3 py-2 text-right">IVA 17%</th>
              <th className="px-3 py-2 text-right">Valor c/IVA</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Acção</th>
            </tr>
          </thead>
          <tbody>
            {creditos.length === 0 && (
              <tr>
                <td colSpan={9} className={emptyTextClasses}>
                  Nenhum crédito registado.
                </td>
              </tr>
            )}

            {creditos.map((c) => (
              <tr
                key={c.id || c.referencia}
                className={
                  bodyRowBase +
                  (c.novo
                    ? isDark
                      ? " bg-sky-900/20"
                      : " bg-sky-50/80"
                    : "")
                }
              >
                <td className={dateCell}>{c.data}</td>
                <td className={monoCell}>{c.referencia}</td>
                <td className={normalCell}>{c.cliente}</td>
                <td className={monoCell}>{c.facturaNumero}</td>
                <td className={moneyCell}>{formatMoney(c.valorSemIva)}</td>
                <td className={moneyCell}>{formatMoney(c.valorIva)}</td>
                <td className={moneyCell}>
                  {formatMoney(c.valorComIva ?? c.valor)}
                </td>
                <td className="px-3 py-2">
                  <span className={getStatusClasses(c.status)}>
                    {c.status}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    className={actionButton}
                    onClick={() =>
                      console.log("Ver crédito", c.id || c.referencia)
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

export default CreditoTable;
