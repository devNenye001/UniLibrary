import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import axiosClient from "./services/axiosClient";
import { AnimatePresence } from "framer-motion";
import ChatbotWidget from "./components/ChatbotWidget";
import ProtectedRoute from "./components/ProtectedRoute";
import PageWrapper from "./components/layouts/PageWrapper";
import AdminLayout from "./components/admin/AdminLayout";
import { useAuth } from "./context/AuthContext";
import NotFound from "./pages/NotFound";
import AdminPanel from "./pages/AdminPanel";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMaterials from "./pages/admin/AdminMaterials";
import AdminUsers from "./pages/admin/AdminUsers";
import AnalyticsDashboard from "./pages/admin/AnalyticsDashboard";
import PendingApprovals from "./pages/admin/PendingApprovals";
import ChatbotPage from "./pages/ChatbotPage";
import ForgotPassword from "./pages/ForgotPassword";
import LandingPage from "./pages/LandingPage";
import LecturerDashboard from "./pages/lecturer/LecturerDashboard";
import MyUploads from "./pages/lecturer/MyUploads";
import UploadMaterial from "./pages/lecturer/UploadMaterial";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RecommendationsPage from "./pages/RecommendationsPage";
import ResetPassword from "./pages/ResetPassword";
import BrowseMaterials from "./pages/student/BrowseMaterials";
import MaterialDetail from "./pages/student/MaterialDetail";
import MyHistory from "./pages/student/MyHistory";
import SearchPage from "./pages/student/SearchPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import Upload from "./pages/Upload";

function AuthenticatedWidgets() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated || location.pathname === "/chat") return null;
  return <ChatbotWidget />;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
        <Route path="/reset-password/:token" element={<PageWrapper><ResetPassword /></PageWrapper>} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <PageWrapper><StudentDashboard /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/browse"
          element={
            <ProtectedRoute>
              <PageWrapper><BrowseMaterials /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <PageWrapper><SearchPage /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/materials/:id"
          element={
            <ProtectedRoute>
              <PageWrapper><MaterialDetail /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <PageWrapper><MyHistory /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <PageWrapper><RecommendationsPage /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <PageWrapper><ChatbotPage /></PageWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/lecturer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["lecturer"]}>
              <PageWrapper><LecturerDashboard /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute allowedRoles={["lecturer"]}>
              <PageWrapper><Upload /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lecturer/upload"
          element={
            <ProtectedRoute allowedRoles={["lecturer"]}>
              <PageWrapper><UploadMaterial /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lecturer/uploads"
          element={
            <ProtectedRoute allowedRoles={["lecturer"]}>
              <PageWrapper><MyUploads /></PageWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <PageWrapper><AdminDashboard /></PageWrapper>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <PageWrapper><AnalyticsDashboard /></PageWrapper>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <PageWrapper><AdminPanel /></PageWrapper>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <PageWrapper><AdminUsers /></PageWrapper>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/approvals"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <PageWrapper><PendingApprovals /></PageWrapper>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/materials"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <PageWrapper><AdminMaterials /></PageWrapper>
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  useEffect(() => {
    // Initial wake-up ping to wake up Render free tier backend instantly on client load
    axiosClient.get("/health").catch(() => {});

    // Periodic ping every 5 minutes to keep it awake while any client is active
    const interval = setInterval(() => {
      axiosClient.get("/health").catch(() => {});
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "Inter, sans-serif",
            borderRadius: "1rem",
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.5)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          },
          success: { style: { borderLeft: "4px solid #30d158" } },
          error: { style: { borderLeft: "4px solid #ef4444" } },
        }}
      />
      <BrowserRouter>
        <AuthenticatedWidgets />
        <AnimatedRoutes />
      </BrowserRouter>
    </div>
  );
}
