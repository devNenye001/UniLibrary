import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import Logo from "../assets/Logo.svg";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <nav className="w-full  bg-white shadow-sm px-6 py-3 flex items-center justify-between">
      <div className="max-w-6xl mx-auto flex items-center w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="UniLibrary Logo" className="h-8 w-auto" />
        </Link>
        {/* Centered search + upload */}
        <div className="flex items-center justify-end flex-1">
          <div className="flex items-center w-1/2 max-w-lg relative">
            <IoSearch className="absolute left-3 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search for lecture notes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* Upload Button */}
          <Link
            to="/upload"
            className="ml-4 bg-blue-600 text-white px-10 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            Upload
          </Link>
        </div>
      </div>
    </nav>
  );
}
