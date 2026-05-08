import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPanel from "./pages/AdminPanel";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMaterials from "./pages/admin/AdminMaterials";
import AdminUsers from "./pages/admin/AdminUsers";
import ChatbotPage from "./pages/ChatbotPage";
import ForgotPassword from "./pages/ForgotPassword";
import LandingPage from "./pages/LandingPage";
import LecturerDashboard from "./pages/lecturer/LecturerDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RecommendationsPage from "./pages/RecommendationsPage";
import SearchResults from "./pages/SearchResults";
import BrowseMaterials from "./pages/student/BrowseMaterials";
import MyHistory from "./pages/student/MyHistory";
import StudentDashboard from "./pages/student/StudentDashboard";
import Upload from "./pages/Upload";

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
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Student routes */}
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
                <SearchResults />
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

          {/* Lecturer routes */}
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

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
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

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
