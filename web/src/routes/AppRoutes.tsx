import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import PrivateRoute from "./PrivateRoute";

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
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

        {/* Privada */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
