import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Header from "./Clientes/HeaderClient";
import StatusClient from "./Clientes/StatusClient";
import TableClients from "./Clientes/TableClients";

const normalizeClient = (c) => ({
  id: c.id,
  nome: c.nome,
  email: c.email,
  telefone: c.telefone,
  status: c.status,
  criadoEm: c.criado_em,
  nuit: c.nuit,
  saldo: Number(c.saldo || 0),
  cidade: c.cidade,
  provincia: c.provincia,
  caixaPostal: c.caixa_postal,
  endereco: c.endereco,
});

function ClientesPage({ temaAtual = "light" }) {
  const [clients, setClients] = useState([]);
  const isDark = temaAtual === "dark";

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("http://localhost:4000/clients");
        const data = await res.json();
        setClients(data.map(normalizeClient));
      } catch (err) {
        console.error("Erro ao carregar clientes", err);
      }
    };
    fetchClients();
  }, []);

  const stats = {
    total: clients.length,
    ativos: clients.filter((c) => c.status === "Ativo").length,
    inativos: clients.filter((c) => c.status === "Inativo").length,
    vencidos: clients.filter((c) => c.status === "Vencido").length,
    emRisco: clients.filter((c) => c.status === "Risco").length,
    novos: 0,
  };

  const handleAddClient = (novo) =>
    setClients((prev) => [...prev, normalizeClient(novo)]);

  const handleUpdateClient = (updated) => {
    const norm = normalizeClient(updated);
    setClients((prev) => prev.map((c) => (c.id === norm.id ? norm : c)));
  };

  // PDF PROFISSIONAL (ajustado)
  const handleExportPDF = () => {
    if (!clients.length) return alert("Nenhum cliente para exportar!");

    const doc = new jsPDF("p", "mm", "a4");
    const agora = new Date();
    const azulAfrica = [0, 48, 87];

    const savedAuth = localStorage.getItem("africaLegalUser");
    const authData = savedAuth ? JSON.parse(savedAuth) : null;
    const nomeUtilizador =
      authData?.user?.username || authData?.username || "Operador do Sistema";

    const formatSaldo = (valor) =>
      Number(valor || 0).toLocaleString("pt-MZ", {
        style: "currency",
        currency: "MZN",
        minimumFractionDigits: 2,
      });

    const totalClientes = clients.length;
    const totalSaldo = clients.reduce((sum, c) => sum + (c.saldo || 0), 0);
    const totalAtivos = clients.filter((c) => c.status === "Ativo").length;
    const totalInativos = clients.filter((c) => c.status === "Inativo").length;
    const totalRisco = clients.filter((c) => c.status === "Risco").length;
    const totalVencidos = clients.filter((c) => c.status === "Vencido").length;

    // 1. Cabeçalho + logo um pouco mais alto
    const imgLogo = "/logo.Al.png";
    doc.addImage(imgLogo, "PNG", 14, 10, 45, 18);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...azulAfrica);
    doc.text("AFRICA LEGAL IP & CONSULTING", 14, 34);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(60, 60, 60);
    const infoEmpresa = [
      "Av. Cahora Bassa, n.º 92 Bairro Sommershield",
      "Maputo Cidade, Moçambique",
      "Contacto(s): +258 87 270 7077 | Email: info@africalegalip.com",
      "Nuit: 401623752",
    ];
    doc.text(infoEmpresa, 14, 40);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...azulAfrica);
    doc.text("RELATÓRIO DETALHADO DE CLIENTES", 195, 20, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    doc.text(`Emissão: ${agora.toLocaleDateString("pt-PT")}`, 195, 26, {
      align: "right",
    });
    doc.text(`Hora: ${agora.toLocaleTimeString("pt-PT")}`, 195, 30, {
      align: "right",
    });

    // Linha separadora mais abaixo
    doc.setDrawColor(180);
    doc.setLineWidth(0.2);
    doc.line(14, 52, 195, 52);

    // 2. Resumo / KPIs mais baixo
    let resumoY = 58;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(0, 0, 0);
    doc.text("Resumo Geral", 14, resumoY);

    resumoY += 4;
    doc.setDrawColor(...azulAfrica);
    doc.setLineWidth(0.3);
    doc.rect(14, resumoY, 182, 22);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(40, 40, 40);

    const leftX = 18;
    const middleX = 100;
    const rightX = 155;
    let lineY = resumoY + 7;

    doc.text(`Total de Clientes: ${totalClientes}`, leftX, lineY);
    lineY += 5;
    doc.text(`Ativos: ${totalAtivos}`, leftX, lineY);
    lineY += 5;
    doc.text(`Inativos: ${totalInativos}`, leftX, lineY);

    lineY = resumoY + 7;
    doc.text(`Em Risco: ${totalRisco}`, middleX, lineY);
    lineY += 5;
    doc.text(`Vencidos: ${totalVencidos}`, middleX, lineY);

    lineY = resumoY + 7;
    doc.text(`Saldo Total: ${formatSaldo(totalSaldo)}`, rightX, lineY);
    lineY += 5;
    doc.text(
      `Saldo Médio: ${
        totalClientes ? formatSaldo(totalSaldo / totalClientes) : formatSaldo(0)
      }`,
      rightX,
      lineY
    );

    // 3. Título listagem bem separado do resumo
// 3. Título listagem bem separado do resumo
const tabelaStartY = resumoY + 32;
doc.setFont("helvetica", "bold");
doc.setFontSize(11.5);
doc.setTextColor(0);
doc.text("Listagem Detalhada de Clientes", 105, tabelaStartY - 4, {
  align: "center",
});

// 4. Tabela – sem Província e sem Criado em
autoTable(doc, {
  head: [
    [
      "Nome",
      "Email",
      "Telefone",
      "Cidade",
      "NUIT",
      "Saldo (MZN)",
      "Status",
    ],
  ],
  body: clients.map((c) => [
    c.nome || "-",
    c.email || "-",
    c.telefone || "-",
    c.cidade || "-",
    c.nuit || "-",
    formatSaldo(c.saldo),
    c.status || "-",
  ]),
  startY: tabelaStartY + 4,
  theme: "striped",
  headStyles: {
    fillColor: azulAfrica,
    textColor: 255,
    fontSize: 8,
    halign: "center",
  },
  styles: {
    fontSize: 7,
    cellPadding: 1.6,
    valign: "middle",
    overflow: "linebreak",
  },
  columnStyles: {
    0: { cellWidth: 40 }, // Nome
    1: { cellWidth: 40 }, // Email
    2: { cellWidth: 22 }, // Telefone
    3: { cellWidth: 22 }, // Cidade
    4: { cellWidth: 20 }, // NUIT
    5: { cellWidth: 24, halign: "right" }, // Saldo
    6: { cellWidth: 18 }, // Status
  },
  margin: { left: 14, right: 14 },
});


    // 5. Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const pHeight = doc.internal.pageSize.height;
      const pWidth = doc.internal.pageSize.width;

      doc.setDrawColor(200);
      doc.setLineWidth(0.2);
      doc.line(14, pHeight - 18, pWidth - 14, pHeight - 18);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(80);
      doc.text(`Criado por: ${nomeUtilizador}`, 14, pHeight - 10);

      doc.setFont("helvetica", "italic");
      doc.setFontSize(7);
      doc.text(
        "Processado por computador - AfricaLegalERP System",
        pWidth / 2,
        pHeight - 10,
        { align: "center" }
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(`Página ${i} de ${pageCount}`, pWidth - 14, pHeight - 10, {
        align: "right",
      });
    }

    doc.save(`Relatorio_Clientes_AfricaLegal_${agora.getTime()}.pdf`);
  };

  const handleExportExcel = () => {
    // implementar depois
  };

  const handleImportCSV = async (event) => {
    // implementar depois
  };

  return (
    <div
      className={`min-h-screen  ${
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <Header stats={stats} temaAtual={temaAtual} isDark={isDark} />
        <StatusClient
          onAddClient={handleAddClient}
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
          onImportCSV={handleImportCSV}
          temaAtual={temaAtual}
          isDark={isDark}
        />
        <div className="bg-white dark:bg-slate-900 rounded-x shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <TableClients
            clients={clients}
            onUpdateClient={handleUpdateClient}
            temaAtual={temaAtual}
            isDark={isDark}
          />
        </div>
      </div>
    </div>
  );
}

export default ClientesPage;
