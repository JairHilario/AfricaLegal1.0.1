import React, { useState, useEffect } from "react";
import FacturasHeader from "./Facturas/FacturasHeader";
import FacturasStatus from "./Facturas/FacturasStatus";
import FacturasTable from "./Facturas/FacturasTable";

function Facturas({ temaAtual = "light" }) {
  const [search, setSearch] = useState("");
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        setLoading(true);
        setErro("");

        const savedAuth = localStorage.getItem("africaLegalUser");
        const token = savedAuth ? JSON.parse(savedAuth).token : null;

        const res = await fetch("http://localhost:4000/facturas", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          throw new Error("Erro ao carregar faturas");
        }

        const data = await res.json();
        setFacturas(data);
      } catch (err) {
        console.error(err);
        setErro(err.message || "Erro ao carregar faturas");
      } finally {
        setLoading(false);
      }
    };

    fetchFacturas();
  }, []);

  const stats = {
    total: facturas.length,
    emitidas: facturas.length,
    pagas: facturas.filter((f) => f.status === "Paga").length,
    emAberto: facturas.filter((f) => f.status === "Pendente").length,
    vencidas: facturas.filter((f) => f.status === "Vencida").length,
    valorTotal: facturas.reduce(
      (acc, f) => acc + Number(f.valor || 0),
      0
    ),
  };

  const filtradas = facturas.filter((f) =>
    f.referencia?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddFactura = (nova) => {
    setFacturas((prev) => [
      ...prev,
      {
        ...nova,
        nova: true,
      },
    ]);
  };

  const handleDeleteFactura = (id) => {
    console.log("Apagar factura", id);
    // setFacturas((prev) => prev.filter((f) => f.id !== id));
  };

  const handleEditFactura = (factura) => {
    console.log("Editar factura", factura);
  };

  const isDark = temaAtual === "dark";
  const pageClasses = isDark ? "space-y-6 text-slate-100" : "space-y-6";

  return (
    <div className={pageClasses}>
      <FacturasHeader
        total={stats.total}
        emitidas={stats.emitidas}
        pagas={stats.pagas}
        emAberto={stats.emAberto}
        vencidas={stats.vencidas}
        valorTotal={stats.valorTotal}
        temaAtual={temaAtual}
      />

      <FacturasStatus
        search={search}
        setSearch={setSearch}
        onAddFactura={handleAddFactura}
        temaAtual={temaAtual}
      />

      {erro && (
        <p className="text-sm text-rose-600">
          {erro}
        </p>
      )}

      {loading ? (
        <p className={isDark ? "text-sm text-slate-400" : "text-sm text-slate-500"}>
          Carregando faturas...
        </p>
      ) : (
        <FacturasTable
          facturas={filtradas}
          onEdit={handleEditFactura}
          onDelete={handleDeleteFactura}
          temaAtual={temaAtual}
        />
      )}
    </div>
  );
}

export default Facturas;
