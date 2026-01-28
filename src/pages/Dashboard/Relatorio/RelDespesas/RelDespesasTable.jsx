import React, { useEffect, useState } from "react";

// ---------- EXTENSO EM PT ----------

const UNIDADES = [
  "zero","um","dois","três","quatro","cinco","seis","sete","oito","nove",
  "dez","onze","doze","treze","catorze","quinze","dezasseis","dezassete",
  "dezoito","dezanove"
];

const DEZENAS = [
  "","dez","vinte","trinta","quarenta","cinquenta",
  "sessenta","setenta","oitenta","noventa"
];

const CENTENAS = [
  "","cento","duzentos","trezentos","quatrocentos",
  "quinhentos","seiscentos","setecentos","oitocentos","novecentos"
];

function extensoAte999(n) {
  n = Number(n);
  if (n === 0) return "";
  if (n < 20) return UNIDADES[n];
  if (n < 100) {
    const d = Math.floor(n / 10);
    const u = n % 10;
    return u === 0 ? DEZENAS[d] : `${DEZENAS[d]} e ${UNIDADES[u]}`;
  }
  if (n === 100) return "cem";
  const c = Math.floor(n / 100);
  const resto = n % 100;
  const cent = CENTENAS[c];
  if (resto === 0) return cent;
  return `${cent} e ${extensoAte999(resto)}`;
}

function numeroPorExtensoMeticais(valor) {
  const inteiro = Math.floor(Number(valor) || 0);
  if (inteiro === 0) return "zero meticais";

  const milhoes = Math.floor(inteiro / 1_000_000);
  const milhares = Math.floor((inteiro % 1_000_000) / 1_000);
  const resto = inteiro % 1_000;

  const partes = [];

  if (milhoes > 0) {
    partes.push(
      milhoes === 1 ? "um milhão" : `${extensoAte999(milhoes)} milhões`
    );
  }

  if (milhares > 0) {
    partes.push(
      milhares === 1 ? "mil" : `${extensoAte999(milhares)} mil`
    );
  }

  if (resto > 0) {
    partes.push(extensoAte999(resto));
  }

  const frase =
    partes.length === 1
      ? partes[0]
      : partes.join(" e ");

  return `${frase} meticais`;
}

// ---------- COMPONENTE COM TEMA ----------

function RelDespesasTable({ temaAtual = "dark" }) {
  const [rows, setRows] = useState([]);

  const isDark = temaAtual === "dark";

  const wrapper = isDark
    ? "rounded-md border border-slate-800 bg-slate-900 p-4 md:p-6 shadow-sm text-slate-100 text-sm"
    : "rounded-md border border-sky-100 bg-white p-4 md:p-6 shadow-sm text-slate-800 text-sm";

  const headerInfo = isDark
    ? "mb-3 flex items-center justify-between text-xs text-slate-300"
    : "mb-3 flex items-center justify-between text-xs text-slate-600";

  const theadClasse = isDark
    ? "border-b border-slate-700 text-slate-300 uppercase tracking-wide text-[11px] bg-slate-800"
    : "border-b border-slate-100 text-slate-600 uppercase tracking-wide text-[11px] bg-orange-50";

  const linha = isDark
    ? "border-b border-slate-800"
    : "border-b border-slate-100";

  const statusClasse = (status) => {
    if (status === "Pago") {
      return isDark
        ? "bg-emerald-900/40 text-emerald-300 border-emerald-700"
        : "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (status === "Pendente") {
      return isDark
        ? "bg-amber-900/40 text-amber-300 border-amber-700"
        : "bg-amber-50 text-amber-700 border-amber-200";
    }
    return isDark
      ? "bg-slate-800 text-slate-200 border-slate-600"
      : "bg-slate-50 text-slate-700 border-slate-200";
  };

  const emptyClasse = "px-3 py-4 text-center text-slate-400 text-xs";

  const totalLinha = isDark
    ? "mt-3 text-xs text-slate-300 flex flex-col md:flex-row md:items-center md:justify-between gap-1"
    : "mt-3 text-xs text-slate-700 flex flex-col md:flex-row md:items-center md:justify-between gap-1";

  const totalValorClasse = isDark
    ? "text-orange-400"
    : "text-orange-600";

  const totalExtensoClasse = isDark
    ? "italic text-slate-400"
    : "italic text-slate-500";

  const formatValor = (v) => {
    if (!v || isNaN(Number(v))) return "0";
    const num = Number(v);
    if (num === 0) return "0";
    if (num % 1 === 0) return num.toLocaleString("pt-MZ");
    return num.toLocaleString("pt-MZ", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const totalGeral = rows.reduce(
    (sum, r) => sum + (Number(r.valor) || 0),
    0
  );

  useEffect(() => {
    fetch("http://localhost:4000/rel-despesas")
      .then((res) => res.json())
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((err) =>
        console.error("Erro ao buscar relatorio de despesas", err)
      );
  }, []);

  return (
    <div className={wrapper}>
      <div className={headerInfo}>
        <span>Relatório de Despesas</span>
        <span className={isDark ? "text-slate-300" : "text-slate-500"}>
          Total lançamentos: <strong>{rows.length}</strong>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs md:text-sm">
          <thead className={theadClasse}>
            <tr>
              <th className="px-3 py-2">Data</th>
              <th className="px-3 py-2">Conta</th>
              <th className="px-3 py-2">Categoria</th>
              <th className="px-3 py-2 text-right">Valor</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className={linha}>
                <td className="px-3 py-2 text-[11px] md:text-xs text-slate-400">
                  {r.data}
                </td>
                <td className="px-3 py-2 font-semibold">
                  {r.conta}
                </td>
                <td className="px-3 py-2 text-slate-400">
                  {r.categoria || "—"}
                </td>
                <td className="px-3 py-2 text-right text-orange-400 font-bold">
                  {formatValor(r.valor)}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border",
                      statusClasse(r.status),
                    ].join(" ")}
                  >
                    {r.status || "—"}
                  </span>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className={emptyClasse}>
                  Nenhuma despesa encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={totalLinha}>
        <span>
          Total gasto:{" "}
          <strong className={totalValorClasse}>
            {formatValor(totalGeral)}
          </strong>
        </span>
        <span className={totalExtensoClasse}>
          ({numeroPorExtensoMeticais(totalGeral)})
        </span>
      </div>
    </div>
  );
}

export default RelDespesasTable;
