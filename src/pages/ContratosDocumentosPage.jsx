import React, { useState, useEffect } from "react";

function ContratosDocumentosPage({ temaAtual = "light" }) {
  const [showForm, setShowForm] = useState(false);
  const [modo, setModo] = useState("criar");
  const [contratos, setContratos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [contratoSelecionado, setContratoSelecionado] = useState(null);

  const [novoContrato, setNovoContrato] = useState({
    clientId: "",
    inicio: "",
    fim: "",
    estado: "Vigente",
    ficheiro: null,
    ficheiroNome: "",
  });

  const isDark = temaAtual === "dark";

  const pageClasses =
    "h-full flex flex-col p-4 gap-4 " +
    (isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900");

  const cardTableClasses =
    "flex-1 rounded-md border overflow-hidden " +
    (isDark
      ? "border-slate-800 bg-slate-950"
      : "border-slate-200 bg-white");

  const headerTitle = isDark ? "text-slate-100" : "text-slate-900";
  const headerSubtitle = isDark ? "text-slate-400" : "text-slate-500";

  const emptyText = isDark ? "text-slate-500" : "text-slate-500";

  const theadClasses =
    "bg-slate-50 " +
    (isDark ? "dark:bg-slate-900/60 text-slate-300" : "text-slate-500");

  const rowBorder =
    "border-t " +
    (isDark ? "border-slate-800" : "border-slate-100");

  const estadoBadge = (estado) => {
    if (estado === "Vigente") {
      return isDark
        ? "bg-emerald-900/40 text-emerald-300"
        : "bg-emerald-100 text-emerald-700";
    }
    if (estado === "Expirado") {
      return isDark
        ? "bg-rose-900/40 text-rose-300"
        : "bg-rose-100 text-rose-700";
    }
    return isDark
      ? "bg-amber-900/40 text-amber-300"
      : "bg-amber-100 text-amber-700";
  };

  const linkFile =
    "text-xs " +
    (isDark ? "text-sky-400 hover:text-sky-300" : "text-sky-600 hover:underline");

  const noFileText =
    "text-xs " + (isDark ? "text-slate-500" : "text-slate-400");

  const drawerClasses =
    "w-full max-w-md h-full border-l p-4 flex flex-col " +
    (isDark
      ? "bg-slate-950 border-slate-800 text-slate-100"
      : "bg-white border-slate-200 text-slate-900");

  const inputBase =
    "w-full px-3 py-2 rounded-md border text-sm " +
    (isDark
      ? "bg-slate-900 border-slate-700 text-slate-100"
      : "bg-white border-slate-200 text-slate-900");

  const labelClass =
    "block text-xs font-medium mb-1 " +
    (isDark ? "text-slate-300" : "text-slate-600");

  const footerBorder =
    "mt-auto flex justify-end gap-2 pt-3 border-t " +
    (isDark ? "border-slate-800" : "border-slate-200");

  useEffect(() => {
    async function fetchData() {
      try {
        const savedAuth = localStorage.getItem("africaLegalUser");
        const token = savedAuth ? JSON.parse(savedAuth).token : null;

        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const [resContratos, resClientes] = await Promise.all([
          fetch("http://localhost:4000/contratos", { headers }),
          fetch("http://localhost:4000/clients", { headers }),
        ]);

        if (!resContratos.ok || !resClientes.ok) {
          throw new Error("Erro ao carregar dados");
        }

        const contratosData = await resContratos.json();
        const clientesData = await resClientes.json();

        setContratos(contratosData);
        setClientes(clientesData);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    }

    fetchData();
  }, []);

  const resetForm = () => {
    setNovoContrato({
      clientId: "",
      inicio: "",
      fim: "",
      estado: "Vigente",
      ficheiro: null,
      ficheiroNome: "",
    });
    setContratoSelecionado(null);
  };

  const handleNovoContrato = () => {
    setModo("criar");
    resetForm();
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    resetForm();
  };

  const handleVerContrato = (c) => {
    setModo("ver");
    setContratoSelecionado(c);
    setNovoContrato({
      clientId: c.clientId || "",
      inicio: c.inicio ? String(c.inicio).slice(0, 10) : "",
      fim: c.fim ? String(c.fim).slice(0, 10) : "",
      estado: c.estado || "Vigente",
      ficheiro: null,
      ficheiroNome: c.ficheiroNome || "",
    });
    setShowForm(true);
  };

  const handleEditarContrato = (c) => {
    setModo("editar");
    setContratoSelecionado(c);
    setNovoContrato({
      clientId: c.clientId || "",
      inicio: c.inicio ? String(c.inicio).slice(0, 10) : "",
      fim: c.fim ? String(c.fim).slice(0, 10) : "",
      estado: c.estado || "Vigente",
      ficheiro: null,
      ficheiroNome: c.ficheiroNome || "",
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoContrato((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNovoContrato((prev) => ({
      ...prev,
      ficheiro: file,
      ficheiroNome: file.name,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const savedAuth = localStorage.getItem("africaLegalUser");
      const token = savedAuth ? JSON.parse(savedAuth).token : null;

      if (modo === "criar") {
        const res = await fetch("http://localhost:4000/contratos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            clientId: novoContrato.clientId,
            inicio: novoContrato.inicio,
            fim: novoContrato.fim,
            estado: novoContrato.estado,
            ficheiroNome: novoContrato.ficheiroNome || null,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Erro ao criar contrato");
        }

        setContratos((prev) => [data, ...prev]);
      } else if (modo === "editar" && contratoSelecionado) {
        console.log("TODO PUT /contratos/:id", {
          id: contratoSelecionado.id,
          ...novoContrato,
        });
      }

      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao guardar contrato");
    }
  };

  const formatData = (d) => (d ? new Date(d).toLocaleDateString() : "-");

  const readOnly = modo === "ver";

  return (
    <div className={pageClasses}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className={`text-xl font-semibold ${headerTitle}`}>
            Contratos & Documentos
          </h1>
          <p className={`text-xs ${headerSubtitle}`}>
            Gestão de contratos, anexos e documentação jurídica.
          </p>
        </div>
        <button
          onClick={handleNovoContrato}
          className="px-3 py-2 rounded-md bg-sky-600 text-white text-sm font-medium hover:bg-sky-700"
        >
          + Novo contrato
        </button>
      </div>

      {/* Tabela */}
      <div className={cardTableClasses}>
        {contratos.length === 0 ? (
          <div className={`p-6 text-center text-sm ${emptyText}`}>
            Ainda não existem contratos registados.
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className={theadClasses}>
              <tr>
                <th className="px-3 py-2 text-left font-medium">Nº</th>
                <th className="px-3 py-2 text-left font-medium">Cliente</th>
                <th className="px-3 py-2 text-left font-medium">Início</th>
                <th className="px-3 py-2 text-left font-medium">Fim</th>
                <th className="px-3 py-2 text-left font-medium">Estado</th>
                <th className="px-3 py-2 text-left font-medium">Ficheiro</th>
                <th className="px-3 py-2 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {contratos.map((c) => (
                <tr key={c.id} className={rowBorder}>
                  <td className="px-3 py-2">{c.numero}</td>
                  <td className="px-3 py-2">{c.cliente}</td>
                  <td className="px-3 py-2">{formatData(c.inicio)}</td>
                  <td className="px-3 py-2">{formatData(c.fim)}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded-full ${estadoBadge(
                        c.estado
                      )}`}
                    >
                      {c.estado}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {c.ficheiroNome ? (
                      <a
                        href={`http://localhost:4000/uploads/contratos/${c.ficheiroNome}`}
                        target="_blank"
                        rel="noreferrer"
                        className={linkFile}
                      >
                        {c.ficheiroNome}
                      </a>
                    ) : (
                      <span className={noFileText}>Sem ficheiro</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleVerContrato(c)}
                      className={
                        "text-xs mr-2 " +
                        (isDark
                          ? "text-sky-400 hover:text-sky-300"
                          : "text-sky-600 hover:underline")
                      }
                    >
                      Detalhes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditarContrato(c)}
                      className={
                        "text-xs " +
                        (isDark
                          ? "text-slate-400 hover:text-slate-200"
                          : "text-slate-500 hover:underline")
                      }
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Drawer / formulário */}
      {showForm && (
        <div className="fixed inset-0 z-40 flex">
          <div className="flex-1 bg-black/40" onClick={handleClose} />
          <div className={drawerClasses}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {modo === "criar"
                  ? "Novo contrato"
                  : modo === "editar"
                  ? "Editar contrato"
                  : "Ver contrato"}
              </h2>
              <button
                onClick={handleClose}
                className={
                  "text-sm " +
                  (isDark
                    ? "text-slate-400 hover:text-slate-100"
                    : "text-slate-500 hover:text-slate-800")
                }
              >
                Fechar
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex-1 flex flex-col gap-3 overflow-auto"
            >
              {/* Cliente */}
              <div>
                <label className={labelClass}>Cliente</label>
                <select
                  name="clientId"
                  value={novoContrato.clientId}
                  onChange={handleChange}
                  disabled={readOnly}
                  className={inputBase}
                  required
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Datas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Data de início</label>
                  <input
                    type="date"
                    name="inicio"
                    value={novoContrato.inicio}
                    onChange={handleChange}
                    disabled={readOnly}
                    className={inputBase}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Data de fim</label>
                  <input
                    type="date"
                    name="fim"
                    value={novoContrato.fim}
                    onChange={handleChange}
                    disabled={readOnly}
                    className={inputBase}
                  />
                </div>
              </div>

              {/* Estado */}
              <div>
                <label className={labelClass}>Estado</label>
                <select
                  name="estado"
                  value={novoContrato.estado}
                  onChange={handleChange}
                  disabled={readOnly}
                  className={inputBase}
                >
                  <option value="Vigente">Vigente</option>
                  <option value="Expirado">Expirado</option>
                  <option value="Em revisão">Em revisão</option>
                </select>
              </div>

              {/* Ficheiro */}
              <div>
                <label className={labelClass}>Ficheiro PDF</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  disabled={readOnly}
                  className="w-full text-sm"
                />
                {novoContrato.ficheiroNome && (
                  <p
                    className={
                      "mt-1 text-[11px] " +
                      (isDark ? "text-slate-400" : "text-slate-500")
                    }
                  >
                    Selecionado: {novoContrato.ficheiroNome}
                  </p>
                )}
              </div>

              {/* Ações */}
              <div className={footerBorder}>
                <button
                  type="button"
                  onClick={handleClose}
                  className={
                    "px-3 py-2 rounded-md border text-sm " +
                    (isDark
                      ? "border-slate-700 text-slate-300 hover:bg-slate-900"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50")
                  }
                >
                  {readOnly ? "Fechar" : "Cancelar"}
                </button>
                {!readOnly && (
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-md bg-sky-600 text-white text-sm font-medium hover:bg-sky-700"
                  >
                    {modo === "criar"
                      ? "Guardar contrato"
                      : "Guardar alterações"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContratosDocumentosPage;
