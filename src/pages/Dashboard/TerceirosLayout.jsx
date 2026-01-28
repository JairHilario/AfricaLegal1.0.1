import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

const TerceirosLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-[calc(100vh-5rem)] px-6 pb-6 pt-6">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-1">Terceiros</h2>
        <p className="text-sm opacity-70">Gestão de clientes e fornecedores da Africa Legal.</p>
      </div>

      {/* Abas */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-1 mb-6">
        <div className="flex bg-transparent/50 rounded-xl overflow-hidden">
          <Link
            to="/dashboard/terceiros"
            className={`flex-1 px-6 py-3 text-sm font-medium transition-all ${
              location.pathname === "/dashboard/terceiros" || location.pathname.includes("clientes")
                ? "bg-red-600/90 text-white shadow-lg"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            Clientes
          </Link>
          <Link
            to="/dashboard/terceiros/fornecedores"
            className={`flex-1 px-6 py-3 text-sm font-medium transition-all ${
              location.pathname.includes("fornecedores")
                ? "bg-red-600/90 text-white shadow-lg"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            Fornecedores
          </Link>
        </div>
      </div>

      <Outlet /> {/* Carrega Clientes ou Fornecedores */}
    </div>
  );
};

export default TerceirosLayout;
