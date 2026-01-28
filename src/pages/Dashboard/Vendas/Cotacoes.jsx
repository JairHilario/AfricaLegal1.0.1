import React, { useState, useEffect } from "react";
import CotacoesHeader from "./Cotacoes/CotacoesHeader";
import CotacoesStatus from "./Cotacoes/CotacoesStatus";
import CotacoesTable from "./Cotacoes/CotacoesTable";

function Cotacoes({ temaAtual = "light" }) {
  const [search, setSearch] = useState("");
  const [cotacoes, setCotacoes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [prazos, setPrazos] = useState([]);
  const [ivas, setIvas] = useState([]);

  const isDark = temaAtual === "dark";

  useEffect(() => {
    async function load() {
      const savedAuth = localStorage.getItem("africaLegalUser");
      const token = savedAuth ? JSON.parse(savedAuth).token : null;

      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const [cRes, pRes, iRes, ctRes] = await Promise.all([
        fetch("http://localhost:4000/clients", { headers }),
        fetch("http://localhost:4000/termos-pagamento", { headers }),
        fetch("http://localhost:4000/impostos", { headers }),
        fetch("http://localhost:4000/cotacoes", { headers }),
      ]);

      setClientes(await cRes.json());
      setPrazos(await pRes.json());
      setIvas(await iRes.json());
      setCotacoes(await ctRes.json());
    }

    load();
  }, []);

  const stats = {
    total: cotacoes.length,
    aprovadas: cotacoes.filter((c) => c.status === "Aprovada").length,
    pendentes: cotacoes.filter((c) => c.status === "Pendente").length,
    recusadas: cotacoes.filter((c) => c.status === "Recusada").length,
    novas: cotacoes.filter((c) => c.nova === true).length,
  };

  const filtradas = cotacoes.filter((c) =>
    (c.referencia || "").toLowerCase().includes(search.toLowerCase())
  );

  const pageClasses = isDark
    ? "space-y-6 bg-slate-950 text-slate-100"
    : "space-y-6";

  return (
    <div className={pageClasses}>
      <CotacoesHeader stats={stats} temaAtual={temaAtual} />

      <CotacoesStatus
        search={search}
        setSearch={setSearch}
        onAddCotacao={handleAddCotacao}
        clientes={clientes}
        prazos={prazos}
        ivas={ivas}
        temaAtual={temaAtual}
      />

      <CotacoesTable cotacoes={filtradas} temaAtual={temaAtual} />
    </div>
  );

  async function handleAddCotacao(nova) {
    try {
      const savedAuth = localStorage.getItem("africaLegalUser");
      const token = savedAuth ? JSON.parse(savedAuth).token : null;

      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch("http://localhost:4000/cotacoes", {
        method: "POST",
        headers,
        body: JSON.stringify(nova),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        console.error("Erro API /cotacoes:", errBody || res.statusText);
        return;
      }

      const criada = await res.json();

      setCotacoes((prev) => [
        ...prev,
        {
          ...criada,
          itens: nova.itens,
          nova: true,
        },
      ]);
    } catch (err) {
      console.error("Erro ao guardar cotação:", err);
    }
  }
}

export default Cotacoes;
