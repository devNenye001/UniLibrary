import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";

export default function PastQuestionCard({ pq }) {
  const navigate = useNavigate();

  // Backend returns image as an object: { public_id, url }
  const imageSrc = pq?.image?.url || pq?.previewUrl || "";
  
  return (
    <Motion.div 
      whileHover={{ y: -5 }}
      className="bg-white border border-blue-50 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 p-5 flex flex-col font-['DM_Sans']"
    >
      {/* Container for Preview */}
      <div className="w-full h-32 bg-gray-100 flex items-center justify-center rounded-xl mb-4 overflow-hidden border border-blue-50/20 group">
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={pq.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <span className="text-xs text-gray-400">No preview</span>
        )}
      </div>

      <h3 className="font-semibold text-gray-800 text-sm truncate">
        {pq.title || "Untitled Question"}
      </h3>
      <p className="text-xs font-semibold text-blue-600 mt-1 uppercase tracking-tight">
        {pq.courseCode}
      </p>
      <p className="text-xs font-normal text-gray-400 mt-0.5 mb-3">
        {pq.year}
      </p>

      <button
        onClick={() => navigate(`/view-pq/${pq.slug}`)}
        className="mt-auto bg-blue-600 cursor-pointer text-white text-sm font-semibold py-2 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
      >
        View Question
      </button>
    </Motion.div>
  );
} 