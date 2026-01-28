import React, { useState, useEffect } from "react";
import {
  DocumentArrowDownIcon,
  ArrowDownOnSquareStackIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

function TransferenciaStatus({
  totalTransferencias = 0,
  valorTotal = 0,
  pendentes = 0,
  confirmadas = 0,
  onAddTransferencia,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [contas, setContas] = useState([]);

  // Carregar contas bancárias para os selects
  useEffect(() => {
    async function fetchContas() {
      try {
        const savedAuth = localStorage.getItem("africaLegalUser");
        const token = savedAuth ? JSON.parse(savedAuth).token : null;

        const res = await fetch("http://localhost:4000/contas-bancarias", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar contas bancárias");

        const data = await res.json();
        setContas(data || []);
      } catch (err) {
        console.error("Erro ao carregar contas bancárias", err);
      }
    }

    fetchContas();
  }, []);

  return (
    <>
      <div className="mb-4 rounded-md border border-sky-100 bg-white p-4 md:p-6 shadow-sm text-slate-800">
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
              <span>{showAddForm ? "Fechar" : "Nova transferência"}</span>
            </button>
          </div>

          {/* Busca */}
          <div className="relative w-full md:w-1/2">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Buscar por origem, destino, referência..."
              className="w-full pl-9 pr-4 py-2 rounded-md text-sm border border-sky-100 bg-sky-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-300"
            />
          </div>
        </div>

        {/* CARDS */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="rounded-md p-3 text-center border border-sky-100 bg-sky-50">
            <h3 className="text-slate-500">Transferências</h3>
            <p className="text-lg font-semibold text-slate-900">
              {totalTransferencias}
            </p>
          </div>

          <div className="rounded-md p-3 text-center border border-sky-200 bg-sky-50">
            <h3 className="text-sky-600">Valor Total</h3>
            <p className="text-lg font-semibold text-sky-700">
              {valorTotal.toLocaleString("pt-MZ", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="rounded-md p-3 text-center border border-amber-100 bg-amber-50">
            <h3 className="text-amber-600">Pendentes</h3>
            <p className="text-lg font-semibold text-amber-700">
              {pendentes.toLocaleString()}
            </p>
          </div>

          <div className="rounded-md p-3 text-center border border-emerald-100 bg-emerald-50">
            <h3 className="text-emerald-600">Confirmadas</h3>
            <p className="text-lg font-semibold text-emerald-700">
              {confirmadas.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {showAddForm && (
        <AddTransferenciaForm
          contas={contas}
          onAddTransferencia={onAddTransferencia}
        />
      )}
    </>
  );
}

function AddTransferenciaForm({ contas = [], onAddTransferencia }) {
  const hojeIso = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    origemId: "",
    destinoId: "",
    data: hojeIso,
    descricao: "",
    valor: "",
    referencia: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.origemId) newErrors.origemId = "Obrigatório.";
    if (!form.destinoId) newErrors.destinoId = "Obrigatório.";
    if (form.origemId && form.destinoId && form.origemId === form.destinoId) {
      newErrors.destinoId = "Conta destino deve ser diferente da origem.";
    }
    if (!form.valor || isNaN(Number(form.valor))) {
      newErrors.valor = "Obrigatório.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (onAddTransferencia) {
      onAddTransferencia({
        origemId: Number(form.origemId),
        destinoId: Number(form.destinoId),
        data: form.data,
        descricao: form.descricao,
        valor: Number(form.valor),
        referencia: form.referencia,
      });
    }

    handleClear();
  };

  const handleClear = () => {
    setForm({
      origemId: "",
      destinoId: "",
      data: hojeIso,
      descricao: "",
      valor: "",
      referencia: "",
    });
    setErrors({});
  };

  return (
    <div className="mb-4 rounded-md border border-sky-100 bg-white p-4 md:p-6 shadow-sm text-slate-800">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-700">
        Nova transferência
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 md:grid-cols-2 text-sm"
      >
        {/* De (origem) */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            De (conta origem) <span className="text-rose-500">*</span>
          </label>
          <select
            name="origemId"
            value={form.origemId}
            onChange={handleChange}
            className="w-full rounded-md border border-sky-100 bg-sky-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-300"
          >
            <option value="">Escolha uma conta</option>
            {contas.map((conta) => (
              <option key={conta.id} value={conta.id}>
                {conta.banco} - {conta.numero}
              </option>
            ))}
          </select>
          {errors.origemId && (
            <p className="mt-1 text-[11px] text-rose-600">{errors.origemId}</p>
          )}
        </div>

        {/* À (destino) */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            À (conta destino) <span className="text-rose-500">*</span>
          </label>
          <select
            name="destinoId"
            value={form.destinoId}
            onChange={handleChange}
            className="w-full rounded-md border border-sky-100 bg-sky-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-300"
          >
            <option value="">Escolha uma conta</option>
            {contas.map((conta) => (
              <option key={conta.id} value={conta.id}>
                {conta.banco} - {conta.numero}
              </option>
            ))}
          </select>
          {errors.destinoId && (
            <p className="mt-1 text-[11px] text-rose-600">
              {errors.destinoId}
            </p>
          )}
        </div>

        {/* Data */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Data
          </label>
          <input
            type="date"
            name="data"
            value={form.data}
            onChange={handleChange}
            className="w-full rounded-md border border-sky-100 bg-sky-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-300"
          />
        </div>

        {/* Valor */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Total <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            name="valor"
            value={form.valor}
            onChange={handleChange}
            className="w-full rounded-md border border-sky-100 bg-sky-50 px-3 py-2 text-sm text-slate-900 text-right focus:outline-none focus:ring-1 focus:ring-sky-300"
          />
          {errors.valor && (
            <p className="mt-1 text-[11px] text-rose-600">{errors.valor}</p>
          )}
        </div>

        {/* Referência */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Referência
          </label>
          <input
            type="text"
            name="referencia"
            value={form.referencia}
            onChange={handleChange}
            placeholder="Nº de comprovativo / ref. banco"
            className="w-full rounded-md border border-sky-100 bg-sky-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-300"
          />
        </div>

        {/* Descrição */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Descrição
          </label>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            rows={2}
            placeholder="Descrição da transferência"
            className="w-full rounded-md border border-sky-100 bg-sky-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-300"
          />
        </div>

        {/* Ações */}
        <div className="md:col-span-2 flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleClear}
            className="rounded-md border border-slate-200 px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
          >
            Limpar
          </button>
          <button
            type="submit"
            className="rounded-md bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-500"
          >
            Guardar transferência
          </button>
        </div>
      </form>
    </div>
  );
}

export default TransferenciaStatus;
