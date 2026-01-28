import React from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";

function TerceirosLayout({ temaAtual = "light" }) {
  const isDark = temaAtual === "dark";
  const { pathname } = useLocation();

  const pageBg = isDark
    ? "min-h-[calc(100vh-5rem)] bg-slate-950 text-slate-100"
    : "min-h-[calc(100vh-5rem)] bg-transparent text-slate-900";

  const borderTabs = isDark ? "border-slate-800" : "border-sky-100";

  const tabBase =
    "inline-flex w-full justify-center items-center gap-1.5 px-3 py-2 border text-xs md:text-sm font-medium transition";

  const activeTab = isDark
    ? "bg-sky-900/40 border-sky-500 text-sky-200"
    : "bg-sky-50 border-sky-300 text-sky-700";

  const inactiveTab = isDark
    ? "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600 hover:text-slate-50"
    : "bg-white border-slate-200 text-slate-600 hover:bg-sky-50 hover:border-sky-200 hover:text-slate-800";

  return (
    <div className={pageBg}>
      {/* TABS FULL-WIDTH */}
      <div className={`border-b ${borderTabs}`}>
        <nav className="flex flex-wrap text-[11px] md:text-xs">
          <div className="flex-1 min-w-[120px]">
            <NavLink
              to="clientes"
              className={({ isActive }) =>
                [
                  tabBase,
                  isActive || pathname.endsWith("/Terceiros") ? activeTab : inactiveTab,
                ].join(" ")
              }
              end
            >
              <span className="truncate">Clientes</span>
            </NavLink>
          </div>

          <div className="flex-1 min-w-[120px]">
            <NavLink
              to="fornecedores"
              className={({ isActive }) =>
                [tabBase, isActive ? activeTab : inactiveTab].join(" ")
              }
            >
              <span className="truncate">Fornecedores</span>
            </NavLink>
          </div>
        </nav>
      </div>

      {/* CONTEÚDO */}
      <div className="p-1">
        <Outlet />
      </div>
    </div>
  );
}

export default TerceirosLayout;
