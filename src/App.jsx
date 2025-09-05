import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import ReadBook from "./pages/ReadBook";
import Upload from "./pages/Upload";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/read-book/:id" element={<ReadBook />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </Router>
  );
}
