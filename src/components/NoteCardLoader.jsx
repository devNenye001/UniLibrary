export default function NoteCardLoader() {
  return (
    <div className="bg-white border border-blue-50 rounded-2xl shadow-sm p-5 flex flex-col animate-pulse">
      {/* Placeholder for preview */}
      <div className="w-full h-36 bg-gray-100 rounded-xl mb-4 overflow-hidden"></div>

      {/* Title placeholder */}
      <div className="h-4 bg-gray-100 rounded w-3/4 mb-3"></div>

      {/* Course code */}
      <div className="h-3 bg-gray-50 rounded w-1/2 mb-2"></div>

      {/* Year */}
      <div className="h-3 bg-gray-50 rounded w-1/3 mb-4"></div>

      {/* Button placeholder */}
      <div className="h-10 bg-gray-200 rounded-xl w-full mt-auto"></div>
    </div>
  );
}