// Components/FooterBar.jsx
import React, { useState } from "react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export default function FooterBar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <footer
      className={`
        border-t text-xs transition-all duration-300
        ${expanded ? "bg-sky-100" : "bg-sky-50"}
        text-slate-800 border-sky-200
        dark:border-slate-800
        ${expanded ? "dark:bg-slate-900" : "dark:bg-slate-950"}
        dark:text-slate-200
      `}
    >
      {/* Barra clicável */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2 cursor-pointer select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-300 dark:focus-visible:ring-sky-500"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2">
          {/* Logo suave */}
          <img
            src="/logo.Al.png"
            alt="Africa Legal"
            className="h-4 opacity-60 dark:opacity-50"
          />
          <span className="text-[11px] md:text-xs">
            © 2025 Africa Legal — Todos os direitos reservados
          </span>
        </div>
        {expanded ? (
          <ChevronDownIcon className="w-4 h-4 opacity-80" />
        ) : (
          <ChevronUpIcon className="w-4 h-4 opacity-80" />
        )}
      </button>

      {/* Conteúdo expandido */}
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="px-4 pb-4 text-[11px] text-left space-y-3 bg-white border-t border-sky-200 dark:bg-slate-900 dark:border-slate-800">
          <div className="pt-3 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            {/* Coluna: Links úteis */}
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
                Links úteis
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                <li>
                  <Link
                    to="/Dashboard/Feedback"
                    className="hover:underline text-sky-700 dark:text-sky-400"
                  >
                    Enviar feedback sobre o sistema
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Dashboard/Ajuda"
                    className="hover:underline text-sky-700 dark:text-sky-400"
                  >
                    Centro de ajuda e suporte técnico
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Dashboard/Termos"
                    className="hover:underline text-sky-700 dark:text-sky-400"
                  >
                    Termos de uso da plataforma
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Dashboard/Privacidade"
                    className="hover:underline text-sky-700 dark:text-sky-400"
                  >
                    Política de privacidade e dados
                  </Link>
                </li>
              </ul>
            </div>

            {/* Coluna: Sobre o sistema */}
            <div className="max-w-xs">
              <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
                Sobre o AfricaLegalERP
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Sistema interno para gestão de clientes, faturação, processos e
                despesas, desenvolvido para optimizar o fluxo de trabalho da
                Africa Legal IP &amp; Consulting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
