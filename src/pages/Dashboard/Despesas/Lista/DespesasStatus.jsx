import React, { useState } from "react";
import {
  DocumentArrowDownIcon,
  ArrowDownOnSquareStackIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

const formatDate = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

function DespesasStatus({
  totalDespesas = 0,
  valorTotal = 0,
  pagas = 0,
  emAberto = 0,
  emAtraso = 0,
  onAddDespesa,
  contas = [],
  fornecedores = [],
  categoriasDespesas = [],
  temaAtual = "light",
  search,
  setSearch,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const isDark = temaAtual === "dark";

  const wrapper = isDark
    ? "mb-4 rounded-md border border-slate-800 bg-slate-900 p-4 md:p-6 shadow-sm text-slate-100"
    : "mb-4 rounded-md border border-sky-100 bg-white p-4 md:p-6 shadow-sm text-slate-800";

  const inputBase =
    "w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1";
  const inputSoft = isDark
    ? `${inputBase} border border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-400 focus:ring-sky-500`
    : `${inputBase} border border-sky-100 bg-sky-50 text-slate-900 placeholder-slate-400 focus:ring-sky-300`;

  const label = isDark
    ? "mb-1 block text-xs font-medium text-slate-300"
    : "mb-1 block text-xs font-medium text-slate-600";

  const cardBase = "rounded-md p-3 text-center border";
  const cardTotal = isDark
    ? `${cardBase} border-slate-700 bg-slate-800`
    : `${cardBase} border-sky-100 bg-sky-50`;
  const cardValor = isDark
    ? `${cardBase} border-sky-700 bg-sky-900/30`
    : `${cardBase} border-sky-200 bg-sky-50`;
  const cardPagas = isDark
    ? `${cardBase} border-emerald-700 bg-emerald-900/30`
    : `${cardBase} border-emerald-100 bg-emerald-50`;
  const cardAberto = isDark
    ? `${cardBase} border-amber-700 bg-amber-900/30`
    : `${cardBase} border-amber-100 bg-amber-50`;
  const cardAtraso = isDark
    ? `${cardBase} border-rose-700 bg-rose-900/30`
    : `${cardBase} border-rose-100 bg-rose-50`;

  const errorText = "mt-1 text-[11px] text-rose-500";

  return (
    <>
      <div className={wrapper}>
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
              <span>{showAddForm ? "Fechar" : "Nova despesa"}</span>
            </button>
          </div>

          {/* Busca */}
          <div className="relative w-full md:w-1/2">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Buscar por fornecedor, categoria, referência..."
              value={search}
              onChange={(e) => setSearch?.(e.target.value)}
              className={`${inputSoft} pl-9`}
            />
          </div>
        </div>

        {/* CARDS */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div className={cardTotal}>
            <h3 className={isDark ? "text-slate-300" : "text-slate-500"}>
              Despesas
            </h3>
            <p className="text-lg font-semibold">
              {totalDespesas}
            </p>
          </div>

          <div className={cardValor}>
            <h3 className="text-sky-400">Valor Total</h3>
            <p className="text-lg font-semibold">
              {valorTotal.toLocaleString()}
            </p>
          </div>

          <div className={cardPagas}>
            <h3 className="text-emerald-400">Pagas</h3>
            <p className="text-lg font-semibold">
              {pagas.toLocaleString()}
            </p>
          </div>

          <div className={cardAberto}>
            <h3 className="text-amber-400">Em aberto</h3>
            <p className="text-lg font-semibold">
              {emAberto.toLocaleString()}
            </p>
          </div>

          <div className={cardAtraso}>
            <h3 className="text-rose-400">Em atraso</h3>
            <p className="text-lg font-semibold">
              {emAtraso.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {showAddForm && (
        <AddDespesaForm
          onAddDespesa={onAddDespesa}
          contas={contas}
          fornecedores={fornecedores}
          categoriasDespesas={categoriasDespesas}
          temaAtual={temaAtual}
          label={label}
          inputSoft={inputSoft}
          errorText={errorText}
        />
      )}
    </>
  );
}

function AddDespesaForm({
  onAddDespesa,
  contas = [],
  fornecedores = [],
  categoriasDespesas = [],
  temaAtual = "light",
  label,
  inputSoft,
  errorText,
}) {
  const hojeIso = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    contaId: "",
    fornecedorId: "",
    categoria: "",
    descricao: "",
    total: "",
    moeda: "MZN",
    data: hojeIso,
    anexo: null,
  });

  const [errors, setErrors] = useState({});
  const isDark = temaAtual === "dark";

  const inputReadOnly = isDark
    ? "w-full cursor-not-allowed rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-400"
    : "w-full cursor-not-allowed rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500";

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "anexo") {
      setForm((prev) => ({
        ...prev,
        anexo: files && files[0] ? files[0] : null,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: name === "total" ? Number(value) : value,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.contaId) newErrors.contaId = "Obrigatório.";
    if (!form.fornecedorId) newErrors.fornecedorId = "Obrigatório.";
    if (form.total === "" || isNaN(form.total))
      newErrors.total = "Obrigatório.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClear = () => {
    setForm({
      contaId: "",
      fornecedorId: "",
      categoria: "",
      descricao: "",
      total: "",
      moeda: "MZN",
      data: hojeIso,
      anexo: null,
    });
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onAddDespesa?.(form);
    handleClear();
  };

  const wrapper = isDark
    ? "mb-4 rounded-md border border-slate-800 bg-slate-900 p-4 md:p-6 shadow-sm text-slate-100"
    : "mb-4 rounded-md border border-sky-100 bg-white p-4 md:p-6 shadow-sm text-slate-800";

  return (
    <div className={wrapper}>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide">
        Nova despesa
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 md:grid-cols-2 text-sm"
      >
        {/* Conta */}
        <div>
          <label className={label}>
            Conta <span className="text-rose-500">*</span>
          </label>
          <select
            name="contaId"
            value={form.contaId}
            onChange={handleChange}
            className={inputSoft}
          >
            <option value="">Selecione a conta</option>
            {contas.map((conta) => (
              <option key={conta.id} value={conta.id}>
                {conta.nome} ({conta.numero})
              </option>
            ))}
          </select>
          {errors.contaId && (
            <p className={errorText}>{errors.contaId}</p>
          )}
        </div>

        {/* Fornecedor */}
        <div>
          <label className={label}>
            Fornecedor <span className="text-rose-500">*</span>
          </label>
          <select
            name="fornecedorId"
            value={form.fornecedorId}
            onChange={handleChange}
            className={inputSoft}
          >
            <option value="">Selecione o fornecedor</option>
            {fornecedores.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nome}
              </option>
            ))}
          </select>
          {errors.fornecedorId && (
            <p className={errorText}>{errors.fornecedorId}</p>
          )}
        </div>

        {/* Categoria */}
        <div>
          <label className={label}>
            Categoria
          </label>
          <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            className={inputSoft}
          >
            <option value="">Selecione a categoria</option>
            {categoriasDespesas.map((cat) => (
              <option key={cat.id} value={cat.nome}>
                {cat.nome} {cat.tipo ? `- ${cat.tipo}` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Total */}
        <div>
          <label className={label}>
            Total <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            name="total"
            value={form.total}
            onChange={handleChange}
            className={inputSoft}
          />
          {errors.total && (
            <p className={errorText}>{errors.total}</p>
          )}
        </div>

        {/* Moeda */}
        <div>
          <label className={label}>
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

        {/* Data */}
        <div>
          <label className={label}>
            Data
          </label>
          <input
            type="text"
            value={formatDate(form.data)}
            readOnly
            className={inputReadOnly}
          />
        </div>

        {/* Descrição */}
        <div className="md:col-span-2">
          <label className={label}>
            Descrição
          </label>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            rows={2}
            className={inputSoft}
            placeholder="Detalhes da despesa"
          />
        </div>

        {/* Anexo */}
        <div className="md:col-span-2">
          <label className={label}>
            Anexo (opcional)
          </label>
          <input
            type="file"
            name="anexo"
            onChange={handleChange}
            className="w-full text-xs"
          />
        </div>

        {/* Ações */}
        <div className="md:col-span-2 flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleClear}
            className={
              isDark
                ? "rounded-md border border-slate-600 px-4 py-1.5 text-xs text-slate-100 hover:bg-slate-800"
                : "rounded-md border border-slate-200 px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
            }
          >
            Limpar
          </button>
          <button
            type="submit"
            className="rounded-md bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-500"
          >
            Guardar despesa
          </button>
        </div>
      </form>
    </div>
  );
}

export default DespesasStatus;
