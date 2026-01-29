import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Layout/Login";
import MainLayout from "./Pages/Layout/MainLayout";
import Dashboard from "./Pages/Dashboard/Dashboard";

// ====== ROTAS ANTIGAS ======
import TerceirosLayout from "./Pages/Dashboard/Terceiros/Terceiros";
import Clientes from "./Pages/Dashboard/Terceiros/Clientes";
import Fornecedores from "./Pages/Dashboard/Terceiros/Fornecedores";
import Stock from "./Pages/Dashboard/Stock/Stock";
import Vendas from "./Pages/Dashboard/Vendas/Vendas";
import Tesouraria from "./Pages/Dashboard/Tesouraria/Tesouraria";
import Despesas from "./Pages/Dashboard/Despesas/Despesas";
import Ordens from "./Pages/Dashboard/Ordens/Ordens";
import Relatorios from "./Pages/Dashboard/Relatorio/Relatorios";
import Analises from "./Pages/Dashboard/Analises";

// ====== CONFIGURAÇÕES ======
import ConfiguracoesLayout from "./Pages/Configuracoes/Configuracoes";
import ConfigGerais from "./Pages/Configuracoes/ConfigGerais";
import ConfigRecibos from "./Pages/Configuracoes/ConfigRecibos";

// ====== HEADER LINKS ======
import Perfil from "./Pages/Dashboard/Perfil";
import Novo from "./Pages/Dashboard/Novo";
import Notificacoes from "./Pages/Dashboard/Notificacoes";

import PrivateRoute from "./Components/PrivateRoute";

// ====== Vendas – páginas filhas ======
import Cotacoes from "./Pages/Dashboard/Vendas/Cotacoes";
import Facturas from "./Pages/Dashboard/Vendas/Facturas";
import Vds from "./Pages/Dashboard/Vendas/Vds";
import Pos from "./Pages/Dashboard/Vendas/Pos";
import Recibos from "./Pages/Dashboard/Vendas/Recibos";
import Credito from "./Pages/Dashboard/Vendas/Credito";
import Debito from "./Pages/Dashboard/Vendas/Debito";
import Caixa from "./Pages/Dashboard/Vendas/Caixa";
import Entrega from "./Pages/Dashboard/Vendas/Entrega";
import Transporte from "./Pages/Dashboard/Vendas/Transporte";

// ====== Footer Pages ======
import FeedbackPage from "./Pages/FooterP/FeedbackPage";
import AjudaPage from "./Pages/FooterP/AjudaPage";
import TermosPage from "./Pages/FooterP/TermosPage";
import PrivacidadePage from "./Pages/FooterP/PrivacidadePage";

// ====== NOVO: Contratos & Documentos ======
import ContratosDocumentos from "./Pages/ContratosDocumentosPage";

function App() {
  const [temaAtual, setTemaAtual] = useState(() => {
    const saved = localStorage.getItem("temaAfricaLegal");
    return saved || "dark";
  });

  useEffect(() => {
    localStorage.setItem("temaAfricaLegal", temaAtual);
  }, [temaAtual]);

  const trocarTema = () => {
    setTemaAtual((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Routes>
        <Route path="/Login" element={<Login temaAtual={temaAtual} />} />

        <Route
          path="/Dashboard"
          element={
            <PrivateRoute>
              <MainLayout temaAtual={temaAtual} trocarTema={trocarTema} />
            </PrivateRoute>
          }
        >
          {/* Home do painel */}
          <Route index element={<Dashboard temaAtual={temaAtual} />} />

          {/* ====== ROTAS ANTIGAS ====== */}
          {/* Terceiros */}
          <Route
            path="Terceiros"
            element={<TerceirosLayout temaAtual={temaAtual} />}
          >
            <Route
              index
              element={<Clientes temaAtual={temaAtual} />}
            />
            <Route
              path="Clientes"
              element={<Clientes temaAtual={temaAtual} />}
            />
            <Route
              path="Fornecedores"
              element={<Fornecedores temaAtual={temaAtual} />}
            />
          </Route>

          {/* Sidebar principal antigo */}
          <Route path="Stock" element={<Stock temaAtual={temaAtual} />} />

          {/* Vendas */}
          <Route
            path="Vendas"
            element={<Vendas temaAtual={temaAtual} />}
          >
            <Route
              index
              element={<Navigate to="/Dashboard/Vendas/Cotacoes" replace />}
            />
            <Route
              path="Cotacoes"
              element={<Cotacoes temaAtual={temaAtual} />}
            />
            <Route
              path="Facturas"
              element={<Facturas temaAtual={temaAtual} />}
            />
            <Route
              path="Vds"
              element={<Vds temaAtual={temaAtual} />}
            />
            <Route
              path="Pos"
              element={<Pos temaAtual={temaAtual} />}
            />
            <Route
              path="Recibos"
              element={<Recibos temaAtual={temaAtual} />}
            />
            <Route
              path="Credito"
              element={<Credito temaAtual={temaAtual} />}
            />
            <Route
              path="Debito"
              element={<Debito temaAtual={temaAtual} />}
            />
            <Route
              path="Caixa"
              element={<Caixa temaAtual={temaAtual} />}
            />
            <Route
              path="Entrega"
              element={<Entrega temaAtual={temaAtual} />}
            />
            <Route
              path="Transporte"
              element={<Transporte temaAtual={temaAtual} />}
            />
          </Route>

          <Route
            path="Tesouraria"
            element={<Tesouraria temaAtual={temaAtual} />}
          />
          <Route
            path="Despesas"
            element={<Despesas temaAtual={temaAtual} />}
          />
          <Route
            path="Ordens"
            element={<Ordens temaAtual={temaAtual} />}
          />
          <Route
            path="Relatorios"
            element={<Relatorios temaAtual={temaAtual} />}
          />
          <Route
            path="Analises"
            element={<Analises temaAtual={temaAtual} />}
          />

          {/* NOVO: Contratos & Documentos */}
          <Route
            path="Contratos-Documentos"
            element={<ContratosDocumentos temaAtual={temaAtual} />}
          />

          {/* Header links */}
          <Route
            path="Perfil"
            element={<Perfil temaAtual={temaAtual} />}
          />
          <Route
            path="Novo"
            element={<Novo temaAtual={temaAtual} />}
          />
          <Route
            path="Notificacoes"
            element={<Notificacoes temaAtual={temaAtual} />}
          />

          {/* Configurações */}
          <Route
            path="Configuracoes"
            element={<ConfiguracoesLayout temaAtual={temaAtual} />}
          >
            <Route
              index
              element={<ConfigGerais temaAtual={temaAtual} />}
            />
            <Route
              path="Ceral"
              element={<ConfigGerais temaAtual={temaAtual} />}
            />
            <Route
              path="Recibos"
              element={<ConfigRecibos temaAtual={temaAtual} />}
            />
          </Route>

          {/* ====== Footer Pages dentro de /Dashboard ====== */}
          <Route
            path="Feedback"
            element={<FeedbackPage temaAtual={temaAtual} />}
          />
          <Route
            path="Ajuda"
            element={<AjudaPage temaAtual={temaAtual} />}
          />
          <Route
            path="Termos"
            element={<TermosPage temaAtual={temaAtual} />}
          />
          <Route
            path="Privacidade"
            element={<PrivacidadePage temaAtual={temaAtual} />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/Login" />} />
      </Routes>
    </div>
  );
}

export default App;
