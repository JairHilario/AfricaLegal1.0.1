import React, { useState, useEffect } from "react";
import {
  ArrowUpOnSquareStackIcon,
  ArrowDownOnSquareStackIcon,
  DocumentArrowDownIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

function StockStatus({ search, setSearch, onAddProduto, temaAtual = "light" }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const isDark = temaAtual === "dark";

  const barClasses =
    "mb-4 rounded-md border p-4 md:p-6 shadow-sm " +
    (isDark
      ? "border-slate-800 bg-slate-900"
      : "border-sky-100 bg-white");

  const labelText = isDark ? "text-slate-300" : "text-slate-600";

  const selectFilter =
    "px-2 py-1 rounded-md text-xs md:text-sm border focus:outline-none focus:ring-1 focus:ring-sky-300 " +
    (isDark
      ? "border-slate-700 bg-slate-800 text-slate-100"
      : "border-sky-100 bg-sky-50 text-slate-800");

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
            <button className="inline-flex items-center gap-1.5 bg-sky-500 hover:bg-sky-400 text-white px-3 py-1.5 rounded-md text-xs md:text-sm">
              <ArrowUpOnSquareStackIcon className="h-4 w-4 opacity-90" />
              <span>Importar</span>
            </button>

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
              <PlusIcon className="h-4 w-4 opacity-90" />
              <span>{showAddForm ? "Fechar" : "Novo item"}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
            <span className={labelText}>Filtro rápido:</span>
            <select className={selectFilter}>
              <option value="todos">Todos</option>
              <option value="estoque">Só em estoque</option>
              <option value="esgotados">Esgotados</option>
              <option value="reposicao">Em reposição</option>
            </select>
          </div>
        </div>

        <div className="mt-4 relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Buscar por nome, referência, categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={searchInput}
          />
        </div>
      </div>

      {showAddForm && (
        <AddProdutoForm onAddProduto={onAddProduto} temaAtual={temaAtual} />
      )}
    </>
  );
}

function AddProdutoForm({ onAddProduto, temaAtual = "light" }) {
  const isDark = temaAtual === "dark";

  const [form, setForm] = useState({
    idItem: "",
    nome: "",
    referencia: "",
    marca: "",
    categoria: "",
    unidade: "Unidade",
    tipo: "item",
    venda: true,
    compra: true,
    incluiIva: false,
    qtyInicial: 0,
    fornecedor: "",
    tipoImposto: "",
    precoCompra: 0,
    precoVenda: 0,
    descricao: "",
    imagem: null,
  });

  const [errors, setErrors] = useState({});
  const [marcas, setMarcas] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [impostos, setImpostos] = useState([]);
  const [loadingAux, setLoadingAux] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingAux(true);
        const [resMarcas, resUnidades, resCategorias, resImpostos] =
          await Promise.all([
            fetch("http://localhost:4000/marcas"),
            fetch("http://localhost:4000/unidades"),
            fetch("http://localhost:4000/categorias-item"),
            fetch("http://localhost:4000/impostos"),
          ]);

        const dataMarcas = await resMarcas.json();
        const dataUnidades = await resUnidades.json();
        const dataCategorias = await resCategorias.json();
        const dataImpostos = await resImpostos.json();

        setMarcas(dataMarcas || []);
        setUnidades(dataUnidades || []);
        setCategorias(dataCategorias || []);
        setImpostos(dataImpostos || []);

        const padrao = (dataImpostos || []).find((i) => i.padrao);
        if (padrao) {
          setForm((prev) => ({ ...prev, tipoImposto: String(padrao.id) }));
        }
      } catch (e) {
        console.error(
          "Erro ao carregar marcas/unidades/categorias/impostos",
          e
        );
      } finally {
        setLoadingAux(false);
      }
    }
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "radio") {
      setForm((prev) => ({ ...prev, [name]: value }));
      return;
    }

    const numericFields = ["qtyInicial", "precoCompra", "precoVenda"];
    setForm((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nome.trim()) newErrors.nome = "Obrigatório.";
    if (!form.referencia.trim()) newErrors.referencia = "Obrigatório.";
    if (form.precoVenda === "" || isNaN(form.precoVenda)) {
      newErrors.precoVenda = "Obrigatório.";
    }
    if (!form.tipoImposto) {
      newErrors.tipoImposto = "Selecione um imposto.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const lucroBruto = form.precoVenda - form.precoCompra;
    const margemPercent =
      form.precoVenda > 0 ? (lucroBruto / form.precoVenda) * 100 : 0;

    const payload = {
      idItem: form.idItem,
      nome: form.nome,
      referencia: form.referencia,
      marca: form.marca,
      categoria: form.categoria,
      unidade: form.unidade,
      tipo: form.tipo,
      venda: form.venda,
      compra: form.compra,
      incluiIva: form.incluiIva,
      qtyInicial: form.qtyInicial,
      fornecedor: form.fornecedor,
      tipoImposto: form.tipoImposto,
      precoCompra: form.precoCompra,
      preco: form.precoVenda,
      descricao: form.descricao,
      lucro: lucroBruto,
      margem: margemPercent,
    };

    if (onAddProduto) onAddProduto(payload);
    handleClear();
  };

  const handleClear = () => {
    setForm({
      idItem: "",
      nome: "",
      referencia: "",
      marca: "",
      categoria: "",
      unidade: "Unidade",
      tipo: "item",
      venda: true,
      compra: true,
      incluiIva: false,
      qtyInicial: 0,
      fornecedor: "",
      tipoImposto: "",
      precoCompra: 0,
      precoVenda: 0,
      descricao: "",
      imagem: null,
    });
    setErrors({});
  };

  const lucroBruto = form.precoVenda - form.precoCompra;
  const margemPercent =
    form.precoVenda > 0 ? (lucroBruto / form.precoVenda) * 100 : 0;

  const containerClasses =
    "mb-4 rounded-md border p-4 md:p-6 shadow-sm " +
    (isDark
      ? "border-slate-800 bg-slate-900"
      : "border-sky-100 bg-white");

  const labelClass =
    "mb-1 block text-xs font-medium " +
    (isDark ? "text-slate-300" : "text-slate-700");

  const inputBase =
    "w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300 ";
  const inputNormal = isDark
    ? inputBase + "border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-500"
    : inputBase + "border-sky-100 bg-sky-50 text-slate-900 placeholder-slate-400";

  const selectNormal = inputNormal;

  const textareaNormal = inputNormal;

  const helperText = isDark
    ? "mt-1 text-[11px] text-emerald-300"
    : "mt-1 text-[11px] text-emerald-700";

  const errorText = "mt-1 text-[11px] text-rose-600";

  const btnClear =
    "rounded-md border px-4 py-1.5 text-xs " +
    (isDark
      ? "border-slate-700 text-slate-200 hover:bg-slate-800"
      : "border-slate-200 text-slate-700 hover:bg-slate-100");

  return (
    <div className={containerClasses}>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-sky-600">
        Adicionar item
      </h2>

      {loadingAux && (
        <p
          className={
            "mb-2 text-[11px] " +
            (isDark ? "text-slate-400" : "text-slate-500")
          }
        >
          Carregando marcas, unidades, categorias e impostos...
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 md:grid-cols-2 text-sm"
      >
        {/* ID do item */}
        <div>
          <label className={labelClass}>ID do item</label>
          <input
            type="text"
            name="idItem"
            value={form.idItem}
            onChange={handleChange}
            className={inputNormal}
          />
        </div>

        {/* Nome */}
        <div>
          <label className={labelClass}>
            Nome do item <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Ex: Impressora Laser X"
            className={inputNormal}
          />
          {errors.nome && <p className={errorText}>{errors.nome}</p>}
        </div>

        {/* Referência */}
        <div>
          <label className={labelClass}>
            Referência / Código <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="referencia"
            value={form.referencia}
            onChange={handleChange}
            placeholder="SKU / Código interno"
            className={inputNormal}
          />
          {errors.referencia && (
            <p className={errorText}>{errors.referencia}</p>
          )}
        </div>

        {/* Marca */}
        <div>
          <label className={labelClass}>Marca</label>
          <select
            name="marca"
            value={form.marca}
            onChange={handleChange}
            className={selectNormal}
          >
            <option value="">-</option>
            {marcas.map((m) => (
              <option key={m.id} value={m.nome}>
                {m.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Categoria */}
        <div>
          <label className={labelClass}>Categoria</label>
          <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            className={selectNormal}
          >
            <option value="">-</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.nome}>
                {c.nome} {c.unidade ? `(${c.unidade})` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Unidade */}
        <div>
          <label className={labelClass}>Unidades</label>
          <select
            name="unidade"
            value={form.unidade}
            onChange={handleChange}
            className={selectNormal}
          >
            {unidades.map((u) => (
              <option key={u.id} value={u.sigla}>
                {u.nome} ({u.sigla})
              </option>
            ))}
          </select>
        </div>

        {/* Tipo: Item / Serviço */}
        <div>
          <label className={labelClass}>Tipo</label>
          <div className="flex gap-4 text-xs">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="tipo"
                value="item"
                checked={form.tipo === "item"}
                onChange={handleChange}
              />
              <span className={isDark ? "text-slate-200" : "text-slate-700"}>
                Item
              </span>
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="tipo"
                value="servico"
                checked={form.tipo === "servico"}
                onChange={handleChange}
              />
              <span className={isDark ? "text-slate-200" : "text-slate-700"}>
                Serviço
              </span>
            </label>
          </div>
        </div>

        {/* Venda / Compra */}
        <div>
          <label className={labelClass}>Operações</label>
          <div className="flex gap-4 text-xs">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                name="venda"
                checked={form.venda}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, venda: e.target.checked }))
                }
              />
              <span className={isDark ? "text-slate-200" : "text-slate-700"}>
                Venda
              </span>
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                name="compra"
                checked={form.compra}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, compra: e.target.checked }))
                }
              />
              <span className={isDark ? "text-slate-200" : "text-slate-700"}>
                Compra
              </span>
            </label>
          </div>
        </div>

        {/* Inclusão do IVA */}
        <div>
          <label className={labelClass}>Inclusão do IVA</label>
          <div className="flex gap-4 text-xs">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="incluiIva"
                value="nao"
                checked={!form.incluiIva}
                onChange={() =>
                  setForm((p) => ({ ...p, incluiIva: false }))
                }
              />
              <span className={isDark ? "text-slate-200" : "text-slate-700"}>
                Não
              </span>
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="incluiIva"
                value="sim"
                checked={form.incluiIva}
                onChange={() =>
                  setForm((p) => ({ ...p, incluiIva: true }))
                }
              />
              <span className={isDark ? "text-slate-200" : "text-slate-700"}>
                Sim
              </span>
            </label>
          </div>
        </div>

        {/* Qty inicial */}
        <div>
          <label className={labelClass}>Qty. inicial</label>
          <input
            type="number"
            name="qtyInicial"
            value={form.qtyInicial}
            onChange={handleChange}
            className={inputNormal}
          />
        </div>

        {/* Fornecedor */}
        <div>
          <label className={labelClass}>Fornecedor</label>
          <input
            type="text"
            name="fornecedor"
            value={form.fornecedor}
            onChange={handleChange}
            placeholder="N/A"
            className={inputNormal}
          />
        </div>

        {/* Tipo de imposto */}
        <div>
          <label className={labelClass}>
            Tipo de imposto <span className="text-rose-500">*</span>
          </label>
          <select
            name="tipoImposto"
            value={form.tipoImposto}
            onChange={handleChange}
            className={selectNormal}
          >
            <option value="">Selecione...</option>
            {impostos.map((imp) => (
              <option key={imp.id} value={imp.id}>
                {imp.nome} ({imp.taxa}%)
              </option>
            ))}
          </select>
          {errors.tipoImposto && (
            <p className={errorText}>{errors.tipoImposto}</p>
          )}
        </div>

        {/* Preço de compra */}
        <div>
          <label className={labelClass}>Preço de compra (MZN)</label>
          <input
            type="number"
            step="0.01"
            name="precoCompra"
            value={form.precoCompra}
            onChange={handleChange}
            className={inputNormal}
          />
        </div>

        {/* Preço de venda + lucro */}
        <div>
          <label className={labelClass}>
            Preço de venda (MZN) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            name="precoVenda"
            value={form.precoVenda}
            onChange={handleChange}
            className={inputNormal}
          />
          <p className={helperText}>
            Lucro bruto: {lucroBruto.toFixed(2)} MZN · Margem:{" "}
            {margemPercent.toFixed(1)}%
          </p>
          {errors.precoVenda && (
            <p className={errorText}>{errors.precoVenda}</p>
          )}
        </div>

        {/* Descrição */}
        <div className="md:col-span-2">
          <label className={labelClass}>Descrição</label>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            rows={3}
            className={textareaNormal}
          />
        </div>

        {/* Imagem */}
        <div>
          <label className={labelClass}>Imagem</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                imagem: e.target.files[0] || null,
              }))
            }
            className="w-full text-xs"
          />
        </div>

        {/* Ações */}
        <div className="md:col-span-2 flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleClear}
            className={btnClear}
          >
            Limpar
          </button>
          <button
            type="submit"
            className="rounded-md bg-emerald-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-400"
          >
            Guardar item
          </button>
        </div>
      </form>
    </div>
  );
}

export default StockStatus;
