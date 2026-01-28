import React, { useState } from "react";
import {
  ArrowUpOnSquareStackIcon,
  ArrowDownOnSquareStackIcon,
  DocumentArrowDownIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

function EntriesStatus({
  search,
  setSearch,
  onAddMovimento,
  produtos,
  temaAtual = "light",
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const isDark = temaAtual === "dark";

  const barClasses =
    "mb-4 rounded-md border p-4 md:p-6 shadow-sm " +
    (isDark
      ? "border-slate-800 bg-slate-900"
      : "border-sky-100 bg-white");

  const labelText = isDark ? "text-slate-300" : "text-slate-600";

  const selectFilter =
    "px-2 py-1 rounded-md text-xs md:text-sm border focus:outline-none focus:ring-1 focus:ring-sky-300 " +
    (isDark
      ? "border-slate-700 bg-slate-800 text-slate-100"
      : "border-sky-100 bg-sky-50 text-slate-800");

  const searchInput =
    "w-full md:w-2/3 pl-9 pr-4 py-2 rounded-md text-sm border focus:outline-none focus:ring-1 focus:ring-sky-300 " +
    (isDark
      ? "border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500"
      : "border-sky-100 bg-sky-50 text-slate-800 placeholder-slate-400");

  return (
    <>
      {/* AÇÕES, TIPO, BUSCA */}
      <div className={barClasses}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Ações */}
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-1.5 bg-sky-500 hover:bg-sky-400 text-white px-3 py-1.5 rounded-md text-xs md:text-sm">
              <ArrowUpOnSquareStackIcon className="h-4 w-4 opacity-90" />
              <span>Importar</span>
            </button>

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
              <PlusIcon className="h-4 w-4 opacity-90" />
              <span>{showAddForm ? "Fechar" : "Novo movimento"}</span>
            </button>
          </div>

          {/* Filtro por tipo (ainda não aplicado nos dados) */}
          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
            <span className={labelText}>Tipo:</span>
            <select className={selectFilter}>
              <option value="todos">Todos</option>
              <option value="entrada">Só entradas</option>
              <option value="saida">Só saídas</option>
            </select>
          </div>
        </div>

        {/* Busca */}
        <div className="mt-4 relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Buscar por item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={searchInput}
          />
        </div>
      </div>

      {showAddForm && (
        <AddMovimentoForm
          onAddMovimento={onAddMovimento}
          produtos={produtos}
          temaAtual={temaAtual}
        />
      )}
    </>
  );
}

function AddMovimentoForm({ onAddMovimento, produtos, temaAtual = "light" }) {
  const [form, setForm] = useState({
    produtoId: "",
    quantidade: 0,
  });

  const [errors, setErrors] = useState({});
  const isDark = temaAtual === "dark";

  const containerClasses =
    "mb-4 rounded-md border p-4 md:p-6 shadow-sm " +
    (isDark
      ? "border-slate-800 bg-slate-900"
      : "border-sky-100 bg-white");

  const labelClass =
    "mb-1 block text-xs font-medium " +
    (isDark ? "text-slate-300" : "text-slate-700");

  const inputBase =
    "w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300 ";
  const inputNormal = isDark
    ? inputBase + "border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-500"
    : inputBase + "border-sky-100 bg-sky-50 text-slate-900 placeholder-slate-400";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "quantidade" ? Number(value) : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.produtoId) newErrors.produtoId = "Obrigatório.";
    if (form.quantidade === "" || isNaN(form.quantidade))
      newErrors.quantidade = "Obrigatório.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (onAddMovimento) {
      onAddMovimento(form);
    }

    setForm({ produtoId: "", quantidade: 0 });
    setErrors({});
  };

  return (
    <div className={containerClasses}>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-sky-600">
        Registar movimento
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 md:grid-cols-2 text-sm"
      >
        {/* Item vindo do estoque */}
        <div className="md:col-span-2">
          <label className={labelClass}>
            Item <span className="text-rose-500">*</span>
          </label>
          <select
            name="produtoId"
            value={form.produtoId}
            onChange={handleChange}
            className={inputNormal}
          >
            <option value="">Selecione um item...</option>
            {produtos?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} ({p.referencia})
              </option>
            ))}
          </select>
          {errors.produtoId && (
            <p className="mt-1 text-[11px] text-rose-600">
              {errors.produtoId}
            </p>
          )}
        </div>

        {/* Quantidade */}
        <div>
          <label className={labelClass}>
            Quantidade <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            name="quantidade"
            value={form.quantidade}
            onChange={handleChange}
            className={inputNormal}
          />
          {errors.quantidade && (
            <p className="mt-1 text-[11px] text-rose-600">
              {errors.quantidade}
            </p>
          )}
        </div>

        {/* Ações */}
        <div className="md:col-span-2 flex justify-end gap-2 pt-2">
          <button
            type="submit"
            className="rounded-md bg-emerald-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-400"
          >
            Guardar movimento
          </button>
        </div>
      </form>
    </div>
  );
}

export default EntriesStatus;
