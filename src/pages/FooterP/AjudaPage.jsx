import { useState } from "react";

export default function AjudaPage({ temaAtual = "light" }) {
  const isDark = temaAtual === "dark";

  const container = "max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6";
  const card = isDark
    ? "rounded-xl border border-slate-700 bg-slate-900/70 shadow-lg backdrop-blur"
    : "rounded-xl border border-slate-200 bg-white shadow-sm";
  const heading = isDark ? "text-slate-50" : "text-slate-900";
  const muted = isDark ? "text-slate-300" : "text-slate-600";
  const sectionTitle =
    "text-sm font-semibold " + (isDark ? "text-slate-100" : "text-slate-800");
  const text = "text-xs sm:text-[13px] leading-relaxed " + muted;

  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Olá! Sou o assistente do AfricaLegalERP. Em que módulo está a sua dúvida?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const next = [
      ...messages,
      { from: "user", text: trimmed },
      {
        from: "bot",
        text:
          "Obrigado pela mensagem. Registe os passos que seguiu, prints de tela (se possível) " +
          "e contacte o administrador ou use a página de Feedback para mais detalhes.",
      },
    ];
    setMessages(next);
    setInput("");
  };

  return (
    <div className={container}>
      {/* Cabeçalho */}
      <div className="space-y-1">
        <h1 className={`text-xl sm:text-2xl font-semibold ${heading}`}>
          Centro de ajuda e suporte
        </h1>
        <p className={`text-xs sm:text-sm ${muted}`}>
          Recursos rápidos para tirar dúvidas e resolver problemas no
          AfricaLegalERP.
        </p>
      </div>

      {/* Secções de ajuda (FAQ + suporte interno) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={card}>
          <div className="p-4 sm:p-5 space-y-2">
            <h2 className={sectionTitle}>FAQ rápida</h2>
            <ul className={`list-disc list-inside space-y-1 ${text}`}>
              <li>Como criar um novo cliente ou fornecedor.</li>
              <li>O que fazer quando uma factura não é emitida.</li>
              <li>Como alterar a minha senha ou dados de perfil.</li>
            </ul>
            <p className={text}>
              Para questões mais detalhadas, contacte o administrador interno do
              sistema.
            </p>
          </div>
        </div>

        <div className={card}>
          <div className="p-4 sm:p-5 space-y-2">
            <h2 className={sectionTitle}>Suporte interno</h2>
            <p className={text}>
              Em caso de erro técnico, comportamento estranho do sistema ou
              dificuldades de acesso:
            </p>
            <ul className={`list-disc list-inside space-y-1 ${text}`}>
              <li>Registe o passo-a-passo do problema.</li>
              <li>Guarde prints da tela, se possível.</li>
              <li>Envie ao responsável de TI ou administrador interno.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sugestões */}
      <div className={card}>
        <div className="p-4 sm:p-5 space-y-3">
          <h2 className={sectionTitle}>Sugestões e melhorias</h2>
          <p className={text}>
            Se tiver ideias para melhorar fluxos, relatórios ou telas do
            sistema, utilize a página de{" "}
            <a
              href="/Dashboard/Feedback"
              className={
                isDark
                  ? "font-medium text-sky-400 hover:text-sky-300"
                  : "font-medium text-sky-600 hover:text-sky-700"
              }
            >
              Enviar feedback
            </a>{" "}
            ou comunique à gestão. A evolução do AfricaLegalERP é contínua e
            baseada nas necessidades diárias da equipa.
          </p>
        </div>
      </div>

      {/* Assistente virtual (chat simples) */}
      <div className={card}>
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className={sectionTitle}>Assistente virtual de suporte</h2>
            <button
              type="button"
              onClick={() => setChatOpen((v) => !v)}
              className={
                "text-xs px-3 py-1 rounded-full border transition-colors " +
                (isDark
                  ? "border-slate-600 text-slate-200 hover:bg-slate-800"
                  : "border-slate-300 text-slate-700 hover:bg-slate-100")
              }
            >
              {chatOpen ? "Fechar chat" : "Abrir chat"}
            </button>
          </div>

          {chatOpen && (
            <div
              className={
                "mt-2 rounded-lg border text-xs flex flex-col h-64 " +
                (isDark
                  ? "border-slate-700 bg-slate-950/60"
                  : "border-slate-200 bg-slate-50")
              }
            >
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={
                      "max-w-[80%] rounded-lg px-2.5 py-1.5 " +
                      (m.from === "bot"
                        ? isDark
                          ? "bg-slate-800 text-slate-100"
                          : "bg-white text-slate-800 border border-slate-200"
                        : isDark
                        ? "bg-sky-600 text-white ml-auto"
                        : "bg-sky-600 text-white ml-auto")
                    }
                  >
                    {m.text}
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleSend}
                className="border-t flex items-center gap-2 px-2 py-1.5"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Descreva a dúvida ou problema..."
                  className={
                    "flex-1 bg-transparent text-xs outline-none px-2" +
                    (isDark
                      ? " text-slate-50 placeholder:text-slate-500"
                      : " text-slate-900 placeholder:text-slate-400")
                  }
                />
                <button
                  type="submit"
                  className={
                    "text-xs px-3 py-1 rounded-lg font-medium transition-colors " +
                    (isDark
                      ? "bg-sky-500 hover:bg-sky-600 text-white"
                      : "bg-sky-600 hover:bg-sky-700 text-white")
                  }
                >
                  Enviar
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
