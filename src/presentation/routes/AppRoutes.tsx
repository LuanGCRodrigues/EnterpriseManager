import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { LoginPage } from "../pages";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rota pública */}
          <Route path="/login" element={<LoginPage />} />

          {/* Aqui entrarão as rotas privadas */}

          {/* Redirecionamento padrão */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
