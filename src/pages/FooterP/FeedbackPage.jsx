// Pages/FeedbackPage.jsx
export default function FeedbackPage({ temaAtual = "light" }) {
  const isDark = temaAtual === "dark";

  const container =
    "max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6";
  const card = isDark
    ? "rounded-xl border border-slate-700 bg-slate-900/70 shadow-lg backdrop-blur"
    : "rounded-xl border border-slate-200 bg-white shadow-sm";
  const label =
    "block text-xs font-semibold tracking-wide uppercase mb-1 " +
    (isDark ? "text-slate-300" : "text-slate-500");
  const input =
    "w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors " +
    (isDark
      ? "bg-slate-950 border-slate-700 text-slate-50 focus:border-sky-500"
      : "bg-white border-slate-300 text-slate-900 focus:border-sky-500");
  const textarea = input + " min-h-[120px] resize-y";

  return (
    <div className={container}>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1
            className={
              "text-xl sm:text-2xl font-semibold " +
              (isDark ? "text-slate-50" : "text-slate-900")
            }
          >
            Enviar feedback
          </h1>
          <p
            className={
              "text-xs sm:text-sm mt-1 " +
              (isDark ? "text-slate-300" : "text-slate-600")
            }
          >
            Ajude a melhorar o AfricaLegalERP com sugestões, erros encontrados
            ou ideias de novas funcionalidades.
          </p>
        </div>

        <span
          className={
            "hidden sm:inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium " +
            (isDark
              ? "bg-slate-800 text-slate-200 border border-slate-700"
              : "bg-sky-50 text-sky-800 border border-sky-100")
          }
        >
          Versão interna · Africa Legal IP &amp; Consulting
        </span>
      </div>

      {/* Formulário */}
      <div className={card}>
        <form className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Nome</label>
              <input
                type="text"
                placeholder="O seu nome (opcional)"
                className={input}
              />
            </div>
            <div>
              <label className={label}>Email</label>
              <input
                type="email"
                placeholder="Para contacto de retorno (opcional)"
                className={input}
              />
            </div>
          </div>

          <div>
            <label className={label}>Tipo de feedback</label>
            <select className={input}>
              <option>Melhoria / sugestão</option>
              <option>Erro / problema técnico</option>
              <option>Dúvida sobre funcionamento</option>
              <option>Outro</option>
            </select>
          </div>

          <div>
            <label className={label}>Mensagem</label>
            <textarea
              className={textarea}
              placeholder="Descreva o que aconteceu ou a sua sugestão com o máximo de detalhes possível..."
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
            <p
              className={
                "text-[11px] " +
                (isDark ? "text-slate-400" : "text-slate-500")
              }
            >
              Os dados enviados serão analisados apenas pela equipa interna da
              Africa Legal. Não partilhe informações sensíveis de clientes.
            </p>
            <button
              type="submit"
              className={
                "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors " +
                (isDark
                  ? "bg-sky-500 hover:bg-sky-600 text-white"
                  : "bg-sky-600 hover:bg-sky-700 text-white")
              }
            >
              Enviar feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
