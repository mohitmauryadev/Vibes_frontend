
import React, { useState, useRef, useEffect } from "react";
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/solid";

export default function Home({ theme, history, setHistory }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const defaultSong = {
    trackName: "Ram Siya Ram Siya Ram Jay Jay Ram",
    artistName: "Traditional / Devotional",
    artwork: "https://i.ytimg.com/vi/YgF2rj9xvTw/hqdefault.jpg",
    previewUrl: "https://example.com/ram_siya_ram.mp3",
  };

  const [currentSong, setCurrentSong] = useState(defaultSong);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  useEffect(() => {
    const fetchDefault = async () => {
      try {
        const resp = await fetch(
          `https://vibes-lqf9.onrender.com/api/search?q=${encodeURIComponent(
            "Ram Siya Ram Siya Ram"
          )}`
        );
        const data = await resp.json();
        if (data.items && data.items.length > 0) {
          setResults(data.items);
          setCurrentSong(data.items[0]);
        } else setResults([]);
      } catch (err) {
        console.error("Default fetch failed:", err);
      }
    };
    fetchDefault();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && isPlaying) setProgress(audioRef.current.currentTime);
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const doSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      const resp = await fetch(
        `https://vibes-lqf9.onrender.com/api/search?q=${encodeURIComponent(query)}`
      );
      const data = await resp.json();
      setResults(data.items || []);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const playSong = (song) => {
    setCurrentSong(song);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);

        const exists = history.find((h) => h.trackName === song.trackName);
        if (!exists) {
          const newHistory = [
            ...history,
            {
              trackName: song.trackName,
              artistName: song.artistName,
              artwork: song.artwork,
            },
          ];
          setHistory(newHistory);
          localStorage.setItem("history", JSON.stringify(newHistory));
        }
      }
    }, 300);
  };

  const changeVolume = (delta) => setVolume((v) => Math.min(1, Math.max(0, v + delta)));
  const handleSeek = (e) => {
    const newTime = e.target.value;
    setProgress(newTime);
    if (audioRef.current) audioRef.current.currentTime = newTime;
  };
  const formatTime = (time) => `${Math.floor(time / 60)}:${Math.floor(time % 60).toString().padStart(2,"0")}`;

  const playerHeight = 140;

  return (
    <div
      className={`min-h-screen flex flex-col items-center px-4 py-8 pb-[${playerHeight}px] transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Search */}
      <form
        onSubmit={doSearch}
        className={`w-full max-w-3xl flex flex-col sm:flex-row rounded-2xl shadow-lg overflow-hidden mb-8 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search songs, artists, moods..."
          className={`flex-grow px-4 py-3 text-lg focus:outline-none ${
            theme === "dark"
              ? "bg-transparent text-white placeholder-gray-400"
              : "bg-transparent text-gray-900 placeholder-gray-500"
          }`}
        />
        <button
          type="submit"
          className="mt-2 sm:mt-0 sm:ml-2 bg-emerald-500 hover:bg-emerald-600 px-6 py-3 font-semibold transition flex-shrink-0"
        >
          Search
        </button>
      </form>

      {/* Songs Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.length === 0 && (
          <div
            className={`p-4 rounded-2xl shadow-xl cursor-pointer hover:scale-105 transform transition-all ${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            }`}
            onClick={() => playSong(defaultSong)}
          >
            <img
              src={defaultSong.artwork}
              alt="thumb"
              className="w-full h-48 rounded-xl object-cover mb-4"
            />
            <div className="font-semibold text-lg truncate">{defaultSong.trackName}</div>
            <div className={`text-sm truncate ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {defaultSong.artistName}
            </div>
          </div>
        )}
        {results.map((item, index) => (
          <div
            key={index}
            onClick={() => playSong(item)}
            className={`p-4 rounded-2xl shadow-xl cursor-pointer hover:scale-105 transform transition-all ${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            }`}
          >
            <img
              src={item.artwork}
              alt="thumb"
              className="w-full h-48 rounded-xl object-cover mb-4"
            />
            <div className="font-semibold text-lg truncate">{item.trackName}</div>
            <div className={`text-sm truncate ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {item.artistName}
            </div>
          </div>
        ))}
      </div>

      {/* Responsive Music Player */}
      {currentSong && (
        <div
          className={`fixed bottom-7 left-0 w-full px-4 py-4 shadow-2xl backdrop-blur-xl flex flex-col gap-3 z-50 transition-all ${
            theme === "dark" ? "bg-gray-900/95" : "bg-white/95"
          }`}
          style={{ height: `${playerHeight}px` }}
        >
          {/* Top: Song info */}
          <div className="flex items-center gap-3">
            <img src={currentSong.artwork} alt="album" className="w-16 h-16 rounded-lg object-cover"/>
            <div className="truncate">
              <div className="font-semibold truncate">{currentSong.trackName}</div>
              <div className={`text-sm truncate ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`}>
                {currentSong.artistName}
              </div>
            </div>
          </div>

          {/* Middle: Progress */}
          <div className="flex items-center gap-3 w-full">
            <span className="text-xs text-gray-400">{formatTime(progress)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              value={progress}
              onChange={handleSeek}
              className="flex-grow accent-emerald-500 cursor-pointer"
            />
            <span className="text-xs text-gray-400">{formatTime(duration)}</span>
          </div>

          {/* Bottom: Controls */}
          <div className="flex items-center justify-between gap-4 w-full">
            <button onClick={() => changeVolume(-0.1)} className="p-3 rounded-full bg-gray-200/30 hover:bg-gray-300/30">
              <SpeakerXMarkIcon className="w-6 h-6 text-emerald-500"/>
            </button>
            <button
              onClick={togglePlay}
              className="flex-1 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center gap-2 text-white font-semibold"
            >
              {isPlaying ? <PauseIcon className="w-6 h-6"/> : <PlayIcon className="w-6 h-6"/>}
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button onClick={() => changeVolume(0.1)} className="p-3 rounded-full bg-gray-200/30 hover:bg-gray-300/30">
              <SpeakerWaveIcon className="w-6 h-6 text-emerald-500"/>
            </button>
          </div>

          <audio
            ref={audioRef}
            src={currentSong.previewUrl}
            onTimeUpdate={() => setProgress(audioRef.current?.currentTime || 0)}
            onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
            onEnded={() => setIsPlaying(false)}
            autoPlay
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
