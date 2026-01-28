import React, { useState, useEffect } from "react";
import {
  DocumentArrowDownIcon,
  ArrowDownOnSquareStackIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

const API_BASE = "http://localhost:4000";

function VendasStatus({ search, setSearch, onAddVenda, temaAtual = "light" }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const isDark = temaAtual === "dark";

  const handleToggleForm = () => setShowAddForm((v) => !v);

  const barClasses = isDark
    ? "mb-4 rounded-md border border-slate-800 bg-slate-900 p-4 md:p-6 shadow-sm"
    : "mb-4 rounded-md border border-sky-100 bg-white p-4 md:p-6 shadow-sm";

  const labelText = isDark ? "text-slate-300" : "text-slate-600";
  const inputBorder = isDark ? "border-slate-700 bg-slate-800 text-slate-100" : "border-sky-100 bg-sky-50 text-slate-800";
  const searchInputBorder = isDark ? "border-slate-700 bg-slate-900 text-slate-100" : "border-sky-100 bg-sky-50 text-slate-800";
  const searchPlaceholder = isDark ? "placeholder-slate-500" : "placeholder-slate-400";

  return (
    <>
      {/* ===== BARRA SUPERIOR ===== */}
      <div className={barClasses}>
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
              onClick={handleToggleForm}
              className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-md text-xs md:text-sm"
            >
              <UserPlusIcon className="h-4 w-4 opacity-90" />
              <span>{showAddForm ? "Fechar" : "Nova venda"}</span>
            </button>
          </div>

          {/* Período */}
          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
            <span className={labelText}>Período:</span>
            <input
              type="date"
              className={`px-2 py-1 rounded-md ${inputBorder} focus:outline-none focus:ring-1 focus:ring-sky-300`}
            />
            <span className={isDark ? "text-slate-400" : "text-slate-500"}>até</span>
            <input
              type="date"
              className={`px-2 py-1 rounded-md ${inputBorder} focus:outline-none focus:ring-1 focus:ring-sky-300`}
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
            placeholder="Buscar por número, cliente, produto, estado..."
            className={
              "w-full md:w-2/3 pl-9 pr-4 py-2 rounded-md text-sm " +
              searchInputBorder +
              " " +
              searchPlaceholder +
              " focus:outline-none focus:ring-1 focus:ring-sky-300"
            }
          />
        </div>
      </div>

      {/* ===== FORM NOVA VENDA ===== */}
      {showAddForm && <AddVendaForm onAddVenda={onAddVenda} temaAtual={temaAtual} />}
    </>
  );
}

function AddVendaForm({ onAddVenda, temaAtual = "light" }) {
  const isDark = temaAtual === "dark";
  const hojeIso = new Date().toISOString().slice(0, 10);

  // ===== STATE CABEÇALHO =====
  const [form, setForm] = useState({
    clienteId: "",
    contaId: "",
    referenciaNumero: "",
    currency: "MZN",
    localizacao: "Armazem",
    data: hojeIso,
    paymentMethod: "",
    request: "",
    nota: "",
    prazoVencimento: "",
  });

  const [clientes, setClientes] = useState([]);
  const [contas, setContas] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [loadingContas, setLoadingContas] = useState(false);
  const [clientesError, setClientesError] = useState("");
  const [contasError, setContasError] = useState("");

  const [items, setItems] = useState([]);
  const [termos, setTermos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [itemSelecionadoId, setItemSelecionadoId] = useState("");

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        descricao: "",
        quant: 1,
        preco: 0,
        ivaPercent: 0,
        descontoPercent: 0,
      },
    ]);
  };

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const subTotal = items.reduce((acc, item) => acc + item.quant * item.preco, 0);
  const totalImposto = items.reduce((acc, item) => {
    const base = item.quant * item.preco;
    return acc + (base * (item.ivaPercent || 0)) / 100;
  }, 0);
  const totalDesconto = items.reduce((acc, item) => {
    const base = item.quant * item.preco;
    return acc + (base * (item.descontoPercent || 0)) / 100;
  }, 0);
  const totalDocumento = subTotal + totalImposto - totalDesconto;

  useEffect(() => {
    const savedAuth = localStorage.getItem("africaLegalUser");
    const token = savedAuth ? JSON.parse(savedAuth).token : null;

    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const fetchClientes = async () => {
      try {
        setLoadingClientes(true);
        setClientesError("");
        const res = await fetch(`${API_BASE}/clients`, { headers });
        if (!res.ok) throw new Error("Erro ao carregar clientes");
        const data = await res.json();
        setClientes(data);
      } catch (err) {
        setClientesError(err.message || "Erro ao carregar clientes");
      } finally {
        setLoadingClientes(false);
      }
    };

    const fetchContas = async () => {
      try {
        setLoadingContas(true);
        setContasError("");
        const res = await fetch(`${API_BASE}/contas-bancarias`, {
          headers,
        });
        if (!res.ok) throw new Error("Erro ao carregar contas");
        const data = await res.json();
        setContas(data);
      } catch (err) {
        setContasError(err.message || "Erro ao carregar contas");
      } finally {
        setLoadingContas(false);
      }
    };

    const fetchReferencia = async () => {
      try {
        const res = await fetch(`${API_BASE}/vendas/proxima-referencia`, {
          headers,
        });
        if (!res.ok) throw new Error("Erro ao obter referência");
        const data = await res.json();
        const numeroLimpo = (data.referencia || "").replace(/^FT-/, "");
        setForm((prev) => ({
          ...prev,
          referenciaNumero: numeroLimpo,
        }));
      } catch {
        // deixa como está
      }
    };

    const fetchTermos = async () => {
      try {
        const res = await fetch(`${API_BASE}/termos-pagamento`, { headers });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setTermos(data);
      } catch {
        // opcional
      }
    };

    const fetchProdutos = async () => {
      try {
        const res = await fetch(`${API_BASE}/produtos`, { headers });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProdutos(data);
      } catch {
        // opcional
      }
    };

    fetchClientes();
    fetchContas();
    fetchReferencia();
    fetchTermos();
    fetchProdutos();
  }, []);

  const handleProdutoSelect = (e) => {
    const id = e.target.value;
    setItemSelecionadoId(id);

    const produto = produtos.find((p) => String(p.id) === id);
    if (!produto) return;

    const ivaPercent =
      produto.tipoImposto === "regime_normal"
        ? 17
        : produto.tipoImposto === "cont_simplf"
        ? 5
        : 0;

    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        descricao: produto.nome,
        quant: 1,
        preco: produto.preco || 0,
        ivaPercent,
        descontoPercent: 0,
      },
    ]);
  };

  const handleSubmit = async () => {
    if (!onAddVenda) return;

    if (!form.clienteId) {
      alert("Seleciona um cliente.");
      return;
    }
    if (!form.data) {
      alert("Seleciona a data da venda.");
      return;
    }
    if (!form.prazoVencimento) {
      alert("Seleciona o prazo de vencimento.");
      return;
    }
    if (items.length === 0) {
      alert("Adiciona pelo menos um item.");
      return;
    }

    const savedAuth = localStorage.getItem("africaLegalUser");
    const token = savedAuth ? JSON.parse(savedAuth).token : null;

    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const itensPayload = items.map((item) => ({
      descricao: item.descricao,
      quantidade: item.quant,
      precoUnit: item.preco,
      ivaPercent: item.ivaPercent,
      descontoPercent: item.descontoPercent,
    }));

    const payload = {
      clienteId: Number(form.clienteId),
      moeda: form.currency,
      localizacao: form.localizacao,
      data: form.data,
      prazoVencimento: form.prazoVencimento,
      observacoes: form.nota || null,
      numeroRequisicao: form.request || null,
      itens: itensPayload,
      subTotal,
      descontoTotal: totalDesconto,
      impostoTotal: totalImposto,
      totalDocumento,
      contaId: form.contaId ? Number(form.contaId) : null,
    };

    const res = await fetch(`${API_BASE}/vendas`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.message || "Erro ao gravar venda");
      return;
    }

    onAddVenda(data);
    setItems([]);
  };

  const containerClasses = isDark
    ? "mb-4 rounded-md border border-slate-800 bg-slate-900 p-4 md:p-6 shadow-sm text-xs md:text-sm"
    : "mb-4 rounded-md border border-sky-100 bg-white p-4 md:p-6 shadow-sm text-xs md:text-sm";

  const labelClasses =
    "mb-1 block text-xs font-medium " + (isDark ? "text-slate-300" : "text-slate-700");

  const inputBase =
    "w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300 ";
  const inputNormal = isDark
    ? inputBase + "border-slate-700 bg-slate-800 text-slate-100"
    : inputBase + "border-sky-100 bg-sky-50 text-slate-900";

  const inputMuted = isDark
    ? inputBase + "border-slate-700 bg-slate-900 text-slate-100"
    : inputBase + "border-sky-100 bg-slate-50 text-slate-900";

  const tableHeader =
    "bg-sky-50 text-slate-700 " +
    (isDark ? "bg-slate-800 text-slate-200" : "bg-sky-50 text-slate-700");

  const tableInput =
    "w-full rounded-md border px-2 py-1 text-xs " +
    (isDark ? "border-slate-700 bg-slate-800 text-slate-100" : "border-sky-100 bg-sky-50 text-slate-900");

  const textSoft = isDark ? "text-slate-300" : "text-slate-600";
  const textStrong = isDark ? "text-slate-100" : "text-slate-900";

  return (
    <div className={containerClasses}>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-sky-600">
        Nova venda / fatura
      </h2>

      {/* CABEÇALHO */}
      <div className="grid md:grid-cols-4 gap-4 mb-4">
        {/* Cliente */}
        <div className="md:col-span-2">
          <label className={labelClasses}>
            Cliente <span className="text-rose-500">*</span>
          </label>
          <select
            value={form.clienteId}
            onChange={handleChange("clienteId")}
            className={inputNormal}
            disabled={loadingClientes}
          >
            <option value="">
              {loadingClientes ? "Carregando clientes..." : "Selecione um"}
            </option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
          {clientesError && (
            <p className="mt-1 text-[11px] text-rose-600">{clientesError}</p>
          )}
        </div>

        {/* Conta */}
        <div>
          <label className={labelClasses}>
            Conta <span className="text-rose-500">*</span>
          </label>
          <select
            value={form.contaId}
            onChange={handleChange("contaId")}
            className={inputNormal}
            disabled={loadingContas}
          >
            <option value="">
              {loadingContas ? "Carregando contas..." : "Selecione uma conta"}
            </option>
            {contas.map((conta) => (
              <option key={conta.id} value={conta.id}>
                {conta.banco} - {conta.numero}
              </option>
            ))}
          </select>
          {contasError && (
            <p className="mt-1 text-[11px] text-rose-600">{contasError}</p>
          )}
        </div>

        {/* Referência */}
        <div>
          <label className={labelClasses}>
            Referência <span className="text-rose-500">*</span>
          </label>
          <div className="flex">
            <span
              className={
                "inline-flex items-center rounded-l-md border px-2 text-xs " +
                (isDark
                  ? "border-slate-700 bg-slate-800 text-slate-200"
                  : "border-sky-100 bg-sky-100 text-slate-700")
              }
            >
              VD-
            </span>
            <input
              type="text"
              value={form.referenciaNumero}
              onChange={handleChange("referenciaNumero")}
              placeholder="00001"
              className={
                "flex-1 rounded-r-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300 " +
                (isDark
                  ? "border-slate-700 bg-slate-800 text-slate-100"
                  : "border-sky-100 bg-sky-50 text-slate-900")
              }
            />
          </div>
        </div>

        {/* Currency */}
        <div>
          <label className={labelClasses}>Currency</label>
          <input
            type="text"
            value={form.currency}
            readOnly
            className={inputMuted}
          />
        </div>

        {/* Localização */}
        <div>
          <label className={labelClasses}>
            Localização <span className="text-rose-500">*</span>
          </label>
          <select
            value={form.localizacao}
            onChange={handleChange("localizacao")}
            className={inputNormal}
          >
            <option>Armazem</option>
          </select>
        </div>

        {/* Data */}
        <div>
          <label className={labelClasses}>
            Data <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            value={form.data}
            onChange={handleChange("data")}
            className={inputNormal}
          />
        </div>

        {/* Prazo */}
        <div>
          <label className={labelClasses}>Prazo de Vencimento</label>
          <select
            value={form.prazoVencimento}
            onChange={handleChange("prazoVencimento")}
            className={inputNormal}
          >
            <option value="">Selecione um prazo</option>
            {termos.map((t) => (
              <option key={t.id} value={t.prazo}>
                {t.prazo}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method */}
        <div>
          <label className={labelClasses}>Payment Method</label>
          <select
            value={form.paymentMethod}
            onChange={handleChange("paymentMethod")}
            className={inputNormal}
          >
            <option value="">Selecione um</option>
            <option>Sem dados</option>
          </select>
        </div>

        {/* Request */}
        <div>
          <label className={labelClasses}>Request</label>
          <input
            type="text"
            value={form.request}
            onChange={handleChange("request")}
            className={inputNormal}
          />
        </div>

        {/* Pesquisar Item */}
        <div>
          <label className={labelClasses}>Pesquisar Item</label>
          <select
            value={itemSelecionadoId}
            onChange={handleProdutoSelect}
            className={inputNormal}
          >
            <option value="">Selecione um item</option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} - {p.referencia}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABELA DE ITENS */}
      <div
        className={
          "mt-4 overflow-x-auto border rounded-md " +
          (isDark ? "border-slate-800" : "border-sky-100")
        }
      >
        <table className="min-w-full text-xs">
          <thead className={tableHeader}>
            <tr>
              <th className="px-2 py-2 text-left">Descrição</th>
              <th className="px-2 py-2 text-right">Quant</th>
              <th className="px-2 py-2 text-right">Pr.Unitário (MZN)</th>
              <th className="px-2 py-2 text-right">IVA (%)</th>
              <th className="px-2 py-2 text-right">IVA</th>
              <th className="px-2 py-2 text-right">Desct. (%)</th>
              <th className="px-2 py-2 text-right">Total</th>
              <th className="px-2 py-2 text-center">Acção</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const base = item.quant * item.preco;
              const ivaValor = (base * (item.ivaPercent || 0)) / 100;
              const descValor = (base * (item.descontoPercent || 0)) / 100;
              const total = base + ivaValor - descValor;

              return (
                <tr
                  key={item.id}
                  className={
                    isDark
                      ? "border-t border-slate-800"
                      : "border-t border-slate-100"
                  }
                >
                  <td className="px-2 py-1">
                    <input
                      type="text"
                      value={item.descricao}
                      onChange={(e) =>
                        updateItem(item.id, "descricao", e.target.value)
                      }
                      className={tableInput}
                    />
                  </td>
                  <td className="px-2 py-1 text-right">
                    <input
                      type="number"
                      min="0"
                      value={item.quant}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "quant",
                          Number(e.target.value) || 0
                        )
                      }
                      className={tableInput}
                    />
                  </td>
                  <td className="px-2 py-1 text-right">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.preco}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "preco",
                          Number(e.target.value) || 0
                        )
                      }
                      className={tableInput}
                    />
                  </td>
                  <td className="px-2 py-1 text-right">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.ivaPercent}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "ivaPercent",
                          Number(e.target.value) || 0
                        )
                      }
                      className={tableInput}
                    />
                  </td>
                  <td className="px-2 py-1 text-right">
                    {ivaValor.toFixed(2)}
                  </td>
                  <td className="px-2 py-1 text-right">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.descontoPercent}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "descontoPercent",
                          Number(e.target.value) || 0
                        )
                      }
                      className={tableInput}
                    />
                  </td>
                  <td className="px-2 py-1 text-right">
                    {total.toFixed(2)}
                  </td>
                  <td className="px-2 py-1 text-center">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className={
                        "inline-flex items-center rounded-md border px-2 py-1 text-[10px] " +
                        (isDark
                          ? "border-rose-700 bg-rose-950 text-rose-300 hover:bg-rose-900"
                          : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100")
                      }
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              );
            })}

            <tr>
              <td
                colSpan={8}
                className={
                  "px-3 py-2 text-left text-xs cursor-pointer " +
                  (isDark ? "text-rose-300" : "text-rose-600")
                }
                onClick={addItem}
              >
                Add Custom Item
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* RODAPÉ DE TOTAIS */}
      <div className="mt-4 flex flex-col items-end gap-1 text-xs">
        <div className="flex justify-end gap-6">
          <span className={textSoft}>Subtotal:</span>
          <span className="font-semibold">
            {subTotal.toFixed(2)} {form.currency}
          </span>
        </div>
        <div className="flex justify-end gap-6">
          <span className={textSoft}>Descontos:</span>
          <span className="font-semibold text-amber-700">
            - {totalDesconto.toFixed(2)} {form.currency}
          </span>
        </div>
        <div className="flex justify-end gap-6">
          <span className={textSoft}>Impostos:</span>
          <span className="font-semibold text-emerald-700">
            + {totalImposto.toFixed(2)} {form.currency}
          </span>
        </div>
        <div
          className={
            "flex justify-end gap-6 pt-1 mt-1 border-t " +
            (isDark ? "border-slate-700" : "border-slate-200")
          }
        >
          <span className={`font-semibold ${textSoft}`}>
            Total documento:
          </span>
          <span className={`font-bold ${textStrong}`}>
            {totalDocumento.toFixed(2)} {form.currency}
          </span>
        </div>
      </div>

      {/* AÇÕES FINAIS */}
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-md bg-emerald-500 px-4 py-1.5 text-xs md:text-sm font-medium text-white hover:bg-emerald-400"
        >
          Gravar venda
        </button>
      </div>
    </div>
  );
}

export default VendasStatus;
