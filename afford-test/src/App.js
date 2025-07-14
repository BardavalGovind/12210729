import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UrlShortenerPage from "./Question1/ShortenerPage";
import StatisticsPage from "./Question2/StatsPage";
import RedirectHandler from "./Question2/RedirectHandler";

const App = () => {
  return (
    <Router>
      <Routes>
      
        <Route path="/" element={<UrlShortenerPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/:shortCode" element={<RedirectHandler />} />
      </Routes>
    </Router>
  );
};

export default App;
