import React, { useState, useEffect } from "react";

const API_BASE = "http://localhost:4000/financeiro";

function ConfigFinancas() {
  const [aba, setAba] = useState("impostos");

  const btnClass = (active) => [
    "px-3 py-1.5 rounded-t-lg border-b-2 transition-colors",
    active ? "border-sky-500 text-sky-400 bg-white/5" : "border-transparent opacity-70 hover:opacity-100"
  ].join(" ");

  return (
    <div className="space-y-4">
      <div className="border-b border-white/10">
        <nav className="flex flex-wrap gap-2 text-xs md:text-sm">
          <button onClick={() => setAba("impostos")} className={btnClass(aba === "impostos")}>Impostos</button>
          <button onClick={() => setAba("termos")} className={btnClass(aba === "termos")}>Termos de Pagamento</button>
          <button onClick={() => setAba("cambio")} className={btnClass(aba === "cambio")}>Taxas de Câmbio</button>
          <button onClick={() => setAba("moeda")} className={btnClass(aba === "moeda")}>Moeda Nativa</button>
        </nav>
      </div>

      <div className="rounded-md border border-white/10 bg-white/5 p-4 text-sm text-white">
        {aba === "impostos" && <AbaImpostos />}
        {aba === "termos" && <AbaTermosPagamento />}
        {aba === "cambio" && <AbaCambio />}
        {aba === "moeda" && <AbaMoedaNativa />}
      </div>
    </div>
  );
}

/* --------- 1. ABA IMPOSTOS --------- */
function AbaImpostos() {
  const [impostos, setImpostos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome: "", taxa: "", padrao: false });

  const carregar = () => {
    fetch(`${API_BASE}/impostos`)
      .then(res => res.json())
      .then(data => setImpostos(Array.isArray(data) ? data : []))
      .catch(() => setImpostos([]));
  };

  useEffect(() => carregar(), []);

  const salvar = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/impostos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, taxa: Number(form.taxa) })
    });
    if (res.ok) {
      carregar();
      setShowForm(false);
      setForm({ nome: "", taxa: "", padrao: false });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold">Impostos (IVA)</h3>
        <button onClick={() => setShowForm(!showForm)} className="bg-sky-600 px-3 py-1 rounded text-xs">
          {showForm ? "Fechar" : "Novo Imposto"}
        </button>
      </div>
      <div className="bg-white rounded text-slate-900 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 font-bold">
            <tr>
              <th className="p-2">Nome</th>
              <th className="p-2">Taxa %</th>
              <th className="p-2 text-center">Padrão</th>
            </tr>
          </thead>
          <tbody>
            {impostos.map(i => (
              <tr key={i.id} className="border-t">
                <td className="p-2">{i.nome}</td>
                <td className="p-2">{i.taxa}%</td>
                <td className="p-2 text-center">{i.padrao ? "✅" : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && (
        <form onSubmit={salvar} className="bg-white/10 p-3 rounded grid gap-2">
          <input placeholder="Ex: IVA 16%" className="bg-slate-800 p-2 rounded outline-none" 
                 value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required />
          <input type="number" placeholder="Taxa %" className="bg-slate-800 p-2 rounded outline-none" 
                 value={form.taxa} onChange={e => setForm({...form, taxa: e.target.value})} required />
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={form.padrao} onChange={e => setForm({...form, padrao: e.target.checked})} />
            Definir como padrão
          </label>
          <button className="bg-emerald-600 p-2 rounded font-bold">Salvar</button>
        </form>
      )}
    </div>
  );
}

/* --------- 2. ABA TERMOS DE PAGAMENTO --------- */
function AbaTermosPagamento() {
  const [termos, setTermos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ prazo: "", diaDevido: "", padrao: false });

  const carregar = () => {
    fetch(`${API_BASE}/termos-pagamento`)
      .then(res => res.json())
      .then(data => setTermos(Array.isArray(data) ? data : []))
      .catch(() => setTermos([]));
  };

  useEffect(() => carregar(), []);

  const salvar = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/termos-pagamento`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, diaDevido: Number(form.diaDevido) })
    });
    if (res.ok) {
      carregar();
      setShowForm(false);
      setForm({ prazo: "", diaDevido: "", padrao: false });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold">Prazos de Pagamento</h3>
        <button onClick={() => setShowForm(!showForm)} className="bg-sky-600 px-3 py-1 rounded text-xs">
          {showForm ? "Fechar" : "Novo Termo"}
        </button>
      </div>
      <div className="bg-white rounded text-slate-900 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 font-bold">
            <tr>
              <th className="p-2">Prazo</th>
              <th className="p-2">Dias</th>
              <th className="p-2 text-center">Padrão</th>
            </tr>
          </thead>
          <tbody>
            {termos.map(t => (
              <tr key={t.id} className="border-t">
                <td className="p-2">{t.prazo}</td>
                <td className="p-2">{t.diaDevido} dias</td>
                <td className="p-2 text-center">{t.padrao ? "✅" : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && (
        <form onSubmit={salvar} className="bg-white/10 p-3 rounded grid gap-2">
          <input placeholder="Ex: Pagamento a 30 dias" className="bg-slate-800 p-2 rounded outline-none" 
                 value={form.prazo} onChange={e => setForm({...form, prazo: e.target.value})} required />
          <input type="number" placeholder="Quantidade de dias" className="bg-slate-800 p-2 rounded outline-none" 
                 value={form.diaDevido} onChange={e => setForm({...form, diaDevido: e.target.value})} required />
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={form.padrao} onChange={e => setForm({...form, padrao: e.target.checked})} />
            Definir como padrão
          </label>
          <button className="bg-emerald-600 p-2 rounded font-bold">Salvar Termo</button>
        </form>
      )}
    </div>
  );
}

/* --------- 3. ABA TAXAS DE CÂMBIO --------- */
function AbaCambio() {
  const [taxas, setTaxas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ data: "", moeda: "USD", compra: "", venda: "" });

  const carregar = () => {
    fetch(`${API_BASE}/taxas-cambio`)
      .then(res => res.json())
      .then(data => setTaxas(Array.isArray(data) ? data : []))
      .catch(() => setTaxas([]));
  };

  useEffect(() => carregar(), []);

  const salvar = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/taxas-cambio`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      carregar();
      setShowForm(false);
      setForm({ data: "", moeda: "USD", compra: "", venda: "" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold">Câmbio de Moedas</h3>
        <button onClick={() => setShowForm(!showForm)} className="bg-sky-600 px-3 py-1 rounded text-xs">
          {showForm ? "Fechar" : "Nova Taxa"}
        </button>
      </div>
      <div className="bg-white rounded text-slate-900 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 font-bold">
            <tr>
              <th className="p-2">Data</th>
              <th className="p-2">Moeda</th>
              <th className="p-2 text-right">Compra</th>
              <th className="p-2 text-right">Venda</th>
            </tr>
          </thead>
          <tbody>
            {taxas.map(t => (
              <tr key={t.id} className="border-t">
                <td className="p-2">{new Date(t.data).toLocaleDateString()}</td>
                <td className="p-2">{t.moeda}</td>
                <td className="p-2 text-right">{t.compra}</td>
                <td className="p-2 text-right">{t.venda}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && (
        <form onSubmit={salvar} className="bg-white/10 p-3 rounded grid gap-2">
          <input type="date" className="bg-slate-800 p-2 rounded outline-none" 
                 value={form.data} onChange={e => setForm({...form, data: e.target.value})} required />
          <select className="bg-slate-800 p-2 rounded" value={form.moeda} onChange={e => setForm({...form, moeda: e.target.value})}>
            <option value="USD">USD - Dólar</option>
            <option value="ZAR">ZAR - Rand</option>
            <option value="EUR">EUR - Euro</option>
          </select>
          <input type="number" step="0.01" placeholder="Preço Compra" className="bg-slate-800 p-2 rounded outline-none" 
                 value={form.compra} onChange={e => setForm({...form, compra: e.target.value})} required />
          <input type="number" step="0.01" placeholder="Preço Venda" className="bg-slate-800 p-2 rounded outline-none" 
                 value={form.venda} onChange={e => setForm({...form, venda: e.target.value})} required />
          <button className="bg-emerald-600 p-2 rounded font-bold">Salvar Câmbio</button>
        </form>
      )}
    </div>
  );
}

/* --------- 4. ABA MOEDA NATIVA --------- */
function AbaMoedaNativa() {
  const [config, setConfig] = useState({ moedaPadrao: "MZN", formato: "1 234,56" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/moeda`)
      .then(res => res.json())
      .then(data => { if(data) setConfig({ moedaPadrao: data.moedaPadrao, formato: data.formato }); });
  }, []);

  const salvar = async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE}/moeda`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config)
    });
    setLoading(false);
    if (res.ok) alert("Configuração de moeda salva!");
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold">Moeda Principal do Sistema</h3>
      <div className="grid gap-4 max-w-xs">
        <div>
          <label className="text-xs opacity-70 block mb-1">Moeda Padrão</label>
          <select className="w-full bg-slate-800 p-2 rounded text-white" value={config.moedaPadrao} 
                  onChange={e => setConfig({...config, moedaPadrao: e.target.value})}>
            <option value="MZN">Metical (MZN)</option>
            <option value="USD">Dólar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>
        </div>
        <div>
          <label className="text-xs opacity-70 block mb-1">Formato de Exibição</label>
          <select className="w-full bg-slate-800 p-2 rounded text-white" value={config.formato} 
                  onChange={e => setConfig({...config, formato: e.target.value})}>
            <option value="1 234,56">1 234,56 (Espaço e vírgula)</option>
            <option value="1,234.56">1,234.56 (Vírgula e ponto)</option>
          </select>
        </div>
        <button onClick={salvar} disabled={loading} className="bg-emerald-600 p-2 rounded font-bold">
          {loading ? "Salvando..." : "Atualizar Moeda"}
        </button>
      </div>
    </div>
  );
}

export default ConfigFinancas;