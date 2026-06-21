import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";

export default function NoteCard({ note }) {
  const navigate = useNavigate();
  const format = note?.file?.format || "pdf";
  
  return (
    <Motion.div 
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="glass-card p-6 flex flex-col transition-all hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
    >
      {/* Container for preview - maintained structure */}
      <div className="w-full h-36 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-xl mb-5 border border-white/40 shadow-inner">
        <div className="flex flex-col items-center">
          <span className="text-5xl filter drop-shadow-sm">📄</span>
          <span className="text-[10px] font-bold text-campus-600 mt-3 tracking-[0.2em]">
            {String(format).toUpperCase()}
          </span>
        </div>
      </div>

      <h3 className="font-bold text-slate-900 text-lg tracking-tight truncate mb-1">
        {note.title || "Untitled Note"}
      </h3>
      <p className="text-xs font-bold text-campus-600 mb-1 uppercase tracking-widest">
        {note.courseCode}
      </p>
      <p className="text-sm font-medium text-slate-500 mb-5">{note.year}</p>

      <button
        onClick={() => navigate(`/read-book/${note.slug}`)}
        className="mt-auto rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-800 hover:shadow-lg active:scale-95"
      >
        Preview Note
      </button>
    </Motion.div>
  );
}