import { createBaseDoc } from "./core";

export const generateClientesPDF = ({ clientes, resumoAI }) => {
  const { doc, pageWidth, pageHeight, addFooter } = createBaseDoc();

  const dataAtual = new Date().toLocaleDateString("pt-PT");
  const horaAtual = new Date().toLocaleTimeString("pt-PT");

  const clientesAtivos = clientes.filter(c => c.estado === "Ativo").length;
  const totalClientes = clientes.length;
  const saldoTotal = clientes.reduce((sum, c) => sum + c.saldo, 0);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("LISTA DE CLIENTES", 15, 62);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Data: ${dataAtual} às ${horaAtual}`, 15, 70);
  doc.text(
    `Total de Clientes: ${totalClientes} | Ativos: ${clientesAtivos} | Saldo Total: MZN ${saldoTotal.toLocaleString()}`,
    15,
    77
  );

  let yPosition = 88;

  if (resumoAI) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Resumo Analítico (IA)", 15, yPosition);
    yPosition += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const texto = doc.splitTextToSize(resumoAI, pageWidth - 30);
    doc.text(texto, 15, yPosition);
    yPosition += texto.length * 5 + 4;
  }

  const colX = [15, 50, 95, 145, 180, 210];
  const colWidths = [35, 45, 50, 35, 30, 30];
  const headers = ["NOME", "EMAIL", "TELEFONE", "NUIT", "SALDO", "ESTADO"];

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setFillColor(200, 0, 0);
  doc.setTextColor(255, 255, 255);

  headers.forEach((header, i) => {
    doc.rect(colX[i], yPosition - 5, colWidths[i], 7, "F");
    doc.text(header, colX[i] + 1, yPosition + 1);
  });

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  yPosition += 10;

  doc.setFontSize(8);
  clientes.forEach((cliente) => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    doc.text(cliente.nome.substring(0, 30), colX[0] + 1, yPosition);
    doc.text(cliente.email.substring(0, 25), colX[1] + 1, yPosition);
    doc.text(cliente.telefone, colX[2] + 1, yPosition);
    doc.text(cliente.nuit, colX[3] + 1, yPosition);
    doc.text(`MZN ${cliente.saldo.toLocaleString()}`, colX[4] + 1, yPosition);
    doc.text(cliente.estado, colX[5] + 1, yPosition);

    doc.setDrawColor(220, 220, 220);
    doc.line(15, yPosition + 2, pageWidth - 15, yPosition + 2);

    yPosition += 8;
  });

  addFooter();
  doc.save(`clientes_africa_legal_${dataAtual}.pdf`);
};
