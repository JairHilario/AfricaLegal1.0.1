import React from "react";

const formatDate = (iso) => {
  if (!iso) return "";
  const [y, m, d] = String(iso).split("-");
  if (!d || !m || !y) return iso;
  return `${d}/${m}/${y}`;
};

function DespesasTable({ despesas = [], temaAtual = "light" }) {
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

  const botaoVer = isDark
    ? "rounded-md border border-slate-600 bg-slate-800 hover:bg-slate-700 px-2 py-1 text-[10px] text-slate-100"
    : "rounded-md border border-slate-200 bg-white hover:bg-slate-50 px-2 py-1 text-[10px] text-slate-700";

  return (
    <div className={wrapper}>
      <div className={headerInfo}>
        <span>Despesas</span>
        <span className={isDark ? "text-slate-300" : "text-slate-500"}>
          Total: <strong>{despesas.length}</strong>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs md:text-sm">
          <thead className={theadClasse}>
            <tr>
              <th className="px-3 py-2">Nome da conta</th>
              <th className="px-3 py-2">Número da conta</th>
              <th className="px-3 py-2">Descrição</th>
              <th className="px-3 py-2">Categoria</th>
              <th className="px-3 py-2 text-right">Total</th>
              <th className="px-3 py-2">Data</th>
              <th className="px-3 py-2">Acção</th>
            </tr>
          </thead>
          <tbody>
            {despesas.length === 0 && (
              <tr>
                <td colSpan={7} className={emptyClasse}>
                  Nenhuma despesa registada.
                </td>
              </tr>
            )}

            {despesas.map((d) => (
              <tr key={d.id} className={linhaClasse}>
                <td className="px-3 py-2">
                  {d.nomeConta || ""}
                </td>
                <td className="px-3 py-2 font-mono text-[11px] md:text-xs">
                  {d.numeroConta || ""}
                </td>
                <td className="px-3 py-2 truncate max-w-xs">
                  {d.descricao}
                </td>
                <td className="px-3 py-2">
                  {d.categoria}
                </td>
                <td className="px-3 py-2 text-right">
                  {d.total?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-3 py-2 text-[11px] md:text-xs text-slate-400">
                  {formatDate(d.data)}
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    className={botaoVer}
                    onClick={() => console.log("Ver despesa", d.id)}
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

export default DespesasTable;
