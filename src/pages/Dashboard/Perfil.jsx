import { useEffect, useState } from "react";

const Perfil = ({ temaAtual = "light" }) => {
  const [userAtual, setUserAtual] = useState({
    nome: "Admin Master",
    email: "",
    role: "",
    empresa: "Minha Empresa Lda",
  });

  const [avatar, setAvatar] = useState(null);
  const [editando, setEditando] = useState(false);

  const [perfilForm, setPerfilForm] = useState({
    nome: "",
    email: "",
    role: "",
    empresa: "Minha Empresa Lda",
  });

  const [novoUser, setNovoUser] = useState({
    nome: "",
    email: "",
    role: "Utilizador",
    senha: "",
  });

  const [users, setUsers] = useState([]);

  const isAdmin = userAtual.role === "Administrador";
  const isDark = temaAtual === "dark";

  const containerClass = isDark
    ? "overflow-hidden rounded-xl border border-slate-700 bg-slate-900/80 shadow-2xl backdrop-blur-xl p-6 space-y-6 text-slate-50"
    : "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg p-6 space-y-6 text-slate-900";

  const baseInput =
    "w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors";
  const inputClass = isDark
    ? `${baseInput} bg-slate-900 border-slate-600 text-slate-50 focus:border-sky-500`
    : `${baseInput} bg-white border-slate-300 text-slate-900 focus:border-sky-500`;

  const selectClass = inputClass;

  const primaryBtn = isDark
    ? "px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-medium transition-colors"
    : "px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium transition-colors";

  const secondaryBtn = isDark
    ? "px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
    : "px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-sm font-medium transition-colors";

  const subtleText = isDark ? "text-slate-300" : "text-slate-500";
  const labelText =
    "text-xs font-semibold tracking-wide uppercase " + subtleText;

  useEffect(() => {
    const savedAuth = localStorage.getItem("africaLegalUser");
    if (!savedAuth) return;

    try {
      const parsed = JSON.parse(savedAuth);
      const u = parsed.user || {};
      const username = u.username || null;

      const displayNameLocal = localStorage.getItem("displayName");
      const nome = displayNameLocal || u.username || "Admin Master";

      const roleMap = {
        admin: "Administrador",
        gestor: "Gestor",
        utilizador: "Utilizador",
      };
      const role = roleMap[u.role] || "Utilizador";

      setUserAtual((prev) => ({
        ...prev,
        nome,
        email: u.email || "",
        role,
      }));

      setPerfilForm((prev) => ({
        ...prev,
        nome,
        email: u.email || "",
        role,
      }));

      if (username) {
        const avatarKey = `avatar:${username}`;
        const savedAvatar = localStorage.getItem(avatarKey);
        if (savedAvatar) setAvatar(savedAvatar);
      } else {
        const savedAvatar = localStorage.getItem("avatar");
        if (savedAvatar) setAvatar(savedAvatar);
      }

      const { token } = parsed;

      const fetchUsers = async () => {
        const res = await fetch("http://localhost:4000/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Erro ao buscar utilizadores");
          return;
        }

        const data = await res.json();

        const roleFromBackendMap = {
          admin: "Administrador",
          gestor: "Gestor",
          utilizador: "Utilizador",
        };

        setUsers(
          data.map((user) => ({
            id: user.id,
            nome: user.username,
            email: user.email || "",
            role: roleFromBackendMap[user.role] || "Utilizador",
            senha: "******",
          }))
        );
      };

      if (role === "Administrador") {
        fetchUsers().catch((e) => console.error("Erro ao buscar users", e));
      }
    } catch (e) {
      console.error("Erro ao ler africaLegalUser", e);
    }
  }, []);

  const handleToggleEdit = () => {
    if (!editando) {
      setPerfilForm({
        nome: userAtual.nome,
        email: userAtual.email,
        role: userAtual.role,
        empresa: userAtual.empresa,
      });
      setEditando(true);
      return;
    }

    if (!perfilForm.nome || !perfilForm.email) return;

    setUserAtual((prev) => ({
      ...prev,
      nome: perfilForm.nome,
      email: perfilForm.email,
      role: perfilForm.role,
      empresa: perfilForm.empresa,
    }));

    localStorage.setItem("displayName", perfilForm.nome);

    setEditando(false);
  };

  const handleCancelEdit = () => {
    setPerfilForm({
      nome: userAtual.nome,
      email: userAtual.email,
      role: userAtual.role,
      empresa: userAtual.empresa,
    });
    setEditando(false);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!novoUser.nome || !novoUser.email || !novoUser.senha) return;

    const savedAuth = localStorage.getItem("africaLegalUser");
    if (!savedAuth) {
      alert("Sessão expirada. Faça login novamente.");
      return;
    }

    const { token } = JSON.parse(savedAuth);

    const roleToBackend = {
      Utilizador: "utilizador",
      Gestor: "gestor",
      Administrador: "admin",
    };
    const roleBackend = roleToBackend[novoUser.role] || "utilizador";

    try {
      const response = await fetch("http://localhost:4000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: novoUser.email,
          role: roleBackend,
          password: novoUser.senha,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar utilizador");
      }

      const roleFromBackendMap = {
        admin: "Administrador",
        gestor: "Gestor",
        utilizador: "Utilizador",
      };
      const roleAmigavel = roleFromBackendMap[data.role] || "Utilizador";

      setUsers((prev) => [
        ...prev,
        {
          id: data.id,
          nome: data.username,
          email: data.email || "",
          role: roleAmigavel,
          senha: "******",
        },
      ]);

      setNovoUser({
        nome: "",
        email: "",
        role: "Utilizador",
        senha: "",
      });
    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao criar utilizador");
    }
  };

  const handleRemove = async (id) => {
    const savedAuth = localStorage.getItem("africaLegalUser");
    if (!savedAuth) return;

    const { token } = JSON.parse(savedAuth);

    try {
      const res = await fetch(`http://localhost:4000/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok && res.status !== 204) {
        alert("Erro ao remover utilizador");
        return;
      }

      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      console.error(e);
      alert("Erro ao remover utilizador");
    }
  };

  const handleUploadClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const src = ev.target.result;

          const savedAuth = localStorage.getItem("africaLegalUser");
          if (savedAuth) {
            try {
              const parsed = JSON.parse(savedAuth);
              const u = parsed.user || {};
              if (u.username) {
                const avatarKey = `avatar:${u.username}`;
                localStorage.setItem(avatarKey, src);
              } else {
                localStorage.setItem("avatar", src);
              }
            } catch (e) {
              console.error("Erro ao gravar avatar", e);
              localStorage.setItem("avatar", src);
            }
          } else {
            localStorage.setItem("avatar", src);
          }

          setAvatar(src);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className={containerClass}>
      {/* Cabeçalho + avatar */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          {avatar ? (
            <img
              src={avatar}
              alt={userAtual.nome}
              className="h-14 w-14 rounded-full object-cover shadow-lg"
            />
          ) : (
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-sky-500 to-emerald-400 flex items-center justify-center text-xl font-bold text-white shadow-lg">
              {userAtual.nome.charAt(0)}
            </div>
          )}

          <button
            onClick={handleUploadClick}
            aria-label="Alterar foto de perfil"
            className={
              "absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shadow-lg hover:scale-110 transition-all " +
              (isDark
                ? "bg-white text-gray-800 hover:bg-gray-100"
                : "bg-slate-900 text-white hover:bg-slate-800")
            }
          >
            +
          </button>
        </div>

        <div className="flex-1">
          <h1
            className={
              "text-2xl font-semibold " + (isDark ? "text-slate-50" : "text-slate-900")
            }
          >
            Perfil do Utilizador
          </h1>
          <p className={"text-sm " + (isDark ? "text-slate-200" : "text-slate-600")}>
            Dados pessoais, segurança e gestão de utilizadores.
          </p>
        </div>

        <div className="flex gap-2">
          {editando && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className={secondaryBtn}
            >
              Cancelar
            </button>
          )}
          <button
            type="button"
            onClick={handleToggleEdit}
            className={primaryBtn}
          >
            {editando ? "Guardar alterações" : "Editar perfil"}
          </button>
        </div>
      </div>

      {/* Dados principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <p className={labelText}>Nome</p>
          {editando ? (
            <input
              type="text"
              value={perfilForm.nome}
              onChange={(e) =>
                setPerfilForm((prev) => ({ ...prev, nome: e.target.value }))
              }
              className={inputClass}
            />
          ) : (
            <p className={isDark ? "text-[15px] text-slate-50" : "text-[15px] text-slate-900"}>
              {userAtual.nome}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <p className={labelText}>Email</p>
          {editando ? (
            <input
              type="email"
              value={perfilForm.email}
              onChange={(e) =>
                setPerfilForm((prev) => ({ ...prev, email: e.target.value }))
              }
              className={inputClass}
            />
          ) : (
            <p className={isDark ? "text-[15px] text-slate-50" : "text-[15px] text-slate-900"}>
              {userAtual.email || "—"}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <p className={labelText}>Função</p>
          {editando ? (
            <select
              value={perfilForm.role}
              onChange={(e) =>
                setPerfilForm((prev) => ({ ...prev, role: e.target.value }))
              }
              className={selectClass}
            >
              <option>Utilizador</option>
              <option>Gestor</option>
              <option>Administrador</option>
            </select>
          ) : (
            <p className={isDark ? "text-[15px] text-slate-50" : "text-[15px] text-slate-900"}>
              {userAtual.role}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <p className={labelText}>Empresa</p>
          {editando ? (
            <input
              type="text"
              value={perfilForm.empresa}
              onChange={(e) =>
                setPerfilForm((prev) => ({
                  ...prev,
                  empresa: e.target.value,
                }))
              }
              className={inputClass}
            />
          ) : (
            <p className={isDark ? "text-[15px] text-slate-50" : "text-[15px] text-slate-900"}>
              {userAtual.empresa}
            </p>
          )}
        </div>
      </div>

      {/* Info extra */}
      <div
        className={
          "grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm pt-4 border-t " +
          (isDark ? "border-white/10" : "border-slate-200")
        }
      >
        <div className="space-y-1">
          <p className={labelText}>Telefone</p>
          <p className={isDark ? "text-[15px] text-slate-100" : "text-[15px] text-slate-800"}>
            +258 84 000 0000
          </p>
        </div>
        <div className="space-y-1">
          <p className={labelText}>Localização</p>
          <p className={isDark ? "text-[15px] text-slate-100" : "text-[15px] text-slate-800"}>
            Maputo, Moçambique
          </p>
        </div>
        <div className="space-y-1">
          <p className={labelText}>Fuso horário</p>
          <p className={isDark ? "text-[15px] text-slate-100" : "text-[15px] text-slate-800"}>
            GMT+2
          </p>
        </div>
      </div>

      {/* Gestão de utilizadores */}
      {isAdmin && (
        <div
          className={
            "mt-8 pt-6 space-y-4 border-t " +
            (isDark ? "border-white/10" : "border-slate-200")
          }
        >
          <h2
            className={
              "text-lg font-semibold " +
              (isDark ? "text-slate-50" : "text-slate-900")
            }
          >
            Gestão de Utilizadores
          </h2>

          <form
            onSubmit={handleAddUser}
            className="grid grid-cols-1 md:grid-cols-5 gap-3 text-sm"
          >
            <input
              type="text"
              placeholder="Nome"
              value={novoUser.nome}
              onChange={(e) =>
                setNovoUser((prev) => ({ ...prev, nome: e.target.value }))
              }
              className={inputClass}
            />
            <input
              type="email"
              placeholder="Email"
              value={novoUser.email}
              onChange={(e) =>
                setNovoUser((prev) => ({ ...prev, email: e.target.value }))
              }
              className={inputClass}
            />
            <input
              type="password"
              placeholder="Senha"
              value={novoUser.senha}
              onChange={(e) =>
                setNovoUser((prev) => ({ ...prev, senha: e.target.value }))
              }
              className={inputClass}
            />
            <select
              value={novoUser.role}
              onChange={(e) =>
                setNovoUser((prev) => ({ ...prev, role: e.target.value }))
              }
              className={selectClass}
            >
              <option>Utilizador</option>
              <option>Gestor</option>
              <option>Administrador</option>
            </select>
            <button
              type="submit"
              className={
                isDark
                  ? "px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                  : "px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              }
            >
              Adicionar
            </button>
          </form>

          <div
            className={
              isDark
                ? "max-h-60 overflow-y-auto rounded-lg border border-slate-700/70 bg-slate-900/60"
                : "max-h-60 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50"
            }
          >
            <table className="w-full text-xs text-left">
              <thead
                className={
                  isDark
                    ? "bg-slate-900/80 text-slate-400 sticky top-0"
                    : "bg-slate-100 text-slate-600 sticky top-0"
                }
              >
                <tr>
                  <th className="px-3 py-2">Nome</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Função</th>
                  <th className="px-3 py-2 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className={
                      isDark
                        ? "border-t border-slate-700/60"
                        : "border-t border-slate-200"
                    }
                  >
                    <td className="px-3 py-2">{u.nome}</td>
                    <td className="px-3 py-2">{u.email}</td>
                    <td className="px-3 py-2">{u.role}</td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemove(u.id)}
                        className={
                          "px-2 py-1 rounded text-xs " +
                          (isDark
                            ? "text-red-400 hover:text-red-300 hover:bg-red-500/20"
                            : "text-red-600 hover:text-red-500 hover:bg-red-100")
                        }
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className={
                        "px-3 py-4 text-center " +
                        (isDark ? "text-slate-500" : "text-slate-400")
                      }
                    >
                      Nenhum utilizador registado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className={"text-[10px] " + subtleText}>
            As senhas são sempre guardadas como hash no backend; aqui mostramos
            apenas “******”.
          </p>
        </div>
      )}
    </div>
  );
};

export default Perfil;
