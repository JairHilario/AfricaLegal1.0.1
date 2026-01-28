import React from "react";

function TransporteHeader({
  total = 0,
  emCurso = 0,
  concluidos = 0,
  cancelados = 0,
  temaAtual = "light",
}) {
  const isDark = temaAtual === "dark";

  const headerClasses =
    "p-4 mb-4 border rounded-md shadow-sm " +
    (isDark ? "border-slate-800 bg-slate-900" : "border-sky-100 bg-white");

  const titleClasses =
    "text-xl font-bold mb-4 " +
    (isDark ? "text-slate-100" : "text-slate-900");

  const baseTile = "rounded-md p-3 text-center border";

  const boxTotal = isDark
    ? "border-slate-700 bg-slate-800"
    : "border-sky-100 bg-sky-50";
  const titleTotal = isDark ? "text-slate-300" : "text-slate-500";
  const valueTotal = isDark
    ? "text-lg font-semibold text-slate-50"
    : "text-lg font-semibold text-slate-900";

  const boxEmCurso = isDark
    ? "border-sky-700 bg-sky-900/30"
    : "border-sky-200 bg-sky-50";
  const valueEmCurso = isDark
    ? "text-lg font-semibold text-sky-300"
    : "text-lg font-semibold text-sky-700";

  const boxConcluidos = isDark
    ? "border-emerald-700 bg-emerald-900/30"
    : "border-emerald-100 bg-emerald-50";
  const valueConcluidos = isDark
    ? "text-lg font-semibold text-emerald-300"
    : "text-lg font-semibold text-emerald-700";

  const boxCancelados = isDark
    ? "border-rose-700 bg-rose-900/30"
    : "border-rose-100 bg-rose-50";
  const valueCancelados = isDark
    ? "text-lg font-semibold text-rose-300"
    : "text-lg font-semibold text-rose-700";

  return (
    <header className={headerClasses}>
      <h1 className={titleClasses}>Transportes</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
        <div className={`${baseTile} ${boxTotal}`}>
          <h3 className={titleTotal}>Total</h3>
          <p className={valueTotal}>{total}</p>
        </div>

        <div className={`${baseTile} ${boxEmCurso}`}>
          <h3 className="text-sky-600">Em curso</h3>
          <p className={valueEmCurso}>{emCurso}</p>
        </div>

        <div className={`${baseTile} ${boxConcluidos}`}>
          <h3 className="text-emerald-600">Concluídos</h3>
          <p className={valueConcluidos}>{concluidos}</p>
        </div>

        <div className={`${baseTile} ${boxCancelados}`}>
          <h3 className="text-rose-600">Cancelados</h3>
          <p className={valueCancelados}>{cancelados}</p>
        </div>
      </div>
    </header>
  );
}

export default TransporteHeader;
