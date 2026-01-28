import React from "react";

function CaixaTable({ movimentos = [] }) {
  return (
    <div className="rounded-md border border-sky-100 bg-white p-4 md:p-6 shadow-sm text-slate-800 text-sm">
      <div className="mb-3 flex items-center justify-between text-xs text-slate-600">
        <span>Movimentos de Caixa</span>
        <span className="text-slate-500">
          Total: <strong>{movimentos.length}</strong>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs md:text-sm">
          <thead className="border-b border-slate-100 text-slate-600 uppercase tracking-wide text-[11px] bg-sky-50">
            <tr>
              <th className="px-3 py-2">Descrição</th>
              <th className="px-3 py-2">Tipo</th>
              <th className="px-3 py-2">Data</th>
              <th className="px-3 py-2 text-right">Valor</th>
              <th className="px-3 py-2">Moeda</th>
              <th className="px-3 py-2">Acção</th>
            </tr>
          </thead>
          <tbody>
            {movimentos.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-6 text-center text-slate-500 text-xs"
                >
                  Nenhum movimento registado.
                </td>
              </tr>
            )}

            {movimentos.map((m) => (
              <tr
                key={m.id || m.descricao}
                className={`border-b border-slate-100 hover:bg-sky-50 transition-colors ${
                  m.novo ? "bg-sky-50/80" : ""
                }`}
              >
                <td className="px-3 py-2">{m.descricao}</td>
                <td className="px-3 py-2">
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border",
                      m.tipo === "Entrada"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200",
                    ].join(" ")}
                  >
                    {m.tipo}
                  </span>
                </td>
                <td className="px-3 py-2 text-[11px] md:text-xs text-slate-600">
                  {m.data}
                </td>
                <td className="px-3 py-2 text-right">
                  {m.valor?.toLocaleString("pt-MZ", {
                    style: "currency",
                    currency: m.moeda || "MZN",
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="px-3 py-2 text-slate-700">
                  {m.moeda || "MZN"}
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    className="rounded-md border border-slate-200 bg-white hover:bg-slate-50 px-2 py-1 text-[10px] text-slate-700"
                    onClick={() =>
                      console.log("Ver movimento", m.id || m.descricao)
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

export default CaixaTable;
