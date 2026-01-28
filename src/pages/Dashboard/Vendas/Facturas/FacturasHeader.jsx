import React from "react";

function FacturasHeader({
  total = 0,
  emitidas = 0,
  pagas = 0,
  emAberto = 0,
  vencidas = 0,
  temaAtual = "light",
}) {
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

  const boxEmitidas = isDark
    ? "border-sky-700 bg-sky-900/30"
    : "border-sky-200 bg-sky-50";
  const valueEmitidas = isDark
    ? "text-lg font-semibold text-sky-300"
    : "text-lg font-semibold text-sky-700";

  const boxPagas = isDark
    ? "border-emerald-700 bg-emerald-900/30"
    : "border-emerald-100 bg-emerald-50";
  const valuePagas = isDark
    ? "text-lg font-semibold text-emerald-300"
    : "text-lg font-semibold text-emerald-700";

  const boxEmAberto = isDark
    ? "border-amber-700 bg-amber-900/30"
    : "border-amber-200 bg-amber-50";
  const valueEmAberto = isDark
    ? "text-lg font-semibold text-amber-300"
    : "text-lg font-semibold text-amber-700";

  const boxVencidas = isDark
    ? "border-rose-700 bg-rose-900/30"
    : "border-rose-200 bg-rose-50";
  const valueVencidas = isDark
    ? "text-lg font-semibold text-rose-300"
    : "text-lg font-semibold text-rose-700";

  return (
    <header className={headerClasses}>
      <h1 className={titleClasses}>Facturas</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
        <div className={`${baseTile} ${boxTotal}`}>
          <h3 className={titleTotal}>Total</h3>
          <p className={valueTotal}>{total}</p>
        </div>

        <div className={`${baseTile} ${boxEmitidas}`}>
          <h3 className="text-sky-600">Emitidas</h3>
          <p className={valueEmitidas}>{emitidas}</p>
        </div>

        <div className={`${baseTile} ${boxPagas}`}>
          <h3 className="text-emerald-600">Pagas</h3>
          <p className={valuePagas}>{pagas}</p>
        </div>

        <div className={`${baseTile} ${boxEmAberto}`}>
          <h3 className="text-amber-600">Em aberto</h3>
          <p className={valueEmAberto}>{emAberto}</p>
        </div>

        <div className={`${baseTile} ${boxVencidas}`}>
          <h3 className="text-rose-600">Vencidas</h3>
          <p className={valueVencidas}>{vencidas}</p>
        </div>
      </div>
    </header>
  );
}

export default FacturasHeader;
