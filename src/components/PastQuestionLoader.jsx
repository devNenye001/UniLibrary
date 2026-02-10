export default function PastQuestionLoader() {
  return (
    <div className="bg-white border border-blue-50 rounded-2xl shadow-sm p-5 flex flex-col animate-pulse font-['DM_Sans']">
      
      {/* Image Preview Placeholder - matching the 36 height of the real card */}
      <div className="w-full h-36 bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
        {/* Shimmer effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>

      {/* Title Placeholder */}
      <div className="h-4 bg-gray-100 rounded-md w-3/4 mb-3"></div>

      {/* Course Code Placeholder */}
      <div className="h-3 bg-gray-50 rounded-md w-1/4 mb-2"></div>

      {/* Meta Info Placeholder (Exam Type + Year) */}
      <div className="h-3 bg-gray-50 rounded-md w-1/2 mb-5"></div>

      {/* Button Placeholder */}
      <div className="h-10 bg-gray-200 rounded-xl w-full mt-auto"></div>
    </div>
  );
}