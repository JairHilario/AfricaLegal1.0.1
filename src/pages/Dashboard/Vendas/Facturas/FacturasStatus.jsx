import React, { useState, useEffect } from "react";
import {
  DocumentArrowDownIcon,
  ArrowDownOnSquareStackIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

function VendasStatus({ onAddVenda, temaAtual = "light" }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const isDark = temaAtual === "dark";

  const barClasses =
    "mb-4 rounded-md border p-4 md:p-6 shadow-sm " +
    (isDark ? "border-slate-800 bg-slate-900" : "border-sky-100 bg-white");

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

  const handleToggleForm = () => {
    setShowAddForm((v) => !v);
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
              onClick={handleToggleForm}
              className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-md text-xs md:text-sm"
            >
              <UserPlusIcon className="h-4 w-4 opacity-90" />
              <span>{showAddForm ? "Fechar" : "Nova venda"}</span>
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
            placeholder="Buscar por número, cliente, produto, estado..."
            className={searchInput}
          />
        </div>
      </div>

      {showAddForm && <AddVendaForm onAddVenda={onAddVenda} temaAtual={temaAtual} />}
    </>
  );
}


function AddVendaForm({ onAddVenda, temaAtual = "light" }) {
  const isDark = temaAtual === "dark";
  const hojeIso = new Date().toISOString().slice(0, 10);

  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [clientesError, setClientesError] = useState("");

  const [form, setForm] = useState({
    clienteId: "",
    referencia: "",
    moeda: "MZN",
    localizacao: "Armazem",
    prazoVencimento: "Pagamento na Entrega",
    data: hojeIso,
    dataFim: "",
    observacoes: "",
    pesquisarItem: "",
    numeroRequisicao: "",
  });

  const [itens, setItens] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const containerClasses =
    "mb-4 rounded-md border p-4 md:p-6 shadow-sm " +
    (isDark ? "border-slate-800 bg-slate-900" : "border-sky-100 bg-white");

  const titleClasses =
    "mb-4 text-sm font-semibold uppercase tracking-wide " +
    (isDark ? "text-slate-200" : "text-slate-700");

  const labelClass =
    "mb-1 block text-xs font-medium " +
    (isDark ? "text-slate-300" : "text-slate-700");

  const inputBase =
    "w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300 ";

  const inputNormal = isDark
    ? inputBase +
      "border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-500"
    : inputBase +
      "border-sky-100 bg-sky-50 text-slate-900 placeholder-slate-400";

  const inputReadOnly = isDark
    ? "w-full rounded-md border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-slate-200"
    : "w-full rounded-md border border-sky-100 bg-sky-100 px-3 py-2 text-sm text-slate-900";

  const selectNormal = inputNormal;

  const textAreaClass =
    "w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300 " +
    (isDark
      ? "border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-500"
      : "border-sky-100 bg-sky-50 text-slate-900 placeholder-slate-400");

  const tableWrapper =
    "md:col-span-2 mt-2 border rounded-md overflow-x-auto " +
    (isDark ? "border-slate-800" : "border-sky-100");

  const tableClass =
    "min-w-full text-xs md:text-sm " +
    (isDark ? "text-slate-100" : "text-slate-800");

  const tableHead =
    (isDark ? "bg-slate-800 text-slate-200" : "bg-sky-50 text-slate-700");

  const cellInput =
    "w-full border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-sky-300 " +
    (isDark
      ? "border-slate-700 bg-slate-800 text-slate-100"
      : "border-sky-100 bg-sky-50 text-slate-900");

  const rowBorder = isDark ? "border-t border-slate-800" : "border-t border-slate-100";

  const totalsLabelCell =
    "px-3 py-2 text-right font-medium " +
    (isDark ? "text-slate-200" : "text-slate-700");

  const totalsValueCell =
    "px-3 py-2 text-right " + (isDark ? "text-slate-100" : "text-slate-800");

  const clearButton =
    "rounded-md border px-4 py-1.5 text-xs hover:bg-slate-700/40 " +
    (isDark
      ? "border-slate-600 text-slate-200"
      : "border-slate-200 text-slate-700 hover:bg-slate-100");

  const submitButton =
    "rounded-md bg-emerald-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-400 disabled:opacity-60";

  // efeitos, handlers e cálculos são os mesmos que você já tinha
  // (copiados do seu código, só reusando as mesmas funções)

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoadingClientes(true);
        setClientesError("");

        const savedAuth = localStorage.getItem("africaLegalUser");
        const token = savedAuth ? JSON.parse(savedAuth).token : null;

        const res = await fetch("http://localhost:4000/clients", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          throw new Error("Erro ao buscar clientes");
        }

        const data = await res.json();
        setClientes(data);
      } catch (err) {
        console.error(err);
        setClientesError(err.message || "Erro ao carregar clientes");
      } finally {
        setLoadingClientes(false);
      }
    };

    fetchClientes();
  }, []);

  useEffect(() => {
    const fetchReferencia = async () => {
      try {
        const savedAuth = localStorage.getItem("africaLegalUser");
        const token = savedAuth ? JSON.parse(savedAuth).token : null;

        const res = await fetch(
          "http://localhost:4000/vendas/proxima-referencia",
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (!res.ok) {
          throw new Error("Erro ao obter referência");
        }

        const data = await res.json();
        setForm((prev) => ({ ...prev, referencia: data.referencia }));
      } catch (err) {
        console.error(err);
        setForm((prev) => ({ ...prev, referencia: "FT-" }));
      }
    };

    fetchReferencia();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.clienteId.trim()) newErrors.clienteId = "Obrigatório.";
    if (!form.data) newErrors.data = "Obrigatório.";
    if (itens.length === 0) newErrors.itens = "Adicione pelo menos um item.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClear = () => {
    setForm((prev) => ({
      ...prev,
      clienteId: "",
      moeda: "MZN",
      localizacao: "Armazem",
      prazoVencimento: "Pagamento na Entrega",
      data: hojeIso,
      dataFim: "",
      observacoes: "",
      pesquisarItem: "",
      numeroRequisicao: "",
    }));
    setItens([]);
    setErrors({});
  };

  const handleAddItem = () => {
    setItens((prev) => [
      ...prev,
      {
        id: Date.now(),
        descricao: "",
        quantidade: 1,
        precoUnit: 0,
        ivaPercent: 0,
        descontoPercent: 0,
      },
    ]);
  };

  const handleItemChange = (id, field, value) => {
    setItens((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "quantidade" ||
                field === "precoUnit" ||
                field === "ivaPercent" ||
                field === "descontoPercent"
                  ? Number(value)
                  : value,
            }
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setItens((prev) => prev.filter((i) => i.id !== id));
  };

  const subTotal = itens.reduce(
    (acc, item) => acc + item.quantidade * item.precoUnit,
    0
  );

  const descontoTotal = itens.reduce((acc, item) => {
    const linha = item.quantidade * item.precoUnit;
    return acc + (linha * (item.descontoPercent || 0)) / 100;
  }, 0);

  const impostoTotal = itens.reduce((acc, item) => {
    const linha = item.quantidade * item.precoUnit;
    const linhaComDesconto =
      linha - (linha * (item.descontoPercent || 0)) / 100;
    return acc + (linhaComDesconto * (item.ivaPercent || 0)) / 100;
  }, 0);

  const totalDocumento = subTotal - descontoTotal + impostoTotal;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const savedAuth = localStorage.getItem("africaLegalUser");
      const token = savedAuth ? JSON.parse(savedAuth).token : null;

      const res = await fetch("http://localhost:4000/vendas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          clienteId: form.clienteId,
          referencia: form.referencia,
          moeda: form.moeda,
          localizacao: form.localizacao,
          prazoVencimento: form.prazoVencimento,
          data: form.data,
          dataFim: form.dataFim || null,
          observacoes: form.observacoes || null,
          numeroRequisicao: form.numeroRequisicao || null,
          itens,
          subTotal,
          descontoTotal,
          impostoTotal,
          totalDocumento,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Erro ao criar venda");
      }

      if (onAddVenda) {
        onAddVenda(data);
      }

      handleClear();

      const refRes = await fetch(
        "http://localhost:4000/vendas/proxima-referencia",
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      if (refRes.ok) {
        const refData = await refRes.json();
        setForm((prev) => ({ ...prev, referencia: refData.referencia }));
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao criar venda");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={containerClasses}>
      <h2 className={titleClasses}>Nova venda / fatura</h2>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 md:grid-cols-2 text-sm"
      >
        <div>
          <label className={labelClass}>
            Cliente <span className="text-rose-500">*</span>
          </label>
          <select
            name="clienteId"
            value={form.clienteId}
            onChange={handleChange}
            className={selectNormal}
            disabled={loadingClientes}
          >
            <option value="">
              {loadingClientes ? "Carregando clientes..." : "Selecione um"}
            </option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>
          {clientesError && (
            <p className="mt-1 text-[11px] text-rose-600">{clientesError}</p>
          )}
          {errors.clienteId && (
            <p className="mt-1 text-[11px] text-rose-600">
              {errors.clienteId}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>Referência</label>
          <input
            type="text"
            name="referencia"
            value={form.referencia}
            readOnly
            className={inputReadOnly}
          />
        </div>

        <div>
          <label className={labelClass}>Moeda</label>
          <select
            name="moeda"
            value={form.moeda}
            onChange={handleChange}
            className={selectNormal}
          >
            <option value="MZN">MZN</option>
            <option value="ZAR">ZAR</option>
            <option value="USD">USD</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Localização</label>
          <select
            name="localizacao"
            value={form.localizacao}
            onChange={handleChange}
            className={selectNormal}
          >
            <option value="Armazem">Armazem</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Prazo de vencimento</label>
          <select
            name="prazoVencimento"
            value={form.prazoVencimento}
            onChange={handleChange}
            className={selectNormal}
          >
            <option value="Pagamento na Entrega">Pagamento na Entrega</option>
            <option value="Apos 7 dias">Apos 7 dias</option>
            <option value="Apos 15 dias">Apos 15 dias</option>
            <option value="Apos 30 dias">Apos 30 dias</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Data</label>
          <input
            type="date"
            name="data"
            value={form.data}
            onChange={handleChange}
            className={inputNormal}
          />
          {errors.data && (
            <p className="mt-1 text-[11px] text-rose-600">{errors.data}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Data fim</label>
          <input
            type="date"
            name="dataFim"
            value={form.dataFim}
            onChange={handleChange}
            className={inputNormal}
          />
        </div>

        <div>
          <label className={labelClass}>Nº Requisição</label>
          <input
            type="text"
            name="numeroRequisicao"
            value={form.numeroRequisicao}
            onChange={handleChange}
            placeholder="Nr Requisição"
            className={inputNormal}
          />
        </div>

        <div>
          <label className={labelClass}>Pesquisar Item</label>
          <input
            type="text"
            name="pesquisarItem"
            value={form.pesquisarItem}
            onChange={handleChange}
            placeholder="Procurar Item"
            className={inputNormal}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Observações</label>
          <textarea
            name="observacoes"
            value={form.observacoes}
            onChange={handleChange}
            rows={3}
            placeholder="Notas internas, condições especiais..."
            className={textAreaClass}
          />
        </div>

        <div className={tableWrapper}>
          <table className={tableClass}>
            <thead className={tableHead}>
              <tr>
                <th className="px-3 py-2 text-left">Descrição</th>
                <th className="px-3 py-2 text-right">Quant</th>
                <th className="px-3 py-2 text-right">Pr.Unitário (MZN)</th>
                <th className="px-3 py-2 text-right">IVA (%)</th>
                <th className="px-3 py-2 text-right">IVA</th>
                <th className="px-3 py-2 text-right">Desct. (%)</th>
                <th className="px-3 py-2 text-right">Total</th>
                <th className="px-3 py-2 text-center">Ação</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  className={
                    "px-3 py-2 text-xs cursor-pointer " +
                    (isDark ? "text-sky-300" : "text-sky-600")
                  }
                  colSpan={8}
                  onClick={handleAddItem}
                >
                  Add Custom Item
                </td>
              </tr>

              {itens.map((item) => {
                const linha = item.quantidade * item.precoUnit;
                const linhaDesconto =
                  (linha * (item.descontoPercent || 0)) / 100;
                const linhaBase = linha - linhaDesconto;
                const linhaIva =
                  (linhaBase * (item.ivaPercent || 0)) / 100;
                const linhaTotal = linhaBase + linhaIva;

                return (
                  <tr key={item.id} className={rowBorder}>
                    <td className="px-3 py-1">
                      <input
                        type="text"
                        className={cellInput}
                        value={item.descricao}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "descricao",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="px-3 py-1">
                      <input
                        type="number"
                        min="1"
                        className={cellInput + " text-right"}
                        value={item.quantidade}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "quantidade",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="px-3 py-1">
                      <input
                        type="number"
                        step="0.01"
                        className={cellInput + " text-right"}
                        value={item.precoUnit}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "precoUnit",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="px-3 py-1">
                      <input
                        type="number"
                        step="0.01"
                        className={cellInput + " text-right"}
                        value={item.ivaPercent}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "ivaPercent",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="px-3 py-1 text-right">
                      {linhaIva.toFixed(2)}
                    </td>
                    <td className="px-3 py-1">
                      <input
                        type="number"
                        step="0.01"
                        className={cellInput + " text-right"}
                        value={item.descontoPercent}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "descontoPercent",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="px-3 py-1 text-right">
                      {linhaTotal.toFixed(2)}
                    </td>
                    <td className="px-3 py-1 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className={
                          "text-[11px] " +
                          (isDark ? "text-rose-300" : "text-rose-600")
                        }
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                );
              })}

              <tr className={rowBorder}>
                <td colSpan={6} className={totalsLabelCell}>
                  Sub Total (MZN)
                </td>
                <td className={totalsValueCell}>{subTotal.toFixed(2)}</td>
                <td />
              </tr>
              <tr>
                <td colSpan={6} className={totalsLabelCell}>
                  Desct. (MZN)
                </td>
                <td className={totalsValueCell}>
                  {descontoTotal.toFixed(2)}
                </td>
                <td />
              </tr>
              <tr>
                <td colSpan={6} className={totalsLabelCell}>
                  Imposto Total (MZN)
                </td>
                <td className={totalsValueCell}>
                  {impostoTotal.toFixed(2)}
                </td>
                <td />
              </tr>
              <tr>
                <td
                  colSpan={6}
                  className={
                    totalsLabelCell + " font-semibold"
                  }
                >
                  Total do Documento em (MZN)
                </td>
                <td className={totalsValueCell + " font-semibold"}>
                  {totalDocumento.toFixed(2)}
                </td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>

        <div className="md:col-span-2 flex justify-end gap-2 pt-3">
          <button
            type="button"
            onClick={handleClear}
            className={clearButton}
            disabled={submitting}
          >
            Limpar
          </button>
          <button
            type="submit"
            className={submitButton}
            disabled={submitting}
          >
            {submitting ? "Guardando..." : "Guardar venda"}
          </button>
        </div>

        {errors.itens && (
          <p className="md:col-span-2 mt-1 text-[11px] text-rose-600">
            {errors.itens}
          </p>
        )}
      </form>
    </div>
  );
}


export default VendasStatus;
