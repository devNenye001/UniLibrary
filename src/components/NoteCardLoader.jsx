export default function NoteCardLoader() {
  return (
    <div className="bg-white  rounded-lg shadow-sm p-4 flex flex-col animate-pulse">
      {/* Placeholder for preview */}
      <div className="w-full h-32 bg-gray-200 rounded-md mb-4 overflow-hidden"></div>

      {/* Title placeholder */}
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>

      {/* Course code */}
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>

      {/* Year */}
      <div className="h-3 bg-gray-200 rounded w-1/3 mb-3"></div>

      {/* Button placeholder */}
      <div className="h-8 bg-gray-300 rounded-md w-full"></div>
    </div>
  );
}
