import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import PrivateRoute from "./PrivateRoute";
import AppLayout from "../layouts/AppLayout";
import ClientesPage from "../pages/clientes/ClientesPage";
import ServicosPage from "../pages/servicos/ServicoPage";
import AgendamentosPage from "../pages/agendamentos/AgendamentosPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* Privadas com layout */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }

        >
          <Route index element={<AgendamentosPage />} />
          <Route path="clientes" element={<ClientesPage />} />
          <Route path="servicos" element={<ServicosPage />} />
          <Route path="agendamentos" element={<AgendamentosPage />} />


        </Route>
      </Routes>
    </BrowserRouter>
  );
}
