import React from "react";
import {
  DocumentTextIcon,
  DocumentDuplicateIcon,
  ReceiptRefundIcon,
  CreditCardIcon,
  ReceiptPercentIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  BanknotesIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { Link, Outlet, useLocation } from "react-router-dom";

const vendasItems = [
  { label: "Cotações", icon: DocumentTextIcon, path: "/Dashboard/Vendas/Cotacoes" },
  { label: "Facturas", icon: DocumentDuplicateIcon, path: "/Dashboard/Vendas/Facturas" },
  { label: "VDs", icon: ReceiptRefundIcon, path: "/Dashboard/Vendas/Vds" },
  { label: "POS", icon: CreditCardIcon, path: "/Dashboard/Vendas/Pos" },
  { label: "Recibos", icon: ReceiptPercentIcon, path: "/Dashboard/Vendas/Recibos" },
  { label: "Crédito", icon: ArrowUturnLeftIcon, path: "/Dashboard/Vendas/Credito" },
  { label: "Débito", icon: ArrowUturnRightIcon, path: "/Dashboard/Vendas/Debito" },
  { label: "Caixa", icon: BanknotesIcon, path: "/Dashboard/Vendas/Caixa" },
  { label: "Entrega", icon: TruckIcon, path: "/Dashboard/Vendas/Entrega" },
  { label: "Transporte", icon: TruckIcon, path: "/Dashboard/Vendas/Transporte" },
];

function Vendas() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-transparent dark:bg-slate-950">
      <div className="min-h-[400px] flex flex-col gap-4">
        {/* NAV HORIZONTAL */}
        <nav className="border-b border-slate-200 dark:border-slate-800">
          <ul className="flex flex-wrap text-[11px] md:text-xs text-slate-900 dark:text-slate-100">
            {vendasItems.map(({ label, icon: Icon, path }) => {
              const isRootVendas =
                pathname === "/Dashboard/Vendas" ||
                pathname === "/Dashboard/Vendas/";
              const isCotacoesPath = path === "/Dashboard/Vendas/Cotacoes";

              const active =
                (isRootVendas && isCotacoesPath) ||
                pathname === path ||
                pathname.startsWith(`${path}/`);

              return (
                <li key={label} className="flex-1 min-w-[110px]">
                  <Link
                    to={path}
                    className={[
                      "inline-flex w-full justify-center items-center gap-1.5 px-3 py-1.5 border text-xs font-medium transition",
                      active
                        ? "bg-sky-50 border-sky-300 text-sky-700 dark:bg-sky-900/40 dark:border-sky-500 dark:text-sky-200"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-sky-50 hover:border-sky-200 hover:text-slate-800 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-slate-600 dark:hover:text-slate-50",
                    ].join(" ")}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="truncate">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* CONTEÚDO */}
        <main className="flex-1 space-y-4 text-slate-900 dark:text-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Vendas;
