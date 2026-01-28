import { Outlet } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import Header from "../../Components/Header";
import FooterBar from "../../Components/FooterBar";
import { useState, useEffect } from "react";

const MainLayout = ({ temaAtual, trocarTema, lang = "pt", trocarLang }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const temas = [{ id: "azul", nome: "Tema Azul" }];

  const isDark = temaAtual === "dark";

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div
      className={
        isDark
          ? "flex h-screen bg-slate-950 text-slate-100"
          : "flex h-screen bg-sky-50 text-slate-900"
      }
    >
      <Sidebar colapsado={!sidebarOpen} temaAtual={temaAtual} lang={lang} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          temaAtual={temaAtual}
          trocarTema={trocarTema}
          temas={temas}
          lang={lang}
          trocarLang={trocarLang}
        />

        <main
          className={
            isDark
              ? "flex-1 overflow-y-auto p-2 bg-slate-950 text-slate-100"
              : "flex-1 overflow-y-auto p-2 bg-sky-50 text-slate-900"
          }
        >
          <Outlet />
        </main>

        <FooterBar lang={lang} />
      </div>
    </div>
  );
};

export default MainLayout;
