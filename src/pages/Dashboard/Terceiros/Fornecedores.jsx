import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import FornecedorHeader from "./Fornecedor/FornecedorHeader";
import FornecedorStatus from "./Fornecedor/FornecedorStatus";
import FornecedorTable from "./Fornecedor/FornecedorTable";

function Fornecedores({ temaAtual = "light" }) {
  const [search, setSearch] = useState("");
  const [fornecedores, setFornecedores] = useState([]);

  const isDark = temaAtual === "dark";

  useEffect(() => {
    async function load() {
      try {
        const savedAuth = localStorage.getItem("africaLegalUser");
        const token = savedAuth ? JSON.parse(savedAuth).token : null;

        const res = await fetch("http://localhost:4000/fornecedores", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Erro ao carregar fornecedores");

        setFornecedores(data);
      } catch (e) {
        console.error(e);
        alert(e.message || "Erro ao carregar fornecedores");
      }
    }

    load();
  }, []);

  const stats = {
    total: fornecedores.length,
    ativos: fornecedores.filter((f) => f.status === "Ativo").length,
    inativos: fornecedores.filter((f) => f.status === "Inativo").length,
    comPendencias: fornecedores.filter((f) => f.status === "Pendente").length,
    emNegociacao: fornecedores.filter(
      (f) => f.status === "Em Negociação"
    ).length,
    novos: fornecedores.filter((f) => f.novo === true).length,
  };

  const filtrados = fornecedores.filter((f) =>
    f.nome?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddFornecedor = (novo) => {
    setFornecedores((prev) => [...prev, { ...novo, novo: true }]);
  };

  // === PDF PROFISSIONAL DE FORNECEDORES (ajustado + tabela mais compacta) ===
  const handleExportPDF = () => {
    if (!fornecedores.length) {
      alert("Nenhum fornecedor para exportar!");
      return;
    }

    const doc = new jsPDF("p", "mm", "a4");
    const agora = new Date();
    const azulAfrica = [0, 48, 87];

    const savedAuth = localStorage.getItem("africaLegalUser");
    const authData = savedAuth ? JSON.parse(savedAuth) : null;
    const nomeUtilizador =
      authData?.user?.username || authData?.username || "Operador do Sistema";

    const formatValor = (valor) =>
      Number(valor || 0).toLocaleString("pt-MZ", {
        style: "currency",
        currency: "MZN",
        minimumFractionDigits: 2,
      });

    const totalFornecedores = fornecedores.length;
    const totalAtivos = fornecedores.filter((f) => f.status === "Ativo").length;
    const totalInativos = fornecedores.filter(
      (f) => f.status === "Inativo"
    ).length;
    const totalPendentes = fornecedores.filter(
      (f) => f.status === "Pendente"
    ).length;
    const totalNegociacao = fornecedores.filter(
      (f) => f.status === "Em Negociação"
    ).length;

    const totalLimite = fornecedores.reduce(
      (sum, f) => sum + (f.limite_credito || 0),
      0
    );

    // 1. Cabeçalho + logo mais “alto”
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
    doc.text("RELATÓRIO DETALHADO DE FORNECEDORES", 195, 20, {
      align: "right",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    doc.text(`Emissão: ${agora.toLocaleDateString("pt-PT")}`, 195, 26, {
      align: "right",
    });
    doc.text(`Hora: ${agora.toLocaleTimeString("pt-PT")}`, 195, 30, {
      align: "right",
    });

    // Linha separadora
    doc.setDrawColor(180);
    doc.setLineWidth(0.2);
    doc.line(14, 52, 195, 52);

    // 2. Resumo / KPIs mais abaixo
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

    doc.text(`Total de Fornecedores: ${totalFornecedores}`, leftX, lineY);
    lineY += 5;
    doc.text(`Ativos: ${totalAtivos}`, leftX, lineY);
    lineY += 5;
    doc.text(`Inativos: ${totalInativos}`, leftX, lineY);

    lineY = resumoY + 7;
    doc.text(`Pendentes: ${totalPendentes}`, middleX, lineY);
    lineY += 5;
    doc.text(`Em Negociação: ${totalNegociacao}`, middleX, lineY);

    lineY = resumoY + 7;
    doc.text(`Limite Total: ${formatValor(totalLimite)}`, rightX, lineY);

    // 3. Título listagem bem separado
    const tabelaStartY = resumoY + 28; // ~88
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.setTextColor(0);
    doc.text("Listagem Detalhada de Fornecedores", 105, tabelaStartY - 3, {
      align: "center",
    });

    // 4. Tabela mais compacta
    autoTable(doc, {
      head: [
        [
          "Nome",
          "Email",
          "Telefone",
          "NIF/NUIT",
          "Empresa",
          "Cidade",
          "Status",
          "Limite Crédito",
        ],
      ],
      body: fornecedores.map((f) => [
        f.nome || "-",
        f.email || "-",
        f.telefone || "-",
        f.nuit || f.nif || "-",
        f.empresa || "-",
        f.cidade || "-",
        f.status || "-",
        formatValor(f.limite_credito || 0),
      ]),
      startY: tabelaStartY + 3,
      theme: "striped",
      headStyles: {
        fillColor: azulAfrica,
        textColor: 255,
        fontSize: 8,
        halign: "center",
      },
      styles: {
        fontSize: 7,
        cellPadding: 1.2, // mais apertado
        valign: "middle",
        overflow: "linebreak",
      },
      columnStyles: {
        0: { cellWidth: 30 }, // Nome
        1: { cellWidth: 34 }, // Email
        2: { cellWidth: 20 }, // Telefone
        3: { cellWidth: 20 }, // NIF/NUIT
        4: { cellWidth: 24 }, // Empresa
        5: { cellWidth: 20 }, // Cidade
        6: { cellWidth: 16 }, // Status
        7: { cellWidth: 24, halign: "right" }, // Limite
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

    doc.save(`Relatorio_Fornecedores_AfricaLegal_${agora.getTime()}.pdf`);
  };

  const pageClasses = isDark
    ? "space-y-6 bg-slate-950 text-slate-100"
    : "space-y-6";

  return (
    <div className={pageClasses}>
      <FornecedorHeader stats={stats} temaAtual={temaAtual} />

      <div>
        <FornecedorStatus
          onAddFornecedor={handleAddFornecedor}
          onExportPDF={handleExportPDF}
          temaAtual={temaAtual}
        />

        <FornecedorTable fornecedores={filtrados} temaAtual={temaAtual} />
      </div>
    </div>
  );
}

export default Fornecedores;
