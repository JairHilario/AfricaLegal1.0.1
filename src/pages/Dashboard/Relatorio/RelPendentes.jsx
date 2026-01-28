import React, { useEffect, useState } from "react";
import { numeroPorExtensoMeticais } from "../../../context/numeroPorExtenso";

function RelPendentesTable({ temaAtual = "dark" }) {
  const [rows, setRows] = useState([]);

  const isDark = temaAtual === "dark";

  const wrapper = isDark
    ? "rounded-md border border-slate-800 bg-slate-900 p-4 md:p-6 shadow-sm text-slate-100 text-sm"
    : "rounded-md border border-sky-100 bg-white p-4 md:p-6 shadow-sm text-slate-800 text-sm";

  const headerInfo = isDark
    ? "mb-3 flex items-center justify-between text-xs text-slate-300"
    : "mb-3 flex items-center justify-between text-xs text-slate-600";

  const theadClasse = isDark
    ? "border-b border-slate-700 text-slate-300 uppercase tracking-wide text-[11px] bg-slate-800"
    : "border-b border-slate-100 text-slate-600 uppercase tracking-wide text-[11px] bg-orange-50";

  const linha = isDark
    ? "border-b border-slate-800"
    : "border-b border-slate-100";

  const statusClasse = (status) =>
    status === "Pendente"
      ? isDark
        ? "bg-amber-900/40 text-amber-300 border-amber-700"
        : "bg-amber-50 text-amber-700 border-amber-200"
      : isDark
      ? "bg-emerald-900/40 text-emerald-300 border-emerald-700"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";

  const emptyClasse = "px-3 py-4 text-center text-slate-400 text-xs";

  const totalLinha = isDark
    ? "mt-3 text-xs text-slate-300 flex flex-col md:flex-row md:items-center md:justify-between gap-1"
    : "mt-3 text-xs text-slate-700 flex flex-col md:flex-row md:items-center md:justify-between gap-1";

  const totalValorClasse = isDark
    ? "text-orange-400"
    : "text-orange-600";

  const totalExtensoClasse = isDark
    ? "italic text-slate-400"
    : "italic text-slate-500";

  const formatValor = (valor) => {
    if (!valor || isNaN(Number(valor))) return "0";
    const num = Number(valor);
    if (num === 0) return "0";
    if (num % 1 === 0) return num.toLocaleString("pt-MZ");
    return num.toLocaleString("pt-MZ", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const totalGeral = rows.reduce(
    (sum, r) => sum + (Number(r.valor) || 0),
    0
  );

  useEffect(() => {
    fetch("http://localhost:4000/rel-pendentes")
      .then((res) => res.json())
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao buscar pendentes", err));
  }, []);

  return (
    <div className={wrapper}>
      <div className={headerInfo}>
        <span>Relatório de Pendentes</span>
        <span className={isDark ? "text-slate-300" : "text-slate-500"}>
          Total: <strong>{rows.length}</strong>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs md:text-sm">
          <thead className={theadClasse}>
            <tr>
              <th className="px-3 py-2">Data</th>
              <th className="px-3 py-2">Cliente</th>
              <th className="px-3 py-2">Tipo</th>
              <th className="px-3 py-2">Referência</th>
              <th className="px-3 py-2 text-right">Valor</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className={linha}>
                <td className="px-3 py-2 text-[11px] md:text-xs text-slate-400">
                  {r.data}
                </td>
                <td className="px-3 py-2 font-semibold">
                  {r.cliente}
                </td>
                <td className="px-3 py-2 text-slate-400">
                  {r.tipo}
                </td>
                <td className="px-3 py-2 text-slate-400">
                  {r.referencia}
                </td>
                <td className="px-3 py-2 text-right text-orange-400 font-bold">
                  {formatValor(r.valor)}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border",
                      statusClasse(r.status),
                    ].join(" ")}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className={emptyClasse}>
                  Nenhum pendente encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={totalLinha}>
        <span>
          Total pendente:{" "}
          <strong className={totalValorClasse}>
            {formatValor(totalGeral)}
          </strong>
        </span>
        <span className={totalExtensoClasse}>
          ({numeroPorExtensoMeticais(totalGeral)})
        </span>
      </div>
    </div>
  );
}

export default RelPendentesTable;
