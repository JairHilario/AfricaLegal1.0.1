import React, { useState, useEffect } from "react";
import OrdensStatus from "./Lista/OrdensStatus";
import OrdensTable from "./Lista/OrdensTable";

function OrdensLista({ temaAtual = "dark" }) {
  const [search, setSearch] = useState("");
  const [ordens, setOrdens] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [contas, setContas] = useState([]);

  const isDark = temaAtual === "dark";
  const container = isDark
    ? "space-y-6 text-slate-100"
    : "space-y-6 text-slate-900";

  useEffect(() => {
    async function carregarDados() {
      try {
        const [respClientes, respContas, respOrdens] = await Promise.all([
          fetch("http://localhost:4000/clients"),
          fetch("http://localhost:4000/contas-bancarias"),
          fetch("http://localhost:4000/ordens"),
        ]);

        if (!respClientes.ok) throw new Error("Erro em /clients");
        if (!respContas.ok) throw new Error("Erro em /contas-bancarias");
        if (!respOrdens.ok) throw new Error("Erro em /ordens");

        const dadosClientes = await respClientes.json();
        const dadosContas = await respContas.json();
        const dadosOrdens = await respOrdens.json();

        setClientes(Array.isArray(dadosClientes) ? dadosClientes : []);
        setContas(Array.isArray(dadosContas) ? dadosContas : []);
        setOrdens(Array.isArray(dadosOrdens) ? dadosOrdens : []);
      } catch (e) {
        console.error("Erro ao carregar dados", e);
        setClientes([]);
        setContas([]);
        setOrdens([]);
      }
    }

    carregarDados();
  }, []);

  const handleAddOrdem = async (form) => {
    try {
      const resp = await fetch("http://localhost:4000/ordens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!resp.ok) {
        console.error("Erro ao criar ordem");
        return;
      }

      const respLista = await fetch("http://localhost:4000/ordens");
      if (!respLista.ok) {
        console.error("Erro ao recarregar ordens");
        return;
      }
      const lista = await respLista.json();
      setOrdens(Array.isArray(lista) ? lista : []);
    } catch (e) {
      console.error("Erro ao salvar ordem", e);
    }
  };

  const filtradas = ordens.filter((o) =>
    o.numero?.toLowerCase().includes(search.toLowerCase())
  );

  const totalOrdens = ordens.length;
  const abertas = ordens.filter(
    (o) => o.status === "aberta" || o.status === "Em aberto"
  ).length;
  const emProgresso = ordens.filter(
    (o) => o.status === "em progresso"
  ).length;
  const concluidas = ordens.filter(
    (o) => o.status === "concluída"
  ).length;
  const canceladas = ordens.filter(
    (o) => o.status === "cancelada"
  ).length;

  return (
    <div className={container}>
      <OrdensStatus
        search={search}
        setSearch={setSearch}
        onAddOrdem={handleAddOrdem}
        totalOrdens={totalOrdens}
        abertas={abertas}
        emProgresso={emProgresso}
        concluidas={concluidas}
        canceladas={canceladas}
        clientes={clientes}
        contas={contas}
        temaAtual={temaAtual}
      />

      <OrdensTable ordens={filtradas} temaAtual={temaAtual} />
    </div>
  );
}

export default OrdensLista;
