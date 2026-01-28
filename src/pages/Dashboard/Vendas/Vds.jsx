import React, { useState, useEffect } from "react";
import VendasHeader from "./Vendas/VendasHeader";
import VendasStatus from "./Vendas/VendasStatus";
import VendasTable from "./Vendas/VendasTable";

function Vds({ temaAtual = "light" }) {
  const isDark = temaAtual === "dark";

  const [search, setSearch] = useState("");
  const [vendas, setVendas] = useState([]);

  useEffect(() => {
    const loadVendas = async () => {
      try {
        // ATUALIZADO: Agora aponta para a rota modular /vendas/tabela
        const res = await fetch("http://localhost:4000/vendas/tabela");
        
        if (!res.ok) throw new Error("Falha ao carregar dados do servidor");
        
        const data = await res.json();
        
        // Garante que 'vendas' seja sempre um array, evitando erro no .reduce
        setVendas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao carregar vendas:", err);
        setVendas([]); // Fallback para array vazio em caso de erro
      }
    };

    loadVendas();
  }, []);

  // --- CÁLCULOS COM PROTEÇÃO ---
  // Usamos (vendas || []) para garantir que não tente ler propriedade de undefined
  const listaVendas = Array.isArray(vendas) ? vendas : [];

  const totalDocumentos = listaVendas.length;
  
  const valorTotal = listaVendas.reduce((acc, v) => acc + Number(v.total || 0), 0);
  
  const recebidos = listaVendas
    .filter((v) => v.estado?.toLowerCase() === "paga")
    .reduce((acc, v) => acc + Number(v.total || 0), 0);
    
  const emAberto = listaVendas
    .filter((v) => v.estado?.toLowerCase() === "pendente")
    .reduce((acc, v) => acc + Number(v.total || 0), 0);
    
  const vencidos = listaVendas
    .filter((v) => v.estado?.toLowerCase() === "vencida")
    .reduce((acc, v) => acc + Number(v.total || 0), 0);

  // --- FILTRAGEM ---
  const filtradas = listaVendas.filter((v) => {
    const q = search.toLowerCase();
    return (
      v.numero?.toLowerCase().includes(q) ||
      v.cliente?.toLowerCase().includes(q) ||
      v.estado?.toLowerCase().includes(q)
    );
  });

  const handleAddVenda = (nova) => {
    setVendas((prev) => [
      {
        ...nova,
        numero: nova.referencia,
        total: nova.totalDocumento,
      },
      ...prev,
    ]);
  };

  const handleViewVenda = (venda) => {
    console.log("Ver venda", venda.id || venda.numero);
  };

  return (
    <div className={isDark ? "space-y-6 bg-slate-950 text-slate-100 p-4" : "space-y-6 bg-transparent text-slate-900 p-4"}>
      <VendasHeader
        totalDocumentos={totalDocumentos}
        valorTotal={valorTotal}
        recebidos={recebidos}
        emAberto={emAberto}
        vencidos={vencidos}
        temaAtual={temaAtual}
        isDark={isDark}
      />

      <VendasStatus
        search={search}
        setSearch={setSearch}
        onAddVenda={handleAddVenda}
        temaAtual={temaAtual}
        isDark={isDark}
      />

      <VendasTable
        vendas={filtradas}
        onViewVenda={handleViewVenda}
        temaAtual={temaAtual}
        isDark={isDark}
      />
    </div>
  );
}

export default Vds;