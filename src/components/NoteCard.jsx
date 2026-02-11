import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";

export default function NoteCard({ note }) {
  const navigate = useNavigate();
  const format = note?.file?.format || "pdf";
  
  return (
    <Motion.div 
      whileHover={{ y: -5 }}
      className="bg-white border border-blue-50 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 p-5 flex flex-col font-['DM_Sans']"
    >
      {/* Container for preview - maintained structure */}
      <div className="w-full h-36 bg-gradient-to-br from-blue-50 to-white flex items-center justify-center rounded-xl mb-4 border border-blue-50/50">
        <div className="flex flex-col items-center">
          <span className="text-5xl filter drop-shadow-sm">📄</span>
          <span className="text-[10px] font-semibold text-blue-400 mt-2 tracking-widest">
            {String(format).toUpperCase()}
          </span>
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 text-sm truncate mb-1">
        {note.title || "Untitled Note"}
      </h3>
      <p className="text-xs font-semibold text-blue-600 mb-0.5 uppercase tracking-tighter">
        {note.courseCode}
      </p>
      <p className="text-xs font-normal text-gray-400 mb-4">{note.year}</p>

      <button
        onClick={() => navigate(`/read-book/${note.slug}`)}
        className="mt-auto bg-blue-600 cursor-pointer text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-blue-700 shadow-lg transition-all active:scale-95"
      >
        Preview
      </button>
    </Motion.div>
  );
}