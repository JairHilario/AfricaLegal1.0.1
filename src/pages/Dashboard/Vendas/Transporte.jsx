import React, { useState, useEffect } from "react";
import TransporteHeader from "./Transporte/TransporteHeader";
import TransporteStatus from "./Transporte/TransporteStatus";
import TransporteTable from "./Transporte/TransporteTable";

const API_BASE = "http://localhost:4000";

function Transporte({ temaAtual = "light" }) {
  const [search, setSearch] = useState("");
  const [transportes, setTransportes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransportes = async () => {
      try {
        setLoading(true);
        const url =
          search.trim().length > 0
            ? `${API_BASE}/api/transportes?search=${encodeURIComponent(
                search
              )}`
            : `${API_BASE}/api/transportes`;

        const res = await fetch(url);
        const data = await res.json();
        setTransportes(data);
      } catch (err) {
        console.error("Erro ao carregar transportes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransportes();
  }, [search]);

  const stats = {
    total: transportes.length,
    emCurso: transportes.filter((t) => t.status === "Em curso").length,
    concluidos: transportes.filter((t) => t.status === "Concluído").length,
    cancelados: transportes.filter((t) => t.status === "Cancelado").length,
  };

  const handleAddTransporte = (novo) => {
    setTransportes((prev) => [novo, ...prev]);
  };

  const isDark = temaAtual === "dark";
  const pageClasses = isDark ? "space-y-6 text-slate-100" : "space-y-6";

  return (
    <div className={pageClasses}>
      <TransporteHeader
        total={stats.total}
        emCurso={stats.emCurso}
        concluidos={stats.concluidos}
        cancelados={stats.cancelados}
        temaAtual={temaAtual}
      />

      <TransporteStatus
        search={search}
        setSearch={setSearch}
        onAddTransporte={handleAddTransporte}
        temaAtual={temaAtual}
      />

      <TransporteTable
        transportes={transportes}
        loading={loading}
        temaAtual={temaAtual}
      />
    </div>
  );
}

export default Transporte;
