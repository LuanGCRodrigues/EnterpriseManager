import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { MainLayout } from "../layouts/MainLayout";
import { EnterprisesPage, HomePage, LoginPage, ReportsPage } from "../pages";
import { ProtectedRoute } from "./ProtectedRoute";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rota pública */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rotas protegidas */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="empreendimentos" element={<EnterprisesPage />} />
            <Route path="relatorios" element={<ReportsPage />} />
          </Route>

          {/* Redirecionamento padrão */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
