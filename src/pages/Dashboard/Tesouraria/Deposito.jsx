import React, { useEffect, useState } from "react";
import DepositoStatus from "./Deposito/DepositoStatus";
import DepositoTable from "./Deposito/DepositoTable";

const TAXAS_CAMBIO = { MZN: 1, USD: 63.91, ZAR: 3.9 };

function DepositosPage({ temaAtual = "light" }) {
  const [depositos, setDepositos] = useState([]); // Inicia como array vazio
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDepositos() {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:4000/depositos");
        
        // Se a resposta não for OK (404, 500), força um array vazio
        if (!res.ok) {
          setDepositos([]);
          return;
        }

        const data = await res.json();
        // Garante que 'data' seja um array antes de salvar no estado
        setDepositos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao buscar depósitos:", err);
        setDepositos([]); // Fallback para erro de conexão
      } finally {
        setLoading(false);
      }
    }
    fetchDepositos();
  }, []);

  const handleAddDeposito = async (novo) => {
    try {
      const res = await fetch("http://localhost:4000/depositos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novo),
      });
      const criado = await res.json();
      if (!res.ok) throw new Error(criado.message || "Erro ao criar");
      setDepositos((prev) => [...prev, criado]);
    } catch (err) {
      alert(err.message);
    }
  };

  // --- BLINDAGEM DO REDUCE ---
  // Usamos (depositos || []) para garantir que nunca tentará reduzir algo nulo
  const valorTotalMZN = (Array.isArray(depositos) ? depositos : []).reduce((acc, d) => {
    const moeda = d.moeda || "MZN";
    const valor = Number(d.montante ?? d.valor ?? 0);
    const taxa = TAXAS_CAMBIO[moeda] || 1;
    return acc + valor * taxa;
  }, 0);

  const pendentes = (Array.isArray(depositos) ? depositos : []).filter(
    (d) => (d?.status || "").toLowerCase() === "pendente"
  ).length;

  const confirmados = (Array.isArray(depositos) ? depositos : []).filter(
    (d) => (d?.status || "").toLowerCase() === "confirmado"
  ).length;

  return (
    <div className={temaAtual === "dark" ? "space-y-6 text-slate-100" : "space-y-6"}>
      <DepositoStatus
        totalDepositos={depositos.length}
        valorTotal={valorTotalMZN}
        pendentes={pendentes}
        confirmados={confirmados}
        onAddDeposito={handleAddDeposito}
        temaAtual={temaAtual}
      />
      {loading ? (
        <p className="text-xs">Carregando depósitos...</p>
      ) : (
        <DepositoTable depositos={depositos} temaAtual={temaAtual} />
      )}
    </div>
  );
}

export default DepositosPage;