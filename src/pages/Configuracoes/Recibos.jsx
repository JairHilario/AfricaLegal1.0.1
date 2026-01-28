// src/pages/Recibos.jsx
const Recibos = () => {
  return (
    <div className="min-h-[calc(100vh-5rem)] px-6 pb-8 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Sistema de recibos</h2>
          <p className="text-sm opacity-70">
            Gere, visualize e exporte recibos dos clientes.
          </p>
        </div>
        <button
          type="button"
          className="text-xs px-3 py-1 rounded-full bg-sky-600 hover:bg-sky-500 text-white"
        >
          Novo recibo
        </button>
      </div>

      <div className="bg-[#05060a]/85 rounded-xl border border-slate-700/70 shadow-md p-5 text-sm">
        <p className="opacity-70">
          Aqui vão a lista de recibos, filtros por cliente, data e estado
          (pago/pendente), e ações para imprimir ou enviar por email.
        </p>
      </div>
    </div>
  );
};

export default Recibos;
