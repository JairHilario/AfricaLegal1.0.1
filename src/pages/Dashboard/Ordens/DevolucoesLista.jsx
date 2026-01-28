import React, { useState, useEffect } from "react";
import DevolucoesStatus from "./Devolucoes/DevolucoesStatus";
import DevolucoesTable from "./Devolucoes/DevolucoesTable";

function DevolucoesLista({ clientes = [], contas = [], temaAtual = "dark" }) {
  const [search, setSearch] = useState("");
  const [devolucoes, setDevolucoes] = useState([]);

  const isDark = temaAtual === "dark";
  const container = isDark
    ? "space-y-6 text-slate-100"
    : "space-y-6 text-slate-900";

  useEffect(() => {
    const carregar = async () => {
      try {
        const resp = await fetch("http://localhost:4000/devolucoes");
        if (!resp.ok) {
          console.error("Erro HTTP em /devolucoes", resp.status);
          setDevolucoes([]);
          return;
        }
        const data = await resp.json();
        setDevolucoes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao carregar devoluções", err);
        setDevolucoes([]);
      }
    };
    carregar();
  }, []);

  const handleAddDevolucao = async (form) => {
    try {
      const resp = await fetch("http://localhost:4000/devolucoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!resp.ok) {
        console.error("Erro ao criar devolução");
        return;
      }
      const nova = await resp.json();

      const cliente = clientes.find(
        (c) => c.id === Number(nova.clienteId)
      );
      const contaObj = contas.find(
        (c) => c.id === Number(nova.contaId)
      );

      const conta =
        nova.contaId == null
          ? nova.contaLivre
          : contaObj
          ? `${contaObj.banco} - ${contaObj.numero}`
          : "";

      setDevolucoes((prev) => [
        ...prev,
        {
          id: nova.id,
          data: nova.data,
          cliente: cliente ? cliente.nome : "",
          conta,
          referencia: nova.referencia,
          valor: Number(nova.valor),
          moeda: nova.moeda,
          status: nova.status,
        },
      ]);
    } catch (err) {
      console.error("Erro ao guardar devolução:", err);
    }
  };

  const filtradas = devolucoes.filter((d) =>
    d.referencia?.toLowerCase().includes(search.toLowerCase())
  );

  const totalDevolucoes = devolucoes.length;
  const valorTotal = devolucoes.reduce(
    (acc, d) => acc + (d.valor || 0),
    0
  );
  const pendentes = devolucoes.filter(
    (d) => d.status === "pendente"
  ).length;
  const aprovadas = devolucoes.filter(
    (d) => d.status === "aprovada"
  ).length;
  const rejeitadas = devolucoes.filter(
    (d) => d.status === "rejeitada"
  ).length;

  return (
    <div className={container}>
      <DevolucoesStatus
        search={search}
        setSearch={setSearch}
        onAddDevolucao={handleAddDevolucao}
        totalDevolucoes={totalDevolucoes}
        valorTotal={valorTotal}
        pendentes={pendentes}
        aprovadas={aprovadas}
        rejeitadas={rejeitadas}
        clientes={clientes}
        contas={contas}
        temaAtual={temaAtual}
      />
      <DevolucoesTable
        devolucoes={filtradas}
        temaAtual={temaAtual}
      />
    </div>
  );
}

export default DevolucoesLista;
