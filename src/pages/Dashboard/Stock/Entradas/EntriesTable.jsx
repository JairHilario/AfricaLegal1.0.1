import React from "react";

function EntriesTable({ movimentos = [], temaAtual = "light" }) {
  const isDark = temaAtual === "dark";

  const containerClasses =
    "rounded-md border p-4 md:p-6 shadow-sm " +
    (isDark
      ? "border-slate-800 bg-slate-900"
      : "border-sky-100 bg-white");

  const titleClasses =
    "mb-3 text-sm font-semibold uppercase tracking-wide " +
    (isDark ? "text-slate-200" : "text-slate-700");

  const innerBoxClasses =
    "overflow-x-auto rounded-md border shadow-sm " +
    (isDark
      ? "border-slate-800 bg-slate-900"
      : "border-sky-100 bg-white");

  const headCell =
    "px-4 py-2 text-xs font-semibold " +
    (isDark ? "text-slate-300" : "text-slate-600");

  const rowBase =
    "transition-colors " +
    (isDark ? "hover:bg-slate-800" : "hover:bg-sky-50");

  const tdText = (extra = "") =>
    "px-4 py-2 " +
    extra +
    " " +
    (isDark ? "text-slate-300" : "text-slate-700");

  return (
    <div className={containerClasses}>
      <h2 className={titleClasses}>Movimentos de estoque</h2>

      <div className={innerBoxClasses}>
        <table
          className={
            "min-w-full divide-y text-sm " +
            (isDark
              ? "divide-slate-800 text-slate-100"
              : "divide-slate-100 text-slate-800")
          }
        >
          <thead className={isDark ? "bg-slate-800" : "bg-sky-50"}>
            <tr>
              <th className={headCell + " text-left"}>Referência</th>
              <th className={headCell + " text-left"}>Item</th>
              <th className={headCell + " text-left"}>Categoria</th>
              <th className={headCell + " text-right"}>Quantidade</th>
              <th className={headCell + " text-left"}>Data</th>
            </tr>
          </thead>
          <tbody
            className={
              isDark
                ? "divide-y divide-slate-800"
                : "divide-y divide-slate-100"
            }
          >
            {movimentos.map((m) => (
              <tr key={m.id} className={rowBase}>
                <td className={tdText()}>
                  {m.referencia || "-"}
                </td>
                <td className={tdText()}>{m.nome}</td>
                <td className={tdText()}>
                  {m.categoria || "-"}
                </td>
                <td className={tdText("text-right")}>
                  {m.quantidade}
                </td>
                <td className={tdText()}>
                  {(m.criadoEm || "").slice(0, 10)}
                </td>
              </tr>
            ))}

            {movimentos.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className={
                    "px-4 py-4 text-center text-xs " +
                    (isDark ? "text-slate-500" : "text-slate-500")
                  }
                >
                  Nenhum movimento registado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EntriesTable;
