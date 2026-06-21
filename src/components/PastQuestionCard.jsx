import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";

export default function PastQuestionCard({ pq }) {
  const navigate = useNavigate();

  // Backend returns image as an object: { public_id, url }
  const imageSrc = pq?.image?.url || pq?.previewUrl || "";
  
  return (
    <Motion.div 
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="glass-card p-6 flex flex-col transition-all hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
    >
      {/* Container for Preview */}
      <div className="w-full h-32 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-xl mb-5 overflow-hidden border border-white/40 shadow-inner group">
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={pq.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <span className="text-xs font-medium text-slate-400 tracking-widest uppercase">No preview</span>
        )}
      </div>

      <h3 className="font-bold text-slate-900 text-lg tracking-tight truncate">
        {pq.title || "Untitled Question"}
      </h3>
      <p className="text-xs font-bold text-campus-600 mt-1 uppercase tracking-widest">
        {pq.courseCode}
      </p>
      <p className="text-sm font-medium text-slate-500 mt-1 mb-5">
        {pq.year}
      </p>

      <button
        onClick={() => navigate(`/view-pq/${pq.slug}`)}
        className="mt-auto rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-800 hover:shadow-lg active:scale-95"
      >
        View Question
      </button>
    </Motion.div>
  );
}