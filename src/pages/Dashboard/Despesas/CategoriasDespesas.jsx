import React, { useState, useEffect, useMemo } from "react";
import CategoriasDespesasHeader from "./Categorias/CategoriasDespesasHeader";
import CategoriasDespesasStatus from "./Categorias/CategoriasDespesasStatus";
import CategoriasDespesasTable from "./Categorias/CategoriasDespesasTable";

function CategoriasDespesas({
  temaAtual = "light",
  onCategoriasChange,
}) {
  const [search, setSearch] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");

  const isDark = temaAtual === "dark";

  useEffect(() => {
    async function load() {
      try {
        const savedAuth = localStorage.getItem("africaLegalUser");
        const token = savedAuth ? JSON.parse(savedAuth).token : null;

        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const res = await fetch(
          "http://localhost:4000/categorias-despesas/categorias",
          { headers }
        );

        if (!res.ok) {
          console.error("Erro ao carregar categorias:", await res.text());
          setCategorias([]);
          onCategoriasChange?.([]);
          return;
        }

        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];
        setCategorias(arr);
        onCategoriasChange?.(arr);
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
        setCategorias([]);
        onCategoriasChange?.([]);
      }
    }

    load();
  }, [onCategoriasChange]);

  const handleAdd = async () => {
    if (!nome.trim() || !tipo.trim()) return;

    try {
      const savedAuth = localStorage.getItem("africaLegalUser");
      const token = savedAuth ? JSON.parse(savedAuth).token : null;

      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch(
        "http://localhost:4000/categorias-despesas/categorias",
        {
          method: "POST",
          headers,
          body: JSON.stringify({ nome, tipo }),
        }
      );

      if (!res.ok) {
        console.error("Erro ao criar categoria:", await res.text());
        return;
      }

      const criada = await res.json();
      setCategorias((prev) => {
        const next = [criada, ...(Array.isArray(prev) ? prev : [])];
        onCategoriasChange?.(next);
        return next;
      });
      setNome("");
      setTipo("");
    } catch (err) {
      console.error("Erro ao criar categoria:", err);
    }
  };

  const filtradas = useMemo(
    () =>
      (categorias || []).filter((c) => {
        if (!c) return false;

        const nomeCat = (c.nome || "").toString().toLowerCase();
        const tipoCat = (c.tipo || "").toString().toLowerCase();
        const busca = (search || "").toLowerCase();

        return nomeCat.includes(busca) || tipoCat.includes(busca);
      }),
    [categorias, search]
  );

  const container = isDark
    ? "space-y-4 bg-slate-900/40 border border-slate-800 rounded-xl  text-slate-100"
    : "space-y-4 bg-white border border-slate-200 rounded-xl  text-slate-900 shadow-sm";

  return (
    <div className={container}>
      <CategoriasDespesasHeader totalCategorias={categorias.length} />

      <CategoriasDespesasStatus
        nome={nome}
        tipo={tipo}
        search={search}
        setNome={setNome}
        setTipo={setTipo}
        setSearch={setSearch}
        onAddCategoria={handleAdd}
        temaAtual={temaAtual}
      />

      <CategoriasDespesasTable
        categorias={filtradas}
        temaAtual={temaAtual}
      />
    </div>
  );
}

export default CategoriasDespesas;
