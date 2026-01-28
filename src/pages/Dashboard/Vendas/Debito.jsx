import React, { useState, useEffect } from "react";
import DebitoHeader from "./Debito/DebitoHeader";
import DebitoStatus from "./Debito/DebitoStatus";
import DebitoTable from "./Debito/DebitoTable";

const API_BASE = "http://localhost:4000";

function Debito({ temaAtual = "light" }) {
  const [search, setSearch] = useState("");
  const [debitos, setDebitos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/debitos`)
      .then(async (r) => {
        if (!r.ok) {
          const err = await r.json().catch(() => ({}));
          throw new Error(err.message || `Erro HTTP ${r.status}`);
        }
        return r.json();
      })
      .then((data) => {
        setDebitos(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Erro ao carregar débitos:", err);
        setError(err.message);
        setDebitos([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filtrados = debitos.filter(
    (d) =>
      d.referencia?.toLowerCase().includes(search.toLowerCase()) ||
      d.cliente?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: debitos.length,
    ativos: debitos.filter((d) => d.status === "Ativo").length,
    liquidados: debitos.filter((d) => d.status === "Liquidado").length,
    vencidos: debitos.filter((d) => d.status === "Vencido").length,
    valorTotal: debitos.reduce(
      (acc, d) => acc + (d.valor || d.valorComIva || 0),
      0
    ),
  };

  const handleAddDebito = async (novo) => {
    try {
      const res = await fetch(`${API_BASE}/debitos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novo),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Erro ao gravar débito");
      }

      const salvo = await res.json();

      setDebitos((prev) => [
        {
          ...salvo,
          novo: true,
          status: salvo.status || "Ativo",
        },
        ...prev,
      ]);
    } catch (err) {
      console.error("Erro ao gravar débito:", err);
      alert(`Erro ao gravar débito: ${err.message}`);
    }
  };

  const handleRefresh = () => {
    setError(null);
    setLoading(true);

    fetch(`${API_BASE}/debitos`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`Erro HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => setDebitos(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Erro no refresh:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  const isDark = temaAtual === "dark";
  const pageClasses = isDark ? "space-y-6 text-slate-100" : "space-y-6";

  if (loading) {
    return (
      <div className={pageClasses}>
        <div className="p-8 text-center text-slate-500">
          Carregando débitos...
        </div>
      </div>
    );
  }

  return (
    <div className={pageClasses}>
      <DebitoHeader
        total={stats.total}
        ativos={stats.ativos}
        liquidados={stats.liquidados}
        vencidos={stats.vencidos}
        valorTotal={stats.valorTotal}
        temaAtual={temaAtual}
      />

      {error && (
        <div
          className={
            "rounded-md border p-4 " +
            (isDark
              ? "border-amber-700 bg-amber-900/30"
              : "border-amber-200 bg-amber-50")
          }
        >
          <div className="flex items-center">
            <span
              className={
                "text-sm " +
                (isDark ? "text-amber-200" : "text-amber-800")
              }
            >
              ⚠️ {error}
              <button
                onClick={handleRefresh}
                className="ml-2 underline hover:no-underline"
              >
                Tentar novamente
              </button>
            </span>
          </div>
        </div>
      )}

      <DebitoStatus
        search={search}
        setSearch={setSearch}
        onAddDebito={handleAddDebito}
        temaAtual={temaAtual}
      />

      <DebitoTable debitos={filtrados} temaAtual={temaAtual} />
    </div>
  );
}

export default Debito;
