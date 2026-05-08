// Barrel re-export — all service modules in one place.
// Existing pages that import from api.js continue to work unchanged.

// ── Auth ──────────────────────────────────────────────────────────────────────
export {
  login as loginUser,
  register as registerUser,
  forgotPassword,
} from "./auth.service.js";

// ── Materials ─────────────────────────────────────────────────────────────────
export {
  getMaterials,
  getMaterial,
  getMaterialById,
  getDocuments,
  uploadMaterial,
  uploadDocument,
  updateMaterial,
  deleteMaterial,
  viewMaterial as logMaterialView,
  getLecturerStats,
  getLecturerMaterials,
  getStudentStats,
  getViewHistory,
} from "./material.service.js";

// ── Search ────────────────────────────────────────────────────────────────────
export {
  semanticSearch as searchMaterials,
  keywordSearch as searchDocuments,
} from "./search.service.js";

// ── Recommendations ───────────────────────────────────────────────────────────
export {
  getRecommendations as getStudentRecommendations,
  getPopular as getPopularMaterials,
  getSimilar as getSimilarMaterials,
  getRecommendationsByRole as getRecommendations,
} from "./recommendation.service.js";

// ── Admin ─────────────────────────────────────────────────────────────────────
export {
  getStats as getAdminStats,
  getUsers,
  approveUser,
  rejectUser,
  approveMaterial,
  rejectMaterial,
} from "./admin.service.js";

// ── Chatbot ───────────────────────────────────────────────────────────────────
export { sendMessage } from "./chatbot.service.js";
