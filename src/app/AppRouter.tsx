import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LoginPage } from "../features/auth/LoginPage/LoginPage";
import { RegisterPage } from "../features/auth/RegisterPage/RegisterPage";
import { BrickCalculator } from "../features/brick/components/BrickCalculator/BrickCalculator";
import { PaintCalculator } from "../features/paint/components/PaintCalculator/PaintCalculator";
import { ConcreteCalculator } from "../features/concrete/components/ConcreteCalculator/ConcreteCalculator";
import { ProtectedRoute } from "../shared/components/ProtectedRoute/ProtectedRoute";
import { HomePage } from "../pages/HomePage/HomePage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/brick"
            element={
              <ProtectedRoute>
                <BrickCalculator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/paint"
            element={
              <ProtectedRoute>
                <PaintCalculator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/concrete"
            element={
              <ProtectedRoute>
                <ConcreteCalculator />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
