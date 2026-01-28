import { useMemo, useState } from "react";

const Notificacoes = ({ temaAtual = "dark" }) => {
  const [filtro, setFiltro] = useState("todas"); // "todas" | "nao-lidas"

  const notificacoes = [
    {
      id: 1,
      titulo: "Novo cliente cadastrado",
      mensagem: "João Silva fez seu primeiro pedido.",
      tipo: "sucesso",
      data: "2025-12-25 10:30",
      grupo: "Hoje",
      lida: false,
    },
    {
      id: 2,
      titulo: "Fatura pendente",
      mensagem: "Fatura #INV-045 vence amanhã.",
      tipo: "aviso",
      data: "2025-12-25 09:15",
      grupo: "Hoje",
      lida: true,
    },
    {
      id: 3,
      titulo: "Estoque baixo",
      mensagem: "Produto 'Camiseta Azul' abaixo do mínimo.",
      tipo: "erro",
      data: "2025-12-24 08:45",
      grupo: "Ontem",
      lida: false,
    },
  ];

  const isDark = temaAtual === "dark";

  const wrapper = isDark
    ? "overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70 shadow-xl backdrop-blur-xl p-6 space-y-5 text-slate-100"
    : "overflow-hidden rounded-xl border border-sky-100 bg-white shadow-xl p-6 space-y-5 text-slate-900";

  const title = "text-2xl font-semibold";
  const subtitle = isDark ? "text-sm text-slate-300" : "text-sm text-slate-500";

  const badgeNew = "px-3 py-1 bg-sky-500 text-white text-xs rounded-full font-medium";

  const chipBase =
    "px-3 py-1 rounded-full text-xs font-medium border transition-colors";
  const chipActive = isDark
    ? "bg-sky-600 text-white border-sky-500"
    : "bg-sky-500 text-white border-sky-500";
  const chipInactive = isDark
    ? "bg-transparent text-slate-300 border-slate-600 hover:bg-slate-800"
    : "bg-transparent text-slate-600 border-slate-300 hover:bg-slate-100";

  const btnMarkAll = isDark
    ? "text-xs px-3 py-1.5 rounded-md border border-slate-700/70 text-slate-300 hover:bg-slate-800"
    : "text-xs px-3 py-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50";

  const cardBase =
    "relative pl-8 pr-4 py-3 rounded-lg border transition-all cursor-pointer flex gap-3";
  const cardLida = isDark
    ? "border-slate-800 bg-slate-900/40 opacity-70"
    : "border-slate-200 bg-slate-50 opacity-80";
  const cardNaoLida = isDark
    ? "border-sky-500/40 bg-sky-500/10 shadow-md"
    : "border-sky-300 bg-sky-50 shadow-md";

  const titleNotif = isDark
    ? "font-semibold text-slate-50 truncate"
    : "font-semibold text-slate-900 truncate";
  const msgNotif = isDark
    ? "text-xs text-slate-300 line-clamp-2"
    : "text-xs text-slate-600 line-clamp-2";
  const dataNotif = isDark ? "text-[11px] text-slate-400" : "text-[11px] text-slate-500";

  const dotVertical = isDark ? "bg-slate-700" : "bg-slate-300";

  const filtradas = useMemo(
    () =>
      notificacoes.filter((n) => (filtro === "nao-lidas" ? !n.lida : true)),
    [filtro]
  );

  const grupos = useMemo(() => {
    const mapa = new Map();
    for (const n of filtradas) {
      const grupo = n.grupo || "Outros";
      if (!mapa.has(grupo)) mapa.set(grupo, []);
      mapa.get(grupo).push(n);
    }
    return Array.from(mapa.entries());
  }, [filtradas]);

  const totalNaoLidas = notificacoes.filter((n) => !n.lida).length;

  const marcarLida = (id) => {
    console.log(`Marcando notificação ${id} como lida`);
  };

  return (
    <div className={wrapper}>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className={title}>Notificações</h1>
          <p className={subtitle}>Alertas e atualizações do sistema</p>
        </div>
        {totalNaoLidas > 0 && (
          <span className={badgeNew}>{totalNaoLidas} novas</span>
        )}
      </div>

      {/* Filtros */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            className={[
              chipBase,
              filtro === "todas" ? chipActive : chipInactive,
            ].join(" ")}
            onClick={() => setFiltro("todas")}
          >
            Todas
          </button>
          <button
            type="button"
            className={[
              chipBase,
              filtro === "nao-lidas" ? chipActive : chipInactive,
            ].join(" ")}
            onClick={() => setFiltro("nao-lidas")}
          >
            Não lidas ({totalNaoLidas})
          </button>
        </div>
        <button type="button" className={btnMarkAll}>
          Marcar todas como lidas
        </button>
      </div>

      {/* Timeline */}
      <div className="max-h-96 overflow-y-auto space-y-4">
        {grupos.map(([grupo, lista]) => (
          <div key={grupo} className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
              <span className={`w-1 h-6 rounded-full ${dotVertical}`} />
              <span>{grupo}</span>
            </div>

            <div className="space-y-2">
              {lista.map((notif) => (
                <div
                  key={notif.id}
                  className={[
                    cardBase,
                    notif.lida ? cardLida : cardNaoLida,
                  ].join(" ")}
                  onClick={() => marcarLida(notif.id)}
                >
                  {/* Linha e ponto da timeline */}
                  <div className="absolute left-3 top-0 bottom-0 flex flex-col items-center">
                    <span
                      className={[
                        "w-2 h-2 rounded-full mt-2",
                        notif.tipo === "sucesso"
                          ? "bg-emerald-400"
                          : notif.tipo === "aviso"
                          ? "bg-amber-400"
                          : "bg-red-400",
                        notif.lida ? "opacity-50" : "",
                      ].join(" ")}
                    />
                  </div>

                  <div className="flex-1 min-w-0 pl-2">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className={titleNotif}>{notif.titulo}</h3>
                      <span className={dataNotif}>{notif.data}</span>
                    </div>
                    <p className={msgNotif}>{notif.mensagem}</p>
                    {!notif.lida && (
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-sky-400">
                        <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
                        <span>Novo</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {grupos.length === 0 && (
          <p className="text-xs text-center text-slate-400 py-6">
            Nenhuma notificação para exibir.
          </p>
        )}
      </div>
    </div>
  );
};

export default Notificacoes;
