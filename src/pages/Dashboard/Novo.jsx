import { Link } from "react-router-dom";
import {
  UserPlusIcon,
  BuildingOffice2Icon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ReceiptRefundIcon,
  BanknotesIcon,
  ClipboardDocumentListIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

const ATALHOS = [
  {
    id: "novo-cliente",
    titulo: "Novo cliente",
    descricao: "Criar e gerir clientes no módulo Terceiros.",
    rota: "/Dashboard/Terceiros/Clientes",
    icone: UserPlusIcon,
    grupo: "Terceiros",
  },
  {
    id: "novo-fornecedor",
    titulo: "Novo fornecedor",
    descricao: "Registar fornecedores e parceiros.",
    rota: "/Dashboard/Terceiros/Fornecedores",
    icone: BuildingOffice2Icon,
    grupo: "Terceiros",
  },
  {
    id: "nova-cotacao",
    titulo: "Nova cotação",
    descricao: "Emitir propostas comerciais para clientes.",
    rota: "/Dashboard/Vendas/Cotacoes",
    icone: DocumentTextIcon,
    grupo: "Vendas",
  },
  {
    id: "nova-factura",
    titulo: "Nova factura",
    descricao: "Criar facturas a partir de vendas ou serviços.",
    rota: "/Dashboard/Vendas/Facturas",
    icone: CurrencyDollarIcon,
    grupo: "Vendas",
  },
  {
    id: "novo-recibo",
    titulo: "Novo recibo",
    descricao: "Registar pagamentos recebidos de clientes.",
    rota: "/Dashboard/Vendas/Recibos",
    icone: ReceiptRefundIcon,
    grupo: "Vendas",
  },
  {
    id: "nova-despesa",
    titulo: "Nova despesa",
    descricao: "Lançar despesas e custos operacionais.",
    rota: "/Dashboard/Despesas",
    icone: BanknotesIcon,
    grupo: "Despesas",
  },
  {
    id: "nova-ordem",
    titulo: "Nova ordem / tarefa",
    descricao: "Registar ordens de serviço ou actividades internas.",
    rota: "/Dashboard/Ordens",
    icone: ClipboardDocumentListIcon,
    grupo: "Ordens",
  },
  {
    id: "novo-contrato",
    titulo: "Novo contrato / documento",
    descricao: "Gerir contratos e documentação jurídica.",
    rota: "/Dashboard/Contratos-Documentos",
    icone: DocumentDuplicateIcon,
    grupo: "Contratos",
  },
];

function Novo({ temaAtual = "dark" }) {
  const isDark = temaAtual === "dark";

  const container =
    "min-h-[calc(100vh-5rem)] px-4 sm:px-6 py-6 sm:py-8";
  const heading = isDark ? "text-slate-50" : "text-slate-900";
  const muted = isDark ? "text-slate-300" : "text-slate-600";
  const cardBase =
    "flex flex-col justify-between rounded-xl border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md";
  const card = isDark
    ? `${cardBase} border-slate-800 bg-slate-900/80`
    : `${cardBase} border-slate-200 bg-white`;
  const badgeBase =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium";
  const badge = isDark
    ? `${badgeBase} bg-slate-800 text-slate-200 border border-slate-700`
    : `${badgeBase} bg-sky-50 text-sky-800 border border-sky-100`;
  const button =
    "inline-flex items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors";

  return (
    <div className={container}>
      {/* Cabeçalho */}
      <div className="max-w-4xl mb-6 space-y-1">
        <h1 className={`text-xl sm:text-2xl font-semibold ${heading}`}>
          Criar novo registo
        </h1>
        <p className={`text-xs sm:text-sm ${muted}`}>
          Utilize estes atalhos para aceder rapidamente às principais acções do
          AfricaLegalERP (clientes, vendas, despesas, contratos, etc.).
        </p>
      </div>

      {/* Grid de atalhos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {ATALHOS.map((item) => {
          const Icon = item.icone;
          return (
            <div key={item.id} className={card}>
              <div className="p-4 sm:p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className={badge}>{item.grupo}</div>
                    </div>
                    <h2
                      className={
                        "text-sm sm:text-base font-semibold " + heading
                      }
                    >
                      {item.titulo}
                    </h2>
                    <p className={"text-[11px] sm:text-xs " + muted}>
                      {item.descricao}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={
                  "px-4 sm:px-5 py-3 border-t flex items-center justify-between text-[11px] sm:text-xs " +
                  (isDark ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-500")
                }
              >
                <span>Atalho directo para o módulo correspondente.</span>
                <Link
                  to={item.rota}
                  className={
                    button +
                    " " +
                    (isDark
                      ? "bg-sky-600 hover:bg-sky-500 text-white"
                      : "bg-sky-600 hover:bg-sky-500 text-white")
                  }
                >
                  Ir para módulo
                  <span className="text-[13px]">→</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Novo;
