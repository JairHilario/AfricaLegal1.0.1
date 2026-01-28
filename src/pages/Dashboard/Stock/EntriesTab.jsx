import React, { useState, useEffect } from "react";
import EntriesHeader from "./Entradas/EntriesHeader";
import EntriesStatus from "./Entradas/EntriesStatus";
import EntriesTable from "./Entradas/EntriesTable";

function EntriesTab({ temaAtual = "light" }) {
  const [search, setSearch] = useState("");
  const [movimentos, setMovimentos] = useState([]);
  const [produtos, setProdutos] = useState([]);

  const isDark = temaAtual === "dark";

  // Carregar produtos e movimentos do backend
  useEffect(() => {
    async function loadProdutos() {
      try {
        const res = await fetch("http://localhost:4000/produtos");
        if (!res.ok) throw new Error("Erro ao carregar produtos");
        const data = await res.json();
        setProdutos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Falha ao buscar produtos:", err);
      }
    }

    async function loadMovimentos() {
      try {
        // AJUSTADO: Agora chama /produtos/movimentos conforme definido no server.js
        const res = await fetch("http://localhost:4000/produtos/movimentos");
        if (!res.ok) throw new Error("Erro ao carregar movimentos");
        const data = await res.json();
        setMovimentos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Falha ao buscar movimentos:", err);
      }
    }

    loadProdutos();
    loadMovimentos();
  }, []);

  // Estatísticas calculadas dinamicamente
  const stats = {
    totalMovimentos: movimentos.length,
    entradasItens: movimentos.length,
    saidasItens: 0,
    saldoItens: 0,
    movimentosHoje: movimentos.filter(
      (m) => (m.criadoEm || "").slice(0, 10) === new Date().toISOString().slice(0, 10)
    ).length,
    movimentosMes: movimentos.filter((m) => {
      const mes = (m.criadoEm || "").slice(0, 7);
      const mesAtual = new Date().toISOString().slice(0, 7);
      return mes === mesAtual;
    }).length,
  };

  // Filtro de busca
  const filtrados = search.trim() === ""
      ? movimentos
      : movimentos.filter((m) =>
          (m.nome || "").toLowerCase().includes(search.trim().toLowerCase()) ||
          (m.referencia || "").toLowerCase().includes(search.trim().toLowerCase())
        );

  // Criar movimento (Entrada de Estoque)
  const handleAddMovimento = async (novo) => {
    const payload = {
      produtoId: Number(novo.produtoId),
      quantidade: Number(novo.quantidade),
    };

    try {
      // AJUSTADO: Rota corrigida para /produtos/movimentos
      const res = await fetch("http://localhost:4000/produtos/movimentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorMsg = await res.json();
        throw new Error(errorMsg.message || "Erro ao criar movimento");
      }

      // O backend agora retorna uma mensagem de sucesso ou o objeto criado
      // Como o estoque mudou, o ideal é recarregar a lista ou adicionar o retorno
      const result = await res.json();
      
      // Se o seu backend retornar o objeto do movimento criado:
      if (result.id) {
        setMovimentos((prev) => [result, ...prev]);
      } else {
        // Se retornar apenas mensagem, recarregamos a lista para atualizar os saldos
        window.location.reload(); 
      }

    } catch (err) {
      console.error("Falha ao criar movimento:", err);
      alert("Erro: " + err.message);
    }
  };

  const containerClasses = isDark ? "space-y-4 text-slate-100" : "space-y-4 text-slate-800";

  return (
    <div className={containerClasses}>
      <EntriesHeader stats={stats} temaAtual={temaAtual} />

      <EntriesStatus
        search={search}
        setSearch={setSearch}
        onAddMovimento={handleAddMovimento}
        produtos={produtos}
        temaAtual={temaAtual}
      />

      <EntriesTable movimentos={filtrados} temaAtual={temaAtual} />
    </div>
  );
}

export default EntriesTab;