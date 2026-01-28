import React from "react";

function EntriesHeader({ stats = {}, temaAtual = "light" }) {
  const {
    totalMovimentos = 0,
    entradasItens = 0,
    saidasItens = 0,
    saldoItens = 0,
    movimentosHoje = 0,
    movimentosMes = 0,
  } = stats;

  const isDark = temaAtual === "dark";

  const headerClasses = isDark
    ? "p-4 mb-4 border border-slate-800 rounded-md bg-slate-900 shadow-sm"
    : "p-4 mb-4 border border-sky-100 rounded-md bg-white shadow-sm";

  const titleClasses = isDark
    ? "text-xl font-bold mb-4 text-slate-100"
    : "text-xl font-bold mb-4 text-slate-900";

  const baseTile = "rounded-md p-3 text-center border";

  const boxTotal = isDark
    ? "border-slate-700 bg-slate-800"
    : "border-sky-100 bg-sky-50";
  const titleTotal = isDark ? "text-slate-300" : "text-slate-500";
  const valueTotal = isDark
    ? "text-lg font-semibold text-slate-50"
    : "text-lg font-semibold text-slate-900";

  const boxEntradas = isDark
    ? "border-emerald-700 bg-emerald-900/30"
    : "border-emerald-100 bg-emerald-50";
  const valueEntradas = isDark
    ? "text-lg font-semibold text-emerald-300"
    : "text-lg font-semibold text-emerald-700";

  const boxSaidas = isDark
    ? "border-rose-700 bg-rose-900/30"
    : "border-rose-200 bg-rose-50";
  const valueSaidas = isDark
    ? "text-lg font-semibold text-rose-300"
    : "text-lg font-semibold text-rose-700";

  const boxSaldo = isDark
    ? "border-sky-700 bg-sky-900/30"
    : "border-sky-200 bg-sky-50";
  const valueSaldo = isDark
    ? "text-lg font-semibold text-sky-300"
    : "text-lg font-semibold text-sky-700";

  const boxHoje = isDark
    ? "border-amber-700 bg-amber-900/30"
    : "border-amber-200 bg-amber-50";
  const valueHoje = isDark
    ? "text-lg font-semibold text-amber-300"
    : "text-lg font-semibold text-amber-700";

  const boxMes = isDark
    ? "border-violet-700 bg-violet-900/30"
    : "border-violet-200 bg-violet-50";
  const valueMes = isDark
    ? "text-lg font-semibold text-violet-300"
    : "text-lg font-semibold text-violet-700";

  return (
    <header className={headerClasses}>
      <h1 className={titleClasses}>Movimentações de Estoque</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
        <div className={`${baseTile} ${boxTotal}`}>
          <h3 className={titleTotal}>Total movimentos</h3>
          <p className={valueTotal}>{totalMovimentos}</p>
        </div>

        <div className={`${baseTile} ${boxEntradas}`}>
          <h3 className="text-emerald-600">Entradas (itens)</h3>
          <p className={valueEntradas}>{entradasItens}</p>
        </div>

        <div className={`${baseTile} ${boxSaidas}`}>
          <h3 className="text-rose-600">Saídas (itens)</h3>
          <p className={valueSaidas}>{saidasItens}</p>
        </div>

        <div className={`${baseTile} ${boxSaldo}`}>
          <h3 className="text-sky-600">Saldo em estoque</h3>
          <p className={valueSaldo}>{saldoItens}</p>
        </div>

        <div className={`${baseTile} ${boxHoje}`}>
          <h3 className="text-amber-600">Movimentos hoje</h3>
          <p className={valueHoje}>{movimentosHoje}</p>
        </div>

        <div className={`${baseTile} ${boxMes}`}>
          <h3 className="text-violet-600">Mês atual</h3>
          <p className={valueMes}>{movimentosMes}</p>
        </div>
      </div>
    </header>
  );
}

export default EntriesHeader;
