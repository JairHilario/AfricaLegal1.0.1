import React, { useState, useEffect } from "react";
import {
  ArrowUpOnSquareStackIcon,
  ArrowDownOnSquareStackIcon,
  DocumentArrowDownIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

export default function SettingsTab({ temaAtual = "light" }) {
  const [activeTab, setActiveTab] = useState("categorias");

  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [unidades, setUnidades] = useState([]);

  const [search, setSearch] = useState("");

  const [nomeCategoria, setNomeCategoria] = useState("");
  const [unidadeCategoria, setUnidadeCategoria] = useState("");
  const [nomeMarca, setNomeMarca] = useState("");
  const [nomeUnidade, setNomeUnidade] = useState("");
  const [siglaUnidade, setSiglaUnidade] = useState("");

  const [showForm, setShowForm] = useState({
    categorias: false,
    marcas: false,
    unidades: false,
  });

  const isDark = temaAtual === "dark";

  // --- CARREGAR DADOS ---
  useEffect(() => {
    async function loadAll() {
      try {
        const [catRes, marRes, uniRes] = await Promise.all([
          fetch("http://localhost:4000/produtos/aux/categorias"),
          fetch("http://localhost:4000/produtos/aux/marcas"),
          fetch("http://localhost:4000/produtos/aux/unidades"),
        ]);

        if (!catRes.ok || !marRes.ok || !uniRes.ok) throw new Error("Erro ao carregar");

        const [catData, marData, uniData] = await Promise.all([
          catRes.json(),
          marRes.json(),
          uniRes.json(),
        ]);

        setCategorias(catData);
        setMarcas(marData);
        setUnidades(uniData);
      } catch (err) {
        console.error("ERRO LOADALL", err);
      }
    }
    loadAll();
  }, []);

  // --- FUNÇÕES DE SALVAMENTO ---
  const handleAddUnidade = async () => {
    if (!nomeUnidade.trim() || !siglaUnidade.trim()) return;
    try {
      const res = await fetch("http://localhost:4000/produtos/aux/unidades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nomeUnidade, sigla: siglaUnidade }),
      });
      if (!res.ok) throw new Error("Erro ao criar unidade");
      const created = await res.json();
      setUnidades((prev) => [created, ...prev]);
      setNomeUnidade("");
      setSiglaUnidade("");
    } catch (err) {
      console.error("ERRO", err);
    }
  };

  const handleAddMarca = async () => {
    if (!nomeMarca.trim()) return;
    try {
      const res = await fetch("http://localhost:4000/produtos/aux/marcas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nomeMarca }),
      });
      if (!res.ok) throw new Error("Erro ao criar marca");
      const created = await res.json();
      setMarcas((prev) => [created, ...prev]);
      setNomeMarca("");
    } catch (err) {
      console.error("ERRO", err);
    }
  };

  const handleAddCategoria = async () => {
    if (!nomeCategoria.trim() || !unidadeCategoria.trim()) return;
    try {
      const res = await fetch("http://localhost:4000/produtos/aux/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nomeCategoria, unidade_sigla: unidadeCategoria }),
      });
      if (!res.ok) throw new Error("Erro ao criar categoria");
      const created = await res.json();
      setCategorias((prev) => [created, ...prev]);
      setNomeCategoria("");
      setUnidadeCategoria("");
    } catch (err) {
      console.error("ERRO", err);
    }
  };

  // --- FILTROS E LÓGICA DE UI ---
  const toggleForm = (tab) => setShowForm((prev) => ({ ...prev, [tab]: !prev[tab] }));
  const searchLower = search.toLowerCase();

  const filtradas = activeTab === "categorias" 
    ? categorias.filter(c => c.nome?.toLowerCase().includes(searchLower))
    : activeTab === "marcas" 
    ? marcas.filter(m => m.nome?.toLowerCase().includes(searchLower))
    : unidades.filter(u => u.nome?.toLowerCase().includes(searchLower));

  return (
    <div className={isDark ? "space-y-4 text-slate-100" : "space-y-4 text-slate-800"}>
      <h2 className="text-lg font-semibold">Configuração dos itens</h2>

      {/* ABAS */}
      <div className={`flex rounded-md border shadow-sm overflow-hidden text-sm ${isDark ? "border-slate-800 bg-slate-900" : "border-sky-100 bg-white"}`}>
        {["categorias", "marcas", "unidades"].map((tab) => (
          <TabButton key={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)} isDark={isDark}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </TabButton>
        ))}
      </div>

      <ActionsBar activeTab={activeTab} search={search} setSearch={setSearch} onToggleForm={toggleForm} temaAtual={temaAtual} />

      {activeTab === "categorias" && (
        <CategoriasSection 
          filtradas={filtradas} nomeCategoria={nomeCategoria} setNomeCategoria={setNomeCategoria} 
          unidadeCategoria={unidadeCategoria} setUnidadeCategoria={setUnidadeCategoria} 
          onSave={handleAddCategoria} showForm={showForm.categorias} unidades={unidades} temaAtual={temaAtual} 
        />
      )}

      {activeTab === "marcas" && (
        <MarcasSection 
          filtradas={filtradas} nomeMarca={nomeMarca} setNomeMarca={setNomeMarca} 
          onSave={handleAddMarca} showForm={showForm.marcas} temaAtual={temaAtual} 
        />
      )}

      {activeTab === "unidades" && (
        <UnidadesSection 
          filtradas={filtradas} nomeUnidade={nomeUnidade} setNomeUnidade={setNomeUnidade} 
          siglaUnidade={siglaUnidade} setSiglaUnidade={setSiglaUnidade} 
          onSave={handleAddUnidade} showForm={showForm.unidades} temaAtual={temaAtual} 
        />
      )}
    </div>
  );
}

// --- SUBCOMPONENTES (UI) ---

function TabButton({ children, active, onClick, isDark }) {
  const base = "flex-1 px-4 py-2 text-center text-xs md:text-sm border-b-2 transition-colors";
  const activeClasses = isDark ? "border-sky-500 bg-slate-800 text-sky-300 font-medium" : "border-sky-500 bg-sky-50 text-sky-700 font-medium";
  const inactiveClasses = isDark ? "border-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-800" : "border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50";
  return <button onClick={onClick} className={`${base} ${active ? activeClasses : inactiveClasses}`}>{children}</button>;
}

function ActionsBar({ activeTab, search, setSearch, onToggleForm, temaAtual }) {
  const isDark = temaAtual === "dark";
  const barClasses = `mb-4 rounded-md border p-4 md:p-6 shadow-sm ${isDark ? "border-slate-800 bg-slate-900" : "border-sky-100 bg-white"}`;
  const searchInput = `w-full md:w-2/3 pl-9 pr-4 py-2 rounded-md text-sm border focus:outline-none focus:ring-1 focus:ring-sky-300 ${isDark ? "border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500" : "border-sky-100 bg-sky-50 text-slate-800 placeholder-slate-400"}`;

  return (
    <div className={barClasses}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center gap-1.5 bg-sky-500 hover:bg-sky-400 text-white px-3 py-1.5 rounded-md text-xs md:text-sm"><ArrowUpOnSquareStackIcon className="h-4 w-4" /> Importar</button>
          <button className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1.5 rounded-md text-xs md:text-sm"><DocumentArrowDownIcon className="h-4 w-4" /> PDF</button>
          <button className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 px-3 py-1.5 rounded-md text-xs md:text-sm"><ArrowDownOnSquareStackIcon className="h-4 w-4" /> Excel</button>
          <button onClick={() => onToggleForm(activeTab)} className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-md text-xs md:text-sm"><PlusIcon className="h-4 w-4" /> Novo</button>
        </div>
        <div className="flex items-center gap-2 text-xs md:text-sm">
          <span className={isDark ? "text-slate-300" : "text-slate-600"}>Tipo:</span>
          <select className={`px-2 py-1 rounded-md border ${isDark ? "border-slate-700 bg-slate-800 text-slate-100" : "border-sky-100 bg-sky-50"}`}><option>Todos</option></select>
        </div>
      </div>
      <div className="mt-4 relative">
        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400"><MagnifyingGlassIcon className="h-4 w-4" /></span>
        <input type="text" placeholder={`Buscar em ${activeTab}...`} value={search} onChange={(e) => setSearch(e.target.value)} className={searchInput} />
      </div>
    </div>
  );
}

function CategoriasSection({ filtradas, nomeCategoria, setNomeCategoria, unidadeCategoria, setUnidadeCategoria, onSave, showForm, unidades, temaAtual }) {
  const isDark = temaAtual === "dark";
  const inputClass = `w-full rounded-md border px-3 py-2 text-sm ${isDark ? "border-slate-700 bg-slate-800 text-slate-100" : "border-sky-100 bg-sky-50 text-slate-900"}`;
  return (
    <div className={`mb-4 rounded-md border p-4 md:p-6 shadow-sm ${isDark ? "border-slate-800 bg-slate-900" : "border-sky-100 bg-white"}`}>
      <h1 className={`mb-4 text-sm font-semibold uppercase ${isDark ? "text-slate-200" : "text-slate-700"}`}>Categorias</h1>
      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-4 mb-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input type="text" placeholder="Nome da Categoria" value={nomeCategoria} onChange={(e) => setNomeCategoria(e.target.value)} className={inputClass} />
            <select value={unidadeCategoria} onChange={(e) => setUnidadeCategoria(e.target.value)} className={inputClass}>
              <option value="">Selecione Unidade</option>
              {unidades.map(u => <option key={u.id} value={u.sigla}>{u.nome} ({u.sigla})</option>)}
            </select>
          </div>
          <button type="submit" className="bg-emerald-500 text-white px-4 py-1.5 rounded-md text-xs">Salvar</button>
        </form>
      )}
      <TableWrapper headers={["Categoria", "Unidade", "Data"]} rows={filtradas.map(c => [c.nome, c.unidade_sigla || c.unidade || "-", formatDate(c.criado_em || c.criadoEm)])} temaAtual={temaAtual} />
    </div>
  );
}

function MarcasSection({ filtradas, nomeMarca, setNomeMarca, onSave, showForm, temaAtual }) {
  const isDark = temaAtual === "dark";
  const inputClass = `w-full rounded-md border px-3 py-2 text-sm ${isDark ? "border-slate-700 bg-slate-800 text-slate-100" : "border-sky-100 bg-sky-50 text-slate-900"}`;
  return (
    <div className={`mb-4 rounded-md border p-4 md:p-6 shadow-sm ${isDark ? "border-slate-800 bg-slate-900" : "border-sky-100 bg-white"}`}>
      <h1 className={`mb-4 text-sm font-semibold uppercase ${isDark ? "text-slate-200" : "text-slate-700"}`}>Marcas</h1>
      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-4 mb-4">
          <input type="text" placeholder="Nome da Marca" value={nomeMarca} onChange={(e) => setNomeMarca(e.target.value)} className={inputClass} />
          <button type="submit" className="bg-emerald-500 text-white px-4 py-1.5 rounded-md text-xs">Salvar</button>
        </form>
      )}
      <TableWrapper headers={["Marca", "Data"]} rows={filtradas.map(m => [m.nome, formatDate(m.criado_em || m.criadoEm)])} temaAtual={temaAtual} />
    </div>
  );
}

function UnidadesSection({ filtradas, nomeUnidade, setNomeUnidade, siglaUnidade, setSiglaUnidade, onSave, showForm, temaAtual }) {
  const isDark = temaAtual === "dark";
  const inputClass = `w-full rounded-md border px-3 py-2 text-sm ${isDark ? "border-slate-700 bg-slate-800 text-slate-100" : "border-sky-100 bg-sky-50 text-slate-900"}`;
  return (
    <div className={`mb-4 rounded-md border p-4 md:p-6 shadow-sm ${isDark ? "border-slate-800 bg-slate-900" : "border-sky-100 bg-white"}`}>
      <h1 className={`mb-4 text-sm font-semibold uppercase ${isDark ? "text-slate-200" : "text-slate-700"}`}>Unidades</h1>
      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-4 mb-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input type="text" placeholder="Nome" value={nomeUnidade} onChange={(e) => setNomeUnidade(e.target.value)} className={inputClass} />
            <input type="text" placeholder="Sigla" value={siglaUnidade} onChange={(e) => setSiglaUnidade(e.target.value)} className={inputClass} />
          </div>
          <button type="submit" className="bg-emerald-500 text-white px-4 py-1.5 rounded-md text-xs">Salvar</button>
        </form>
      )}
      <TableWrapper headers={["Unidade", "Sigla", "Data"]} rows={filtradas.map(u => [u.nome, u.sigla, formatDate(u.criado_em || u.criadoEm)])} temaAtual={temaAtual} />
    </div>
  );
}

function TableWrapper({ headers, rows, temaAtual }) {
  const isDark = temaAtual === "dark";
  return (
    <div className={`overflow-x-auto border rounded-md ${isDark ? "border-slate-800" : "border-sky-100"}`}>
      <table className="min-w-full text-sm">
        <thead className={isDark ? "bg-slate-800" : "bg-sky-50"}>
          <tr>{headers.map(h => <th key={h} className="px-4 py-2 text-left font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {rows.map((row, i) => (
            <tr key={i} className={isDark ? "hover:bg-slate-800" : "hover:bg-sky-50"}>
              {row.map((cell, j) => <td key={j} className="px-4 py-2">{cell}</td>)}
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={headers.length} className="px-4 py-4 text-center">Nenhum registro.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return "-";
  try {
    const data = new Date(iso);
    return data.toLocaleDateString('pt-PT');
  } catch (e) {
    return "-";
  }
}