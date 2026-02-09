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

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="h-14 bg-zinc-900 flex items-center justify-between px-6">
        <h1 className="font-semibold">Agenda de Consultas</h1>

        <button
          onClick={handleLogout}
          className="text-sm bg-zinc-700 px-3 py-1 rounded hover:bg-zinc-600"
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
