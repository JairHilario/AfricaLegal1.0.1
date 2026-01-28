import React, { useEffect, useState } from "react";
import TransferenciaStatus from "./Transferencias/TransferenciaStatus";
import TransferenciaTable from "./Transferencias/TransferenciaTable";

const TAXAS_CAMBIO = { MZN: 1, USD: 63.91, ZAR: 3.9 };

function Transferencia({ temaAtual = "light" }) {
  const [search, setSearch] = useState("");
  const [transferencias, setTransferencias] = useState([]); // Garante início como array
  const [loading, setLoading] = useState(false);

  const isDark = temaAtual === "dark";
  const wrapperClasses = isDark ? "space-y-6 text-slate-100" : "space-y-6";

  useEffect(() => {
    async function fetchTransferencias() {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:4000/transferencias");
        
        // Se a rota não existir (404) ou der erro (500), caímos no catch ou tratamos aqui
        if (!res.ok) {
          setTransferencias([]);
          return;
        }

        const data = await res.json();
        // SEGURANÇA: Só define se data for realmente um Array
        setTransferencias(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao buscar transferências:", err);
        setTransferencias([]); // Evita que a variável vire undefined
      } finally {
        setLoading(false);
      }
    }
    fetchTransferencias();
  }, []);

  // --- FILTRO COM VERIFICAÇÃO DE SEGURANÇA ---
  const filtradas = (Array.isArray(transferencias) ? transferencias : []).filter((t) => {
    const termo = (search || "").toLowerCase();
    return (
      t.referencia?.toLowerCase().includes(termo) ||
      t.origem?.toLowerCase().includes(termo) ||
      t.destino?.toLowerCase().includes(termo)
    );
  });

  const handleAddTransferencia = async (nova) => {
    try {
      const res = await fetch("http://localhost:4000/transferencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nova),
      });

      const criada = await res.json();
      if (!res.ok) throw new Error(criada.message || "Erro ao criar");

      setTransferencias((prev) => [...prev, criada]);
    } catch (err) {
      alert(err.message);
    }
  };

  // --- REDUCE COM VERIFICAÇÃO DE SEGURANÇA ---
  const valorTotalMZN = (Array.isArray(transferencias) ? transferencias : []).reduce((acc, t) => {
    const moeda = t.moeda || "MZN";
    const valor = Number(t.valor || 0);
    const taxa = TAXAS_CAMBIO[moeda] || 1;
    return acc + valor * taxa;
  }, 0);

  const pendentes = (Array.isArray(transferencias) ? transferencias : []).filter(
    (t) => (t.status || "").toLowerCase() === "pendente"
  ).length;

  const confirmadas = (Array.isArray(transferencias) ? transferencias : []).filter(
    (t) => (t.status || "").toLowerCase() === "confirmada"
  ).length;

  return (
    <div className={wrapperClasses}>
      <TransferenciaStatus
        totalTransferencias={transferencias.length}
        valorTotal={valorTotalMZN}
        pendentes={pendentes}
        confirmadas={confirmadas}
        onAddTransferencia={handleAddTransferencia}
        temaAtual={temaAtual}
      />

      {loading ? (
        <p className="text-xs">Carregando transferências...</p>
      ) : (
        <TransferenciaTable
          transferencias={filtradas}
          temaAtual={temaAtual}
        />
      )}
    </div>
  );
}

export default Transferencia;