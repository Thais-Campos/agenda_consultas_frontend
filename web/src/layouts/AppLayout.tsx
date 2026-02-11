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
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="h-14 bg-zinc-900 flex items-center justify-between px-6">
        <h1 className="font-semibold">Agenda de Consultas</h1>

        <button
          onClick={confirmarLogout}
          className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600"
        >
          Sair
        </button>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
