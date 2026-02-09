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
        className="w-full max-w-sm bg-zinc-900 p-6 rounded-xl space-y-4"
      >
        <h1 className="text-xl font-semibold">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded bg-zinc-800 p-2 outline-none"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full rounded bg-zinc-800 p-2 outline-none"
        />

        <button
          type="submit"
          className="w-full bg-emerald-600 p-2 rounded font-medium hover:bg-emerald-500"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
