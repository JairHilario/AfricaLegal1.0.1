// src/pages/configuracoes/ConfigRecibos.jsx
import { useEffect, useRef, useState } from "react";
import { Canvas, Rect, IText, Text, Line } from "fabric"; // <- import correto v6+

const templates = [
  { id: "tpl1", nome: "Cinza clássico" },
  { id: "tpl2", nome: "Preto moderno" },
  { id: "tpl3", nome: "Minimal clean" },
];

const ConfigRecibos = () => {
  const [templateSelecionado, setTemplateSelecionado] = useState("tpl1");
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  // inicializar canvas só uma vez
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const canvas = new Canvas(el, {
      width: 400,
      height: 520,
      selection: true,
    });

    fabricRef.current = canvas;

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  // carregar layout base quando trocar template
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.clear();

    // fundo branco do papel
    const bg = new Rect({
      left: 0,
      top: 0,
      width: 400,
      height: 520,
      fill: "#ffffff",
      selectable: false,
      evented: false,
    });
    canvas.add(bg);

    if (templateSelecionado === "tpl1") {
      const header = new Rect({
        left: 0,
        top: 0,
        width: 400,
        height: 60,
        fill: "#1f2933",
        selectable: false,
      });
      const title = new Text("INVOICE", {
        left: 20,
        top: 18,
        fontSize: 24,
        fontWeight: "bold",
        fill: "#f9fafb",
      });
      const order = new Text("Order #0001", {
        left: 280,
        top: 24,
        fontSize: 12,
        fill: "#e5e7eb",
      });
      canvas.add(header, title, order);
    } else if (templateSelecionado === "tpl2") {
      const header = new Rect({
        left: 0,
        top: 0,
        width: 400,
        height: 60,
        fill: "#020617",
        selectable: false,
      });
      const title = new Text("INVOICE", {
        left: 20,
        top: 18,
        fontSize: 22,
        fontWeight: "bold",
        fill: "#f9fafb",
      });
      canvas.add(header, title);
    } else if (templateSelecionado === "tpl3") {
      const title = new Text("INVOICE", {
        left: 140,
        top: 20,
        fontSize: 20,
        fontWeight: "600",
        fill: "#020617",
      });
      const line = new Line([40, 50, 360, 50], {
        stroke: "#cbd5f5",
        strokeWidth: 1,
      });
      canvas.add(title, line);
    }

    canvas.renderAll();
  }, [templateSelecionado]);

  const handleAddText = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const text = new IText("Novo texto", {
      left: 80,
      top: 100,
      fontSize: 14,
      fill: "#111827",
    });
    canvas.add(text).setActiveObject(text);
  };

  const handleAddBox = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const rect = new Rect({
      left: 80,
      top: 150,
      width: 180,
      height: 40,
      stroke: "#9ca3af",
      strokeWidth: 1,
      fill: "rgba(0,0,0,0)",
    });
    canvas.add(rect).setActiveObject(rect);
  };

  const handleReset = () => {
    // força recarregar o layout atual reaplicando o efeito
    setTemplateSelecionado((prev) => prev);
  };

  const handleDownload = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL({ format: "png", multiplier: 2 });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${templateSelecionado}-recibo.png`;
    link.click();
  };

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-700/70 shadow-md p-5 bg-[#05060a]/85">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Sistema de recibos</h3>
            <p className="text-xs opacity-70">
              Edite o layout diretamente no papel do recibo.
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
          {/* Editor / papel */}
          <div className="rounded-lg border border-slate-700/70 bg-slate-900/60 p-3 flex flex-col">
            <div className="flex items-center justify-between mb-2 text-xs">
              <span className="font-semibold">
                Editando:{" "}
                {templates.find((t) => t.id === templateSelecionado)?.nome}
              </span>
              <span className="opacity-60">Ferramentas</span>
            </div>

            <div className="mb-2 flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={handleAddText}
                className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20"
              >
                Adicionar texto
              </button>
              <button
                type="button"
                onClick={handleAddBox}
                className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20"
              >
                Adicionar caixa
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/15"
              >
                Resetar
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white"
              >
                Download PNG
              </button>
            </div>

            <div className="flex-1 bg-slate-950/80 rounded-md flex items-center justify-center">
              {/* papel branco */}
              <div className="bg-white shadow-xl">
                <canvas ref={canvasRef} />
              </div>
            </div>
          </div>

          {/* Coluna de templates */}
          <div className="space-y-2">
            <p className="text-xs font-semibold opacity-80">
              Templates disponíveis
            </p>
            <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
              {templates.map((tpl) => {
                const ativo = tpl.id === templateSelecionado;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setTemplateSelecionado(tpl.id)}
                    className={`flex gap-2 rounded-md border bg-slate-900/70 hover:bg-slate-900 transition-colors p-1 text-left ${
                      ativo
                        ? "border-sky-500/80 ring-1 ring-sky-500/40"
                        : "border-slate-700/80"
                    }`}
                  >
                    <div className="w-16 h-20 rounded-sm overflow-hidden flex items-center justify-center bg-slate-50">
                      <div className="w-[90%] h-[90%] bg-white border border-slate-300 rounded-sm flex flex-col">
                        <div className="h-4 bg-slate-800" />
                        <div className="flex-1 px-1 py-1">
                          <div className="h-2 bg-slate-200 mb-1" />
                          <div className="h-2 bg-slate-100 mb-1" />
                          <div className="h-2 bg-slate-100" />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 text-[11px]">
                      <p className="font-semibold">{tpl.nome}</p>
                      {ativo && (
                        <span className="mt-1 inline-flex px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px]">
                          Selecionado
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConfigRecibos;
