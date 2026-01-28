import React, { useState } from "react";
import CaixaHeader from "./Caixa/CaixaHeader";
import CaixaStatus from "./Caixa/CaixaStatus";
import CaixaTable from "./Caixa/CaixaTable";

function Caixa() {
  const [search, setSearch] = useState("");
  const [movimentos, setMovimentos] = useState([]);

  const stats = {
    total: movimentos.length,
    entradas: movimentos.filter((m) => m.tipo === "Entrada").length,
    saidas: movimentos.filter((m) => m.tipo === "Saída").length,
    saldo: movimentos.reduce((acc, m) => {
      const valor = m.valor || 0;
      return m.tipo === "Entrada" ? acc + valor : acc - valor;
    }, 0),
  };

  const filtrados = movimentos.filter((m) =>
    m.descricao?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddMovimento = (novo) => {
    setMovimentos((prev) => [
      ...prev,
      {
        ...novo,
        id: prev.length + 1,
        novo: true,
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* HEADER: título e estatísticas */}
      <CaixaHeader stats={stats} />

      {/* STATUS: filtros, busca, botão adicionar */}
      <CaixaStatus
        search={search}
        setSearch={setSearch}
        onAddMovimento={handleAddMovimento}
      />

      {/* TABELA: listagem dos movimentos */}
      <CaixaTable movimentos={filtrados} />
    </div>
  );
}

export default Caixa;