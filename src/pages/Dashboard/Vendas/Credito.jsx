import React, { useState, useEffect } from "react";
import CreditoHeader from "./Credito/CreditoHeader";
import CreditoStatus from "./Credito/CreditoStatus";
import CreditoTable from "./Credito/CreditoTable";

const API_BASE = "http://localhost:4000";

function Credito({ temaAtual = "light" }) {
  const [search, setSearch] = useState("");
  const [creditos, setCreditos] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/creditos`)
      .then((r) => r.json())
      .then(setCreditos)
      .catch(console.error);
  }, []);

  const stats = {
    total: creditos.length,
    ativos: creditos.filter((c) => c.status === "Ativo").length,
    liquidados: creditos.filter((c) => c.status === "Liquidado").length,
    vencidos: creditos.filter((c) => c.status === "Vencido").length,
    valorTotal: creditos.reduce((acc, c) => acc + (c.valor || 0), 0),
  };

  const filtrados = creditos.filter((c) =>
    c.referencia?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCredito = async (novo) => {
    const res = await fetch(`${API_BASE}/creditos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novo),
    });
    const salvo = await res.json();

    setCreditos((prev) => [...prev, { ...salvo, novo: true }]);
  };

  const isDark = temaAtual === "dark";
  const pageClasses = isDark ? "space-y-6 text-slate-100" : "space-y-6";

  return (
    <div className={pageClasses}>
      <CreditoHeader
        total={stats.total}
        ativos={stats.ativos}
        liquidados={stats.liquidados}
        vencidos={stats.vencidos}
        valorTotal={stats.valorTotal}
        temaAtual={temaAtual}
      />

      <CreditoStatus
        search={search}
        setSearch={setSearch}
        onAddCredito={handleAddCredito}
        temaAtual={temaAtual}
      />

      <CreditoTable creditos={filtrados} temaAtual={temaAtual} />
    </div>
  );
}

export default Credito;
