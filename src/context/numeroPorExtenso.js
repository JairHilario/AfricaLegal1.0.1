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

export function numeroPorExtensoMeticais(valor) {
  const inteiro = Math.floor(Number(valor) || 0);
  if (inteiro === 0) return "zero meticais";

  const milhoes = Math.floor(inteiro / 1_000_000);
  const milhares = Math.floor((inteiro % 1_000_000) / 1_000);
  const resto = inteiro % 1_000;

  const partes = [];

  if (milhoes > 0) {
    partes.push(
      milhoes === 1
        ? "um milhão"
        : `${extensoAte999(milhoes)} milhões`
    );
  }

  if (milhares > 0) {
    partes.push(
      milhares === 1
        ? "mil"
        : `${extensoAte999(milhares)} mil`
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
