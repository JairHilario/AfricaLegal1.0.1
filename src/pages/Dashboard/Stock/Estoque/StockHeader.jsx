import React from "react";

function StockHeader({ stats = {}, temaAtual = "light" }) {
  const {
    total = 0,
    emEstoque = 0,
    esgotados = 0,
    emReposicao = 0,
    destaque = 0,
    novos = 0,
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

  const boxEstoque = isDark
    ? "border-emerald-700 bg-emerald-900/30"
    : "border-emerald-100 bg-emerald-50";
  const valueEstoque = isDark
    ? "text-lg font-semibold text-emerald-300"
    : "text-lg font-semibold text-emerald-700";

  const boxEsgotados = isDark
    ? "border-rose-700 bg-rose-900/30"
    : "border-rose-200 bg-rose-50";
  const valueEsgotados = isDark
    ? "text-lg font-semibold text-rose-300"
    : "text-lg font-semibold text-rose-700";

  const boxReposicao = isDark
    ? "border-amber-700 bg-amber-900/30"
    : "border-amber-200 bg-amber-50";
  const valueReposicao = isDark
    ? "text-lg font-semibold text-amber-300"
    : "text-lg font-semibold text-amber-700";

  const boxDestaque = isDark
    ? "border-sky-700 bg-sky-900/30"
    : "border-sky-200 bg-sky-50";
  const valueDestaque = isDark
    ? "text-lg font-semibold text-sky-300"
    : "text-lg font-semibold text-sky-700";

  const boxNovos = isDark
    ? "border-violet-700 bg-violet-900/30"
    : "border-violet-200 bg-violet-50";
  const valueNovos = isDark
    ? "text-lg font-semibold text-violet-300"
    : "text-lg font-semibold text-violet-700";

  return (
    <header className={headerClasses}>
      <h1 className={titleClasses}>Gestão de Stock</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
        <div className={`${baseTile} ${boxTotal}`}>
          <h3 className={titleTotal}>Total de Produtos</h3>
          <p className={valueTotal}>{total}</p>
        </div>

        <div className={`${baseTile} ${boxEstoque}`}>
          <h3 className="text-emerald-600">Em estoque</h3>
          <p className={valueEstoque}>{emEstoque}</p>
        </div>

        <div className={`${baseTile} ${boxEsgotados}`}>
          <h3 className="text-rose-600">Esgotados</h3>
          <p className={valueEsgotados}>{esgotados}</p>
        </div>

        <div className={`${baseTile} ${boxReposicao}`}>
          <h3 className="text-amber-600">Em reposição</h3>
          <p className={valueReposicao}>{emReposicao}</p>
        </div>

        <div className={`${baseTile} ${boxDestaque}`}>
          <h3 className="text-sky-600">Destaque</h3>
          <p className={valueDestaque}>{destaque}</p>
        </div>

        <div className={`${baseTile} ${boxNovos}`}>
          <h3 className="text-violet-600">Novos</h3>
          <p className={valueNovos}>{novos}</p>
        </div>
      </div>
    </header>
  );
}

export default StockHeader;
