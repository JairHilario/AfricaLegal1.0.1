import React from "react";

const formatDate = (iso) => {
  if (!iso) return "";
  const onlyDate = String(iso).split("T")[0];
  const [y, m, d] = onlyDate.split("-");
  return `${d}/${m}/${y}`;
};

function VendasTable({ vendas = [], onViewVenda, temaAtual = "light" }) {
  const isDark = temaAtual === "dark";

  const containerClasses = isDark
    ? "rounded-md border border-slate-800 bg-slate-900 p-4 md:p-6 shadow-sm text-slate-100 text-sm"
    : "rounded-md border border-sky-100 bg-white p-4 md:p-6 shadow-sm text-slate-800 text-sm";

  const headerRowClasses = isDark
    ? "border-b border-slate-700 text-slate-200 uppercase tracking-wide text-[11px] bg-slate-800"
    : "border-b border-slate-100 text-slate-600 uppercase tracking-wide text-[11px] bg-sky-50";

  const emptyTextClasses = isDark
    ? "px-3 py-6 text-center text-slate-500 text-xs"
    : "px-3 py-6 text-center text-slate-400 text-xs";

  const rowBorder = isDark ? "border-b border-slate-800" : "border-b border-slate-100";
  const rowHover = isDark ? "hover:bg-slate-800" : "hover:bg-sky-50";

  const numText = isDark
    ? "px-3 py-2 text-[11px] md:text-xs font-mono text-slate-100"
    : "px-3 py-2 text-[11px] md:text-xs font-mono text-slate-800";

  const cellText = isDark ? "text-slate-100" : "text-slate-800";
  const dateText = isDark ? "text-slate-400" : "text-slate-600";

  const buttonClasses = isDark
    ? "rounded-md border border-slate-700 bg-slate-900 hover:bg-slate-800 px-2 py-1 text-[10px] text-slate-100"
    : "rounded-md border border-slate-200 bg-white hover:bg-slate-50 px-2 py-1 text-[10px] text-slate-700";

  return (
    <div className={containerClasses}>
      <div className="mb-3 flex items-center justify-between text-xs">
        <span className={isDark ? "text-slate-300" : "text-slate-600"}>Vendas</span>
        <span className={isDark ? "text-slate-400" : "text-slate-500"}>
          Total: <strong>{vendas.length}</strong>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs md:text-sm">
          <thead className={headerRowClasses}>
            <tr>
              <th className="px-3 py-2">Nº Venda</th>
              <th className="px-3 py-2">Cliente</th>
              <th className="px-3 py-2">Data</th>
              <th className="px-3 py-2 text-right">Total</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Acção</th>
            </tr>
          </thead>
          <tbody>
            {vendas.length === 0 && (
              <tr>
                <td colSpan={6} className={emptyTextClasses}>
                  Nenhuma venda registada.
                </td>
              </tr>
            )}

            {vendas.map((v) => {
              const chipClasses =
                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border " +
                (v.estado === "paga" || v.estado === "Paga"
                  ? isDark
                    ? "bg-emerald-900/30 text-emerald-300 border-emerald-700"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : v.estado === "vencida" || v.estado === "Vencida"
                  ? isDark
                    ? "bg-rose-900/30 text-rose-300 border-rose-700"
                    : "bg-rose-50 text-rose-700 border-rose-200"
                  : isDark
                  ? "bg-amber-900/30 text-amber-300 border-amber-700"
                  : "bg-amber-50 text-amber-700 border-amber-200");

              return (
                <tr
                  key={v.id || v.numero}
                  className={`${rowBorder} ${rowHover} transition-colors`}
                >
                  <td className={numText}>{v.numero}</td>
                  <td className={`px-3 py-2 ${cellText}`}>{v.cliente}</td>
                  <td className={`px-3 py-2 text-[11px] md:text-xs ${dateText}`}>
                    {formatDate(v.data)}
                  </td>
                  <td className={`px-3 py-2 text-right ${cellText}`}>
                    {Number(v.total || 0).toLocaleString("pt-MZ", {
                      style: "currency",
                      currency: v.moeda || "MZN",
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-3 py-2">
                    <span className={chipClasses}>{v.estado}</span>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      className={buttonClasses}
                      onClick={() => onViewVenda && onViewVenda(v)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VendasTable;
