import { useNavigate } from "react-router-dom";

export default function NoteCard({ note }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition p-4 flex flex-col">
      <div className="w-full h-32 bg-gray-100 flex items-center justify-center rounded-md mb-4">
        <div className="flex flex-col items-center">
          <span className="text-5xl">📄</span>
          <span className="text-xs text-gray-500 mt-1">
            {note.file.format.toUpperCase()}
          </span>
        </div>
      </div>

      <h3 className="font-semibold text-gray-800 text-sm truncate">
        {note.title || "Untitled Note"}
      </h3>
      <p className="text-xs text-gray-600">{note.courseCode}</p>
      <p className="text-xs text-gray-400">{note.year}</p>

      <button
        onClick={() => navigate(`/read-book/${note.slug}`)}
        className="mt-3 bg-blue-600 cursor-pointer text-white text-sm py-2 rounded-md hover:bg-blue-700 transition"
      >
        Preview
      </button>
    </div>
  );
}
