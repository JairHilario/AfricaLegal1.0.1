import React, { useState, useEffect, useCallback } from "react";
import EntregaHeader from "./Entrega/EntregaHeader";
import EntregaStatus from "./Entrega/EntregaStatus";
import EntregaTable from "./Entrega/EntregaTable";

const API_BASE = "http://localhost:4000";

function Entrega({ temaAtual = "light" }) {
  const [search, setSearch] = useState("");
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allEntregas, setAllEntregas] = useState([]);

  // CORRIGIDO: Removido o "/api" da URL
  const fetchAllEntregas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/entregas`); 
      
      if (!response.ok) throw new Error("Erro ao carregar entregas");

      const data = await response.json();

      // Garantir que data seja um array antes de mapear
      const listaSujeta = Array.isArray(data) ? data : [];

      const entregasFormatadas = listaSujeta.map((entrega) => ({
        id: entrega.id,
        referencia: entrega.referencia,
        data: entrega.data,
        cliente: entrega.cliente_nome || entrega.cliente_nome_real || "N/A",
        localEntrega: entrega.local_entrega,
        motoristaNome: entrega.motorista_nome,
        status: entrega.status || "Pendente",
        valor: entrega.valor,
        nota: entrega.nota,
      }));

      setAllEntregas(entregasFormatadas);
      setEntregas(entregasFormatadas);
    } catch (error) {
      console.error("Erro ao buscar entregas:", error);
      setAllEntregas([]);
      setEntregas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // CORRIGIDO: Removido o "/api" também no POST
  const handleAddEntrega = async (nova) => {
    try {
      const response = await fetch(`${API_BASE}/entregas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nova),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erro ao salvar no servidor");
      }

      const entregaSalva = await response.json();
      
      const entregaFormatada = {
        ...entregaSalva,
        nova: true, // Para efeito visual de novo item
        cliente: nova.cliente,
        localEntrega: nova.localEntrega,
        motoristaNome: nova.motoristaNome,
        status: "Pendente",
      };

      setAllEntregas((prev) => [entregaFormatada, ...prev]);
    } catch (error) {
      alert(`Erro: ${error.message}`);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllEntregas();
  }, [fetchAllEntregas]);

  // Efeito de busca/filtro simplificado
  useEffect(() => {
    const termo = search.toLowerCase();
    const filtradasLocal = allEntregas.filter(
      (e) =>
        e.referencia?.toLowerCase().includes(termo) ||
        e.cliente?.toLowerCase().includes(termo) ||
        e.motoristaNome?.toLowerCase().includes(termo) ||
        e.data?.includes(termo)
    );
    setEntregas(filtradasLocal);
  }, [search, allEntregas]);

  // Limpa o estado "nova" após 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setAllEntregas((prev) => prev.map((e) => ({ ...e, nova: false })));
    }, 5000);
    return () => clearTimeout(timer);
  }, [allEntregas.length]);

  const stats = {
    total: allEntregas.length,
    concluidas: allEntregas.filter((e) => e.status === "Concluída").length,
    pendentes: allEntregas.filter((e) => e.status === "Pendente").length,
    canceladas: allEntregas.filter((e) => e.status === "Cancelada").length,
  };

  const isDark = temaAtual === "dark";
  const pageClasses = isDark ? "space-y-6 text-slate-100" : "space-y-6";

  if (loading) {
    return (
      <div className={pageClasses}>
        <div className="py-12 text-center text-slate-500 animate-pulse">
          Carregando entregas...
        </div>
      </div>
    );
  }

  return (
    <div className={pageClasses}>
      <EntregaHeader
        total={stats.total}
        concluidas={stats.concluidas}
        pendentes={stats.pendentes}
        canceladas={stats.canceladas}
        temaAtual={temaAtual}
      />

      <EntregaStatus
        search={search}
        setSearch={setSearch}
        onAddEntrega={handleAddEntrega}
        temaAtual={temaAtual}
      />

      {/* Usamos o estado 'entregas' que já contém o filtro aplicado no useEffect */}
      <EntregaTable entregas={entregas} temaAtual={temaAtual} />
    </div>
  );
}

export default Entrega;