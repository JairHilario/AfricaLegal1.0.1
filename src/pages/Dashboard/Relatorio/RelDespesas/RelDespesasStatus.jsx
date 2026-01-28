import React from "react";
import {
  DocumentArrowDownIcon,
  ArrowDownOnSquareStackIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

function RelDespesasStatus({ onAddRelatorio, temaAtual = "dark" }) {
  const isDark = temaAtual === "dark";

  const wrapper = isDark
    ? "mb-4 rounded-md border border-slate-800 bg-slate-900 p-4 md:p-6 shadow-sm"
    : "mb-4 rounded-md border border-sky-100 bg-white p-4 md:p-6 shadow-sm";

  const input = isDark
    ? "w-full pl-9 pr-4 py-2 rounded-md text-sm border border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
    : "w-full pl-9 pr-4 py-2 rounded-md text-sm border border-sky-100 bg-sky-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-300";

  const select = isDark
    ? "px-2 py-2 rounded-md text-xs md:text-sm border border-slate-700 bg-slate-800 text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
    : "px-2 py-2 rounded-md text-xs md:text-sm border border-sky-100 bg-sky-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-300";

  const searchIcon = "text-slate-400";

  return (
    <div className={wrapper}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Ações */}
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1.5 rounded-md text-xs md:text-sm">
            <DocumentArrowDownIcon className="h-4 w-4 opacity-90" />
            <span>PDF</span>
          </button>

          <button className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 px-3 py-1.5 rounded-md text-xs md:text-sm">
            <ArrowDownOnSquareStackIcon className="h-4 w-4 opacity-90" />
            <span>Excel</span>
          </button>

          <button
            type="button"
            onClick={onAddRelatorio}
            className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-md text-xs md:text-sm"
          >
            <UserPlusIcon className="h-4 w-4 opacity-90" />
            <span>Novo relatório</span>
          </button>
        </div>

        {/* Busca / filtros */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <span className={`absolute inset-y-0 left-3 flex items-center ${searchIcon} pointer-events-none`}>
              <MagnifyingGlassIcon className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Buscar por fornecedor, categoria..."
              className={input}
            />
          </div>

          <select className={select}>
            <option value="">Todas as categorias</option>
            <option value="renda">Renda</option>
            <option value="servicos">Serviços</option>
            <option value="combustivel">Combustível</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default RelDespesasStatus;
