import React, { useState } from "react";
import PosHeader from "./Pos/PosHeader";
import PosStatus from "./Pos/PosStatus";
import PosTable from "./Pos/PosTable";

function Pos() {
  const [search, setSearch] = useState("");
  const [vendas, setVendas] = useState([]);

  const stats = {
    total: vendas.length,
    porPOS: vendas.filter((v) => v.tipo === "POS").length,
    canceladas: vendas.filter((v) => v.status === "Cancelada").length,
    valorTotal: vendas.reduce((acc, v) => acc + (v.valor || 0), 0),
  };

  const filtradas = vendas.filter((v) =>
    v.referencia?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddVenda = (nova) => {
    setVendas((prev) => [
      ...prev,
      {
        ...nova,
        id: prev.length + 1,
        tipo: "POS",
        status: "Concluída",
        nova: true,
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* HEADER: título e estatísticas */}
      <PosHeader stats={stats} />

      {/* STATUS: filtros, busca, botão adicionar */}
      <PosStatus
        search={search}
        setSearch={setSearch}
        onAddVenda={handleAddVenda}
      />

      {/* TABELA: listagem das vendas */}
      <PosTable vendas={filtradas} />
    </div>
  );
}

export default Pos;

