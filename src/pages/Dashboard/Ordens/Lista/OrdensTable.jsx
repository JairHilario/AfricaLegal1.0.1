import React from "react";

function OrdensTable({ ordens = [], temaAtual = "dark" }) {
  const isDark = temaAtual === "dark";

  const wrapper = isDark
    ? "rounded-md border border-slate-800 bg-slate-900 p-4 md:p-6 shadow-sm text-slate-100 text-sm"
    : "rounded-md border border-sky-100 bg-white p-4 md:p-6 shadow-sm text-slate-800 text-sm";

  const headerInfo = isDark
    ? "mb-3 flex items-center justify-between text-xs text-slate-300"
    : "mb-3 flex items-center justify-between text-xs text-slate-600";

  const theadClasse = isDark
    ? "border-b border-slate-700 text-slate-300 uppercase tracking-wide text-[11px] bg-slate-800"
    : "border-b border-slate-100 text-slate-600 uppercase tracking-wide text-[11px] bg-sky-50";

  const linhaClasse = isDark
    ? "border-b border-slate-800 hover:bg-slate-800/60 transition-colors"
    : "border-b border-slate-100 hover:bg-sky-50 transition-colors";

  const emptyClasse = "px-3 py-6 text-center text-slate-400 text-xs";

  const statusClasse = (status) => {
    if (status === "concluída") {
      return isDark
        ? "bg-emerald-900/40 text-emerald-300 border-emerald-700"
        : "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (status === "em progresso") {
      return isDark
        ? "bg-sky-900/40 text-sky-300 border-sky-700"
        : "bg-sky-50 text-sky-700 border-sky-200";
    }
    if (status === "cancelada") {
      return isDark
        ? "bg-rose-900/40 text-rose-300 border-rose-700"
        : "bg-rose-50 text-rose-700 border-rose-200";
    }
    return isDark
      ? "bg-amber-900/40 text-amber-300 border-amber-700"
      : "bg-amber-50 text-amber-700 border-amber-200";
  };

  const botaoVer = isDark
    ? "rounded-md border border-slate-600 bg-slate-800 hover:bg-slate-700 px-2 py-1 text-[10px] text-slate-100"
    : "rounded-md border border-slate-200 bg-white hover:bg-slate-50 px-2 py-1 text-[10px] text-slate-700";

  return (
    <div className={wrapper}>
      <div className={headerInfo}>
        <span>Ordens</span>
        <span className={isDark ? "text-slate-300" : "text-slate-500"}>
          Total: <strong>{ordens.length}</strong>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs md:text-sm">
          <thead className={theadClasse}>
            <tr>
              <th className="px-3 py-2">Nº Ordem</th>
              <th className="px-3 py-2">Cliente</th>
              <th className="px-3 py-2">Conta origem</th>
              <th className="px-3 py-2">Conta destino</th>
              <th className="px-3 py-2 text-right">Valor</th>
              <th className="px-3 py-2">Moeda</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Data</th>
              <th className="px-3 py-2">Acção</th>
            </tr>
          </thead>
          <tbody>
            {ordens.length === 0 && (
              <tr>
                <td colSpan={9} className={emptyClasse}>
                  Nenhuma ordem registada.
                </td>
              </tr>
            )}

            {ordens.map((o) => (
              <tr key={o.id || o.numero} className={linhaClasse}>
                <td className="px-3 py-2 text-[11px] md:text-xs font-mono">
                  {o.numero}
                </td>
                <td className="px-3 py-2">{o.cliente}</td>
                <td className="px-3 py-2 text-[11px] md:text-xs font-mono">
                  {o.contaOrigem}
                </td>
                <td className="px-3 py-2 text-[11px] md:text-xs font-mono">
                  {o.contaDestino}
                </td>
                <td className="px-3 py-2 text-right">
                  {o.valor?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-3 py-2">
                  {o.moeda || "MZN"}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border",
                      statusClasse(o.status),
                    ].join(" ")}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-[11px] md:text-xs text-slate-400">
                  {o.data}
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    className={botaoVer}
                    onClick={() =>
                      console.log("Ver ordem", o.id || o.numero)
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

export default OrdensTable;
