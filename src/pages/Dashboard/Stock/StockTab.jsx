import React, { useState, useEffect } from "react";
import StockHeader from "./Estoque/StockHeader";
import StockStatus from "./Estoque/StockStatus";
import StockTable from "./Estoque/StockTable";

function StockTab({ temaAtual = "light" }) {
  const [produtos, setProdutos] = useState([]);
  const [search, setSearch] = useState("");

  const isDark = temaAtual === "dark";

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:4000/produtos");
        if (!res.ok) throw new Error("Erro ao carregar produtos");
        const data = await res.json();
        setProdutos(data);
      } catch (err) {
        console.error("Falha ao buscar produtos:", err);
      }
    }
    load();
  }, []);

  const handleAddProduto = async (novo) => {
    try {
      const res = await fetch("http://localhost:4000/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novo),
      });
      if (!res.ok) throw new Error("Erro ao criar produto");
      const created = await res.json();
      setProdutos((prev) => [created, ...prev]);
    } catch (err) {
      console.error("Falha ao criar produto:", err);
    }
  };

  const stats = {
    total: produtos.length,
    emEstoque: produtos.filter((p) => (p.quantidade || 0) > 0).length,
    esgotados: produtos.filter((p) => (p.quantidade || 0) === 0).length,
    emReposicao: produtos.filter((p) => p.status === "Reposição").length,
    destaque: produtos.filter((p) => p.destaque === true).length,
    novos: produtos.filter((p) => p.novo === true).length,
  };

  const produtosFiltrados = produtos.filter((p) => {
    const termo = search.toLowerCase();
    return (
      p.nome?.toLowerCase().includes(termo) ||
      p.referencia?.toLowerCase().includes(termo) ||
      p.categoria?.toLowerCase().includes(termo)
    );
  });

  const containerClasses = isDark
    ? "space-y-4 text-slate-100"
    : "space-y-4 text-slate-800";

  return (
    <div className={containerClasses}>
      <StockHeader stats={stats} temaAtual={temaAtual} />
      <StockStatus
        search={search}
        setSearch={setSearch}
        onAddProduto={handleAddProduto}
        temaAtual={temaAtual}
      />
      <StockTable produtos={produtosFiltrados} temaAtual={temaAtual} />
    </div>
  );
}

export default StockTab;
