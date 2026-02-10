import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();


  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };


  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-blue-50 font-['DM_Sans']">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Left: Logo & Core Links */}
        <div className="flex items-center gap-10">
        <Link 
  to="/library" 
  className="flex items-center gap-3 group transition-all duration-300"
>
  {/* Logo with a soft rounded edge and hover lift */}
  <img 
    src="./logo1.jpg" 
    alt="GoLibrary Logo" 
    className="h-9 w-auto rounded-lg object-contain transition-transform group-hover:scale-110" 
  />
  
  {/* Text using DM Sans SemiBold (600) */}
  <p className="font-['DM_Sans'] font-semibold text-xl tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
   <span className="text-black-600">GoLibrary</span>
  </p>
</Link>

          
        </div>

        {/* Center/Right: Search & Actions */}
        <div className="flex items-center gap-4 flex-1 justify-end max-w-2xl">
          <div className="relative w-full max-w-md group">
            <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search Course Name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-blue-50/50 border border-transparent rounded-2xl pl-12 pr-4 py-2.5 text-sm font-normal focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/upload"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 text-sm font-semibold shadow-lg transition-all active:scale-95"
            >
              Upload 
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}