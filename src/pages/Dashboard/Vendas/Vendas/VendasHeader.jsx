import React from "react";

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("pt-MZ", {
    style: "currency",
    currency: "MZN",
    minimumFractionDigits: 2,
  });

function VendasHeader({
  totalDocumentos = 0,
  valorTotal = 0,
  recebidos = 0,
  emAberto = 0,
  vencidos = 0,
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
  const textNumber = isDark ? "text-lg font-semibold text-slate-50" : "text-lg font-semibold text-slate-900";

  const tileConfigs = [
    {
      title: "Documentos",
      titleClass: isDark ? "text-slate-300" : "text-slate-500",
      boxClass: isDark
        ? "border-slate-700 bg-slate-800"
        : "border-sky-100 bg-sky-50",
      value: Number(totalDocumentos || 0).toLocaleString("pt-MZ"),
      valueClass: textNumber,
    },
    {
      title: "Valor Total",
      titleClass: "text-sky-600",
      boxClass: isDark
        ? "border-sky-700 bg-sky-900/30"
        : "border-sky-200 bg-sky-50",
      value: formatMoney(valorTotal),
      valueClass: isDark
        ? "text-lg font-semibold text-sky-300"
        : "text-lg font-semibold text-sky-700",
    },
    {
      title: "Recebido",
      titleClass: "text-emerald-600",
      boxClass: isDark
        ? "border-emerald-700 bg-emerald-900/30"
        : "border-emerald-100 bg-emerald-50",
      value: formatMoney(recebidos),
      valueClass: isDark
        ? "text-lg font-semibold text-emerald-300"
        : "text-lg font-semibold text-emerald-700",
    },
    {
      title: "Em aberto",
      titleClass: "text-amber-600",
      boxClass: isDark
        ? "border-amber-700 bg-amber-900/30"
        : "border-amber-100 bg-amber-50",
      value: formatMoney(emAberto),
      valueClass: isDark
        ? "text-lg font-semibold text-amber-300"
        : "text-lg font-semibold text-amber-700",
    },
    {
      title: "Vencidos",
      titleClass: "text-rose-600",
      boxClass: isDark
        ? "border-rose-700 bg-rose-900/30"
        : "border-rose-100 bg-rose-50",
      value: formatMoney(vencidos),
      valueClass: isDark
        ? "text-lg font-semibold text-rose-300"
        : "text-lg font-semibold text-rose-700",
    },
  ];

  return (
    <header className={headerClasses}>
      <h1 className={titleClasses}>Painel de Vendas</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
        {tileConfigs.map((tile) => (
          <div
            key={tile.title}
            className={`${baseTile} ${tile.boxClass}`}
          >
            <h3 className={tile.titleClass}>{tile.title}</h3>
            <p className={tile.valueClass}>{tile.value}</p>
          </div>
        ))}
      </div>
    </header>
  );
}

export default VendasHeader;
