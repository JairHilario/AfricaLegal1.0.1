import React from "react";

const formatDate = (iso) => {
  if (!iso) return "";
  const onlyDate = String(iso).split("T")[0];
  const [y, m, d] = onlyDate.split("-");
  return `${d}/${m}/${y}`;
};

function StockTable({ produtos, temaAtual = "light" }) {
  const isDark = temaAtual === "dark";

  if (!Array.isArray(produtos)) {
    return (
      <div
        className={
          "mb-4 rounded-md border p-3 text-sm " +
          (isDark
            ? "border-rose-700 bg-rose-900/30 text-rose-200"
            : "border-rose-200 bg-rose-50 text-rose-700")
        }
      >
        Erro: lista de produtos não está disponível.
      </div>
    );
  }

  const headCell =
    "px-4 py-2 text-xs font-semibold " +
    (isDark ? "text-slate-300" : "text-slate-600");

  const rowBase =
    "transition-colors " +
    (isDark ? "hover:bg-slate-800" : "hover:bg-sky-50");

  const chipStatus = (status) =>
    "px-2 py-1 rounded-full text-[11px] font-medium border " +
    (status === "Disponível"
      ? isDark
        ? "bg-emerald-900/30 text-emerald-300 border-emerald-700"
        : "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "Reposição"
      ? isDark
        ? "bg-amber-900/30 text-amber-300 border-amber-700"
        : "bg-amber-50 text-amber-700 border-amber-200"
      : isDark
      ? "bg-slate-800 text-slate-300 border-slate-600"
      : "bg-slate-50 text-slate-700 border-slate-200");

  return (
    <div
      className={
        "overflow-x-auto mb-4 rounded-md border shadow-sm " +
        (isDark
          ? "border-slate-800 bg-slate-900"
          : "border-sky-100 bg-white")
      }
    >
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
            <th className={headCell + " text-left"}>Nome</th>
            <th className={headCell + " text-left"}>Referência</th>
            <th className={headCell + " text-left"}>Categoria</th>
            <th className={headCell + " text-right"}>Quantidade</th>
            <th className={headCell + " text-right"}>Preço (MZN)</th>
            <th className={headCell + " text-left"}>Estado</th>
            <th className={headCell + " text-left"}>Criado em</th>
          </tr>
        </thead>
        <tbody
          className={
            isDark
              ? "divide-y divide-slate-800"
              : "divide-y divide-slate-100"
          }
        >
          {produtos.map((p) => (
            <tr key={p.id} className={rowBase}>
              <td className="px-4 py-2">{p.nome}</td>
              <td
                className={
                  "px-4 py-2 " +
                  (isDark ? "text-slate-300" : "text-slate-700")
                }
              >
                {p.referencia}
              </td>
              <td
                className={
                  "px-4 py-2 " +
                  (isDark ? "text-slate-300" : "text-slate-700")
                }
              >
                {p.categoria}
              </td>
              <td
                className={
                  "px-4 py-2 text-right " +
                  (isDark ? "text-slate-200" : "text-slate-700")
                }
              >
                {p.quantidade ?? 0}
              </td>
              <td
                className={
                  "px-4 py-2 text-right " +
                  (isDark ? "text-slate-200" : "text-slate-700")
                }
              >
                {Number(p.preco || 0).toFixed(2)}
              </td>
              <td className="px-4 py-2">
                <span className={chipStatus(p.status || "Disponível")}>
                  {p.status || "Disponível"}
                </span>
              </td>
              <td
                className={
                  "px-4 py-2 " +
                  (isDark ? "text-slate-400" : "text-slate-600")
                }
              >
                {formatDate(p.criadoEm)}
              </td>
            </tr>
          ))}

          {produtos.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className={
                  "px-4 py-4 text-center text-xs " +
                  (isDark ? "text-slate-500" : "text-slate-500")
                }
              >
                Nenhum produto encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StockTable;
