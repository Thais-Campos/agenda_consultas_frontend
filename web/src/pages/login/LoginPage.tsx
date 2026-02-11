import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";


export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        senha,
      });

      login(response.data.access_token);
      navigate("/");

    } catch (error) {
      alert("Erro ao fazer login");
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
          className="w-full bg-emerald-600 p-3 rounded-md font-semibold text-white transition hover:bg-emerald-500 active:scale-[0.98]"
        >
          Entrar
        </button>


      </form>
    </div>
  );
}
