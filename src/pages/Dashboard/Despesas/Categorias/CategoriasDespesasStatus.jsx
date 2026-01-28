import React from "react";

function CategoriasDespesasStatus({
  search,
  setSearch,
  nome,
  setNome,
  tipo,
  setTipo,
  onAddCategoria,
  temaAtual = "light",
}) {
  const canSave = nome.trim() && tipo.trim();
  const isDark = temaAtual === "dark";

  const wrapper = isDark
    ? "mb-4 rounded-md border border-slate-800 bg-slate-900 p-4 md:p-6 shadow-sm text-slate-100"
    : "mb-4 rounded-md border border-sky-100 bg-white p-4 md:p-6 shadow-sm text-slate-800";

  const labelText = isDark ? "text-slate-100" : "text-slate-800";
  const subText = isDark ? "text-slate-400" : "text-slate-500";

  const inputBase =
    "rounded-md px-3 py-2 text-xs md:text-sm placeholder-slate-400 focus:outline-none focus:ring-1 w-40 md:w-48";
  const inputSoft = isDark
    ? `${inputBase} border border-slate-700 bg-slate-800 text-slate-100 focus:ring-sky-500`
    : `${inputBase} border border-sky-100 bg-sky-50 text-slate-900 focus:ring-sky-300`;

  const searchInput = isDark
    ? "w-full pl-9 pr-4 py-2 rounded-md text-sm border border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
    : "w-full pl-9 pr-4 py-2 rounded-md text-sm border border-sky-100 bg-sky-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-300";

  const searchIcon = "text-slate-400";

  const saveButton = canSave
    ? [
        "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs md:text-sm font-medium",
        isDark
          ? "text-white bg-emerald-600 hover:bg-emerald-500"
          : "text-white bg-emerald-500 hover:bg-emerald-400",
      ].join(" ")
    : [
        "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs md:text-sm font-medium cursor-not-allowed",
        isDark
          ? "bg-slate-500/40 text-slate-300"
          : "bg-slate-200 text-slate-400",
      ].join(" ");

  return (
    <div className={wrapper}>
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className={`text-sm font-semibold ${labelText}`}>
            Categorias de despesas
          </h2>
          <p className={`text-[11px] ${subText}`}>
            Crie novas categorias e pesquise pelas existentes.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
          <input
            type="text"
            placeholder="Nome da categoria"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={inputSoft}
          />
          <input
            type="text"
            placeholder="Tipo de despesa"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className={inputSoft}
          />
          <button
            type="button"
            onClick={onAddCategoria}
            disabled={!canSave}
            className={saveButton}
          >
            Guardar categoria
          </button>
        </div>

        <div className="relative w-full md:w-1/3">
          <span
            className={`absolute inset-y-0 left-3 flex items-center ${searchIcon} pointer-events-none`}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="16" y1="16" x2="21" y2="21" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar por nome ou tipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={searchInput}
          />
        </div>
      </div>
    </div>
  );
}

export default CategoriasDespesasStatus;
