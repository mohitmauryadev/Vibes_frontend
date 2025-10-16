
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
  const progressRef = useRef(null);

  // Fetch default song
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

  // Auto play song
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [currentSong]);

  // Volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Progress
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && isPlaying) {
        setProgress(audioRef.current.currentTime);
      }
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

  const changeVolume = (delta) => {
    setVolume((v) => Math.min(1, Math.max(0, v + delta)));
  };

  const handleSeek = (e) => {
    const newTime = e.target.value;
    setProgress(newTime);
    if (audioRef.current) audioRef.current.currentTime = newTime;
  };

  const formatTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
  };

  // Player height for padding
  const playerHeight = 96; // px, adjust as needed

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
            <div className="font-semibold text-lg truncate">
              {defaultSong.trackName}
            </div>
            <div
              className={`text-sm truncate ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
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
            <div
              className={`text-sm truncate ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {item.artistName}
            </div>
          </div>
        ))}
      </div>

      {/* Music Player */}
      {currentSong && (
        <div
          className={`fixed bottom-0 left-0 w-full px-6 py-4 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between z-50 transition-all ${
            theme === "dark" ? "bg-gray-900/90" : "bg-white/90"
          }`}
          style={{ height: `${playerHeight}px` }}
        >
          <div className="flex items-center gap-4 mb-2 sm:mb-0">
            <img
              src={currentSong.artwork}
              alt="album"
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <div className="font-semibold">{currentSong.trackName}</div>
              <div
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-700"
                }`}
              >
                {currentSong.artistName}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="flex flex-col items-center w-full sm:w-1/2 px-4">
            <input
              type="range"
              ref={progressRef}
              min="0"
              max={duration}
              value={progress}
              onChange={handleSeek}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-xs w-full mt-1 text-gray-400">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button onClick={() => changeVolume(-0.1)}>
              <SpeakerXMarkIcon className="w-6 h-6 text-emerald-400 hover:text-emerald-500 transition" />
            </button>
            <button
              onClick={togglePlay}
              className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-full font-semibold transition flex items-center gap-2"
            >
              {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button onClick={() => changeVolume(0.1)}>
              <SpeakerWaveIcon className="w-6 h-6 text-emerald-400 hover:text-emerald-500 transition" />
            </button>
          </div>

          <audio
            ref={audioRef}
            src={currentSong.previewUrl}
            onTimeUpdate={() =>
              setProgress(audioRef.current ? audioRef.current.currentTime : 0)
            }
            onLoadedMetadata={() =>
              setDuration(audioRef.current ? audioRef.current.duration : 0)
            }
            onEnded={() => setIsPlaying(false)}
            autoPlay
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
