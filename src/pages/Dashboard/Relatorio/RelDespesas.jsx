import React, { useState, useEffect } from "react";
import RelDespesasHeader from "./RelDespesas/RelDespesasHeade";
import RelDespesasStatus from "./RelDespesas/RelDespesasStatus";
import RelDespesasTable from "./RelDespesas/RelDespesasTable";

function RelDespesas({ temaAtual = "dark" }) {
  const [search, setSearch] = useState("");
  const [relatorios, setRelatorios] = useState([]);

  const isDark = temaAtual === "dark";
  const container = isDark
    ? "space-y-6 text-slate-100"
    : "space-y-6 text-slate-900";

  useEffect(() => {
    const carregar = async () => {
      try {
        const resp = await fetch("http://localhost:4000/rel-despesas");
        const data = await resp.json();
        console.log("RELATORIOS DESPESAS API =>", data);
        setRelatorios(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao carregar relatórios de despesas:", err);
        setRelatorios([]);
      }
    };

    carregar();
  }, []);

  const stats = {
    total: relatorios.length,
    fechados: relatorios.filter((r) => r.status === "fechado").length,
    abertos: relatorios.filter((r) => r.status !== "fechado").length,
    valorTotal: relatorios.reduce(
      (acc, r) => acc + (Number(r.totalDespesas) || 0),
      0
    ),
  };

  const filtrados = relatorios.filter((r) =>
    r.conta?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={container}>
      <RelDespesasHeader stats={stats} temaAtual={temaAtual} />

      <RelDespesasStatus
        search={search}
        setSearch={setSearch}
        total={filtrados.length}
        temaAtual={temaAtual}
      />

      <RelDespesasTable relatorios={relatorios} temaAtual={temaAtual} />
    </div>
  );
}

export default RelDespesas;