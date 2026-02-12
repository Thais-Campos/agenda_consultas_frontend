import { Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function AppLayout() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function confirmarLogout() {
    const confirmou = window.confirm("Deseja sair do sistema?");
    if (confirmou) {
      handleLogout();
    }
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-zinc-900 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold mb-8 text-orange-500">
            Agenda
          </h1>

          <nav className="space-y-3">
            <button
              onClick={() => navigate("/")}
              className="w-full text-left px-3 py-2 rounded hover:bg-zinc-800"
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate("/clientes")}
              className="w-full text-left px-3 py-2 rounded hover:bg-zinc-800"
            >
              Clientes
            </button>

            <button
              onClick={() => navigate("/servicos")}
              className="w-full text-left px-3 py-2 rounded hover:bg-zinc-800"
            >
              Serviços
            </button>

            <button
              onClick={() => navigate("/agendamentos")}
              className="w-full text-left px-3 py-2 rounded hover:bg-zinc-800"
            >
              Agendamentos
            </button>

            <button
              onClick={() => navigate("/historico")}
              className="w-full text-left px-3 py-2 rounded hover:bg-zinc-800"
            >
              Histórico
            </button>

          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-10 px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600"
        >
          Sair
        </button>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>

    </div>
  );

}
