// Pages/TermosPage.jsx
export default function TermosPage({ temaAtual = "light" }) {
  const isDark = temaAtual === "dark";

  const container = "max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6";
  const card = isDark
    ? "rounded-xl border border-slate-700 bg-slate-900/70 shadow-lg backdrop-blur"
    : "rounded-xl border border-slate-200 bg-white shadow-sm";
  const heading = isDark ? "text-slate-50" : "text-slate-900";
  const muted = isDark ? "text-slate-300" : "text-slate-600";
  const sectionTitle =
    "text-sm font-semibold " + (isDark ? "text-slate-100" : "text-slate-800");
  const text = "text-xs sm:text-[13px] leading-relaxed " + muted;

  return (
    <div className={container}>
      {/* Cabeçalho */}
      <div className="space-y-1">
        <h1 className={`text-xl sm:text-2xl font-semibold ${heading}`}>
          Termos de uso da plataforma
        </h1>
        <p className={`text-xs sm:text-sm ${muted}`}>
          Regras básicas para utilização do AfricaLegalERP pela equipa interna
          da Africa Legal IP &amp; Consulting.
        </p>
      </div>

      {/* Conteúdo */}
      <div className={card}>
        <div className="p-4 sm:p-5 space-y-4">
          <section className="space-y-1.5">
            <h2 className={sectionTitle}>1. Objectivo do sistema</h2>
            <p className={text}>
              O AfricaLegalERP é uma ferramenta interna destinada à gestão de
              clientes, faturação, processos, contratos e despesas da Africa
              Legal IP &amp; Consulting. O acesso é restrito a utilizadores
              autorizados.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className={sectionTitle}>2. Credenciais e acesso</h2>
            <ul className={`list-disc list-inside space-y-1 ${text}`}>
              <li>Cada utilizador é responsável pela confidencialidade da sua senha.</li>
              <li>É proibida a partilha de contas ou credenciais entre utilizadores.</li>
              <li>Qualquer suspeita de acesso indevido deve ser comunicada ao administrador.</li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h2 className={sectionTitle}>3. Dados de clientes</h2>
            <p className={text}>
              Os dados registados no sistema são confidenciais e devem ser usados
              apenas para fins profissionais relacionados às actividades da
              Africa Legal. É proibida a exportação ou partilha não autorizada
              de informação com terceiros.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className={sectionTitle}>4. Registo de operações</h2>
            <p className={text}>
              Acções relevantes (como criação de documentos, alterações e
              acessos) podem ser registadas para efeitos de auditoria e
              segurança. O uso do sistema implica concordância com esse
              registo.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className={sectionTitle}>5. Suporte e contacto</h2>
            <p className={text}>
              Em caso de dúvidas, erros ou necessidade de alteração de permissões,
              contacte a equipa responsável pelo sistema ou o administrador
              interno designado.
            </p>
          </section>

          <p className={`${text} pt-2 border-t ${isDark ? "border-slate-800" : "border-slate-200"}`}>
            A utilização contínua do AfricaLegalERP significa que concorda com
            estes termos internos de utilização.
          </p>
        </div>
      </div>
    </div>
  );
}
