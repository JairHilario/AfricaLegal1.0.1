import React from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";

function FacturasTable({ facturas = [], onEdit, onDelete, temaAtual = "light" }) {
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

  const bodyRowClasses =
    (isDark
      ? "border-b border-slate-800 hover:bg-slate-800/60"
      : "border-b border-slate-100 hover:bg-sky-50") + " transition-colors";

  const emptyTextClasses =
    "px-3 py-6 text-center text-xs " +
    (isDark ? "text-slate-500" : "text-slate-400");

  const monoCellClasses =
    "px-3 py-2 text-[11px] md:text-xs font-mono " +
    (isDark ? "text-slate-100" : "text-slate-800");

  const normalCell =
    "px-3 py-2 " + (isDark ? "text-slate-100" : "text-slate-800");

  const mutedCell =
    "px-3 py-2 text-[11px] md:text-xs " +
    (isDark ? "text-slate-400" : "text-slate-600");

  const moneyCell =
    "px-3 py-2 text-right " + (isDark ? "text-slate-100" : "text-slate-800");

  const actionButtonBase =
    "inline-flex items-center justify-center rounded-md border px-1.5 py-1 text-[10px] bg-transparent";

  const editButton =
    actionButtonBase +
    " " +
    (isDark
      ? "border-sky-700 text-sky-300 hover:bg-sky-900/40"
      : "border-sky-200 bg-white hover:bg-sky-50 text-sky-700");

  const deleteButton =
    actionButtonBase +
    " " +
    (isDark
      ? "border-rose-700 text-rose-300 hover:bg-rose-900/40"
      : "border-rose-200 bg-white hover:bg-rose-50 text-rose-700");

  const badgeBase =
    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border";

  const getStatusClasses = (status) => {
    if (status === "Paga") {
      return (
        badgeBase +
        " " +
        (isDark
          ? "bg-emerald-900/30 text-emerald-300 border-emerald-700"
          : "bg-emerald-50 text-emerald-700 border-emerald-200")
      );
    }
    if (status === "Vencida") {
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
          Facturas
        </span>
        <span className={isDark ? "text-slate-400" : "text-slate-500"}>
          Total: <strong>{facturas.length}</strong>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs md:text-sm">
          <thead className={headerRowClasses}>
            <tr>
              <th className="px-3 py-2">Nº Factura</th>
              <th className="px-3 py-2">Cliente</th>
              <th className="px-3 py-2">Data</th>
              <th className="px-3 py-2">Vencimento</th>
              <th className="px-3 py-2 text-right">Total</th>
              <th className="px-3 py-2 text-right">Em aberto</th>
              <th className="px-3 py-2">Moeda</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2 text-right">Acção</th>
            </tr>
          </thead>
          <tbody>
            {facturas.length === 0 && (
              <tr>
                <td colSpan={9} className={emptyTextClasses}>
                  Nenhuma factura registada.
                </td>
              </tr>
            )}

            {facturas.map((f) => (
              <tr key={f.id} className={bodyRowClasses}>
                <td className={monoCellClasses}>{f.referencia}</td>

                <td className={normalCell}>{f.cliente}</td>

                <td className={mutedCell}>{f.data}</td>

                <td className={mutedCell}>{f.prazoVencimento || "-"}</td>

                <td className={moneyCell}>
                  {(f.valor || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>

                <td className={moneyCell}>
                  {(f.valor || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>

                <td className={normalCell}>{f.moeda || "MZN"}</td>

                <td className="px-3 py-2">
                  <span className={getStatusClasses(f.status)}>
                    {f.status}
                  </span>
                </td>

                <td className="px-3 py-2 text-right space-x-1">
                  <button
                    type="button"
                    className={editButton}
                    onClick={() => onEdit && onEdit(f)}
                    aria-label="Editar factura"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className={deleteButton}
                    onClick={() => onDelete && onDelete(f.id)}
                    aria-label="Apagar factura"
                  >
                    <TrashIcon className="h-4 w-4" />
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

export default FacturasTable;
