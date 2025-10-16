import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import History from "./components/History";
import Home from "./Home";
import Playlist from "./components/Playlist";
import Developer from "./components/Developer";
import Footer from "./components/Footer";

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );

  // ✅ Apply global dark/light theme to <html> element
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("bg-gray-900", "text-white");
      document.body.classList.remove("bg-white", "text-gray-900");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.add("bg-white", "text-gray-900");
      document.body.classList.remove("bg-gray-900", "text-white");
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const deleteFromHistory = (trackName) => {
    const updated = history.filter((s) => s.trackName !== trackName);
    setHistory(updated);
    localStorage.setItem("history", JSON.stringify(updated));
  };

  return (
    <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen transition-all`}>
      <Router>
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <div className="pt-20 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route
              path="/"
              element={<Home theme={theme} history={history} setHistory={setHistory} />}
            />
            <Route
              path="/playlist"
              element={<Playlist theme={theme} history={history} setHistory={setHistory} />}
            />
            <Route
              path="/history"
              element={<History theme={theme} history={history} deleteFromHistory={deleteFromHistory} />}
            />
            <Route
              path="/developer"
              element={<Developer theme={theme} />}
            />
            {/* <Route
              path="/login"
              element={<Login theme={theme} />}
            /> */}
          </Routes>
        </div>
      </Router>
      <Footer theme={theme} />
    </div>
  );
}
