import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
