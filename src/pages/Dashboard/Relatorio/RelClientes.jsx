import React, { useState, useEffect } from "react";
import RelClientesHeader from "./RelClientes/HeadeRelClientesr";
import RelClientesStatus from "./RelClientes/RelClientesStatus";
import RelClientesTable from "./RelClientes/RelClientesTable";
import ClienteExtratoTable from "./RelClientes/ClienteExtratoTable";

function RelClientes({ temaAtual = "dark" }) {
  const [search, setSearch] = useState("");
  const [relatorios, setRelatorios] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [extrato, setExtrato] = useState([]);

  const isDark = temaAtual === "dark";

  const container = isDark
    ? "space-y-6 text-slate-100"
    : "space-y-6 text-slate-900";

  const voltarBtn = isDark
    ? "mb-4 px-4 py-2 bg-sky-500 text-white rounded-md text-sm hover:bg-sky-600 transition-colors"
    : "mb-4 px-4 py-2 bg-sky-600 text-white rounded-md text-sm hover:bg-sky-700 transition-colors";

  useEffect(() => {
    const carregar = async () => {
      try {
        const resp = await fetch("http://localhost:4000/relatorios/clientes");

        if (!resp.ok) {
          throw new Error("Erro na resposta do servidor");
        }

        const data = await resp.json();
        setRelatorios(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao carregar relatórios de clientes:", err);
        setRelatorios([]);
      }
    };
    carregar();
  }, []);

  const handleVerRelatorio = async (id) => {
    try {
      const resp = await fetch(`http://localhost:4000/clientes/${id}/extrato`);
      const data = await resp.json();
      const cliente = (relatorios || []).find((r) => r.id === id);
      setClienteSelecionado(cliente);
      setExtrato(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar extrato:", err);
    }
  };

  const listaSegura = Array.isArray(relatorios) ? relatorios : [];

  const stats = {
    total: listaSegura.length,
    ativos: listaSegura.filter(
      (c) => (c.estado || "").toLowerCase() === "ativo"
    ).length,
    inativos: listaSegura.filter(
      (c) => (c.estado || "").toLowerCase() === "inativo"
    ).length,
    novos: 0,
  };

  const filtrados = listaSegura.filter((c) =>
    (c.cliente || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={container}>
      <RelClientesHeader stats={stats} temaAtual={temaAtual} />
      <RelClientesStatus
        search={search}
        setSearch={setSearch}
        total={filtrados.length}
        temaAtual={temaAtual}
      />
      <RelClientesTable
        relatorios={filtrados}
        onVerRelatorio={handleVerRelatorio}
        temaAtual={temaAtual}
      />

      {clienteSelecionado && extrato.length > 0 && (
        <div className="mt-8 border-t pt-8">
          <button
            onClick={() => {
              setClienteSelecionado(null);
              setExtrato([]);
            }}
            className={voltarBtn}
          >
            ← Voltar à Lista
          </button>
          <ClienteExtratoTable
            extrato={extrato}
            clienteNome={clienteSelecionado.cliente}
            temaAtual={temaAtual}
          />
        </div>
      )}
    </div>
  );
}

export default RelClientes;
