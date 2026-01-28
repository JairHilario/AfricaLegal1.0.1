import React, { useState, useEffect } from "react";
import RecibosHeader from "./Recibos/RecibosHeader";
import RecibosStatus from "./Recibos/RecibosStatus";
import RecibosTable from "./Recibos/RecibosTable";

function Recibos({ temaAtual = "light" }) {
  const [search, setSearch] = useState("");
  const [recibos, setRecibos] = useState([]);

  useEffect(() => {
    async function fetchRecibos() {
      try {
        const savedAuth = localStorage.getItem("africaLegalUser");
        const token = savedAuth ? JSON.parse(savedAuth).token : null;

        const res = await fetch("http://localhost:4000/recibos", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          console.error("Erro ao buscar recibos");
          return;
        }

        const data = await res.json();
        setRecibos(data);
      } catch (err) {
        console.error("Erro ao carregar recibos", err);
      }
    }

    fetchRecibos();
  }, []);

  const stats = {
    total: recibos.length,
    pagos: recibos.filter((r) => r.status === "Pago").length,
    pendentes: recibos.filter((r) => r.status === "Pendente").length,
    cancelados: recibos.filter((r) => r.status === "Cancelado").length,
    valorTotal: recibos.reduce((acc, r) => acc + (r.valor || 0), 0),
  };

  const filtrados = recibos.filter((r) =>
    (r.numero || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleAddRecibo = (reciboCriado) => {
    setRecibos((prev) => [
      ...prev,
      {
        ...reciboCriado,
        novo: true,
      },
    ]);
  };

  const isDark = temaAtual === "dark";
  const pageClasses = isDark ? "space-y-6 text-slate-100" : "space-y-6";

  return (
    <div className={pageClasses}>
      <RecibosHeader stats={stats} temaAtual={temaAtual} />

      <RecibosStatus
        search={search}
        setSearch={setSearch}
        onAddRecibo={handleAddRecibo}
        temaAtual={temaAtual}
      />

      <RecibosTable recibos={filtrados} temaAtual={temaAtual} />
    </div>
  );
}

export default Recibos;
