function CotacoesTable({ cotacoes = [], temaAtual = "light" }) {
  const isDark = temaAtual === "dark";

  const container =
    "rounded-md border p-4 md:p-6 shadow-sm text-sm " +
    (isDark
      ? "border-slate-800 bg-slate-900 text-slate-100"
      : "border-sky-100 bg-white text-slate-800");

  const headerBar =
    "mb-3 flex items-center justify-between text-xs " +
    (isDark ? "text-slate-400" : "text-slate-600");

  const totalText = isDark ? "text-slate-400" : "text-slate-500";

  const theadClasses =
    "border-b uppercase tracking-wide text-[11px] " +
    (isDark
      ? "border-slate-800 text-slate-300 bg-slate-800"
      : "border-slate-100 text-slate-600 bg-sky-50");

  const emptyText =
    "px-3 py-6 text-center text-xs " +
    (isDark ? "text-slate-500" : "text-slate-500");

  const rowBorder = isDark ? "border-slate-800" : "border-slate-100";
  const rowHover = isDark ? "hover:bg-slate-800" : "hover:bg-sky-50";

  const cellMuted =
    "px-3 py-2 text-[11px] md:text-xs " +
    (isDark ? "text-slate-400" : "text-slate-600");
  const cellMono =
    "px-3 py-2 text-[11px] md:text-xs font-mono " +
    (isDark ? "text-slate-100" : "text-slate-800");
  const cellText = "px-3 py-2 " + (isDark ? "text-slate-100" : "text-slate-800");
  const cellRight = cellText + " text-right";

  const btnVer =
    "rounded-md border px-2 py-1 text-[10px] " +
    (isDark
      ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50");

  return (
    <div className={container}>
      <div className={headerBar}>
        <span>Cotações</span>
        <span className={totalText}>
          Total: <strong>{cotacoes.length}</strong>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs md:text-sm">
          <thead className={theadClasses}>
            <tr>
              <th className="px-3 py-2">Data</th>
              <th className="px-3 py-2">Cotação nº</th>
              <th className="px-3 py-2">Nome do cliente</th>
              <th className="px-3 py-2 text-right">Valor s/IVA</th>
              <th className="px-3 py-2 text-right">IVA</th>
              <th className="px-3 py-2 text-right">Valor c/IVA</th>
              <th className="px-3 py-2">Acção</th>
            </tr>
          </thead>
          <tbody>
            {cotacoes.length === 0 && (
              <tr>
                <td colSpan={7} className={emptyText}>
                  Nenhuma cotação registada.
                </td>
              </tr>
            )}

            {cotacoes.map((c) => {
              const valorSemIva = Number(
                c.valorSemIva ?? c.subTotal ?? c.sub_total ?? 0
              );
              const iva = Number(
                c.iva ?? c.impostoTotal ?? c.imposto_total ?? 0
              );
              const valorComIva = Number(
                c.valorComIva ??
                  c.totalDocumento ??
                  c.total_documento ??
                  valorSemIva + iva
              );

              return (
                <tr
                  key={c.id || c.numero || c.referencia}
                  className={`border-b ${rowBorder} ${rowHover} transition-colors`}
                >
                  <td className={cellMuted}>{c.data}</td>
                  <td className={cellMono}>{c.numero ?? c.referencia}</td>
                  <td className={cellText}>
                    {c.cliente ?? c.cliente_nome}
                  </td>

                  <td className={cellRight}>
                    {valorSemIva.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className={cellRight}>
                    {iva.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className={cellRight}>
                    {valorComIva.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>

                  <td className="px-3 py-2">
                    <button
                      type="button"
                      className={btnVer}
                      onClick={() =>
                        console.log(
                          "Ver cotação",
                          c.id || c.numero || c.referencia
                        )
                      }
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

export default CotacoesTable;
