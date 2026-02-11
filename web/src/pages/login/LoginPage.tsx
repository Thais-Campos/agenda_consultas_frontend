import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";


export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    try {
      const response = await api.post("/auth/login", {
        email,
        senha,
      });

      login(response.data.access_token);
      setLoading(false);
      navigate("/agendamentos");

    } catch (error) {
      setLoading(false);
      setErro("Email ou senha inválidos");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-zinc-900 p-8 rounded-xl space-y-6 shadow-lg"
      >
        <h1 className="text-3xl font-bold text-center text-zinc-100">
          Acesso ao sistema
        </h1>

        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md bg-zinc-800 p-3 text-sm outline-none border border-zinc-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full rounded-md bg-zinc-800 p-3 text-sm outline-none border border-zinc-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-md font-semibold text-white transition
    ${loading
              ? "bg-emerald-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98]"
            }`}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>


        {erro && (
          <p className="text-sm text-red-400 text-center">
            {erro}
          </p>
        )}

      </form>
    </div>
  );
}
