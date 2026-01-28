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

const gerarRefOrdem = () => {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  const rand = String(Math.floor(Math.random() * 999)).padStart(3, "0");
  return `ORD-${ano}${mes}${dia}-${rand}`;
};

function OrdensStatus({
  totalOrdens = 0,
  abertas = 0,
  emProgresso = 0,
  concluidas = 0,
  canceladas = 0,
  onAddOrdem,
  clientes = [],
  contas = [],
  temaAtual = "dark",
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
  const cardAbertas = isDark
    ? `${cardBase} border-sky-700 bg-sky-900/30`
    : `${cardBase} border-sky-200 bg-sky-50`;
  const cardProgresso = isDark
    ? `${cardBase} border-amber-700 bg-amber-900/30`
    : `${cardBase} border-amber-100 bg-amber-50`;
  const cardConcluidas = isDark
    ? `${cardBase} border-emerald-700 bg-emerald-900/30`
    : `${cardBase} border-emerald-100 bg-emerald-50`;
  const cardCanceladas = isDark
    ? `${cardBase} border-rose-700 bg-rose-900/30`
    : `${cardBase} border-rose-100 bg-rose-50`;

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
              <span>{showAddForm ? "Fechar" : "Nova ordem"}</span>
            </button>
          </div>

          {/* Busca */}
          <div className="relative w-full md:w-1/2">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Buscar por número, cliente, status..."
              className={inputSoft}
            />
          </div>
        </div>

        {/* CARDS */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div className={cardTotal}>
            <h3 className={isDark ? "text-slate-300" : "text-slate-500"}>
              Ordens
            </h3>
            <p className="text-lg font-semibold">
              {totalOrdens}
            </p>
          </div>

          <div className={cardAbertas}>
            <h3 className="text-sky-400">Abertas</h3>
            <p className="text-lg font-semibold">
              {abertas.toLocaleString()}
            </p>
          </div>

          <div className={cardProgresso}>
            <h3 className="text-amber-400">Em Progresso</h3>
            <p className="text-lg font-semibold">
              {emProgresso.toLocaleString()}
            </p>
          </div>

          <div className={cardConcluidas}>
            <h3 className="text-emerald-400">Concluídas</h3>
            <p className="text-lg font-semibold">
              {concluidas.toLocaleString()}
            </p>
          </div>

          <div className={cardCanceladas}>
            <h3 className="text-rose-400">Canceladas</h3>
            <p className="text-lg font-semibold">
              {canceladas.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {showAddForm && (
        <AddOrdemForm
          onAddOrdem={onAddOrdem}
          clientes={clientes}
          contas={contas}
          temaAtual={temaAtual}
        />
      )}
    </>
  );
}

function AddOrdemForm({ onAddOrdem, clientes = [], contas = [], temaAtual = "dark" }) {
  const hojeIso = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    numero: gerarRefOrdem(),
    clienteId: "",
    contaOrigemId: "",
    contaOrigemLivre: "",
    contaDestinoId: "",
    contaDestinoLivre: "",
    descricao: "",
    valor: 0,
    moeda: "MZN",
    status: "aberta",
    data: hojeIso,
  });

  const [errors, setErrors] = useState({});

  const isDark = temaAtual === "dark";

  const wrapper = isDark
    ? "mb-4 rounded-md border border-slate-800 bg-slate-900 p-4 md:p-6 shadow-sm text-slate-100"
    : "mb-4 rounded-md border border-sky-100 bg-white p-4 md:p-6 shadow-sm text-slate-800";

  const inputBase =
    "w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1";
  const inputSoft = isDark
    ? `${inputBase} border border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-400 focus:ring-sky-500`
    : `${inputBase} border border-sky-100 bg-sky-50 text-slate-900 placeholder-slate-400 focus:ring-sky-300`;
  const inputReadOnly = isDark
    ? "w-full cursor-not-allowed rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-400"
    : "w-full cursor-not-allowed rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500";

  const label = isDark
    ? "mb-1 block text-xs font-medium text-slate-300"
    : "mb-1 block text-xs font-medium text-slate-600";

  const errorText = "mt-1 text-[11px] text-rose-500";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "valor" ? Number(value) : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.numero.trim()) newErrors.numero = "Obrigatório.";
    if (!form.clienteId) newErrors.clienteId = "Obrigatório.";

    if (!form.contaOrigemId) {
      newErrors.contaOrigemId = "Obrigatório.";
    } else if (
      form.contaOrigemId === "OUTRA" &&
      !form.contaOrigemLivre.trim()
    ) {
      newErrors.contaOrigemLivre =
        "Informe os dados da conta de origem.";
    }

    if (!form.contaDestinoId) {
      newErrors.contaDestinoId = "Obrigatório.";
    } else if (
      form.contaDestinoId === "OUTRA" &&
      !form.contaDestinoLivre.trim()
    ) {
      newErrors.contaDestinoLivre =
        "Informe os dados da conta de destino.";
    }

    if (form.valor === "" || isNaN(form.valor))
      newErrors.valor = "Obrigatório.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm({
      numero: gerarRefOrdem(),
      clienteId: "",
      contaOrigemId: "",
      contaOrigemLivre: "",
      contaDestinoId: "",
      contaDestinoLivre: "",
      descricao: "",
      valor: 0,
      moeda: "MZN",
      status: "aberta",
      data: hojeIso,
    });
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (onAddOrdem) onAddOrdem(form);
    resetForm();
  };

  return (
    <div className={wrapper}>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide">
        Nova ordem de transferência
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 md:grid-cols-2 text-sm"
      >
        {/* Número */}
        <div>
          <label className={label}>
            Nº da ordem <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="numero"
            value={form.numero}
            onChange={handleChange}
            placeholder="ORD-20260121-001"
            className={inputSoft}
          />
          {errors.numero && (
            <p className={errorText}>{errors.numero}</p>
          )}
        </div>

        {/* Cliente */}
        <div>
          <label className={label}>
            Cliente relacionado <span className="text-rose-500">*</span>
          </label>
          <select
            name="clienteId"
            value={form.clienteId}
            onChange={handleChange}
            className={inputSoft}
          >
            <option value="">Selecione um cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
          {errors.clienteId && (
            <p className={errorText}>{errors.clienteId}</p>
          )}
        </div>

        {/* Conta origem */}
        <div>
          <label className={label}>
            Conta de origem (empresa){" "}
            <span className="text-rose-500">*</span>
          </label>
          <select
            name="contaOrigemId"
            value={form.contaOrigemId}
            onChange={handleChange}
            className={inputSoft}
          >
            <option value="">Selecione conta de origem</option>
            {contas.map((conta) => (
              <option key={conta.id} value={conta.id}>
                {conta.banco} - {conta.numero}
              </option>
            ))}
            <option value="OUTRA">
              Outra conta (digitar manualmente)
            </option>
          </select>
          {errors.contaOrigemId && (
            <p className={errorText}>{errors.contaOrigemId}</p>
          )}

          {form.contaOrigemId === "OUTRA" && (
            <input
              type="text"
              name="contaOrigemLivre"
              value={form.contaOrigemLivre}
              onChange={handleChange}
              placeholder="Banco / NIB / IBAN da conta de origem"
              className={`${inputSoft} mt-2`}
            />
          )}
          {errors.contaOrigemLivre && (
            <p className={errorText}>{errors.contaOrigemLivre}</p>
          )}
        </div>

        {/* Conta destino */}
        <div>
          <label className={label}>
            Conta de destino (empresa){" "}
            <span className="text-rose-500">*</span>
          </label>
          <select
            name="contaDestinoId"
            value={form.contaDestinoId}
            onChange={handleChange}
            className={inputSoft}
          >
            <option value="">Selecione conta de destino</option>
            {contas.map((conta) => (
              <option key={conta.id} value={conta.id}>
                {conta.banco} - {conta.numero}
              </option>
            ))}
            <option value="OUTRA">
              Outra conta (digitar manualmente)
            </option>
          </select>
          {errors.contaDestinoId && (
            <p className={errorText}>{errors.contaDestinoId}</p>
          )}

          {form.contaDestinoId === "OUTRA" && (
            <input
              type="text"
              name="contaDestinoLivre"
              value={form.contaDestinoLivre}
              onChange={handleChange}
              placeholder="Banco / NIB / IBAN da conta de destino"
              className={`${inputSoft} mt-2`}
            />
          )}
          {errors.contaDestinoLivre && (
            <p className={errorText}>{errors.contaDestinoLivre}</p>
          )}
        </div>

        {/* Valor */}
        <div>
          <label className={label}>
            Valor <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            name="valor"
            value={form.valor}
            onChange={handleChange}
            className={inputSoft}
          />
          {errors.valor && (
            <p className={errorText}>{errors.valor}</p>
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

        {/* Status */}
        <div>
          <label className={label}>
            Status da ordem
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className={inputSoft}
          >
            <option value="aberta">Aberta</option>
            <option value="em progresso">Em progresso</option>
            <option value="concluída">Concluída</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        {/* Data */}
        <div>
          <label className={label}>
            Data da ordem
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
            Descrição / Observações
          </label>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            rows={2}
            className={inputSoft}
            placeholder="Ex.: Transferência interna referente ao cliente X"
          />
        </div>

        {/* Ações */}
        <div className="md:col-span-2 flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={resetForm}
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
            Guardar ordem
          </button>
        </div>
      </form>
    </div>
  );
}

export default OrdensStatus;
