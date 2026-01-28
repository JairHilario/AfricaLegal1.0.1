import React, { useState, useEffect } from "react";
import {
  DocumentArrowDownIcon,
  ArrowDownOnSquareStackIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";

const formatDate = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

function CotacoesStatus({
  onAddCotacao,
  clientes = [],
  prazos = [],
  ivas = [],
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
              <span>{showAddForm ? "Fechar" : "Nova cotação"}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
            <span className={labelText}>Período:</span>
            <input type="date" className={periodInput} />
            <span className={isDark ? "text-slate-400" : "text-slate-500"}>até</span>
            <input type="date" className={periodInput} />
          </div>
        </div>

        <div className="mt-4 relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Buscar por número, cliente, estado..."
            className={searchInput}
          />
        </div>
      </div>

      {showAddForm && (
        <AddCotacaoForm
          onAddCotacao={onAddCotacao}
          clientes={clientes}
          prazos={prazos}
          ivas={ivas}
          temaAtual={temaAtual}
        />
      )}
    </>
  );
}

function AddCotacaoForm({
  onAddCotacao,
  clientes = [],
  prazos = [],
  ivas = [],
  temaAtual = "light",
}) {
  const isDark = temaAtual === "dark";
  const hojeIso = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    clienteId: "",
    referencia: "",
    moeda: "MZN",
    venda: 1,
    prazoId: "",
    data: hojeIso,
    dataFim: "",
  });

  const [errors, setErrors] = useState({});
  const [itens, setItens] = useState([]);

  // Lógica para calcular Data Fim baseada no Prazo selecionado
  useEffect(() => {
    if (form.prazoId && form.data) {
      const prazoSelecionado = prazos.find(p => String(p.id) === String(form.prazoId));
      if (prazoSelecionado) {
        // Extrai o número do texto (ex: "30 dias" -> 30)
        const dias = parseInt(prazoSelecionado.prazo) || 0;
        const dataFim = new Date(form.data);
        dataFim.setDate(dataFim.getDate() + dias);
        setForm(prev => ({ ...prev, dataFim: dataFim.toISOString().slice(0, 10) }));
      }
    }
  }, [form.prazoId, form.data, prazos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "venda" ? Number(value) : value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    setItens((prev) => {
      const clone = [...prev];
      const item = { ...clone[index] };

      if (["quant", "precoUnit", "descontoPercent"].includes(field)) {
        item[field] = Number(value) || 0;
      } else if (field === "ivaId") {
        item.ivaId = value;
        const tipo = ivas.find((i) => String(i.id) === String(value));
        item.ivaPercent = tipo ? tipo.taxa : 0;
      } else {
        item[field] = value;
      }

      const base = item.quant * item.precoUnit;
      const iva = (base * (item.ivaPercent || 0)) / 100;
      const desconto = (base * (item.descontoPercent || 0)) / 100;
      item.ivaValor = iva;
      item.total = base + iva - desconto;

      clone[index] = item;
      return clone;
    });
  };

  const addItem = () => {
    setItens((prev) => [
      ...prev,
      {
        descricao: "",
        quant: 1,
        precoUnit: 0,
        ivaId: "",
        ivaPercent: 0,
        ivaValor: 0,
        descontoPercent: 0,
        total: 0,
      },
    ]);
  };

  const removeItem = (index) => {
    setItens((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = itens.reduce((acc, it) => acc + it.quant * it.precoUnit, 0);
  const descontoTotal = itens.reduce((acc, it) => acc + (it.quant * it.precoUnit * (it.descontoPercent || 0)) / 100, 0);
  const impostoTotal = itens.reduce((acc, it) => acc + (it.ivaValor || 0), 0);
  const totalDocumento = subtotal + impostoTotal - descontoTotal;

  const validate = () => {
    const newErrors = {};
    if (!form.clienteId) newErrors.clienteId = "Obrigatório.";
    if (!form.referencia.trim()) newErrors.referencia = "Obrigatório.";
    if (!form.moeda) newErrors.moeda = "Obrigatório.";
    if (!form.data) newErrors.data = "Obrigatório.";
    if (!form.prazoId) newErrors.prazoId = "Selecione o prazo.";
    if (itens.length === 0) newErrors.itens = "Adicione pelo menos um item.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (onAddCotacao) {
      onAddCotacao({ ...form, itens, subTotal: subtotal, descontoTotal, impostoTotal, totalDocumento });
    }
  };

  // Estilos dinâmicos (Tailwind)
  const containerClasses = `mb-4 rounded-md border p-4 md:p-6 shadow-sm ${isDark ? "border-slate-800 bg-slate-900" : "border-sky-100 bg-white"}`;
  const labelClass = `mb-1 block text-xs font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`;
  const inputNormal = `w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300 ${isDark ? "border-slate-700 bg-slate-800 text-slate-100" : "border-sky-100 bg-sky-50 text-slate-900"}`;
  const tableHead = `bg-sky-50 text-slate-700 ${isDark ? "bg-slate-800 text-slate-200" : ""}`;

  return (
    <div className={containerClasses}>
      <h2 className={`mb-4 text-sm font-semibold uppercase ${isDark ? "text-slate-200" : "text-slate-700"}`}>Nova cotação</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div className="grid gap-4 md:grid-cols-4">
          {/* Cliente */}
          <div>
            <label className={labelClass}>Cliente *</label>
            <select name="clienteId" value={form.clienteId} onChange={handleChange} className={inputNormal}>
              <option value="">Selecione um</option>
              {Array.isArray(clientes) && clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
            {errors.clienteId && <p className="mt-1 text-[11px] text-rose-600">{errors.clienteId}</p>}
          </div>

          {/* Referência */}
          <div>
            <label className={labelClass}>Referência *</label>
            <div className="flex">
              <span className={`inline-flex items-center rounded-l-md border px-2 text-xs ${isDark ? "border-slate-700 bg-slate-800 text-slate-300" : "border-sky-100 bg-sky-100 text-slate-700"}`}>COT-</span>
              <input type="text" name="referencia" value={form.referencia} onChange={handleChange} placeholder="0001/2026" className={`flex-1 rounded-r-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300 ${isDark ? "border-slate-700 bg-slate-800 text-slate-100" : "border-sky-100 bg-sky-50 text-slate-900"}`} />
            </div>
          </div>

          {/* Moeda */}
          <div>
            <label className={labelClass}>Moeda *</label>
            <select name="moeda" value={form.moeda} onChange={handleChange} className={inputNormal}>
              <option value="MZN">MZN</option>
              <option value="USD">USD</option>
              <option value="ZAR">ZAR</option>
            </select>
          </div>

          {/* Prazo */}
          <div>
            <label className={labelClass}>Prazo de Vencimento</label>
            <select name="prazoId" value={form.prazoId} onChange={handleChange} className={inputNormal}>
              <option value="">Selecione</option>
              {Array.isArray(prazos) && prazos.map((p) => (
                <option key={p.id} value={p.id}>{p.prazo}</option>
              ))}
            </select>
          </div>

          {/* Data e Data Fim */}
          <div>
            <label className={labelClass}>Data *</label>
            <input type="date" name="data" value={form.data} onChange={handleChange} className={inputNormal} />
          </div>
          <div>
            <label className={labelClass}>Data Fim (Auto)</label>
            <input type="date" name="dataFim" value={form.dataFim} readOnly className={`${inputNormal} opacity-70 cursor-not-allowed`} />
          </div>
        </div>

        {/* TABELA DE ITENS */}
        <div className={`mt-4 overflow-x-auto rounded-md border ${isDark ? "border-slate-800" : "border-sky-100"}`}>
          <table className={`min-w-full text-xs ${isDark ? "text-slate-100" : "text-slate-800"}`}>
            <thead className={tableHead}>
              <tr>
                <th className="px-2 py-2 text-left">Descrição</th>
                <th className="px-2 py-2 text-right">Quant</th>
                <th className="px-2 py-2 text-right">Pr.Unitário</th>
                <th className="px-2 py-2 text-right">IVA(%)</th>
                <th className="px-2 py-2 text-right">Total</th>
                <th className="px-2 py-2 text-center">Acção</th>
              </tr>
            </thead>
            <tbody>
              {itens.map((it, index) => (
                <tr key={index} className={isDark ? "border-t border-slate-800" : "border-t border-slate-100"}>
                  <td className="px-2 py-1">
                    <input type="text" value={it.descricao} onChange={(e) => handleItemChange(index, "descricao", e.target.value)} className={inputNormal} />
                  </td>
                  <td className="px-2 py-1">
                    <input type="number" value={it.quant} onChange={(e) => handleItemChange(index, "quant", e.target.value)} className={`${inputNormal} text-right`} />
                  </td>
                  <td className="px-2 py-1">
                    <input type="number" value={it.precoUnit} onChange={(e) => handleItemChange(index, "precoUnit", e.target.value)} className={`${inputNormal} text-right`} />
                  </td>
                  <td className="px-2 py-1">
                    <select value={it.ivaId || ""} onChange={(e) => handleItemChange(index, "ivaId", e.target.value)} className={inputNormal}>
                      <option value="">Isento</option>
                      {Array.isArray(ivas) && ivas.map((iva) => (
                        <option key={iva.id} value={iva.id}>{iva.nome} ({iva.taxa}%)</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-1 text-right font-medium">{it.total.toFixed(2)}</td>
                  <td className="px-2 py-1 text-center">
                    <button type="button" onClick={() => removeItem(index)} className="text-rose-500 hover:text-rose-400">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={addItem} className="p-2 text-xs text-sky-600 hover:underline">+ Adicionar Item</button>
        </div>

        {/* TOTAIS */}
        <div className={`mt-4 border rounded-md p-2 space-y-1 ${isDark ? "border-slate-800 bg-slate-900/50" : "border-sky-100 bg-sky-50/30"}`}>
            <div className="flex justify-between"><span>Subtotal:</span><span>{subtotal.toFixed(2)} MZN</span></div>
            <div className="flex justify-between"><span>IVA Total:</span><span>{impostoTotal.toFixed(2)} MZN</span></div>
            <div className="flex justify-between font-bold border-t pt-1"><span>Total Documento:</span><span>{totalDocumento.toFixed(2)} MZN</span></div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button type="submit" className="rounded-md bg-emerald-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-400">
            Guardar cotação
          </button>
        </div>
      </form>
    </div>
  );
}

export default CotacoesStatus;