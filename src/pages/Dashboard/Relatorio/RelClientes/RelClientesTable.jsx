import React, { useState, useEffect } from "react";

function RelClientesTable({ relatorios = [], temaAtual = "dark" }) {
  const [extratos, setExtratos] = useState({});
  const [carregando, setCarregando] = useState({});
  const [totalGeral, setTotalGeral] = useState(0);

  const isDark = temaAtual === "dark";

  const wrapper = isDark
    ? "rounded-md border border-slate-800 bg-slate-900 p-4 md:p-6 shadow-sm text-slate-100 text-sm"
    : "rounded-md border border-sky-100 bg-white p-4 md:p-6 shadow-sm text-slate-800 text-sm";

  const headerInfo = isDark
    ? "mb-3 flex items-center justify-between text-xs text-slate-300"
    : "mb-3 flex items-center justify-between text-xs text-slate-600";

  const totalGeralClasse = isDark
    ? "text-sky-400 font-bold"
    : "text-sky-600 font-bold";

  const theadClasse = isDark
    ? "border-b border-slate-700 text-slate-300 uppercase tracking-wide text-[11px] bg-slate-800"
    : "border-b border-slate-100 text-slate-600 uppercase tracking-wide text-[11px] bg-sky-50";

  const linhaCliente = isDark
    ? "border-b border-slate-800 bg-slate-900/40"
    : "border-b border-slate-100 bg-sky-25";

  const subTabelaWrapper = isDark
    ? "bg-slate-900 border border-slate-700 rounded-md overflow-hidden shadow-sm ml-6"
    : "bg-white border border-sky-100 rounded-md overflow-hidden shadow-sm ml-6";

  const subHeader = isDark
    ? "p-3 bg-slate-800 border-b border-slate-700"
    : "p-3 bg-sky-50 border-b border-sky-200";

  const subHeaderTitulo = isDark
    ? "text-xs font-medium text-slate-200"
    : "text-xs font-medium text-slate-700";

  const subThead = isDark
    ? "bg-slate-800"
    : "bg-gray-50";

  const debugBox = isDark
    ? "mt-2 p-2 bg-amber-900/30 border border-amber-600 rounded text-xs text-amber-200"
    : "mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800";

  // ------------ Lógica original (sem mexer) ------------

  const formatValor = (valor) => {
    if (!valor || isNaN(Number(valor))) return "0";
    const num = Number(valor);
    if (num === 0) return "0";
    if (num % 1 === 0) {
      return num.toLocaleString("pt-MZ");
    }
    return num.toLocaleString("pt-MZ", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  useEffect(() => {
    const carregarTodos = async () => {
      if (relatorios.length === 0) return;

      const novosExtratos = { ...extratos };
      const novosCarregando = {};

      for (const r of relatorios) {
        if (!extratos[r.id] && !carregando[r.id]) {
          novosCarregando[r.id] = true;
          try {
            const resp = await fetch(
              `http://localhost:4000/clientes/${r.id}/extrato`
            );
            if (!resp.ok) throw new Error("Erro na API");
            const data = await resp.json();
            novosExtratos[r.id] = data;
          } catch (err) {
            console.error(`Erro extrato ${r.id}:`, err);
            novosExtratos[r.id] = [];
          }
        }
      }

      setCarregando(novosCarregando);
      setExtratos(novosExtratos);
    };

    carregarTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relatorios]);

  useEffect(() => {
    setCarregando({});
  }, [extratos]);

  useEffect(() => {
    const total = Object.values(extratos)
      .flat()
      .reduce((sum, mov) => sum + (Number(mov.valor) || 0), 0);
    setTotalGeral(total);
  }, [extratos]);

  const getSomaCliente = (id) => {
    const movimentos = extratos[id] || [];
    return movimentos.reduce(
      (sum, mov) => sum + (Number(mov.valor) || 0),
      0
    );
  };

  // ------------ JSX ------------

  return (
    <div className={wrapper}>
      <div className={headerInfo}>
        <span>Relatórios de Clientes (Extratos Completos)</span>
        <span className={isDark ? "text-slate-300" : "text-slate-500"}>
          Total Clientes: <strong>{relatorios.length}</strong> | Total Geral:{" "}
          <strong className={totalGeralClasse}>
            {formatValor(totalGeral)}
          </strong>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs md:text-sm">
          <thead className={theadClasse}>
            <tr>
              <th className="px-3 py-2">Data</th>
              <th className="px-3 py-2">Cliente</th>
              <th className="px-3 py-2">Segmento</th>
              <th className="px-3 py-2 text-right">Total Faturado</th>
              <th className="px-3 py-2 text-right">Soma Extrato</th>
              <th className="px-3 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {relatorios.map((r) => {
              const extrato = extratos[r.id] || [];
              const somaCliente = getSomaCliente(r.id);
              const carregandoCliente = carregando[r.id];

              return (
                <React.Fragment key={r.id}>
                  <tr className={linhaCliente}>
                    <td className="px-3 py-2 text-[11px] md:text-xs text-slate-400 font-medium">
                      {r.data}
                    </td>
                    <td className="px-3 py-2 font-semibold">
                      {r.cliente}
                    </td>
                    <td className="px-3 py-2 text-slate-400">
                      {r.segmento}
                    </td>
                    <td className="px-3 py-2 text-right text-emerald-400 font-bold">
                      {formatValor(r.totalFaturado)}
                    </td>
                    <td className="px-3 py-2 text-right text-sky-400 font-bold">
                      {carregandoCliente ? (
                        <span className="text-xs text-sky-400 animate-pulse">
                          Carregando...
                        </span>
                      ) : (
                        formatValor(somaCliente)
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={[
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border",
                          r.estado === "ativo"
                            ? isDark
                              ? "bg-emerald-900/40 text-emerald-300 border-emerald-700"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : r.estado === "inativo"
                            ? isDark
                              ? "bg-slate-800 text-slate-200 border-slate-600"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                            : isDark
                            ? "bg-amber-900/40 text-amber-300 border-amber-700"
                            : "bg-amber-50 text-amber-700 border-amber-200",
                        ].join(" ")}
                      >
                        {r.estado}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan={6} className="px-3 py-2">
                      <div className={subTabelaWrapper}>
                        <div className={subHeader}>
                          <div className="flex justify-between items-center">
                            <span className={subHeaderTitulo}>
                              Movimentos{" "}
                              {carregandoCliente ? "(carregando...)" : ""}
                            </span>
                          </div>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-xs">
                            <thead className={subThead}>
                              <tr>
                                <th className="px-2 py-1 text-left text-slate-400 text-[9px]">
                                  Data
                                </th>
                                <th className="px-2 py-1 text-left text-slate-400 text-[9px]">
                                  Doc.
                                </th>
                                <th className="px-2 py-1 text-left text-slate-400 text-[9px]">
                                  Tipo
                                </th>
                                <th className="px-2 py-1 text-right text-slate-400 text-[9px]">
                                  Valor
                                </th>
                                <th className="px-2 py-1 text-left text-slate-400 text-[9px]">
                                  Estado
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {carregandoCliente ? (
                                <tr>
                                  <td
                                    colSpan={5}
                                    className="px-3 py-4 text-center text-sky-400 text-[10px]"
                                  >
                                    <span className="animate-pulse">
                                      ⏳ Carregando movimentos...
                                    </span>
                                  </td>
                                </tr>
                              ) : extrato.length === 0 ? (
                                <tr>
                                  <td
                                    colSpan={5}
                                    className="px-3 py-3 text-center text-slate-500 text-[10px]"
                                  >
                                    Sem facturas/recibos
                                  </td>
                                </tr>
                              ) : (
                                extrato.map((mov) => (
                                  <tr
                                    key={mov.id}
                                    className={
                                      isDark
                                        ? "border-t border-slate-800 hover:bg-slate-800/60"
                                        : "border-t border-slate-100 hover:bg-sky-50/50"
                                    }
                                  >
                                    <td className="px-2 py-1 text-slate-400 text-[9px]">
                                      {mov.data}
                                    </td>
                                    <td className="px-2 py-1 text-[9px]">
                                      {mov.numero}
                                    </td>
                                    <td className="px-2 py-1">
                                      <span
                                        className={`px-1 py-px rounded-full text-[8px] font-medium ${
                                          mov.tipo === "Factura"
                                            ? isDark
                                              ? "bg-blue-900/40 text-blue-300"
                                              : "bg-blue-100 text-blue-800"
                                            : mov.tipo === "Recibo"
                                            ? isDark
                                              ? "bg-emerald-900/40 text-emerald-300"
                                              : "bg-emerald-100 text-emerald-800"
                                            : isDark
                                            ? "bg-amber-900/40 text-amber-300"
                                            : "bg-amber-100 text-amber-800"
                                        }`}
                                      >
                                        {mov.tipo}
                                      </span>
                                    </td>
                                    <td className="px-2 py-1 text-right font-medium text-[9px]">
                                      {formatValor(mov.valor)}
                                    </td>
                                    <td className="px-2 py-1">
                                      <span
                                        className={`inline-flex items-center rounded-full px-1 py-px text-[8px] font-medium ${
                                          mov.status === "Pago"
                                            ? isDark
                                              ? "bg-emerald-900/40 text-emerald-300 border-emerald-700"
                                              : "bg-emerald-100 text-emerald-800 border-emerald-200"
                                            : isDark
                                            ? "bg-amber-900/40 text-amber-300 border-amber-700"
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
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {Object.keys(carregando).length > 0 && (
        <div className={debugBox}>
          Carregando {Object.keys(carregando).length} extratos...
        </div>
      )}
    </div>
  );
}

export default RelClientesTable;
