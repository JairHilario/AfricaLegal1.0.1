import React, { useState, useEffect } from "react";
import {
  DocumentArrowDownIcon,
  ArrowDownOnSquareStackIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

function RecibosStatus({ search, setSearch, onAddRecibo, temaAtual = "light" }) {
  const [showAddForm, setShowAddForm] = useState(false);

  const [clientes, setClientes] = useState([]);
  const [contas, setContas] = useState([]);

  const [form, setForm] = useState({
    clienteId: "",
    data: "",
    contaId: "",
    metodoPagamento: "",
    referencia: "",
    valor: "",
    moeda: "MZN",
    status: "Pago",
  });

  const isDark = temaAtual === "dark";

  const barClasses =
    "mb-4 rounded-md border p-4 md:p-6 shadow-sm " +
    (isDark ? "border-slate-800 bg-slate-900" : "border-sky-100 bg-white");

  const labelText = isDark ? "text-slate-300" : "text-slate-600";

  const periodInput =
    "px-2 py-1 rounded-md border text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-sky-300 " +
    (isDark
      ? "border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-500"
      : "border-sky-100 bg-sky-50 text-slate-800 placeholder-slate-400");

  const searchInput =
    "w-full md:w-2/3 pl-9 pr-4 py-2 rounded-md text-sm border focus:outline-none focus:ring-1 focus:ring-sky-300 " +
    (isDark
      ? "border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500"
      : "border-sky-100 bg-sky-50 text-slate-800 placeholder-slate-400");

  const formContainerClasses =
    "mb-4 rounded-md border p-4 md:p-6 shadow-sm " +
    (isDark ? "border-slate-800 bg-slate-900" : "border-sky-100 bg-white");

  const formTitleClasses =
    "mb-4 text-sm font-semibold " +
    (isDark ? "text-slate-100" : "text-slate-900");

  const labelClass =
    "block mb-1 text-[11px] font-medium " +
    (isDark ? "text-slate-300" : "text-slate-700");

  const inputBase =
    "w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300 ";

  const inputNormal = isDark
    ? inputBase +
      "border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-500"
    : inputBase +
      "border-sky-100 bg-sky-50 text-slate-900 placeholder-slate-400";

  const inputReadOnly = isDark
    ? "w-full rounded-md border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-slate-200 font-mono"
    : "w-full rounded-md border border-sky-100 bg-slate-100 px-3 py-2 text-xs text-slate-900 font-mono";

  const selectNormal = inputNormal;

  const cancelButton =
    "rounded-md px-4 py-2 text-xs md:text-sm " +
    (isDark
      ? "bg-slate-800 text-slate-200 border border-slate-600 hover:bg-slate-700"
      : "bg-slate-100 text-slate-700 hover:bg-slate-200");

  const submitButton =
    "rounded-md bg-emerald-500 px-4 py-2 text-xs md:text-sm text-white hover:bg-emerald-400";

  // CLIENTES
  useEffect(() => {
    async function fetchClientes() {
      try {
        const savedAuth = localStorage.getItem("africaLegalUser");
        const token = savedAuth ? JSON.parse(savedAuth).token : null;

        const res = await fetch("http://localhost:4000/clients", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar clientes");

        const data = await res.json();
        setClientes(data);
      } catch (err) {
        console.error("Erro ao carregar clientes", err);
      }
    }

    fetchClientes();
  }, []);

  // CONTAS BANCÁRIAS
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

  // REFERÊNCIA
  useEffect(() => {
    async function fetchReferencia() {
      try {
        const savedAuth = localStorage.getItem("africaLegalUser");
        const token = savedAuth ? JSON.parse(savedAuth).token : null;

        const res = await fetch(
          "http://localhost:4000/recibos/proxima-referencia",
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (!res.ok) throw new Error("Erro ao obter referência");

        const data = await res.json(); // { referencia: "RE-00023" }
        setForm((prev) => ({ ...prev, referencia: data.referencia }));
      } catch (err) {
        console.error(err);
        setForm((prev) => ({ ...prev, referencia: "RE-" }));
      }
    }

    fetchReferencia();
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.clienteId) {
      alert("Cliente é obrigatório");
      return;
    }
    if (!form.valor) {
      alert("Valor é obrigatório");
      return;
    }

    try {
      const savedAuth = localStorage.getItem("africaLegalUser");
      const token = savedAuth ? JSON.parse(savedAuth).token : null;

      const res = await fetch("http://localhost:4000/recibos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          clienteId: form.clienteId,
          data: form.data,
          contaId: form.contaId ? Number(form.contaId) : null,
          metodoPagamento: form.metodoPagamento,
          valor: Number(form.valor),
          moeda: form.moeda,
          status: form.status,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Erro ao criar recibo");
      }

      if (onAddRecibo) {
        onAddRecibo(data);
      }

      setForm((prev) => ({
        ...prev,
        clienteId: "",
        data: "",
        contaId: "",
        metodoPagamento: "",
        valor: "",
      }));
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao criar recibo");
    }
  };

  return (
    <>
      <div className={barClasses}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
              <span>{showAddForm ? "Fechar" : "Novo recibo"}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
            <span className={labelText}>Período:</span>
            <input type="date" className={periodInput} />
            <span className={isDark ? "text-slate-400" : "text-slate-500"}>
              até
            </span>
            <input type="date" className={periodInput} />
          </div>
        </div>

        <div className="mt-4 relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por número, cliente, valor, estado..."
            className={searchInput}
          />
        </div>
      </div>

      {showAddForm && (
        <div className={formContainerClasses}>
          <h2 className={formTitleClasses}>Novo recibo</h2>

          <form
            className="grid gap-4 md:grid-cols-2 text-xs md:text-sm"
            onSubmit={handleSubmit}
          >
            <div className="md:col-span-1">
              <label className={labelClass}>
                Cliente <span className="text-rose-500">*</span>
              </label>
              <select
                value={form.clienteId}
                onChange={handleChange("clienteId")}
                className={selectNormal}
              >
                <option value="">Selecione um</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-1">
              <label className={labelClass}>Data</label>
              <input
                type="date"
                value={form.data}
                onChange={handleChange("data")}
                className={inputNormal}
              />
            </div>

            <div className="md:col-span-1">
              <label className={labelClass}>Nº Recibo</label>
              <input
                type="text"
                value={form.referencia}
                readOnly
                className={inputReadOnly}
              />
            </div>

            <div className="md:col-span-1">
              <label className={labelClass}>Valor</label>
              <input
                type="number"
                step="0.01"
                value={form.valor}
                onChange={handleChange("valor")}
                className={
                  inputNormal + " text-right"
                }
              />
            </div>

            <div className="md:col-span-1">
              <label className={labelClass}>Moeda</label>
              <select
                value={form.moeda}
                onChange={handleChange("moeda")}
                className={selectNormal}
              >
                <option value="MZN">MZN</option>
                <option value="USD">USD</option>
                <option value="ZAR">ZAR</option>
              </select>
            </div>

            <div className="md:col-span-1">
              <label className={labelClass}>Conta</label>
              <select
                value={form.contaId}
                onChange={handleChange("contaId")}
                className={selectNormal}
              >
                <option value="">Selecione uma conta</option>
                {contas.map((conta) => (
                  <option key={conta.id} value={conta.id}>
                    {conta.banco} - {conta.numero}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-1">
              <label className={labelClass}>Mét. de pagamento</label>
              <select
                value={form.metodoPagamento}
                onChange={handleChange("metodoPagamento")}
                className={selectNormal}
              >
                <option value="">Selecione um</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="transferencia">Transferência bancária</option>
                <option value="mpesa">M-Pesa</option>
                <option value="emola">E-Mola</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>

            <div className="md:col-span-1">
              <label className={labelClass}>Estado</label>
              <select
                value={form.status}
                onChange={handleChange("status")}
                className={selectNormal}
              >
                <option value="Pago">Pago</option>
                <option value="Pendente">Pendente</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className={cancelButton}
              >
                Cancelar
              </button>
              <button type="submit" className={submitButton}>
                Guardar recibo
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default RecibosStatus;
