import React from "react";

function EntregaHeader({
  total = 0,
  concluidas = 0,
  pendentes = 0,
  canceladas = 0,
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

  const boxConcluidas = isDark
    ? "border-emerald-700 bg-emerald-900/30"
    : "border-emerald-100 bg-emerald-50";
  const valueConcluidas = isDark
    ? "text-lg font-semibold text-emerald-300"
    : "text-lg font-semibold text-emerald-700";

  const boxPendentes = isDark
    ? "border-amber-700 bg-amber-900/30"
    : "border-amber-200 bg-amber-50";
  const valuePendentes = isDark
    ? "text-lg font-semibold text-amber-300"
    : "text-lg font-semibold text-amber-700";

  const boxCanceladas = isDark
    ? "border-rose-700 bg-rose-900/30"
    : "border-rose-200 bg-rose-50";
  const valueCanceladas = isDark
    ? "text-lg font-semibold text-rose-300"
    : "text-lg font-semibold text-rose-700";

  return (
    <header className={headerClasses}>
      <h1 className={titleClasses}>Entregas</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
        <div className={`${baseTile} ${boxTotal}`}>
          <h3 className={titleTotal}>Total</h3>
          <p className={valueTotal}>{total}</p>
        </div>

        <div className={`${baseTile} ${boxConcluidas}`}>
          <h3 className="text-emerald-600">Concluídas</h3>
          <p className={valueConcluidas}>{concluidas}</p>
        </div>

        <div className={`${baseTile} ${boxPendentes}`}>
          <h3 className="text-amber-600">Pendentes</h3>
          <p className={valuePendentes}>{pendentes}</p>
        </div>

        <div className={`${baseTile} ${boxCanceladas}`}>
          <h3 className="text-rose-600">Canceladas</h3>
          <p className={valueCanceladas}>{canceladas}</p>
        </div>
      </div>
    </header>
  );
}

export default EntregaHeader;
