import {
  HomeIcon,
  UsersIcon,
  CubeIcon,
  ShoppingBagIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";

const Sidebar = ({ colapsado = false, temaAtual }) => {
  const location = useLocation();
  const isDark = temaAtual === "dark";

  const auth = JSON.parse(localStorage.getItem("africaLegalUser") || "null");
  const userSalvo = auth?.user || null;

  const displayName =
    localStorage.getItem("displayName") || userSalvo?.username || null;

  const avatarKey = userSalvo?.username ? `avatar:${userSalvo.username}` : null;
  const avatar = avatarKey ? localStorage.getItem(avatarKey) : null;

  const cargo = mapRole(userSalvo?.role) || "Cargo será mostrado aqui";

  function mapRole(role) {
    const map = {
      admin: "Administrador",
      gestor: "Gestor",
      utilizador: "Utilizador",
    };
    return map[role] || "";
  }

  const isActive = (path, { exact = false } = {}) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const baseItem =
    "group flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";

  const activeItem = isDark
    ? "bg-sky-600 text-white shadow-md"
    : "bg-sky-500 text-white shadow-md";

  const hoverItem = isDark
    ? "hover:bg-slate-800 text-slate-200"
    : "hover:bg-sky-50 text-slate-700";

  const sectionLabel = isDark ? "text-slate-400" : "text-slate-500";

  const perfilContainerBase =
    "group w-full px-2 py-3 rounded-md cursor-pointer transition-all duration-200 flex items-center border";
  const perfilContainer = clsx(
    perfilContainerBase,
    isDark
      ? "bg-slate-900 border-slate-700 hover:bg-slate-800"
      : "bg-slate-50 border-slate-200 hover:bg-slate-100",
    colapsado ? "justify-center" : "justify-start gap-3",
    isActive("/dashboard/perfil") &&
      (isDark
        ? "border-sky-500 shadow-sm"
        : "border-sky-400 shadow-sm")
  );

  const avatarBg = isDark ? "bg-slate-800" : "bg-sky-100";
  const avatarIconColor = isDark ? "text-sky-400" : "text-sky-600";

  return (
    <aside
      className={clsx(
        "h-screen transition-all duration-300 flex flex-col border-r",
        colapsado ? "w-20" : "w-64",
        isDark
          ? "bg-slate-950 text-slate-100 border-slate-800"
          : "bg-white text-slate-900 border-slate-200"
      )}
    >
      {/* Header */}
      <div
        className={clsx(
          "flex items-center px-4 h-16 flex-shrink-0 border-b",
          isDark ? "border-slate-800" : "border-slate-200/70"
        )}
      >
        <Link
          to="/dashboard"
          className={clsx(
            "flex items-center gap-3 w-full",
            colapsado && "justify-center"
          )}
        >
          <div
            className={clsx(
              "h-9 w-9 rounded-md flex items-center justify-center overflow-hidden",
              isDark ? "bg-slate-100" : "bg-slate-900"
            )}
          >
            <img
              src="/src/assets/logo.Al.png"
              alt="Africa Legal"
              className="h-7 w-7 object-contain"
            />
          </div>

          <div
            className={clsx(
              "flex flex-col transition-all duration-200 overflow-hidden",
              colapsado ? "opacity-0 w-0" : "opacity-100 w-auto"
            )}
          >
            <span className="text-sm font-semibold tracking-wide">
              AFRICA LEGAL
            </span>
            <span
              className={clsx(
                "text-[11px]",
                isDark ? "text-slate-400" : "text-slate-500"
              )}
            >
              ERP Jurídico
            </span>
          </div>
        </Link>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col justify-between px-2">
        <div className="space-y-2 py-2">
          {/* Dashboard */}
          <Link
            to="/Dashboard"
            className={clsx(
              baseItem,
              isActive("/Dashboard", { exact: true }) ? activeItem : hoverItem
            )}
          >
            <HomeIcon className="h-5 w-5 flex-shrink-0" />
            <span
              className={clsx(
                "ml-3 transition-all duration-200 overflow-hidden whitespace-nowrap",
                colapsado ? "opacity-0 w-0" : "opacity-100 w-auto"
              )}
            >
              Dashboard
            </span>
          </Link>

          {/* Menus */}
          {menuSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div
                className={clsx(
                  "px-1 transition-all duration-200 overflow-hidden",
                  colapsado ? "opacity-0 h-0" : "opacity-100 h-auto"
                )}
              >
                <p
                  className={clsx(
                    "text-xs font-semibold uppercase tracking-wide",
                    sectionLabel
                  )}
                >
                  {section.title}
                </p>
              </div>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    to={item.path}
                    key={item.id}
                    className={clsx(
                      baseItem,
                      isActive(item.path) ? activeItem : hoverItem
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span
                      className={clsx(
                        "ml-3 transition-all duration-200 overflow-hidden whitespace-nowrap",
                        colapsado ? "opacity-0 w-0" : "opacity-100 w-auto"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Relatórios / Análises */}
          <div className="space-y-1">
            <Link
              to="/Dashboard/Relatorios"
              className={clsx(
                baseItem,
                isActive("/Dashboard/Relatorios") ? activeItem : hoverItem
              )}
            >
              <ChartBarIcon className="h-5 w-5 flex-shrink-0" />
              <span
                className={clsx(
                  "ml-3 transition-all duration-200 overflow-hidden whitespace-nowrap",
                  colapsado ? "opacity-0 w-0" : "opacity-100 w-auto"
                )}
              >
                Relatórios
              </span>
            </Link>
            <Link
              to="/Dashboard/Analises"
              className={clsx(
                baseItem,
                isActive("/Dashboard/Analises") ? activeItem : hoverItem
              )}
            >
              <ArrowTrendingUpIcon className="h-5 w-5 flex-shrink-0" />
              <span
                className={clsx(
                  "ml-3 transition-all duration-200 overflow-hidden whitespace-nowrap",
                  colapsado ? "opacity-0 w-0" : "opacity-100 w-auto"
                )}
              >
                Análises
              </span>
            </Link>
          </div>
        </div>

        {/* Perfil */}
        <div
          className={clsx(
            "flex-shrink-0 pt-3 pb-4 px-1 border-t",
            isDark ? "border-slate-800" : "border-slate-200"
          )}
        >
          <Link to="/Dashboard/Perfil" className={perfilContainer}>
            <div
              className={clsx(
                "h-9 w-9 rounded-md overflow-hidden flex items-center justify-center",
                avatarBg
              )}
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserCircleIcon
                  className={clsx(
                    "h-8 w-8 flex-shrink-0",
                    avatarIconColor
                  )}
                />
              )}
            </div>
            <div
              className={clsx(
                "transition-all duration-200 overflow-hidden whitespace-nowrap",
                colapsado ? "opacity-0 w-0 ml-0" : "opacity-100 w-auto ml-2"
              )}
            >
              <span className="text-sm font-semibold block">
                {displayName || "Perfil do utilizador"}
              </span>
              <span className="text-xs opacity-80 block">{cargo}</span>
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
};

const menuSections = [
  {
    title: "Menus",
    items: [
      {
        id: 1,
        label: "Terceiros",
        icon: UsersIcon,
        path: "/Dashboard/Terceiros",
      },
      { id: 2, label: "Stock", icon: CubeIcon, path: "/dashboard/stock" },
      {
        id: 3,
        label: "Vendas",
        icon: ShoppingBagIcon,
        path: "/Dashboard/Vendas",
      },
      {
        id: 4,
        label: "Tesouraria",
        icon: BanknotesIcon,
        path: "/Dashboard/Tesouraria",
      },
      {
        id: 5,
        label: "Despesas",
        icon: ReceiptPercentIcon,
        path: "/Dashboard/Despesas",
      },
      {
        id: 6,
        label: "Ordens de Compra",
        icon: ClipboardDocumentListIcon,
        path: "/Dashboard/Ordens",
      },
      {
        id: 7,
        label: "Contratos & Docs",
        icon: ClipboardDocumentListIcon,
        path: "/Dashboard/Contratos-Documentos",
      },
    ],
  },
];

export default Sidebar;
