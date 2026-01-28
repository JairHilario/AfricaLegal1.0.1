import React from "react";

function FornecedorHeader({ stats, temaAtual = "light" }) {
  const {
    total = 0,
    ativos = 0,
    inativos = 0,
    comPendencias = 0,
    emNegociacao = 0,
    novos = 0,
  } = stats || {};

  const isDark = temaAtual === "dark";

  const headerClasses = isDark
    ? "p-4 mb-4 border border-slate-800 rounded-md bg-slate-900 shadow-sm"
    : "p-4 mb-4 border border-sky-100 rounded-md bg-white shadow-sm";

  const titleClasses = isDark
    ? "text-xl font-bold mb-4 text-slate-100"
    : "text-xl font-bold mb-4 text-slate-900";

  const baseTile = "rounded-md p-3 text-center border";

  const totalBox = isDark
    ? "border-slate-700 bg-slate-800"
    : "border-sky-100 bg-sky-50";
  const totalTitle = isDark ? "text-slate-300" : "text-slate-500";
  const totalValue = isDark
    ? "text-lg font-semibold text-slate-50"
    : "text-lg font-semibold text-slate-900";

  const ativosBox = isDark
    ? "border-emerald-700 bg-emerald-900/30"
    : "border-emerald-100 bg-emerald-50";
  const ativosTitle = "text-emerald-600";
  const ativosValue = isDark
    ? "text-lg font-semibold text-emerald-300"
    : "text-lg font-semibold text-emerald-700";

  const inativosBox = isDark
    ? "border-slate-700 bg-slate-800"
    : "border-slate-200 bg-slate-50";
  const inativosTitle = isDark ? "text-slate-400" : "text-slate-600";
  const inativosValue = isDark
    ? "text-lg font-semibold text-slate-200"
    : "text-lg font-semibold text-slate-700";

  const pendenciasBox = isDark
    ? "border-rose-700 bg-rose-900/30"
    : "border-rose-200 bg-rose-50";
  const pendenciasTitle = "text-rose-600";
  const pendenciasValue = isDark
    ? "text-lg font-semibold text-rose-300"
    : "text-lg font-semibold text-rose-700";

  const negociacaoBox = isDark
    ? "border-amber-700 bg-amber-900/30"
    : "border-amber-200 bg-amber-50";
  const negociacaoTitle = "text-amber-600";
  const negociacaoValue = isDark
    ? "text-lg font-semibold text-amber-300"
    : "text-lg font-semibold text-amber-700";

  const novosBox = isDark
    ? "border-sky-700 bg-sky-900/30"
    : "border-sky-200 bg-sky-50";
  const novosTitle = "text-sky-600";
  const novosValue = isDark
    ? "text-lg font-semibold text-sky-300"
    : "text-lg font-semibold text-sky-700";

  return (
    <header className={headerClasses}>
      <h1 className={titleClasses}>Gestão de Fornecedores</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
        <div className={`${baseTile} ${totalBox}`}>
          <h3 className={totalTitle}>Total</h3>
          <p className={totalValue}>{total}</p>
        </div>

        <div className={`${baseTile} ${ativosBox}`}>
          <h3 className={ativosTitle}>Ativos</h3>
          <p className={ativosValue}>{ativos}</p>
        </div>

        <div className={`${baseTile} ${inativosBox}`}>
          <h3 className={inativosTitle}>Inativos</h3>
          <p className={inativosValue}>{inativos}</p>
        </div>

        <div className={`${baseTile} ${pendenciasBox}`}>
          <h3 className={pendenciasTitle}>Com Pendências</h3>
          <p className={pendenciasValue}>{comPendencias}</p>
        </div>

        <div className={`${baseTile} ${negociacaoBox}`}>
          <h3 className={negociacaoTitle}>Em Negociação</h3>
          <p className={negociacaoValue}>{emNegociacao}</p>
        </div>

        <div className={`${baseTile} ${novosBox}`}>
          <h3 className={novosTitle}>Novos</h3>
          <p className={novosValue}>{novos}</p>
        </div>
      </div>
    </header>
  );
}

export default FornecedorHeader;
