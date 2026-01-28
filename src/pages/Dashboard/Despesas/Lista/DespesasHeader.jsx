import React from "react";

function DespesasHeader({
  totalDespesas = 0,
  valorTotal = 0,
  pagas = 0,
  emAberto = 0,
  emAtraso = 0,
  temaAtual, // ✅ RECEBE do pai
}) {
  const isDark = temaAtual === "dark"; // ✅ Detecta tema

  return (
    <header className={`
      p-6 mb-4 border rounded-lg backdrop-blur-sm
      ${isDark 
        ? 'border-slate-700/50 bg-slate-900/80 shadow-2xl text-slate-100' 
        : 'border-slate-200/50 bg-gradient-to-br from-white to-slate-50/80 shadow-lg text-slate-900'
      }
    `}>
      <h1 className={`text-2xl font-bold mb-4 ${
        isDark ? 'text-slate-100 drop-shadow-sm' : 'text-slate-900'
      }`}>
        Gestão de Despesas
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-xs">
        {/* Total */}
        <div className={`
          rounded p-4 text-center transition-all duration-200 hover:scale-[1.02]
          ${isDark 
            ? 'bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-slate-600/50' 
            : 'bg-white/90 border border-slate-200/50 shadow-md hover:shadow-lg hover:border-slate-300/70'
          }
        `}>
          <h3 className={`font-medium mb-1 ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Total
          </h3>
          <p className={`text-xl font-semibold ${
            isDark ? 'text-slate-100 drop-shadow-sm' : 'text-slate-900'
          }`}>
            {totalDespesas}
          </p>
        </div>

        {/* Valor total */}
        <div className={`
          rounded p-4 text-center transition-all duration-200 hover:scale-[1.02]
          ${isDark 
            ? 'bg-sky-500/20 border border-sky-500/30 backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-sky-400/50' 
            : 'bg-sky-500/10 border border-sky-200/50 shadow-md hover:shadow-lg hover:border-sky-300/70'
          }
        `}>
          <h3 className={`font-medium mb-1 ${
            isDark ? 'text-sky-300' : 'text-sky-600'
          }`}>
            Valor Total
          </h3>
          <p className={`text-xl font-semibold ${
            isDark ? 'text-sky-200 drop-shadow-sm' : 'text-sky-700'
          }`}>
            {valorTotal.toLocaleString()}
          </p>
        </div>

        {/* Pagas */}
        <div className={`
          rounded p-4 text-center transition-all duration-200 hover:scale-[1.02]
          ${isDark 
            ? 'bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-emerald-400/50' 
            : 'bg-emerald-500/10 border border-emerald-200/50 shadow-md hover:shadow-lg hover:border-emerald-300/70'
          }
        `}>
          <h3 className={`font-medium mb-1 ${
            isDark ? 'text-emerald-300' : 'text-emerald-600'
          }`}>
            Pagas
          </h3>
          <p className={`text-xl font-semibold ${
            isDark ? 'text-emerald-200 drop-shadow-sm' : 'text-emerald-700'
          }`}>
            {pagas}
          </p>
        </div>

        {/* Em aberto */}
        <div className={`
          rounded p-4 text-center transition-all duration-200 hover:scale-[1.02]
          ${isDark 
            ? 'bg-amber-500/20 border border-amber-500/30 backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-amber-400/50' 
            : 'bg-amber-500/10 border border-amber-200/50 shadow-md hover:shadow-lg hover:border-amber-300/70'
          }
        `}>
          <h3 className={`font-medium mb-1 ${
            isDark ? 'text-amber-300' : 'text-amber-600'
          }`}>
            Em aberto
          </h3>
          <p className={`text-xl font-semibold ${
            isDark ? 'text-amber-200 drop-shadow-sm' : 'text-amber-700'
          }`}>
            {emAberto}
          </p>
        </div>

        {/* Em atraso */}
        <div className={`
          rounded p-4 text-center transition-all duration-200 hover:scale-[1.02]
          ${isDark 
            ? 'bg-red-500/20 border border-red-500/30 backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-red-400/50' 
            : 'bg-red-500/10 border border-red-200/50 shadow-md hover:shadow-lg hover:border-red-300/70'
          }
        `}>
          <h3 className={`font-medium mb-1 ${
            isDark ? 'text-red-300' : 'text-red-600'
          }`}>
            Em atraso
          </h3>
          <p className={`text-xl font-semibold ${
            isDark ? 'text-red-200 drop-shadow-sm' : 'text-red-700'
          }`}>
            {emAtraso}
          </p>
        </div>
      </div>
    </header>
  );
}

export default DespesasHeader;
