import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import liliLogin from "../../assets/lili-login.png"; 


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
    <div className="h-screen flex overflow-hidden">

      {/* LADO ESQUERDO */}
      <div className="w-1/2 flex items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="w-full max-w-md px-8">
          <h1 className="text-3xl font-bold mb-2">
            Acesse sua conta
          </h1>
          <p className="text-zinc-400 mb-6">
            Insira seus dados abaixo
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-3 text-sm text-zinc-100 placeholder-zinc-400 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />

            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-3 text-sm text-zinc-100 placeholder-zinc-400 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />


            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white p-3 rounded-md hover:bg-orange-600 transition"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            {erro && (
              <p className="text-red-500 text-sm">
                {erro}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* LADO DIREITO */}
      <div className="w-1/2 hidden md:block">
        <img
          src={liliLogin}
          alt="Pet Shop"
          className="w-full h-full object-cover"
        />

      </div>

    </div>
  );
}
