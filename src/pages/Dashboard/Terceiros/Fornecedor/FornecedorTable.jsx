import React, { useState } from "react";

const formatDate = (iso) => {
  if (!iso) return "";
  const onlyDate = String(iso).split("T")[0];
  const [y, m, d] = onlyDate.split("-");
  return `${d}/${m}/${y}`;
};

function FornecedorTable({ fornecedores, temaAtual = "light" }) {
  const [selectedFornecedor, setSelectedFornecedor] = useState(null);
  const [activeTab, setActiveTab] = useState("perfil");

  const isDark = temaAtual === "dark";

  if (!Array.isArray(fornecedores)) {
    return (
      <div
        className={
          "mb-4 rounded-md border p-3 text-sm " +
          (isDark
            ? "border-rose-700 bg-rose-900/30 text-rose-200"
            : "border-rose-200 bg-rose-50 text-rose-700")
        }
      >
        Erro: lista de fornecedores não está disponível.
      </div>
    );
  }

  // ---------- VISTA DETALHE + ABAS ----------
  if (selectedFornecedor) {
    return (
      <div
        className={
          "mb-4 rounded-md border md:p-6 p-4 shadow-sm " +
          (isDark
            ? "border-slate-800 bg-slate-900 text-slate-100"
            : "border-sky-100 bg-white text-slate-800")
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
            {[{ id: "perfil", label: "Perfil" }].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
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
            onClick={() => {
              setSelectedFornecedor(null);
              setActiveTab("perfil");
            }}
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
          {selectedFornecedor.nome}
        </h2>

        {/* ABA PERFIL */}
        {activeTab === "perfil" && (
          <>
            <form className="grid gap-4 md:grid-cols-2 text-sm">
              const labelEdit =
              "block text-xs font-medium mb-1 " +
              (isDark ? "text-slate-300" : "text-slate-700");
              const inputEdit =
              "w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-300 " +
              (isDark
              ? "border-slate-700 bg-slate-800 text-slate-100"
              : "border-sky-100 bg-sky-50 text-slate-900");
              const inputReadonly =
              "w-full rounded-md border px-3 py-2 text-sm cursor-not-allowed " +
              (isDark
              ? "border-slate-700 bg-slate-800 text-slate-400"
              : "border-sky-100 bg-slate-50 text-slate-700");

              <div>
                <label className={labelEdit}>Nome do Fornecedor</label>
                <input
                  type="text"
                  defaultValue={selectedFornecedor.nome}
                  className={inputEdit}
                />
              </div>

              <div>
                <label className={labelEdit}>Empresa</label>
                <input
                  type="text"
                  defaultValue={selectedFornecedor.empresa || ""}
                  className={inputEdit}
                />
              </div>

              <div>
                <label className={labelEdit}>E-mail</label>
                <input
                  type="email"
                  defaultValue={selectedFornecedor.email}
                  className={inputEdit}
                />
              </div>

              <div>
                <label className={labelEdit}>Telefone</label>
                <input
                  type="text"
                  defaultValue={selectedFornecedor.telefone}
                  className={inputEdit}
                />
              </div>

              <div>
                <label className={labelEdit}>NUIT</label>
                <input
                  type="text"
                  defaultValue={selectedFornecedor.nuit || ""}
                  className={inputEdit}
                />
              </div>

              <div>
                <label className={labelEdit}>Cidade</label>
                <input
                  type="text"
                  defaultValue={selectedFornecedor.cidade || ""}
                  className={inputEdit}
                />
              </div>

              <div>
                <label className={labelEdit}>Província</label>
                <input
                  type="text"
                  defaultValue={selectedFornecedor.provincia || ""}
                  className={inputEdit}
                />
              </div>

              <div>
                <label className={labelEdit}>Saldo (MZN)</label>
                <input
                  type="text"
                  defaultValue={Number(
                    selectedFornecedor.saldo || 0
                  ).toLocaleString("pt-PT", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  className={inputReadonly}
                  readOnly
                />
              </div>

              <div>
                <label className={labelEdit}>Estado</label>
                <select
                  defaultValue={selectedFornecedor.status || "Ativo"}
                  className={inputEdit}
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                  <option value="Pendente">Pendente</option>
                </select>
              </div>
            </form>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className={
                  "rounded-md px-4 py-2 text-sm " +
                  (isDark
                    ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200")
                }
              >
                Cancelar
              </button>
              <button className="rounded-md bg-emerald-500 px-4 py-2 text-sm text-white hover:bg-emerald-400">
                Guardar
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // ---------- LISTA ----------
  const headCell =
    "px-4 py-2 text-left text-xs font-semibold " +
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
      ? "bg-amber-900/30 text-amber-300 border-amber-700"
      : "bg-amber-50 text-amber-700 border-amber-200");

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
            <th className={headCell}>Nome</th>
            <th className={headCell}>Empresa</th>
            <th className={headCell}>Email</th>
            <th className={headCell}>Telefone</th>
            <th className={headCell}>NUIT</th>
            <th className={headCell}>Saldo (MZN)</th>
            <th className={headCell}>Estado</th>
            <th className={headCell}>Criado em</th>
            <th className={headCell}>Ações</th>
          </tr>
        </thead>
        <tbody
          className={
            isDark
              ? "divide-y divide-slate-800"
              : "divide-y divide-slate-100"
          }
        >
          {fornecedores.map((f) => (
            <tr key={f.id} className={rowBase}>
              <td
                className="px-4 py-2 cursor-pointer"
                onClick={() => setSelectedFornecedor(f)}
              >
                {f.nome}
              </td>
              <td
                className={
                  "px-4 py-2 " +
                  (isDark ? "text-slate-300" : "text-slate-700")
                }
              >
                {f.empresa}
              </td>
              <td
                className={
                  "px-4 py-2 " +
                  (isDark ? "text-slate-300" : "text-slate-700")
                }
              >
                {f.email}
              </td>
              <td
                className={
                  "px-4 py-2 " +
                  (isDark ? "text-slate-300" : "text-slate-700")
                }
              >
                {f.telefone}
              </td>
              <td
                className={
                  "px-4 py-2 " +
                  (isDark ? "text-slate-300" : "text-slate-700")
                }
              >
                {f.nuit}
              </td>
              <td
                className={
                  "px-4 py-2 font-medium " +
                  ((f.saldo || 0) < 0
                    ? "text-rose-500"
                    : "text-emerald-500")
                }
              >
                {Number(f.saldo || 0).toFixed(2)}
              </td>
              <td className="px-4 py-2">
                <span className={chipStatus(f.status || "Ativo")}>
                  {f.status || "Ativo"}
                </span>
              </td>
              <td
                className={
                  "px-4 py-2 " +
                  (isDark ? "text-slate-400" : "text-slate-600")
                }
              >
                {formatDate(f.criadoEm)}
              </td>
              <td className="px-4 py-2">
                <button
                  type="button"
                  onClick={() => setSelectedFornecedor(f)}
                  className={
                    "rounded-md px-3 py-1 text-[11px] font-medium " +
                    (isDark
                      ? "bg-sky-600 text-white hover:bg-sky-500"
                      : "bg-sky-500 text-white hover:bg-sky-400")
                  }
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}

          {fornecedores.length === 0 && (
            <tr>
              <td
                colSpan={9}
                className={
                  "px-4 py-4 text-center text-xs " +
                  (isDark ? "text-slate-500" : "text-slate-500")
                }
              >
                Nenhum fornecedor encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default FornecedorTable;
