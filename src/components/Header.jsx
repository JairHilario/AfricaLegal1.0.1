import { Link } from "react-router-dom";

const Header = ({ onToggleSidebar, temaAtual, trocarTema, temas }) => {
  const handleLogout = () => {
    localStorage.removeItem("africaLegalUser");
    window.location.href = "/login";
  };

  const trocarTemaPrincipal = () => {
    // Aqui inverte: se for dark → light; se for light → dark
    trocarTema(temaAtual === "light" ? "dark" : "light");
  };

  const isDark = temaAtual === "dark"; // dark é o padrão

  const headerBase =
    "px-6 py-1.5 flex justify-between items-center shadow-md border-b";
  const headerClasses = isDark
    ? "bg-slate-900 text-slate-100 border-slate-800"
    : "bg-sky-100 text-slate-900 border-sky-200";

  const cardBg = isDark ? "bg-slate-800 text-slate-100" : "bg-white text-slate-900";
  const cardSoftBg = isDark ? "bg-slate-800/80" : "bg-white/80";
  const btnPrimary = isDark
    ? "bg-sky-500 text-white hover:bg-sky-400"
    : "bg-sky-500 text-white hover:bg-sky-400";
  const iconBtn =
    "inline-flex items-center justify-center h-9 w-9 rounded-md border transition-all shadow-sm";
  const iconBtnBg = isDark
    ? "bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-700 hover:text-white"
    : "bg-white border-sky-200 text-slate-700 hover:bg-sky-50 hover:text-sky-700";
  const simpleIconBtn = isDark
    ? "bg-slate-800 text-slate-100 hover:bg-slate-700"
    : "bg-white text-slate-700 hover:bg-sky-50";

  const inputWrapper = isDark
    ? "w-full max-w-md relative bg-slate-800 rounded-md shadow-sm"
    : "w-full max-w-md relative bg-white rounded-md shadow-sm";
  const inputClasses = isDark
    ? "w-full bg-transparent rounded-md pl-10 pr-4 py-2 text-sm placeholder-slate-400 focus:outline-none text-slate-100"
    : "w-full bg-transparent rounded-md pl-10 pr-4 py-2 text-sm placeholder-slate-400 focus:outline-none text-slate-900";
  const searchIconColor = isDark ? "text-slate-300" : "text-slate-500";

  const logoutBtn = isDark
    ? "bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium px-4 py-2 rounded-md shadow-md transition-all"
    : "bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium px-4 py-2 rounded-md shadow-md transition-all";

  const sunIconColor = isDark ? "text-yellow-300" : "text-sky-600";

  return (
    <header className={`${headerBase} ${headerClasses}`}>
      {/* Esquerda: menu + logo + título */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className={`p-2 rounded-md ${simpleIconBtn}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div className="flex items-center gap-3">
          <div
            className={`rounded-md p-1 transition-transform duration-200 hover:scale-105 ${
              isDark ? "bg-slate-800" : "bg-white"
            }`}
          >
            <img
              src="/logo.Al.png"
              alt="Africa Legal"
              className="h-10 w-auto object-contain drop-shadow-sm"
            />
          </div>
          <div className={`leading-tight rounded-md px-3 py-1 ${cardSoftBg}`}>
            <h1 className="text-lg font-semibold tracking-wide">
              Africa Legal · Painel
            </h1>
            <p className="text-[11px] uppercase tracking-[0.18em] text-sky-600">
              IP &amp; Consulting
            </p>
          </div>
        </div>
      </div>

      {/* Centro: busca */}
      <div className="hidden md:flex flex-1 justify-center px-6">
        <div className={inputWrapper}>
          <input
            type="text"
            placeholder="Buscar clientes, ativos de PI ou contratos…"
            className={inputClasses}
          />
          <span className="absolute inset-y-0 left-3 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ${searchIconColor}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Direita: ações */}
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard/novo"
          className={`inline-flex items-center justify-center h-9 w-9 rounded-md text-lg font-bold transition-all shadow-md ${btnPrimary}`}
          title="Novo registo"
        >
          +
        </Link>

        <Link
          to="/dashboard/notificacoes"
          className={`relative p-2 rounded-md transition-all ${simpleIconBtn}`}
          title="Notificações"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.4-1.4A2 2 0 0118 14.172V11a6 6 0 10-12 0v3.172a2 2 0 01-.586 1.414L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-sky-500" />
        </Link>

        <button
          onClick={trocarTemaPrincipal}
          aria-label="Próximo tema principal"
          className={`${iconBtn} ${iconBtnBg}`}
          title={`Próximo: ${temas[temaAtual]?.nome ?? ""}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${sunIconColor}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </button>

        <Link
          to="/dashboard/configuracoes"
          aria-label="Configurações"
          className={`${iconBtn} ${iconBtnBg}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.757.426 1.757 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.757-2.924 1.757-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.757-.426-1.757-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.573-1.066z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </Link>

        <button onClick={handleLogout} className={logoutBtn}>
          Sair
        </button>
      </div>
    </header>
  );
};

export default Header;
