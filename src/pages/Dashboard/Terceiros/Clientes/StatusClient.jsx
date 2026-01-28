import React, { useState, useRef } from "react";
import {
  ArrowUpOnSquareStackIcon,
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

function StatusClient({ 
  onAddClient, 
  onExportExcel, 
  onExportPDF, 
  onImportCSV, 
  temaAtual = "light" 
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const importInputRef = useRef(null);
  const isDark = temaAtual === "dark";

  const barClasses = isDark
    ? "mb-4 rounded-md border border-slate-800 bg-slate-900 p-4 md:p-6 shadow-sm"
    : "mb-4 rounded-md border border-sky-100 bg-white p-4 md:p-6 shadow-sm";

  const labelText = isDark ? "text-slate-300" : "text-slate-600";
  const periodInput =
    "px-2 py-1 rounded-md text-xs md:text-sm border focus:outline-none focus:ring-1 focus:ring-sky-300 " +
    (isDark
      ? "border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-500"
      : "border-sky-100 bg-sky-50 text-slate-800 placeholder-slate-400");

  const searchInput =
    "w-full md:w-2/3 pl-9 pr-4 py-2 rounded-md text-sm border focus:outline-none focus:ring-1 focus:ring-sky-300 " +
    (isDark
      ? "border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500"
      : "border-sky-100 bg-sky-50 text-slate-800 placeholder-slate-400");

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  return (
    <>
      {/* AÇÕES, PERÍODO, BUSCA */}
      <div className={barClasses}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Ações */}
          <div className="flex flex-wrap gap-2">
            {/* IMPORTAR */}
            <button
              onClick={handleImportClick}
              className="inline-flex items-center gap-1.5 bg-sky-500 hover:bg-sky-400 text-white px-3 py-1.5 rounded-md text-xs md:text-sm"
            >
              <ArrowUpOnSquareStackIcon className="h-4 w-4 opacity-90" />
              <span>Importar</span>
            </button>

            {/* INPUT HIDDEN PARA IMPORT */}
            <input
              ref={importInputRef}
              type="file"
              accept=".csv"
              onChange={onImportCSV}
              hidden
            />

            {/* PDF */}
            <button
              onClick={onExportPDF}
              className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1.5 rounded-md text-xs md:text-sm"
            >
              <DocumentArrowDownIcon className="h-4 w-4 opacity-90" />
              <span>PDF</span>
            </button>

            {/* EXCEL */}
            <button
              onClick={onExportExcel}
              className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 px-3 py-1.5 rounded-md text-xs md:text-sm"
            >
              <ArrowDownOnSquareStackIcon className="h-4 w-4 opacity-90" />
              <span>Excel</span>
            </button>

            {/* NOVO */}
            <button
              type="button"
              onClick={() => setShowAddForm((v) => !v)}
              className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-md text-xs md:text-sm"
            >
              <UserPlusIcon className="h-4 w-4 opacity-90" />
              <span>{showAddForm ? "Fechar" : "Novo"}</span>
            </button>
          </div>

          {/* Filtro por período */}
          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
            <span className={labelText}>Período:</span>
            <input type="date" className={periodInput} />
            <span className={isDark ? "text-slate-400" : "text-slate-500"}>
              até
            </span>
            <input type="date" className={periodInput} />
          </div>
        </div>

        {/* Busca */}
        <div className="mt-4 relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Buscar por nome, email, NUIT, estado..."
            className={searchInput}
          />
        </div>
      </div>

      {showAddForm && <AddClientForm onAddClient={onAddClient} temaAtual={temaAtual} />}
    </>
  );
}

// AddClientForm permanece IGUAL (sem mudanças)
function AddClientForm({ onAddClient, temaAtual = "light" }) {
  const isDark = temaAtual === "dark";
  const hojeIso = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    codigoPais: "+258",
    telefone: "",
    telefone2: "",
    nuit: "",
    localizacao: "",
    endereco: "",
    cidade: "",
    provincia: "",
    caixaPostal: "",
    saldoInicial: 0,
    criadoEm: hojeIso,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "saldoInicial" ? Number(value) : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nome.trim()) newErrors.nome = "Obrigatório.";
    if (!form.email.trim()) newErrors.email = "Obrigatório.";
    if (!form.telefone.trim()) newErrors.telefone = "Obrigatório.";
    if (form.saldoInicial === "" || isNaN(form.saldoInicial))
      newErrors.saldoInicial = "Obrigatório.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const savedAuth = localStorage.getItem("africaLegalUser");
      const token = savedAuth ? JSON.parse(savedAuth).token : null;

      const res = await fetch("http://localhost:4000/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          codigoPais: form.codigoPais,
          telefone: form.telefone,
          telefone2: form.telefone2 || null,
          nuit: form.nuit || null,
          localizacao: form.localizacao || null,
          endereco: form.endereco || null,
          cidade: form.cidade || null,
          provincia: form.provincia || null,
          caixaPostal: form.caixaPostal || null,
          saldoInicial: form.saldoInicial,
          criadoEm: form.criadoEm,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Erro ao criar cliente");
      }

      if (onAddClient) {
        onAddClient(data);
      }

      handleClear();
    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao criar cliente");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = () => {
    setForm({
      nome: "",
      email: "",
      codigoPais: "+258",
      telefone: "",
      telefone2: "",
      nuit: "",
      localizacao: "",
      endereco: "",
      cidade: "",
      provincia: "",
      caixaPostal: "",
      saldoInicial: 0,
      criadoEm: hojeIso,
    });
    setErrors({});
  };

  const containerClasses = isDark
    ? "mb-4 rounded-md border border-slate-800 bg-slate-900 p-4 md:p-6 shadow-sm"
    : "mb-4 rounded-md border border-sky-100 bg-white p-4 md:p-6 shadow-sm";

  const labelClasses =
    "mb-1 block text-xs font-medium " +
    (isDark ? "text-slate-300" : "text-slate-700");

  const inputBase =
    "w-full rounded-md border px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-300 ";
  const inputNormal = isDark
    ? inputBase + "border-slate-700 bg-slate-800 text-slate-100"
    : inputBase + "border-sky-100 bg-sky-50 text-slate-900";
  const inputReadonly = isDark
    ? "w-full cursor-not-allowed rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-400"
    : "w-full cursor-not-allowed rounded-md border border-sky-100 bg-sky-50 px-3 py-2 text-sm text-slate-600";

  const selectCode =
    "rounded-l-md border px-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-sky-300 " +
    (isDark
      ? "border-slate-700 bg-slate-800 text-slate-100"
      : "border-sky-100 bg-sky-50 text-slate-900");

  const telInput =
    "w-full rounded-r-md border border-l-0 px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-300 " +
    (isDark
      ? "border-slate-700 bg-slate-800 text-slate-100"
      : "border-sky-100 bg-sky-50 text-slate-900");

  const errorText = "mt-1 text-[11px] text-rose-600";

  const btnClear =
    "rounded-md border px-4 py-1.5 text-xs " +
    (isDark
      ? "border-slate-700 text-slate-200 hover:bg-slate-800"
      : "border-slate-200 text-slate-700 hover:bg-slate-100");

  return (
    <div className={containerClasses}>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-sky-600">
        Adicionar cliente
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 md:grid-cols-2 text-sm"
      >
        {/* Nome */}
        <div>
          <label className={labelClasses}>
            Nome do Cliente <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Nome completo / Empresa"
            className={inputNormal}
          />
          {errors.nome && <p className={errorText}>{errors.nome}</p>}
        </div>

        {/* Email */}
        <div>
          <label className={labelClasses}>
            E-mail <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="email@cliente.com"
            className={inputNormal}
          />
          {errors.email && <p className={errorText}>{errors.email}</p>}
        </div>

        {/* Telefone com código */}
        <div>
          <label className={labelClasses}>
            Telefone <span className="text-rose-500">*</span>
          </label>
          <div className="flex">
            <select
              name="codigoPais"
              value={form.codigoPais}
              onChange={handleChange}
              className={selectCode}
            >
              <option value="+258">+258</option>
              <option value="+55">+55</option>
              <option value="+351">+351</option>
              <option value="+244">+244</option>
            </select>
            <input
              type="text"
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              placeholder="84 xxx xxxx"
              className={telInput}
            />
          </div>
          {errors.telefone && (
            <p className={errorText}>{errors.telefone}</p>
          )}
        </div>

        {/* Telefone 2 */}
        <div>
          <label className={labelClasses}>Telefone 2</label>
          <input
            type="text"
            name="telefone2"
            value={form.telefone2}
            onChange={handleChange}
            placeholder="Telefone alternativo"
            className={inputNormal}
          />
        </div>

        {/* NUIT */}
        <div>
          <label className={labelClasses}>NUIT</label>
          <input
            type="text"
            name="nuit"
            value={form.nuit}
            onChange={handleChange}
            placeholder="Número fiscal / NUIT"
            className={inputNormal}
          />
        </div>

        {/* Localização */}
        <div className="md:col-span-2">
          <label className={labelClasses}>Localização do Cliente</label>
          <input
            type="text"
            name="localizacao"
            value={form.localizacao}
            onChange={handleChange}
            placeholder="Ex: Próximo ao Shopping X, Bairro Y"
            className={inputNormal}
          />
        </div>

        {/* Endereço */}
        <div className="md:col-span-2">
          <label className={labelClasses}>Endereço</label>
          <input
            type="text"
            name="endereco"
            value={form.endereco}
            onChange={handleChange}
            placeholder="Rua, número, bairro"
            className={inputNormal}
          />
        </div>

        {/* Cidade */}
        <div>
          <label className={labelClasses}>Cidade</label>
          <input
            type="text"
            name="cidade"
            value={form.cidade}
            onChange={handleChange}
            placeholder="Cidade"
            className={inputNormal}
          />
        </div>

        {/* Província */}
        <div>
          <label className={labelClasses}>Província</label>
          <input
            type="text"
            name="provincia"
            value={form.provincia}
            onChange={handleChange}
            placeholder="Província"
            className={inputNormal}
          />
        </div>

        {/* Caixa postal */}
        <div>
          <label className={labelClasses}>Caixa postal</label>
          <input
            type="text"
            name="caixaPostal"
            value={form.caixaPostal}
            onChange={handleChange}
            placeholder="Ex: C.P. 1234"
            className={inputNormal}
          />
        </div>

        {/* Saldo inicial */}
        <div>
          <label className={labelClasses}>
            Saldo Inicial (MZN) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            name="saldoInicial"
            value={form.saldoInicial}
            onChange={handleChange}
            className={inputNormal}
          />
          {errors.saldoInicial && (
            <p className={errorText}>{errors.saldoInicial}</p>
          )}
        </div>

        {/* Criado em */}
        <div>
          <label className={labelClasses}>Criado em</label>
          <input
            type="text"
            value={formatDate(form.criadoEm)}
            readOnly
            className={inputReadonly}
          />
        </div>

        {/* Ações */}
        <div className="md:col-span-2 flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleClear}
            className={btnClear}
            disabled={submitting}
          >
            Limpar
          </button>
          <button
            type="submit"
            className="rounded-md bg-emerald-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-400 disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? "Guardando..." : "Guardar cliente"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default StatusClient;
