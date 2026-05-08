import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatbotWidget from "./components/ChatbotWidget";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import NotFound from "./pages/NotFound";
import AdminPanel from "./pages/AdminPanel";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMaterials from "./pages/admin/AdminMaterials";
import AdminUsers from "./pages/admin/AdminUsers";
import AnalyticsDashboard from "./pages/admin/AnalyticsDashboard";
import ChatbotPage from "./pages/ChatbotPage";
import ForgotPassword from "./pages/ForgotPassword";
import LandingPage from "./pages/LandingPage";
import LecturerDashboard from "./pages/lecturer/LecturerDashboard";
import MyUploads from "./pages/lecturer/MyUploads";
import UploadMaterial from "./pages/lecturer/UploadMaterial";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RecommendationsPage from "./pages/RecommendationsPage";
import BrowseMaterials from "./pages/student/BrowseMaterials";
import MaterialDetail from "./pages/student/MaterialDetail";
import MyHistory from "./pages/student/MyHistory";
import SearchPage from "./pages/student/SearchPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import Upload from "./pages/Upload";

function AuthenticatedWidgets() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;
  return <ChatbotWidget />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "DM Sans, sans-serif",
            borderRadius: "0.75rem",
          },
          success: { style: { borderLeft: "4px solid #234876" } },
          error: { style: { borderLeft: "4px solid #ef4444" } },
        }}
      />
      <BrowserRouter>
        <AuthenticatedWidgets />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/browse"
            element={
              <ProtectedRoute>
                <BrowseMaterials />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/materials/:id"
            element={
              <ProtectedRoute>
                <MaterialDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <MyHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute>
                <RecommendationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatbotPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/lecturer/dashboard"
            element={
              <ProtectedRoute allowedRoles={["lecturer", "admin"]}>
                <LecturerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute allowedRoles={["lecturer", "admin"]}>
                <Upload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lecturer/upload"
            element={
              <ProtectedRoute allowedRoles={["lecturer", "admin"]}>
                <UploadMaterial />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lecturer/uploads"
            element={
              <ProtectedRoute allowedRoles={["lecturer", "admin"]}>
                <MyUploads />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AnalyticsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/materials"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminMaterials />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
