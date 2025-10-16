import React, { useRef } from "react";
import Developer from "../../public/Developer.mp3";
import {
  SunIcon,
  MoonIcon,
  UserCircleIcon,
  ClockIcon,
  QueueListIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const audioRef = useRef(new Audio("" + Developer)); 

  const playDeveloperMusic = () => {
    const audio = audioRef.current;
    audio.currentTime = 0; 
    audio.play().catch(() => {
      console.warn("Autoplay blocked, user interaction required");
    });
    navigate("/developer"); 
  };

  return (
    <nav
      className={`
        fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-opacity-60
        ${theme === "dark" ? "bg-gray-900/70 text-white" : "bg-white/70 text-gray-900"}
        shadow-lg transition-all duration-300
      `}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold text-emerald-500 hover:text-emerald-400 transition"
        >
          Vibes
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="hover:text-emerald-400 flex items-center gap-2 transition"
          >
            <HomeIcon className="w-5 h-5" />
            Home
          </Link>

          <Link
            to="/playlist"
            className="hover:text-emerald-400 flex items-center gap-2 transition"
          >
            <QueueListIcon className="w-5 h-5" />
            Playlist
          </Link>

          <Link
            to="/history"
            className="hover:text-emerald-400 flex items-center gap-2 transition"
          >
            <ClockIcon className="w-5 h-5" />
            History
          </Link>

          {/* ✅ Developer link with music */}
          <button
            onClick={playDeveloperMusic}
            className="hover:text-emerald-400 flex items-center gap-2 transition"
          >
            <UserCircleIcon className="w-5 h-5" />
            Developer
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-800/20 transition"
          >
            {theme === "dark" ? (
              <SunIcon className="w-6 h-6 text-yellow-400" />
            ) : (
              <MoonIcon className="w-6 h-6 text-gray-800" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-800/20 transition"
          >
            {theme === "dark" ? (
              <SunIcon className="w-6 h-6 text-yellow-400" />
            ) : (
              <MoonIcon className="w-6 h-6 text-gray-800" />
            )}
          </button>

          <details className="relative">
            <summary className="list-none cursor-pointer text-emerald-400 text-2xl font-bold">
              ☰
            </summary>
            <div
              className={`absolute right-0 mt-2 rounded-xl shadow-lg p-4 flex flex-col gap-3 min-w-[160px] ${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-900"
              }`}
            >
              <Link to="/" className="hover:text-emerald-400 transition">
                Home
              </Link>
              <Link to="/playlist" className="hover:text-emerald-400 transition">
                Playlist
              </Link>
              <Link to="/history" className="hover:text-emerald-400 transition">
                History
              </Link>
              {/* ✅ Mobile version also plays song */}
              <button
                onClick={playDeveloperMusic}
                className="hover:text-emerald-400 text-left"
              >
                Developer
              </button>
            </div>
          </details>
        </div>
      </div>
    </nav>
  );
}
