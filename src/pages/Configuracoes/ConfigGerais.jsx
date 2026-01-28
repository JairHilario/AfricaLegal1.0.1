// src/pages/configuracoes/ConfigGerais.jsx

const TEXTOS = {
  pt: {
    aparenciaTitulo: "Aparência do painel",
    aparenciaDesc:
      "Controle o tema principal e o contraste do painel Africa Legal.",
    temaPrincipal: "Tema principal",
    temaAtualLabel: "Tema atual",
    altoContraste: "Modo de alto contraste",
    altoContrasteDesc:
      "Facilita a leitura em ambientes com muita luz.",
    notificacoesTitulo: "Notificações",
    notificacoesDesc:
      "Defina quais eventos do sistema devem gerar alertas.",
    alertaFatura: "Alertas de faturas vencidas",
    alertaFaturaDesc:
      "Receba um aviso quando uma fatura ultrapassar a data de vencimento.",
    prazosTitulo: "Prazos de processos",
    prazosDesc:
      "Lembretes diários dos processos com prazo no dia.",
    relatorioTitulo: "Relatório semanal por email",
    relatorioDesc:
      "Resumo automático de ganhos, despesas e inadimplência.",
    perfilTitulo: "Perfil do utilizador",
    perfilNome: "Africa Legal – Admin",
    perfilEmail: "admin@africalegal.com",
    perfilBotao: "Gerir dados do perfil",
    segurancaTitulo: "Segurança da conta",
    sessao1: "Autenticação por senha ativa",
    sessao2: "Sessões inativas expiram após 30 minutos",
    sessao3: "Último acesso: hoje, 11:20",
    terminarSessoes: "Terminar sessões em outros dispositivos",
    temaLabel: "Azul Escuro",
    alterarTemaBotao: "Alterar pelo botão Sol/Lua",
    emBreve: "Em breve",
    ativo: "Ativo",
    desativado: "Desativado",
    emConfig: "Em configuração",
  },
  en: {
    aparenciaTitulo: "Panel appearance",
    aparenciaDesc:
      "Control the main theme and contrast of the Africa Legal panel.",
    temaPrincipal: "Main theme",
    temaAtualLabel: "Current theme",
    altoContraste: "High contrast mode",
    altoContrasteDesc:
      "Improves readability in bright environments.",
    notificacoesTitulo: "Notifications",
    notificacoesDesc:
      "Choose which events should trigger alerts.",
    alertaFatura: "Overdue invoice alerts",
    alertaFaturaDesc:
      "Receive a warning when an invoice passes its due date.",
    prazosTitulo: "Case deadlines",
    prazosDesc:
      "Daily reminders for cases with deadlines today.",
    relatorioTitulo: "Weekly email report",
    relatorioDesc:
      "Automatic summary of revenue, expenses and overdue amounts.",
    perfilTitulo: "User profile",
    perfilNome: "Africa Legal – Admin",
    perfilEmail: "admin@africalegal.com",
    perfilBotao: "Manage profile data",
    segurancaTitulo: "Account security",
    sessao1: "Password authentication enabled",
    sessao2: "Inactive sessions expire after 30 minutes",
    sessao3: "Last access: today, 11:20",
    terminarSessoes: "End sessions on other devices",
    temaLabel: "Dark Blue",
    alterarTemaBotao: "Change using Sun/Moon button",
    emBreve: "Coming soon",
    ativo: "Active",
    desativado: "Disabled",
    emConfig: "Configuring",
  },
};

const ConfigGerais = ({
  temaAtual = "light",
  lang = "pt",
  trocarLang,
  onToggleTema,
  onToggleAlertsFatura,
  onToggleAlertsPrazos,
  onToggleRelatorioSemanal,
  onLogoutAllSessions,
  alertsFatura = true,
  alertsPrazos = false,
  relatorioSemanal = false,
}) => {
  const isDark = temaAtual === "dark";
  const t = TEXTOS[lang] || TEXTOS.pt;

  const card = isDark
    ? "bg-[#05060a]/85 rounded-xl border border-slate-700/70 shadow-md p-5 text-slate-100"
    : "bg-white rounded-xl border border-sky-100 shadow-md p-5 text-slate-900";

  const subText = isDark ? "text-xs opacity-70" : "text-xs text-slate-500";

  const pillPrimary = isDark
    ? "px-3 py-1.5 rounded-full text-xs font-medium bg-sky-600 hover:bg-sky-500 text-white shadow-sm"
    : "px-3 py-1.5 rounded-full text-xs font-medium bg-sky-500 hover:bg-sky-400 text-white shadow-sm";

  const pillNeutral = isDark
    ? "px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20"
    : "px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200";

  const tagActive = isDark
    ? "text-xs px-3 py-1 rounded-full bg-emerald-600/90 text-white cursor-pointer"
    : "text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 cursor-pointer";

  const tagConfig = isDark
    ? "text-xs px-3 py-1 rounded-full bg-emerald-600/30 border border-emerald-500/60 cursor-pointer"
    : "text-xs px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 cursor-pointer";

  const tagOff = isDark
    ? "text-xs px-3 py-1 rounded-full bg-white/10 cursor-pointer"
    : "text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600 cursor-pointer";

  const profileButton = isDark
    ? "w-full mt-2 text-xs font-medium px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20"
    : "w-full mt-2 text-xs font-medium px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200";

  const dangerButton = isDark
    ? "w-full mt-3 text-xs font-medium px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white"
    : "w-full mt-3 text-xs font-medium px-3 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white";

  const langButtonBase =
    "flex items-center gap-1 px-2 py-1 rounded-full text-[11px] border transition-colors";
  const langButtonActive = isDark
    ? "border-sky-500 bg-sky-900/60 text-sky-100"
    : "border-sky-500 bg-sky-50 text-sky-800";
  const langButtonInactive = isDark
    ? "border-slate-700 bg-slate-950 text-slate-300"
    : "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1.2fr]">
      {/* Coluna esquerda – Aparência + Notificações */}
      <div className="space-y-6">
        {/* Aparência */}
        <section className={card}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="text-sm font-semibold">{t.aparenciaTitulo}</h3>
              <p className={`${subText} mt-1`}>{t.aparenciaDesc}</p>
            </div>

            {/* Seletor de linguagem com 🇲🇿 / 🇬🇧 */}
            <div className="flex flex-col items-end gap-1">
              <span className={subText}>Idioma</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => trocarLang && trocarLang("pt")}
                  className={
                    langButtonBase +
                    " " +
                    (lang === "pt"
                      ? langButtonActive
                      : langButtonInactive)
                  }
                >
                  <span className="text-base">🇲🇿</span>
                  <span>Português</span>
                </button>
                <button
                  type="button"
                  onClick={() => trocarLang && trocarLang("en")}
                  className={
                    langButtonBase +
                    " " +
                    (lang === "en"
                      ? langButtonActive
                      : langButtonInactive)
                  }
                >
                  <span className="text-base">🇬🇧</span>
                  <span>English</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t.temaPrincipal}</p>
                <p className={subText}>
                  {t.temaAtualLabel}:{" "}
                  <span className="font-semibold">{t.temaLabel}</span>
                </p>
              </div>
              <button
                type="button"
                className={pillPrimary}
                onClick={onToggleTema}
              >
                {t.alterarTemaBotao}
              </button>
            </div>

            <div className="h-px bg-white/10 my-2" />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t.altoContraste}</p>
                <p className={subText}>{t.altoContrasteDesc}</p>
              </div>
              <button type="button" className={pillNeutral} disabled>
                {t.emBreve}
              </button>
            </div>
          </div>
        </section>

        {/* Notificações */}
        <section className={card}>
          <h3 className="text-sm font-semibold mb-1">
            {t.notificacoesTitulo}
          </h3>
          <p className={`${subText} mb-4`}>{t.notificacoesDesc}</p>

          <div className="space-y-3 text-sm">
            {/* Alertas de faturas vencidas */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t.alertaFatura}</p>
                <p className={subText}>{t.alertaFaturaDesc}</p>
              </div>
              <span
                className={alertsFatura ? tagActive : tagOff}
                onClick={onToggleAlertsFatura}
              >
                {alertsFatura ? t.ativo : t.desativado}
              </span>
            </div>

            {/* Prazos de processos */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t.prazosTitulo}</p>
                <p className={subText}>{t.prazosDesc}</p>
              </div>
              <span
                className={alertsPrazos ? tagConfig : tagOff}
                onClick={onToggleAlertsPrazos}
              >
                {alertsPrazos ? t.emConfig : t.desativado}
              </span>
            </div>

            {/* Relatório semanal por email */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t.relatorioTitulo}</p>
                <p className={subText}>{t.relatorioDesc}</p>
              </div>
              <span
                className={relatorioSemanal ? tagActive : tagOff}
                onClick={onToggleRelatorioSemanal}
              >
                {relatorioSemanal ? t.ativo : t.desativado}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Coluna direita – Perfil + Segurança */}
      <aside className="space-y-6">
        {/* Perfil do utilizador */}
        <section className={card}>
          <h3 className="text-sm font-semibold mb-3">
            {t.perfilTitulo}
          </h3>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-sm font-semibold">AL</span>
            </div>
            <div className="text-xs">
              <p className="font-semibold">{t.perfilNome}</p>
              <p className={subText}>{t.perfilEmail}</p>
            </div>
          </div>
          <button className={profileButton}>{t.perfilBotao}</button>
        </section>

        {/* Segurança da conta */}
        <section className={card}>
          <h3 className="text-sm font-semibold mb-3">
            {t.segurancaTitulo}
          </h3>
          <ul
            className={`text-xs space-y-2 ${
              isDark ? "opacity-80" : "text-slate-700"
            }`}
          >
            <li>• {t.sessao1}</li>
            <li>• {t.sessao2}</li>
            <li>• {t.sessao3}</li>
          </ul>
          <button
            className={dangerButton}
            onClick={onLogoutAllSessions}
          >
            {t.terminarSessoes}
          </button>
        </section>
      </aside>
    </div>
  );
};

export default ConfigGerais;
