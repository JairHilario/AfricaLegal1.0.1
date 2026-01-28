import React, { useState } from "react";
import {
  ArrowDownOnSquareStackIcon,
  DocumentArrowDownIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

const formatDate = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

function ContasStatus({
  search,
  setSearch,
  totalContas = 0,
  saldoTotalMZN = 0,
  saldoPositivoMZN = 0,
  saldoNegativoMZN = 0,
  onAddConta,
}) {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <>
      <div className="mb-4 rounded-md border border-sky-100 bg-white p-4 md:p-6 shadow-sm text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
        {/* AÇÕES + BUSCA */}
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
              <span>{showAddForm ? "Fechar" : "Nova conta"}</span>
            </button>
          </div>

          {/* Busca */}
          <div className="relative w-full md:w-1/2">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Buscar por banco, nº da conta, IBAN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-md text-sm border border-sky-100 bg-sky-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>
        </div>

        {/* CARDS DE STATUS */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* Total de contas */}
          <div className="rounded-md p-3 text-center border border-sky-100 bg-sky-50 dark:border-slate-700 dark:bg-slate-800">
            <h3 className="text-slate-500 dark:text-slate-300">Contas</h3>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {totalContas}
            </p>
          </div>

          {/* Saldo Total em MZN */}
          <div className="rounded-md p-3 text-center border border-sky-200 bg-sky-50 dark:border-sky-700 dark:bg-sky-900/30">
            <h3 className="text-sky-600 dark:text-sky-300">Saldo Total (MZN)</h3>
            <p className="text-lg font-semibold text-sky-700 dark:text-sky-200">
              {Number(saldoTotalMZN).toLocaleString("pt-MZ", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          {/* Saldo Positivo em MZN */}
          <div className="rounded-md p-3 text-center border border-emerald-100 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/30">
            <h3 className="text-emerald-600 dark:text-emerald-300">
              Saldo Positivo (MZN)
            </h3>
            <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-200">
              {Number(saldoPositivoMZN).toLocaleString("pt-MZ", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          {/* Saldo Negativo em MZN */}
          <div className="rounded-md p-3 text-center border border-rose-100 bg-rose-50 dark:border-rose-700 dark:bg-rose-900/30">
            <h3 className="text-rose-600 dark:text-rose-300">
              Saldo Negativo (MZN)
            </h3>
            <p className="text-lg font-semibold text-rose-700 dark:text-rose-200">
              {Number(saldoNegativoMZN).toLocaleString("pt-MZ", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>

      {showAddForm && <AddContaForm onAddConta={onAddConta} />}
    </>
  );
}

function AddContaForm({ onAddConta }) {
  const hojeIso = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    banco: "",
    numero: "",
    tipo: "Corrente",
    moeda: "MZN",
    saldoInicial: 0,
    descricao: "",
    criadoEm: hojeIso,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "saldoInicial" ? Number(value) : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.banco.trim()) newErrors.banco = "Obrigatório.";
    if (!form.numero.trim()) newErrors.numero = "Obrigatório.";
    if (form.saldoInicial === "" || isNaN(form.saldoInicial)) {
      newErrors.saldoInicial = "Obrigatório.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (onAddConta) onAddConta(form);
    handleClear();
  };

  const handleClear = () => {
    setForm({
      banco: "",
      numero: "",
      tipo: "Corrente",
      moeda: "MZN",
      saldoInicial: 0,
      descricao: "",
      criadoEm: hojeIso,
    });
    setErrors({});
  };

  const inputBase =
    "w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300 ";
  const inputSoft =
    inputBase +
    "border-sky-100 bg-sky-50 text-slate-900 placeholder-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500";

  return (
    <div className="mb-4 rounded-md border border-sky-100 bg-white p-4 md:p-6 shadow-sm text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
        Adicionar conta bancária
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 md:grid-cols-2 text-sm"
      >
        {/* Banco */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
            Banco <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="banco"
            value={form.banco}
            onChange={handleChange}
            placeholder="Nome do banco"
            className={inputSoft}
          />
          {errors.banco && (
            <p className="mt-1 text-[11px] text-rose-600">{errors.banco}</p>
          )}
        </div>

        {/* Número da conta */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
            Nº da Conta <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="numero"
            value={form.numero}
            onChange={handleChange}
            placeholder="00000000000"
            className={inputSoft}
          />
          {errors.numero && (
            <p className="mt-1 text-[11px] text-rose-600">{errors.numero}</p>
          )}
        </div>

        {/* Tipo */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
            Tipo de conta
          </label>
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className={inputSoft}
          >
            <option value="Corrente">Corrente</option>
            <option value="Poupança">Poupança</option>
            <option value="Investimento">Investimento</option>
          </select>
        </div>

        {/* Moeda */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
            Moeda
          </label>
          <select
            name="moeda"
            value={form.moeda}
            onChange={handleChange}
            className={inputSoft}
          >
            <option value="MZN">MZN</option>
            <option value="USD">USD</option>
            <option value="ZAR">ZAR</option>
          </select>
        </div>

        {/* Saldo inicial */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
            Saldo Inicial <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            name="saldoInicial"
            value={form.saldoInicial}
            onChange={handleChange}
            className={inputSoft}
          />
          {errors.saldoInicial && (
            <p className="mt-1 text-[11px] text-rose-600">
              {errors.saldoInicial}
            </p>
          )}
        </div>

        {/* Criado em */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
            Criado em
          </label>
          <input
            type="text"
            value={formatDate(form.criadoEm)}
            readOnly
            className="w-full cursor-not-allowed rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
          />
        </div>

        {/* Descrição */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
            Descrição / Observações
          </label>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            rows={2}
            className={inputSoft}
            placeholder="Ex: Conta principal para pagamentos de clientes"
          />
        </div>

        {/* Ações */}
        <div className="md:col-span-2 flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleClear}
            className="rounded-md border border-slate-200 px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            Limpar
          </button>
          <button
            type="submit"
            className="rounded-md bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-500"
          >
            Guardar conta
          </button>
        </div>
      </form>
    </div>
  );
}

export default ContasStatus;
