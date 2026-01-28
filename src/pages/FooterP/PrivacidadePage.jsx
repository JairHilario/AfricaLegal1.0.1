// Pages/PrivacidadePage.jsx
export default function PrivacidadePage({ temaAtual = "light" }) {
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
          Política de privacidade e dados
        </h1>
        <p className={`text-xs sm:text-sm ${muted}`}>
          Como os dados inseridos no AfricaLegalERP são tratados e protegidos no
          contexto interno da Africa Legal IP &amp; Consulting.
        </p>
      </div>

      {/* Conteúdo */}
      <div className={card}>
        <div className="p-4 sm:p-5 space-y-4">
          <section className="space-y-1.5">
            <h2 className={sectionTitle}>1. Tipo de dados tratados</h2>
            <p className={text}>
              O sistema armazena dados de clientes, fornecedores, documentos de
              faturação, processos, contratos e registos internos operacionais.
              Os dados destinam-se exclusivamente às actividades profissionais
              da Africa Legal IP &amp; Consulting.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className={sectionTitle}>2. Acesso e perfis de utilizador</h2>
            <p className={text}>
              O acesso aos dados é controlado por perfis de utilizador
              (Administrador, Gestor, Utilizador). Cada perfil tem permissões
              específicas, definidas pela gestão interna, de forma a limitar
              o acesso apenas ao que é necessário.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className={sectionTitle}>3. Confidencialidade</h2>
            <ul className={`list-disc list-inside space-y-1 ${text}`}>
              <li>
                É proibida a partilha de informação obtida no sistema com
                terceiros não autorizados.
              </li>
              <li>
                Os utilizadores devem evitar exportar dados para dispositivos
                pessoais sem autorização.
              </li>
              <li>
                Qualquer incidente de segurança deve ser reportado ao
                administrador.
              </li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h2 className={sectionTitle}>4. Registo e retenção</h2>
            <p className={text}>
              Os dados são mantidos enquanto forem necessários para fins legais
              e operacionais da Africa Legal. Registos antigos podem ser
              arquivados ou anonimizados conforme decisão da gestão.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className={sectionTitle}>5. Segurança técnica</h2>
            <p className={text}>
              O acesso ao sistema é feito por credenciais individuais e pode ser
              complementado por outras medidas internas de segurança (como
              restrições de rede, backups e auditoria de acessos).
            </p>
          </section>

          <p
            className={`${text} pt-2 border-t ${
              isDark ? "border-slate-800" : "border-slate-200"
            }`}
          >
            Ao utilizar o AfricaLegalERP, o utilizador concorda com estas regras
            internas de privacidade e compromete-se a proteger a informação à
            qual tem acesso.
          </p>
        </div>
      </div>
    </div>
  );
}
