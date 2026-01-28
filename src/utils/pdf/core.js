import jsPDF from "jspdf";

export const createBaseDoc = () => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const dataAtual = new Date().toLocaleDateString("pt-PT");
  const horaAtual = new Date().toLocaleTimeString("pt-PT");

  // Logo + cabeçalho padrão
  doc.addImage("/logo.Al.png", "PNG", 15, 10, 25, 25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("AFRICA LEGAL", 50, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Sociedade Unipessoal", 50, 25);
  doc.text("Email: info@africalegal.mz", 50, 31);
  doc.text("NUIT: 400000001", 50, 37);
  doc.text("Localização: Maputo, Moçambique", 50, 43);

  doc.setDrawColor(200, 0, 0);
  doc.line(15, 50, pageWidth - 15, 50);

  const addFooter = () => {
    doc.setDrawColor(200, 0, 0);
    doc.line(15, pageHeight - 35, pageWidth - 15, pageHeight - 35);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);

    doc.text(
      `Este documento foi processado por computador. Assinatura digital gerada automaticamente em: ${dataAtual} às ${horaAtual}`,
      15,
      pageHeight - 28
    );

    doc.text("Emitido por: AFRICA LEGAL - Sociedade Unipessoal", 15, pageHeight - 22);
    doc.text("NUIT: 400000001 | Email: info@africalegal.mz", 15, pageHeight - 16);

    doc.setDrawColor(0, 0, 0);
    doc.line(15, pageHeight - 10, 60, pageHeight - 10);
    doc.text("Assinatura Digital", 15, pageHeight - 5);
  };

  return { doc, pageWidth, pageHeight, addFooter };
};
