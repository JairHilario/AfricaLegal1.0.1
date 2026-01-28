import React, { useState, useEffect } from "react";

import ContasStatus from "./Contas/ContasStatus";
import ContasTable from "./Contas/ContasTable";

// taxas de câmbio reais (ajusta quando necessário)
const TAXAS_CAMBIO = {
  MZN: 1,
  USD: 63.91, // 1 USD = 63.91 MZN
  ZAR: 3.9,   // 1 ZAR = 3.90 MZN
};

function ContasBancarias({ temaAtual = "light" }) {
  const [search, setSearch] = useState("");
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(false);

  const isDark = temaAtual === "dark";

  // BUSCAR CONTAS NO BACKEND AO MONTAR
  useEffect(() => {
    const fetchContas = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:4000/contas-bancarias");
        const data = await res.json();
        setContas(data || []);
      } catch (err) {
        console.error("Erro ao buscar contas bancárias:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContas();
  }, []);

  // CONVERTER SEMPRE PARA MZN
  const {
    saldoTotalMZN,
    saldoPositivoMZN,
    saldoNegativoMZN,
  } = contas.reduce(
    (acc, c) => {
      const moeda = c.moeda || "MZN";
      const valor = Number(c.saldo || c.saldoInicial || 0);
      const taxa = TAXAS_CAMBIO[moeda] || 1;
      const valorMZN = valor * taxa;

      acc.saldoTotalMZN += valorMZN;
      if (valorMZN > 0) acc.saldoPositivoMZN += valorMZN;
      if (valorMZN < 0) acc.saldoNegativoMZN += valorMZN;

      return acc;
    },
    {
      saldoTotalMZN: 0,
      saldoPositivoMZN: 0,
      saldoNegativoMZN: 0,
    }
  );

  const filtradas = contas.filter((c) => {
    const termo = search.toLowerCase();
    return (
      c.banco?.toLowerCase().includes(termo) ||
      c.numero?.toLowerCase().includes(termo)
    );
  });

  // CRIAR CONTA NO BACKEND E ATUALIZAR LISTA
  const handleAddConta = async (nova) => {
    try {
      const res = await fetch("http://localhost:4000/contas-bancarias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nova),
      });

      if (!res.ok) {
        throw new Error("Erro ao criar conta");
      }

      const criada = await res.json();

      setContas((prev) => [
        ...prev,
        {
          ...criada,
          nova: true,
        },
      ]);
    } catch (err) {
      console.error("Erro ao adicionar conta:", err);
    }
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">  {/* ← Única mudança! */}
      <ContasStatus
        search={search}
        setSearch={setSearch}
        totalContas={contas.length}
        saldoTotalMZN={saldoTotalMZN}
        saldoPositivoMZN={saldoPositivoMZN}
        saldoNegativoMZN={saldoNegativoMZN}
        onAddConta={handleAddConta}
        loading={loading}
        temaAtual={temaAtual}
      />

      <ContasTable contas={filtradas} temaAtual={temaAtual} />
    </div>
  );
}

export default ContasBancarias;
