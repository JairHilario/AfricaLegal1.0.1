import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoAl from "../../assets/logo.Al.png";  // 👈 ADICIONADO - Vite cuida do resto!


const EyeIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeSlashIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
  </svg>
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // LOGIN FALSO PARA DEMO / HOSPEDAGEM
    if (email === "Admin" && password === "2026") {
      localStorage.setItem(
        "africaLegalUser",
        JSON.stringify({
          token: "fake-token-2026",
          user: { username: "Admin", role: "admin" },
        })
      );
      navigate("/dashboard");
      setLoading(false);
      return;
    }

    // LOGIN REAL (BACKEND)
    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Usuário ou senha incorretos");
      }

      localStorage.setItem(
        "africaLegalUser",
        JSON.stringify({
          token: data.token,
          user: data.user,
        })
      );

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto h-28 w-28 bg-white rounded-md flex items-center justify-center mb-6 shadow-md border border-sky-200 transition-transform duration-200 hover:scale-105">
            {/* 👇 MUDANÇA: /src/assets/ → {logoAl} */}
            <img src={logoAl} alt="Logo" className="h-20 w-20 object-contain" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Africa Legal · Acesso</h2>
          <p className="text-xs text-slate-500 mt-1">Entre para aceder ao painel de gestão</p>
        </div>

        <div className="bg-white rounded-md p-6 shadow-md border border-sky-100">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Usuário</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-sky-50 border border-sky-200 rounded-md text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-sky-300 focus:border-sky-300 outline-none text-sm"
                placeholder="Digite seu usuário"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 bg-sky-50 border border-sky-200 rounded-md text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-sky-300 focus:border-sky-300 outline-none text-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-2">
                <p className="text-red-600 text-xs">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group w-full bg-sky-500 text-white py-2.5 px-4 rounded-md font-semibold text-sm shadow-md hover:bg-sky-400 focus:ring-2 focus:ring-sky-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="opacity-25"
                    />
                    <path
                      fill="none"
                      opacity=".75"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4 group-hover:translate-x-0.5 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14"
                    />
                  </svg>
                  <span>Entrar</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
