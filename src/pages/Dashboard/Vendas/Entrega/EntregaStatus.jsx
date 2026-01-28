import React, { useState, useEffect } from "react";
import {
  DocumentArrowDownIcon,
  ArrowDownOnSquareStackIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

// ATUALIZADO: Base da API (sem o /api no final, pois o backend é modular)
const API_BASE = "http://localhost:4000";

function EntregaStatus({ search, setSearch, onAddEntrega, temaAtual = "light" }) {
  const [showAddForm, setShowAddForm] = useState(false);
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
              <span>{showAddForm ? "Fechar" : "Nova entrega"}</span>
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
            placeholder="Buscar por referência, cliente, estado..."
            className={searchInput}
          />
        </div>
      </div>

      {showAddForm && <AddEntregaForm onAddEntrega={onAddEntrega} temaAtual={temaAtual} />}
    </>
  );
}

function AddEntregaForm({ onAddEntrega, temaAtual = "light" }) {
  const isDark = temaAtual === "dark";
  const hojeIso = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    clienteId: "",
    clienteNome: "",
    facturaId: "",
    facturaRef: "",
    data: hojeIso,
    referenciaNumero: "",
    localEntrega: "",
    motoristaNome: "",
    cartaConducao: "",
    matriculaCarro: "",
    nota: "",
  });

  const [clientes, setClientes] = useState([]);
  const [facturas, setFacturas] = useState([]); // Iniciado como array vazio
  const [items, setItems] = useState([]);
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

  const subTotal = items.reduce(
    (acc, item) => acc + item.quant * item.preco,
    0
  );
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
    const fetchAll = async () => {
      try {
        const [cRes, pRes] = await Promise.all([
          fetch(`${API_BASE}/clients`),
          fetch(`${API_BASE}/produtos`),
        ]);
        const cData = await cRes.json();
        const pData = await pRes.json();
        // Segurança: garante que os dados sejam arrays
        setClientes(Array.isArray(cData) ? cData : []);
        setProdutos(Array.isArray(pData) ? pData : []);
      } catch (e) {
        console.error("Erro ao carregar dados:", e);
      }
    };
    fetchAll();
  }, []);

  const handleClienteChange = async (e) => {
    const id = e.target.value;
    const cliente = clientes.find((c) => String(c.id) === id);

    setForm((prev) => ({
      ...prev,
      clienteId: id,
      clienteNome: cliente?.nome || "",
      facturaId: "",
      facturaRef: "",
    }));

    if (!id) {
      setFacturas([]);
      return;
    }

    try {
      // CORRIGIDO: Agora usa /vendas que é a rota de faturas modular
      const res = await fetch(`${API_BASE}/vendas?clientId=${id}`);
      if (!res.ok) throw new Error("Erro na rede");
      const data = await res.json();
      setFacturas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar faturas:", err);
      setFacturas([]); // Evita o erro de .map()
    }
  };

  const handleFacturaChange = (e) => {
    const id = e.target.value;
    const f = facturas.find((ft) => String(ft.id) === id);
    setForm((prev) => ({
      ...prev,
      facturaId: id,
      facturaRef: f?.referencia || "",
    }));
  };

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

  const handleSubmit = () => {
    if (!onAddEntrega) return;

    if (!form.clienteId) { alert("Seleciona um cliente."); return; }
    if (!form.facturaId) { alert("Seleciona a factura relacionada."); return; }
    if (!form.data) { alert("Seleciona a data."); return; }
    if (!form.referenciaNumero) { alert("Escreve a referência da guia de entrega."); return; }
    if (items.length === 0) { alert("Adiciona pelo menos um item."); return; }

    const novo = {
      clienteId: Number(form.clienteId),
      cliente: form.clienteNome,
      facturaId: Number(form.facturaId),
      facturaNumero: form.facturaRef,
      referencia: `GE-${form.referenciaNumero}`,
      data: form.data,
      localEntrega: form.localEntrega,
      motoristaNome: form.motoristaNome,
      cartaConducao: form.cartaConducao,
      matriculaCarro: form.matriculaCarro,
      items,
      valorSemIva: subTotal - totalDesconto,
      valorIva: totalImposto,
      valorComIva: totalDocumento,
      valor: totalDocumento,
      nota: form.nota,
    };

    onAddEntrega(novo);
  };

  // ... (Classes de estilo continuam iguais)
  const containerClasses = "mb-4 rounded-md border p-4 md:p-6 shadow-sm text-xs md:text-sm " + (isDark ? "border-slate-800 bg-slate-900 text-slate-100" : "border-sky-100 bg-white text-slate-800");
  const titleClasses = "mb-4 text-sm font-semibold uppercase tracking-wide " + (isDark ? "text-slate-100" : "text-slate-700");
  const labelClass = "mb-1 block text-xs font-medium " + (isDark ? "text-slate-300" : "text-slate-700");
  const inputBase = "w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300 ";
  const inputNormal = isDark ? inputBase + "border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-500" : inputBase + "border-sky-100 bg-sky-50 text-slate-900 placeholder-slate-400";
  const selectNormal = inputNormal;
  const badgePrefix = "inline-flex items-center rounded-l-md border px-2 text-xs " + (isDark ? "border-slate-700 bg-slate-800 text-slate-300" : "border-sky-100 bg-sky-100 text-slate-700");
  const badgeInput = "flex-1 rounded-r-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300 " + (isDark ? "border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-500" : "border-sky-100 bg-sky-50 text-slate-900 placeholder-slate-400");
  const tableWrapper = "mt-4 overflow-x-auto border rounded-md " + (isDark ? "border-slate-800" : "border-sky-100");
  const tableHead = (isDark ? "bg-slate-800 text-slate-200" : "bg-sky-50 text-slate-700");
  const cellInput = "w-full rounded-md border px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-sky-300 " + (isDark ? "border-slate-700 bg-slate-800 text-slate-100" : "border-sky-100 bg-sky-50 text-slate-900");
  const rowBorder = isDark ? "border-t border-slate-800" : "border-t border-slate-100";
  const totalsBox = "mt-4 border rounded-md text-xs " + (isDark ? "border-slate-800" : "border-sky-100");
  const totalsLabel = "border-r px-3 py-2 text-right font-medium " + (isDark ? "border-slate-800 text-slate-200" : "border-sky-100 text-slate-700");
  const totalsValue = "px-3 py-2 text-right " + (isDark ? "text-slate-100" : "text-slate-800");
  const textAreaClass = "w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300 " + (isDark ? "border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-500" : "border-sky-100 bg-sky-50 text-slate-900 placeholder-slate-400");
  const submitButton = "rounded-md bg-emerald-500 px-4 py-1.5 text-xs md:text-sm font-medium text-white hover:bg-emerald-400";

  return (
    <div className={containerClasses}>
      <h2 className={titleClasses}>Nova Guia de Entrega</h2>

      <div className="grid md:grid-cols-4 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className={labelClass}>
            Cliente <span className="text-rose-500">*</span>
          </label>
          <select value={form.clienteId} onChange={handleClienteChange} className={selectNormal}>
            <option value="">Selecione um</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>
            Factura Relacionada <span className="text-rose-500">*</span>
          </label>
          <select value={form.facturaId} onChange={handleFacturaChange} className={selectNormal}>
            <option value="">Selecione uma factura</option>
            {/* CORREÇÃO: Verificação de segurança Array.isArray */}
            {Array.isArray(facturas) && facturas.map((f) => (
              <option key={f.id} value={f.id}>
                {`${f.referencia} - ${f.data || ''} - ${f.valor || ''}`}
              </option>
            ))}
          </select>
        </div>

        {/* ... (Resto do formulário idêntico) */}
        <div>
          <label className={labelClass}>Data <span className="text-rose-500">*</span></label>
          <input type="date" value={form.data} onChange={handleChange("data")} className={inputNormal} />
        </div>

        <div>
          <label className={labelClass}>Referência <span className="text-rose-500">*</span></label>
          <div className="flex">
            <span className={badgePrefix}>GE-</span>
            <input type="text" value={form.referenciaNumero} onChange={handleChange("referenciaNumero")} placeholder="001" className={badgeInput} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Local de entrega</label>
          <input type="text" value={form.localEntrega} onChange={handleChange("localEntrega")} className={inputNormal} />
        </div>

        <div>
          <label className={labelClass}>Nome do motorista</label>
          <input type="text" value={form.motoristaNome} onChange={handleChange("motoristaNome")} className={inputNormal} />
        </div>

        <div>
          <label className={labelClass}>Carta de Condução</label>
          <input type="text" value={form.cartaConducao} onChange={handleChange("cartaConducao")} className={inputNormal} />
        </div>

        <div>
          <label className={labelClass}>Matricula do carro</label>
          <input type="text" value={form.matriculaCarro} onChange={handleChange("matriculaCarro")} className={inputNormal} />
        </div>

        <div>
          <label className={labelClass}>Pesquisar Item</label>
          <select value={itemSelecionadoId} onChange={handleProdutoSelect} className={selectNormal}>
            <option value="">Selecione um item</option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela de itens e Totais */}
      <div className={tableWrapper}>
        <table className="min-w-full text-xs">
          <thead className={tableHead}>
            <tr>
              <th className="px-2 py-2 text-left">Descrição</th>
              <th className="px-2 py-2 text-right">Quant</th>
              <th className="px-2 py-2 text-right">Pr.Unitário</th>
              <th className="px-2 py-2 text-right">IVA (%)</th>
              <th className="px-2 py-2 text-right">IVA Tax</th>
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
                <tr key={item.id} className={rowBorder}>
                  <td className="px-2 py-1"><input type="text" value={item.descricao} onChange={(e) => updateItem(item.id, "descricao", e.target.value)} className={cellInput} /></td>
                  <td className="px-2 py-1 text-right"><input type="number" value={item.quant} onChange={(e) => updateItem(item.id, "quant", Number(e.target.value))} className={cellInput + " text-right"} /></td>
                  <td className="px-2 py-1 text-right"><input type="number" value={item.preco} onChange={(e) => updateItem(item.id, "preco", Number(e.target.value))} className={cellInput + " text-right"} /></td>
                  <td className="px-2 py-1 text-right"><input type="number" value={item.ivaPercent} onChange={(e) => updateItem(item.id, "ivaPercent", Number(e.target.value))} className={cellInput + " text-right"} /></td>
                  <td className="px-2 py-1 text-right">{ivaValor.toFixed(2)}</td>
                  <td className="px-2 py-1 text-right"><input type="number" value={item.descontoPercent} onChange={(e) => updateItem(item.id, "descontoPercent", Number(e.target.value))} className={cellInput + " text-right"} /></td>
                  <td className="px-2 py-1 text-right">{total.toFixed(2)}</td>
                  <td className="px-2 py-1 text-center space-x-1">
                    <button type="button" onClick={() => removeItem(item.id)} className="text-rose-500">Remover</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={totalsBox}>
        <div className="grid grid-cols-2"><div className={totalsLabel}>Total do Documento (MZN)</div><div className={totalsValue + " font-bold"}>{totalDocumento.toFixed(2)}</div></div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button type="button" onClick={handleSubmit} className={submitButton}>Gravar entrega</button>
      </div>
    </div>
  );
}

export default EntregaStatus;