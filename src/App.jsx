import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import ReadBook from "./pages/ReadBook";
import Upload from "./pages/Upload";
import ViewPastQuestion from "./pages/ViewPastQuestion";
import LandingPage from "./pages/LandingPage";


export default function App() {
  return (
     <div className="flex flex-col min-h-screen">
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/read-book/:id" element={<ReadBook />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/view-pq/:id" element={<ViewPastQuestion />} />
        <Route path="/library" element={<Home />} />
      </Routes>
    </Router>
      </div>
  );
}
