// src/components/NoteCard.jsx
export default function NoteCard({ note }) {
  return (
    <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition p-4 flex flex-col">
      {/* PDF Preview Placeholder */}
      <div className="w-full h-32 bg-gray-100 flex items-center justify-center rounded-md mb-4">
        <div className="flex flex-col items-center">
          <span className="text-5xl">📄</span>
          <span className="text-xs text-gray-500 mt-1">PDF</span>
        </div>
      </div>

      {/* Note Info */}
      <h3 className="font-semibold text-gray-800 text-sm truncate">
        {note.title || "Untitled Note"}
      </h3>
      <p className="text-xs text-gray-600">{note.course}</p>
      <p className="text-xs text-gray-400">{note.year}</p>

      {/* Action Button */}
      <button
        onClick={() => window.open(note.fileUrl, "_blank")}
        className="mt-3 bg-blue-600 text-white text-sm py-2 rounded-md hover:bg-blue-700 transition"
      >
        Preview
      </button>
    </div>
  );
}
