import React from "react";

function ClienteExtratoTable({ extrato = [], clienteNome }) {
  const total = extrato.reduce(
    (sum, mov) => sum + (Number(mov.valor) || 0),
    0
  );

  return (
    <div className="mt-6">
      <div className="mb-4 p-4 bg-sky-50 rounded-md border border-sky-200">
        <h3 className="text-lg font-semibold text-slate-800">
          Extrato: {clienteNome}
        </h3>
      </div>
      <div className="rounded-md border border-sky-100 bg-white p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs md:text-sm">
            <thead className="border-b border-slate-100 text-slate-600 uppercase tracking-wide text-[11px] bg-sky-50">
              <tr>
                <th className="px-3 py-2">Data</th>
                <th className="px-3 py-2">Nº Doc.</th>
                <th className="px-3 py-2">Tipo</th>
                <th className="px-3 py-2 text-right">Valor</th>
                <th className="px-3 py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {extrato.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-6 text-center text-slate-400"
                  >
                    Sem movimentos.
                  </td>
                </tr>
              ) : (
                extrato.map((mov) => (
                  <tr
                    key={mov.id}
                    className="border-b border-slate-100 hover:bg-sky-50"
                  >
                    <td className="px-3 py-2 text-slate-600">
                      {mov.data}
                    </td>
                    <td className="px-3 py-2 text-slate-800">
                      {mov.numero}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          mov.tipo === "Factura"
                            ? "bg-blue-100 text-blue-800"
                            : mov.tipo === "Recibo"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {mov.tipo}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right font-medium text-slate-800">
                      {Number(mov.valor || 0).toLocaleString("pt-MZ", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          mov.status === "Pago"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : "bg-amber-100 text-amber-800 border-amber-200"
                        }`}
                      >
                        {mov.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 text-xs text-slate-700 flex flex-col md:flex-row md:items-center md:justify-between gap-1">
          <span>
            Total movimentado:{" "}
            <strong className="text-orange-600">
              {total.toLocaleString("pt-MZ", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>
          </span>
          <span className="italic text-slate-500">
            ({numeroPorExtensoMeticais(total)})
          </span>
        </div>
      </div>
    </div>
  );
}

export default ClienteExtratoTable;
