import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import type { JSX } from "react";
import { useAppSelector } from "./app/hook";
import Register from "./pages/Register";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = useAppSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicRoute({ children }: { children: JSX.Element }) {
  const token = useAppSelector((state) => state.auth.token);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}