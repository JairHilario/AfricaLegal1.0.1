import React, { useState, useEffect, useMemo } from "react";

import DespesasStatus from "./Lista/DespesasStatus";
import DespesasTable from "./Lista/DespesasTable";

function ListaDespesas({
  contas = [],
  fornecedores = [],
  categoriasDespesas = [],
  temaAtual = "light",
}) {
  const [search, setSearch] = useState("");
  const [despesas, setDespesas] = useState([]);

  const isDark = temaAtual === "dark";

  useEffect(() => {
    async function loadDespesas() {
      try {
        const savedAuth = localStorage.getItem("africaLegalUser");
        const token = savedAuth ? JSON.parse(savedAuth).token : null;

        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const res = await fetch("http://localhost:4000/despesas", { headers });
        if (!res.ok) {
          console.error("Erro ao carregar despesas:", await res.text());
          setDespesas([]);
          return;
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setDespesas(data);
        } else {
          console.warn("API retornou dados inválidos (não é array):", data);
          setDespesas([]);
        }
      } catch (err) {
        console.error("Erro ao carregar despesas:", err);
        setDespesas([]);
      }
    }

    loadDespesas();
  }, []);

  const stats = useMemo(() => {
    if (!Array.isArray(despesas) || despesas.length === 0) {
      return {
        total: 0,
        pagas: 0,
        pendentes: 0,
        vencidas: 0,
        novas: 0,
        valorTotal: 0,
      };
    }

    return {
      total: despesas.length,
      pagas: despesas.filter((d) => d.status === "Paga").length,
      pendentes: despesas.filter((d) => d.status === "Pendente").length,
      vencidas: despesas.filter((d) => d.status === "Vencida").length,
      novas: despesas.filter((d) => d.nova === true).length,
      valorTotal: despesas.reduce(
        (acc, d) => acc + (Number(d.total) || 0),
        0
      ),
    };
  }, [despesas]);

  const enrich = (d) => {
    const conta = contas.find((c) => c.id === d.contaId);
    return {
      ...d,
      nomeConta: conta?.banco || conta?.nome || "",
      numeroConta: conta?.numero || "",
    };
  };

  const filtradas = useMemo(() => {
    if (!Array.isArray(despesas)) return [];
    const q = search.toLowerCase();

    return despesas
      .map(enrich)
      .filter((d) => {
        if (!q) return true;
        return (
          d.descricao?.toLowerCase().includes(q) ||
          d.fornecedorNome?.toLowerCase().includes(q) ||
          d.status?.toLowerCase().includes(q)
        );
      });
  }, [despesas, contas, search]);

  const handleAddDespesa = async (nova) => {
    try {
      const savedAuth = localStorage.getItem("africaLegalUser");
      const token = savedAuth ? JSON.parse(savedAuth).token : null;

      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch("http://localhost:4000/despesas", {
        method: "POST",
        headers,
        body: JSON.stringify(nova),
      });

      if (!res.ok) {
        console.error("Erro ao criar despesa:", await res.text());
        return;
      }

      const criada = await res.json();
      setDespesas((prev) => [
        ...(Array.isArray(prev) ? prev : []),
        criada,
      ]);
    } catch (err) {
      console.error("Erro ao criar despesa:", err);
    }
  };

  const container = isDark
    ? "space-y-6  rounded-xl border-slate-800"
    : "space-y-6  rounded-xl shadow-sm  border-slate-200";

  return (
    <div className={container}>
      <DespesasStatus
        search={search}
        setSearch={setSearch}
        onAddDespesa={handleAddDespesa}
        totalDespesas={stats.total}
        valorTotal={stats.valorTotal}
        pagas={stats.pagas}
        emAberto={stats.pendentes}
        emAtraso={stats.vencidas}
        contas={contas}
        fornecedores={fornecedores}
        categoriasDespesas={categoriasDespesas}
        temaAtual={temaAtual}
      />

      <DespesasTable
        despesas={filtradas}
        temaAtual={temaAtual}
      />
    </div>
  );
}

export default ListaDespesas;
