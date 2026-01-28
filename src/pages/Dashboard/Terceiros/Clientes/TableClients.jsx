import React, { useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/20/solid";

const formatDate = (iso) => {
  if (!iso) return "";
  const onlyDate = String(iso).split("T")[0];
  const [y, m, d] = onlyDate.split("-");
  return `${d}/${m}/${y}`;
};

function TableClients({ clients, onUpdateClient, temaAtual = "light" }) {
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeTab, setActiveTab] = useState("perfil");
  const [isTabFading, setIsTabFading] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const [clientFacturas, setClientFacturas] = useState([]);
  const [loadingFacturas, setLoadingFacturas] = useState(false);
  const [erroFacturas, setErroFacturas] = useState("");

  const [clientRecibos, setClientRecibos] = useState([]);
  const [loadingRecibos, setLoadingRecibos] = useState(false);
  const [erroRecibos, setErroRecibos] = useState("");

  const [extrato, setExtrato] = useState([]);
  const [loadingExtrato, setLoadingExtrato] = useState(false);
  const [erroExtrato, setErroExtrato] = useState("");

  const isDark = temaAtual === "dark";

  if (!Array.isArray(clients)) {
    return <div>Erro: lista de clientes não está disponível.</div>;
  }

  const pendentes = extrato.filter(
    (l) => l.status === "Pendente" || l.tipo === "Pendente"
  );

  const openClient = (client, initialTab = "perfil") => {
    setSelectedClient(client);
    setActiveTab(initialTab);
    setIsTabFading(false);
    setEditForm({
      nome: client.nome || "",
      email: client.email || "",
      telefone: client.telefone || "",
      endereco: client.endereco || "",
      cidade: client.cidade || "",
      caixaPostal: client.caixaPostal || "",
      nuit: client.nuit || "",
      provincia: client.provincia || "",
      status: client.status || "Ativo",
    });

    setClientFacturas([]);
    setErroFacturas("");
    setClientRecibos([]);
    setErroRecibos("");
    setExtrato([]);
    setErroExtrato("");

    if (initialTab === "facturas") {
      loadClientFacturas(client.id);
    }
    if (initialTab === "recibos") {
      loadClientRecibos(client.id);
    }
    if (initialTab === "extracto" || initialTab === "pendentes") {
      loadExtrato(client.id);
    }
  };

  const changeTab = (tabId) => {
    if (!selectedClient || tabId === activeTab) return;

    setIsTabFading(true);

    setTimeout(() => {
      setActiveTab(tabId);

      if (tabId === "facturas") {
        loadClientFacturas(selectedClient.id);
      }
      if (tabId === "recibos") {
        loadClientRecibos(selectedClient.id);
      }
      if (tabId === "extracto" || tabId === "pendentes") {
        loadExtrato(selectedClient.id);
      }

      requestAnimationFrame(() => {
        setIsTabFading(false);
      });
    }, 120);
  };

  const loadClientFacturas = async (clientId) => {
    try {
      setLoadingFacturas(true);
      setErroFacturas("");

      const savedAuth = localStorage.getItem("africaLegalUser");
      const token = savedAuth ? JSON.parse(savedAuth).token : null;

      const res = await fetch(
        `http://localhost:4000/facturas?clientId=${clientId}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!res.ok) {
        throw new Error("Erro ao carregar faturas do cliente");
      }

      const data = await res.json();
      setClientFacturas(data);
    } catch (err) {
      console.error(err);
      setErroFacturas(err.message || "Erro ao carregar faturas do cliente");
      setClientFacturas([]);
    } finally {
      setLoadingFacturas(false);
    }
  };

  const loadClientRecibos = async () => {
    try {
      setLoadingRecibos(true);
      setErroRecibos("");

      const savedAuth = localStorage.getItem("africaLegalUser");
      const token = savedAuth ? JSON.parse(savedAuth).token : null;

      const res = await fetch("http://localhost:4000/recibos", {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        throw new Error("Erro ao carregar recibos do cliente");
      }

      const data = await res.json();
      const filtrados = data.filter((r) => r.cliente === selectedClient.nome);
      setClientRecibos(filtrados);
    } catch (err) {
      console.error(err);
      setErroRecibos(err.message || "Erro ao carregar recibos do cliente");
      setClientRecibos([]);
    } finally {
      setLoadingRecibos(false);
    }
  };

  const loadExtrato = async (clientId) => {
    try {
      setLoadingExtrato(true);
      setErroExtrato("");

      const savedAuth = localStorage.getItem("africaLegalUser");
      const token = savedAuth ? JSON.parse(savedAuth).token : null;

      const res = await fetch(
        `http://localhost:4000/clientes/${clientId}/extrato`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!res.ok) {
        throw new Error("Erro ao carregar extracto do cliente");
      }

      const data = await res.json();
      setExtrato(data);
    } catch (err) {
      console.error(err);
      setErroExtrato(err.message || "Erro ao carregar extracto do cliente");
      setExtrato([]);
    } finally {
      setLoadingExtrato(false);
    }
  };

  const handleSave = async () => {
    if (!selectedClient || !editForm) return;

    const savedAuth = localStorage.getItem("africaLegalUser");
    const token = savedAuth ? JSON.parse(savedAuth).token : null;

    try {
      const res = await fetch(
        `http://localhost:3000/clients/${clientId}/extrato`, // Porta 3000 e /clients
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Erro ao atualizar cliente");
      }

      if (onUpdateClient) {
        onUpdateClient(data);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao atualizar cliente");
    }
  };

  const handleCloseClient = () => {
    setSelectedClient(null);
    setActiveTab("perfil");
    setIsTabFading(false);
    setEditForm(null);
    setClientFacturas([]);
    setErroFacturas("");
    setLoadingFacturas(false);
    setClientRecibos([]);
    setErroRecibos("");
    setLoadingRecibos(false);
    setExtrato([]);
    setErroExtrato("");
    setLoadingExtrato(false);
  };

  const labelEdit =
    "block text-xs font-medium mb-1 " +
    (isDark ? "text-slate-300" : "text-slate-700");

  const inputEdit =
    "w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300 " +
    (isDark
      ? "border-slate-700 bg-slate-800 text-slate-100"
      : "border-sky-100 bg-sky-50 text-slate-900");

  const readonlyInput =
    "w-full rounded-md border px-3 py-2 text-sm cursor-not-allowed " +
    (isDark
      ? "border-slate-700 bg-slate-800 text-slate-400"
      : "border-sky-100 bg-slate-50 text-slate-700");

  const tableContainer =
    "mt-2 overflow-x-auto rounded-md border " +
    (isDark ? "border-slate-800 bg-slate-900" : "border-sky-100 bg-white");

  const tableBase =
    "min-w-full divide-y text-sm " +
    (isDark
      ? "divide-slate-800 text-slate-100"
      : "divide-slate-100 text-slate-800");

  const tableHead =
    "bg-sky-50 " + (isDark ? "bg-slate-800" : "bg-sky-50");

  const headCell =
    "px-3 py-2 text-left text-xs font-semibold " +
    (isDark ? "text-slate-300" : "text-slate-600");

  const rowBase =
    "transition-colors " +
    (isDark ? "hover:bg-slate-800" : "hover:bg-sky-50");

  const chipStatus = (status) =>
    "px-2 py-1 rounded-full text-[11px] font-medium border " +
    (status === "Ativo"
      ? isDark
        ? "bg-emerald-900/30 text-emerald-300 border-emerald-700"
        : "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "Inativo"
        ? isDark
          ? "bg-slate-800 text-slate-300 border-slate-600"
          : "bg-slate-50 text-slate-700 border-slate-200"
        : isDark
          ? "bg-rose-900/30 text-rose-300 border-rose-700"
          : "bg-rose-50 text-rose-700 border-rose-200");

  // PERFIL + ABAS
  if (selectedClient) {
    return (
      <div
        className={
          isDark
            ? "mb-4 rounded-md border border-slate-800 bg-slate-900 p-4 md:p-6 shadow-sm text-slate-100"
            : "mb-4 rounded-md border border-sky-100 bg-white p-4 md:p-6 shadow-sm text-slate-800"
        }
      >
        {/* Tabs + Voltar */}
        <div className="mb-4 flex items-center justify-between">
          <div
            className={
              "flex gap-4 border-b text-sm " +
              (isDark ? "border-slate-800" : "border-sky-100")
            }
          >
            {[
              { id: "perfil", label: "Perfil" },
              { id: "facturas", label: "Factura" },
              { id: "recibos", label: "Recibos" },
              { id: "extracto", label: "Extracto de Conta Corrente" },
              { id: "pendentes", label: "Pendentes" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => changeTab(tab.id)}
                className={
                  "pb-2 border-b-2 text-xs md:text-sm transition-colors " +
                  (activeTab === tab.id
                    ? isDark
                      ? "border-sky-500 text-sky-300"
                      : "border-sky-500 text-sky-700"
                    : isDark
                      ? "border-transparent text-slate-400 hover:text-slate-100"
                      : "border-transparent text-slate-500 hover:text-slate-700")
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleCloseClient}
            className={
              "rounded-md px-3 py-1 text-xs " +
              (isDark
                ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200")
            }
          >
            Voltar à lista
          </button>
        </div>

        {/* Título */}
        <h2
          className={
            "mb-4 text-lg font-semibold " +
            (isDark ? "text-slate-100" : "text-slate-900")
          }
        >
          {selectedClient.nome}
        </h2>

        {/* CONTAINER COM TRANSIÇÃO DAS ABAS */}
        <div
          className={`transition-all duration-200 ease-out ${isTabFading ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
            }`}
        >
          {/* PERFIL */}
          {activeTab === "perfil" && (
            <>
              <form className="grid gap-4 md:grid-cols-2 text-sm">
                <div>
                  <label className={labelEdit}>
                    Nome<span className="text-rose-500"> *</span>
                  </label>
                  <input
                    type="text"
                    value={editForm?.nome ?? ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, nome: e.target.value }))
                    }
                    className={inputEdit}
                  />
                </div>

                <div>
                  <label className={labelEdit}>Saldo</label>
                  <input
                    type="text"
                    defaultValue={Number(
                      selectedClient.saldo || 0
                    ).toLocaleString("pt-PT", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    className={readonlyInput}
                    readOnly
                  />
                </div>

                <div>
                  <label className={labelEdit}>
                    O email<span className="text-rose-500"> *</span>
                  </label>
                  <input
                    type="email"
                    value={editForm?.email ?? ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className={inputEdit}
                  />
                </div>

                <div>
                  <label className={labelEdit}>Morada</label>
                  <input
                    type="text"
                    value={editForm?.endereco ?? ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        endereco: e.target.value,
                      }))
                    }
                    className={inputEdit}
                  />
                </div>

                <div>
                  <label className={labelEdit}>
                    Telefone<span className="text-rose-500"> *</span>
                  </label>
                  <input
                    type="text"
                    value={editForm?.telefone ?? ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        telefone: e.target.value,
                      }))
                    }
                    className={inputEdit}
                  />
                </div>

                <div>
                  <label className={labelEdit}>Caixa postal</label>
                  <input
                    type="text"
                    value={editForm?.caixaPostal ?? ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        caixaPostal: e.target.value,
                      }))
                    }
                    className={inputEdit}
                  />
                </div>

                <div>
                  <label className={labelEdit}>Cidade</label>
                  <input
                    type="text"
                    value={editForm?.cidade ?? ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        cidade: e.target.value,
                      }))
                    }
                    className={inputEdit}
                  />
                </div>

                <div>
                  <label className={labelEdit}>
                    Nuit<span className="text-rose-500"> *</span>
                  </label>
                  <input
                    type="text"
                    value={editForm?.nuit ?? ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, nuit: e.target.value }))
                    }
                    className={inputEdit}
                  />
                </div>

                <div>
                  <label className={labelEdit}>Provincia</label>
                  <input
                    type="text"
                    value={editForm?.provincia ?? ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        provincia: e.target.value,
                      }))
                    }
                    className={inputEdit}
                  />
                </div>

                <div>
                  <label className={labelEdit}>Estado</label>
                  <select
                    value={editForm?.status ?? "Ativo"}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className={inputEdit}
                  >
                    <option value="Ativo">Activo</option>
                    <option value="Inativo">Inactivo</option>
                    <option value="Vencido">Vencido</option>
                    <option value="Risco">Risco</option>
                  </select>
                </div>
              </form>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseClient}
                  className={
                    "rounded-md px-4 py-2 text-sm " +
                    (isDark
                      ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200")
                  }
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-md bg-emerald-500 px-4 py-2 text-sm text-white hover:bg-emerald-400"
                >
                  Registar
                </button>
              </div>
            </>
          )}

          {/* FACTURAS */}
          {activeTab === "facturas" && (
            <div className={tableContainer}>
              {loadingFacturas && (
                <p
                  className={
                    "px-3 py-2 text-xs " +
                    (isDark ? "text-slate-400" : "text-slate-500")
                  }
                >
                  A carregar faturas...
                </p>
              )}
              {erroFacturas && (
                <p className="px-3 py-2 text-xs text-rose-600">{erroFacturas}</p>
              )}
              {!loadingFacturas && (
                <table className={tableBase}>
                  <thead className={tableHead}>
                    <tr>
                      <th className={headCell}>Nº</th>
                      <th className={headCell}>Data</th>
                      <th className={`${headCell} text-right`}>Total (MZN)</th>
                      <th className={headCell}>Estado</th>
                    </tr>
                  </thead>
                  <tbody
                    className={
                      isDark
                        ? "divide-y divide-slate-800"
                        : "divide-y divide-slate-100"
                    }
                  >
                    {clientFacturas.length === 0 && !erroFacturas && (
                      <tr>
                        <td
                          colSpan={4}
                          className={
                            "px-3 py-4 text-center text-xs " +
                            (isDark ? "text-slate-500" : "text-slate-400")
                          }
                        >
                          Nenhuma factura para este cliente.
                        </td>
                      </tr>
                    )}
                    {clientFacturas.map((f) => (
                      <tr key={f.id} className={rowBase}>
                        <td className="px-3 py-2">{f.referencia}</td>
                        <td className="px-3 py-2">{formatDate(f.data)}</td>
                        <td className="px-3 py-2 text-right">
                          {Number(f.valor || 0).toFixed(2)}
                        </td>
                        <td className="px-3 py-2">{f.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* RECIBOS */}
          {activeTab === "recibos" && (
            <div className={tableContainer}>
              {loadingRecibos && (
                <p
                  className={
                    "px-3 py-2 text-xs " +
                    (isDark ? "text-slate-400" : "text-slate-500")
                  }
                >
                  A carregar recibos...
                </p>
              )}
              {erroRecibos && (
                <p className="px-3 py-2 text-xs text-rose-600">{erroRecibos}</p>
              )}
              {!loadingRecibos && (
                <table className={tableBase}>
                  <thead className={tableHead}>
                    <tr>
                      <th className={headCell}>Nº Recibo</th>
                      <th className={headCell}>Data</th>
                      <th className={`${headCell} text-right`}>Valor (MZN)</th>
                      <th className={headCell}>Estado</th>
                    </tr>
                  </thead>
                  <tbody
                    className={
                      isDark
                        ? "divide-y divide-slate-800"
                        : "divide-y divide-slate-100"
                    }
                  >
                    {clientRecibos.length === 0 && !erroRecibos && (
                      <tr>
                        <td
                          colSpan={4}
                          className={
                            "px-3 py-4 text-center text-xs " +
                            (isDark ? "text-slate-500" : "text-slate-400")
                          }
                        >
                          Nenhum recibo para este cliente.
                        </td>
                      </tr>
                    )}
                    {clientRecibos.map((r) => (
                      <tr key={r.id} className={rowBase}>
                        <td className="px-3 py-2">{r.numero}</td>
                        <td className="px-3 py-2">{formatDate(r.data)}</td>
                        <td className="px-3 py-2 text-right">
                          {Number(r.valor || 0).toFixed(2)}
                        </td>
                        <td className="px-3 py-2">{r.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* EXTRACTO */}
          {activeTab === "extracto" && (
            <div className={tableContainer}>
              {loadingExtrato && (
                <p
                  className={
                    "px-3 py-2 text-xs " +
                    (isDark ? "text-slate-400" : "text-slate-500")
                  }
                >
                  A carregar extracto...
                </p>
              )}
              {erroExtrato && (
                <p className="px-3 py-2 text-xs text-rose-600">
                  {erroExtrato}
                </p>
              )}
              {!loadingExtrato && (
                <table className={tableBase}>
                  <thead className={tableHead}>
                    <tr>
                      <th className={headCell}>Data</th>
                      <th className={headCell}>Tipo</th>
                      <th className={headCell}>Nº Documento</th>
                      <th className={`${headCell} text-right`}>
                        Valor (MZN)
                      </th>
                      <th className={headCell}>Estado</th>
                    </tr>
                  </thead>
                  <tbody
                    className={
                      isDark
                        ? "divide-y divide-slate-800"
                        : "divide-y divide-slate-100"
                    }
                  >
                    {extrato.length === 0 && !erroExtrato && (
                      <tr>
                        <td
                          colSpan={5}
                          className={
                            "px-3 py-4 text-center text-xs " +
                            (isDark ? "text-slate-500" : "text-slate-400")
                          }
                        >
                          Nenhum movimento para este cliente.
                        </td>
                      </tr>
                    )}
                    {extrato.map((l) => (
                      <tr
                        key={`${l.tipo}-${l.id}`}
                        className={rowBase}
                      >
                        <td className="px-3 py-2">{formatDate(l.data)}</td>
                        <td className="px-3 py-2">{l.tipo}</td>
                        <td className="px-3 py-2">{l.numero}</td>
                        <td className="px-3 py-2 text-right">
                          {Number(l.valor || 0).toFixed(2)}
                        </td>
                        <td className="px-3 py-2">{l.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* PENDENTES */}
          {activeTab === "pendentes" && (
            <div className={tableContainer}>
              {loadingExtrato && (
                <p
                  className={
                    "px-3 py-2 text-xs " +
                    (isDark ? "text-slate-400" : "text-slate-500")
                  }
                >
                  A carregar pendentes...
                </p>
              )}
              {erroExtrato && (
                <p className="px-3 py-2 text-xs text-rose-600">
                  {erroExtrato}
                </p>
              )}
              {!loadingExtrato && (
                <table className={tableBase}>
                  <thead className={tableHead}>
                    <tr>
                      <th className={headCell}>Data</th>
                      <th className={headCell}>Tipo</th>
                      <th className={headCell}>Nº Documento</th>
                      <th className={`${headCell} text-right`}>
                        Valor (MZN)
                      </th>
                      <th className={headCell}>Estado</th>
                    </tr>
                  </thead>
                  <tbody
                    className={
                      isDark
                        ? "divide-y divide-slate-800"
                        : "divide-y divide-slate-100"
                    }
                  >
                    {pendentes.length === 0 && !erroExtrato && (
                      <tr>
                        <td
                          colSpan={5}
                          className={
                            "px-3 py-4 text-center text-xs " +
                            (isDark ? "text-slate-500" : "text-slate-400")
                          }
                        >
                          Nenhum documento pendente para este cliente.
                        </td>
                      </tr>
                    )}
                    {pendentes.map((p) => (
                      <tr
                        key={`${p.tipo}-pendente-${p.id}`}
                        className={rowBase}
                      >
                        <td className="px-3 py-2">{formatDate(p.data)}</td>
                        <td className="px-3 py-2">{p.tipo}</td>
                        <td className="px-3 py-2">{p.numero}</td>
                        <td className="px-3 py-2 text-right">
                          {Number(p.valor || 0).toFixed(2)}
                        </td>
                        <td className="px-3 py-2">{p.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // LISTA
  return (
    <div
      className={
        "overflow-x-auto mb-4 rounded-md border shadow-sm " +
        (isDark
          ? "border-slate-800 bg-slate-900"
          : "border-sky-100 bg-white")
      }
    >
      <table
        className={
          "min-w-full divide-y text-sm " +
          (isDark
            ? "divide-slate-800 text-slate-100"
            : "divide-slate-100 text-slate-800")
        }
      >
        <thead className={isDark ? "bg-slate-800" : "bg-sky-50"}>
          <tr>
            <th className={headCell.replace("px-3", "px-4")}>Nome</th>
            <th className={headCell.replace("px-3", "px-4")}>Email</th>
            <th className={headCell.replace("px-3", "px-4")}>Telefone</th>
            <th className={headCell.replace("px-3", "px-4")}>NUIT</th>
            <th className={headCell.replace("px-3", "px-4")}>
              Saldo (MZN)
            </th>
            <th className={headCell.replace("px-3", "px-4")}>Status</th>
            <th className={headCell.replace("px-3", "px-4")}>
              Criado em
            </th>
            <th
              className={
                headCell.replace("px-3", "px-4") + " text-right"
              }
            >
              Ações
            </th>
          </tr>
        </thead>
        <tbody
          className={
            isDark
              ? "divide-y divide-slate-800"
              : "divide-y divide-slate-100"
          }
        >
          {clients.map((client) => (
            <tr key={client.id} className={rowBase}>
              <td className="px-4 py-2">
                <button
                  type="button"
                  onClick={() => openClient(client, "facturas")}
                  className={
                    "hover:underline underline-offset-2 text-left " +
                    (isDark ? "text-slate-100" : "text-slate-800")
                  }
                >
                  {client.nome}
                </button>
              </td>
              <td
                className={
                  "px-4 py-2 " +
                  (isDark ? "text-slate-300" : "text-slate-700")
                }
              >
                {client.email}
              </td>
              <td
                className={
                  "px-4 py-2 " +
                  (isDark ? "text-slate-300" : "text-slate-700")
                }
              >
                {client.telefone}
              </td>
              <td
                className={
                  "px-4 py-2 " +
                  (isDark ? "text-slate-300" : "text-slate-700")
                }
              >
                {client.nuit}
              </td>
              <td
                className={
                  "px-4 py-2 font-medium " +
                  ((client.saldo || 0) < 0
                    ? "text-rose-500"
                    : "text-emerald-500")
                }
              >
                {Number(client.saldo || 0).toFixed(2)}
              </td>
              <td className="px-4 py-2">
                <span className={chipStatus(client.status)}>
                  {client.status}
                </span>
              </td>
              <td
                className={
                  "px-4 py-2 " +
                  (isDark ? "text-slate-400" : "text-slate-600")
                }
              >
                {formatDate(client.criadoEm)}
              </td>
              <td className="px-4 py-2 text-right">
                <button
                  type="button"
                  onClick={() => openClient(client, "perfil")}
                  className={
                    "inline-flex items-center justify-center rounded-md border p-1 " +
                    (isDark
                      ? "border-slate-700 text-slate-100 hover:bg-slate-800"
                      : "border-sky-200 text-slate-700 hover:bg-sky-50")
                  }
                  title="Ver / editar cliente"
                >
                  <PencilSquareIcon className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableClients;
