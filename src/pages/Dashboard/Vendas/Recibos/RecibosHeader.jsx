import React from "react";

function RecibosHeader({ stats, temaAtual = "light" }) {
  const {
    total = 0,
    pagos = 0,
    pendentes = 0,
    cancelados = 0,
    valorTotal = 0,
  } = stats || {};

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

  const boxPagos = isDark
    ? "border-emerald-700 bg-emerald-900/30"
    : "border-emerald-100 bg-emerald-50";
  const valuePagos = isDark
    ? "text-lg font-semibold text-emerald-300"
    : "text-lg font-semibold text-emerald-700";

  const boxPendentes = isDark
    ? "border-amber-700 bg-amber-900/30"
    : "border-amber-100 bg-amber-50";
  const valuePendentes = isDark
    ? "text-lg font-semibold text-amber-300"
    : "text-lg font-semibold text-amber-700";

  const boxCancelados = isDark
    ? "border-rose-700 bg-rose-900/30"
    : "border-rose-100 bg-rose-50";
  const valueCancelados = isDark
    ? "text-lg font-semibold text-rose-300"
    : "text-lg font-semibold text-rose-700";

  const boxValorTotal = isDark
    ? "border-sky-700 bg-sky-900/30"
    : "border-sky-200 bg-sky-50";
  const valueValorTotal = isDark
    ? "text-lg font-semibold text-sky-300"
    : "text-lg font-semibold text-sky-700";

  return (
    <header className={headerClasses}>
      <h1 className={titleClasses}>Recibos</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
        <div className={`${baseTile} ${boxTotal}`}>
          <h3 className={titleTotal}>Total</h3>
          <p className={valueTotal}>{total}</p>
        </div>

        <div className={`${baseTile} ${boxPagos}`}>
          <h3 className="text-emerald-600">Pagos</h3>
          <p className={valuePagos}>{pagos}</p>
        </div>

        <div className={`${baseTile} ${boxPendentes}`}>
          <h3 className="text-amber-600">Pendentes</h3>
          <p className={valuePendentes}>{pendentes}</p>
        </div>

        <div className={`${baseTile} ${boxCancelados}`}>
          <h3 className="text-rose-600">Cancelados</h3>
          <p className={valueCancelados}>{cancelados}</p>
        </div>

        <div className={`${baseTile} ${boxValorTotal}`}>
          <h3 className="text-sky-600">Valor total</h3>
          <p className={valueValorTotal}>
            {Number(valorTotal).toLocaleString("pt-MZ", {
              style: "currency",
              currency: "MZN",
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    </header>
  );
}

export default RecibosHeader;
