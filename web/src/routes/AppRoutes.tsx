import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import PrivateRoute from "./PrivateRoute";
import AppLayout from "../layouts/AppLayout";
import ClientesPage from "../pages/clientes/ClientesPage";

function Home() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Área Protegida</h1>
    </div>
  );
}

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
          <Route index element={<Home />} />
            <Route path="clientes" element={<ClientesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
