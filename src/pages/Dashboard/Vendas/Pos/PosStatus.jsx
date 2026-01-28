import React, { useState } from "react";
import {
  DocumentArrowDownIcon,
  ArrowDownOnSquareStackIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

function PosStatus({ search, setSearch, onAddVenda }) {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <>
      <div className="mb-4 rounded-md border border-sky-100 bg-white p-4 md:p-6 shadow-sm">
        {/* AÇÕES + PERÍODO */}
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
              onClick={() => setShowAddForm((v) => !v)}
              className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-md text-xs md:text-sm"
            >
              <UserPlusIcon className="h-4 w-4 opacity-90" />
              <span>{showAddForm ? "Fechar" : "Nova venda"}</span>
            </button>
          </div>

          {/* Período */}
          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
            <span className="text-slate-600">Período:</span>
            <input
              type="date"
              className="px-2 py-1 rounded-md border border-sky-100 bg-sky-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-300"
            />
            <span className="text-slate-500">até</span>
            <input
              type="date"
              className="px-2 py-1 rounded-md border border-sky-100 bg-sky-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-300"
            />
          </div>
        </div>

        {/* Busca */}
        <div className="mt-4 relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por referência, cliente, valor..."
            className="w-full md:w-2/3 pl-9 pr-4 py-2 rounded-md text-sm border border-sky-100 bg-sky-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-300"
          />
        </div>
      </div>

      {showAddForm && null /* depois entra <AddVendaForm onAddVenda={onAddVenda} /> */}
    </>
  );
}

export default PosStatus;
