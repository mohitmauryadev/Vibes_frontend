import React, { useState, useEffect, useRef } from "react";
import { PlayIcon, PauseIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";

export default function Playlist({ theme, history, setHistory }) {
  // ✅ Load playlist from localStorage initially
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playlist, setPlaylist] = useState(
    JSON.parse(localStorage.getItem("playlist")) || []
  );
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  // --- Save playlist to localStorage whenever it changes ---
  useEffect(() => {
    localStorage.setItem("playlist", JSON.stringify(playlist));
  }, [playlist]);

  // --- Search Songs ---
  const doSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    try {
      const res = await fetch(`https://vibes-lqf9.onrender.com/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data.items || []);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  // --- Add song from search results to playlist ---
  const addToPlaylist = (song) => {
    // ✅ Prevent duplicate in playlist
    if (playlist.find((s) => s.url === song.previewUrl)) return;

    const newSong = {
      id: Date.now(),
      title: song.trackName,
      url: song.previewUrl,
      thumbnail: song.artwork,
      artistName: song.artistName,
    };
    setPlaylist([...playlist, newSong]);
    setSearchResults([]);
    setQuery("");
  };

  // --- Remove song ---
  const handleRemove = (index) => {
    const updated = playlist.filter((_, i) => i !== index);
    setPlaylist(updated);
    if (index === currentIndex) stopAudio();
    else if (index < currentIndex) setCurrentIndex(currentIndex - 1);
  };

  const stopAudio = () => {
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
    setCurrentIndex(null);
    setProgress(0);
    setDuration(0);
  };

  // --- Play selected song ---
  const handlePlaySong = (index) => {
    setCurrentIndex(index);
  };

  // --- Play song when currentIndex changes ---
  useEffect(() => {
    if (currentIndex === null) return;
    const audio = audioRef.current;
    audio.src = playlist[currentIndex].url;
    audio.play();
    setIsPlaying(true);

    // ✅ Save to history when song plays
    const song = playlist[currentIndex];
    const exists = history.find(h => h.trackName === song.title);
    if (!exists) {
      const newHistory = [
        ...history,
        {
          trackName: song.title,
          artistName: song.artistName,
          artwork: song.thumbnail,
        },
      ];
      setHistory(newHistory);
      localStorage.setItem("history", JSON.stringify(newHistory));
    }
  }, [currentIndex, playlist]);

  // --- Volume ---
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // --- Progress ---
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && isPlaying) setProgress(audioRef.current.currentTime);
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const newTime = e.target.value;
    setProgress(newTime);
    if (audioRef.current) audioRef.current.currentTime = newTime;
  };

  const handleEnded = () => {
    if (currentIndex + 1 < playlist.length) setCurrentIndex(currentIndex + 1);
    else stopAudio();
  };

  const formatTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
  };

  return (
    <div className={`p-4 rounded-2xl shadow-md mt-6 w-full max-w-3xl ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <h2 className="text-2xl font-bold mb-4 text-green-400">🎵 My Playlist</h2>

      {/* Search Songs */}
      <form className="flex gap-2 mb-4" onSubmit={doSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search songs, artists, moods..."
          className="flex-grow px-3 py-2 rounded-md text-gray-900"
        />
        <button type="submit" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md transition">
          Search
        </button>
      </form>

      {searchResults.length > 0 && (
        <ul className="mb-4 space-y-2 max-h-64 overflow-y-auto border p-2 rounded-md bg-gray-700">
          {searchResults.map((song, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center p-2 rounded-md hover:bg-gray-600 cursor-pointer"
            >
              <div>
                <p className="font-semibold text-sm">{song.trackName}</p>
                <p className="text-xs text-gray-300">{song.artistName}</p>
              </div>
              <button
                onClick={() => addToPlaylist(song)}
                className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md text-sm"
              >
                ➕ Add
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Playlist Songs */}
      {playlist.length === 0 ? (
        <p className="text-gray-400">No songs in playlist yet.</p>
      ) : (
        <ul className="space-y-3">
          {playlist.map((song, index) => (
            <li
              key={song.id}
              className={`flex justify-between items-center p-3 rounded-lg cursor-pointer ${index === currentIndex ? "bg-green-700" : "bg-gray-800 hover:bg-gray-700"}`}
            >
              <div className="flex items-center gap-3" onClick={() => handlePlaySong(index)}>
                <img src={song.thumbnail} alt={song.title} className="w-12 h-12 rounded-lg" />
                <p className="font-semibold">{song.title}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlaySong(index)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition"
                >
                  ▶️
                </button>
                <button
                  onClick={() => handleRemove(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                >
                  ❌
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Player Controls */}
      {currentIndex !== null && (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <button onClick={togglePlay} className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-full text-white flex items-center gap-2">
            {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button onClick={() => setVolume(Math.max(0, volume - 0.1))}>
            <SpeakerXMarkIcon className="w-6 h-6 text-emerald-400 hover:text-emerald-500" />
          </button>
          <button onClick={() => setVolume(Math.min(1, volume + 0.1))}>
            <SpeakerWaveIcon className="w-6 h-6 text-emerald-400 hover:text-emerald-500" />
          </button>

          <input
            type="range"
            min="0"
            max={duration}
            value={progress}
            onChange={handleSeek}
            className="flex-grow accent-emerald-500 cursor-pointer"
          />
          <span className="text-sm">{formatTime(progress)}</span>
        </div>
      )}

      <audio
        ref={audioRef}
        onEnded={handleEnded}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        className="hidden"
      />
    </div>
  );
}

























// import React, { useState, useEffect, useRef } from "react";
// import { PlayIcon, PauseIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";

// export default function Playlist({ theme, history, setHistory }) {
//   const [query, setQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [playlist, setPlaylist] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [volume, setVolume] = useState(0.5);
//   const [progress, setProgress] = useState(0);
//   const [duration, setDuration] = useState(0);

//   const audioRef = useRef(null);

//   // --- Search Songs ---
//   const doSearch = async (e) => {
//     e.preventDefault();
//     if (!query) return;
//     try {
//       const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`);
//       const data = await res.json();
//       setSearchResults(data.items || []);
//     } catch (err) {
//       console.error("Search failed:", err);
//     }
//   };

//   // --- Add song from search results to playlist ---
//   const addToPlaylist = (song) => {
//     const newSong = {
//       id: Date.now(),
//       title: song.trackName,
//       url: song.previewUrl,
//       thumbnail: song.artwork,
//       artistName: song.artistName,
//     };
//     setPlaylist([...playlist, newSong]);
//     setSearchResults([]);
//     setQuery("");
//   };

//   // --- Remove song ---
//   const handleRemove = (index) => {
//     const updated = playlist.filter((_, i) => i !== index);
//     setPlaylist(updated);
//     if (index === currentIndex) stopAudio();
//     else if (index < currentIndex) setCurrentIndex(currentIndex - 1);
//   };

//   const stopAudio = () => {
//     if (audioRef.current) audioRef.current.pause();
//     setIsPlaying(false);
//     setCurrentIndex(null);
//     setProgress(0);
//     setDuration(0);
//   };

//   // --- Play selected song ---
//   const handlePlaySong = (index) => {
//     setCurrentIndex(index);
//   };

//   // --- Play song when currentIndex changes ---
//   useEffect(() => {
//     if (currentIndex === null) return;
//     const audio = audioRef.current;
//     audio.src = playlist[currentIndex].url;
//     audio.play();
//     setIsPlaying(true);

//     // ✅ Save to history when song plays
//     const song = playlist[currentIndex];
//     const exists = history.find(h => h.trackName === song.title);
//     if (!exists) {
//       const newHistory = [
//         ...history,
//         {
//           trackName: song.title,
//           artistName: song.artistName,
//           artwork: song.thumbnail,
//         },
//       ];
//       setHistory(newHistory);
//       localStorage.setItem("history", JSON.stringify(newHistory));
//     }
//   }, [currentIndex, playlist]);

//   // --- Volume ---
//   useEffect(() => {
//     if (audioRef.current) audioRef.current.volume = volume;
//   }, [volume]);

//   // --- Progress ---
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (audioRef.current && isPlaying) setProgress(audioRef.current.currentTime);
//     }, 500);
//     return () => clearInterval(interval);
//   }, [isPlaying]);

//   const togglePlay = () => {
//     if (!audioRef.current) return;
//     if (isPlaying) audioRef.current.pause();
//     else audioRef.current.play();
//     setIsPlaying(!isPlaying);
//   };

//   const handleSeek = (e) => {
//     const newTime = e.target.value;
//     setProgress(newTime);
//     if (audioRef.current) audioRef.current.currentTime = newTime;
//   };

//   const handleEnded = () => {
//     if (currentIndex + 1 < playlist.length) setCurrentIndex(currentIndex + 1);
//     else stopAudio();
//   };

//   const formatTime = (time) => {
//     const min = Math.floor(time / 60);
//     const sec = Math.floor(time % 60);
//     return `${min}:${sec < 10 ? "0" + sec : sec}`;
//   };

//   return (
//     <div className={`p-4 rounded-2xl shadow-md mt-6 w-full max-w-3xl ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
//       <h2 className="text-2xl font-bold mb-4 text-green-400">🎵 My Playlist</h2>

//       {/* Search Songs */}
//       <form className="flex gap-2 mb-4" onSubmit={doSearch}>
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search songs, artists, moods..."
//           className="flex-grow px-3 py-2 rounded-md text-gray-900"
//         />
//         <button type="submit" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md transition">
//           Search
//         </button>
//       </form>

//       {searchResults.length > 0 && (
//         <ul className="mb-4 space-y-2 max-h-64 overflow-y-auto border p-2 rounded-md bg-gray-700">
//           {searchResults.map((song, idx) => (
//             <li
//               key={idx}
//               className="flex justify-between items-center p-2 rounded-md hover:bg-gray-600 cursor-pointer"
//             >
//               <div>
//                 <p className="font-semibold text-sm">{song.trackName}</p>
//                 <p className="text-xs text-gray-300">{song.artistName}</p>
//               </div>
//               <button
//                 onClick={() => addToPlaylist(song)}
//                 className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md text-sm"
//               >
//                 ➕ Add
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}

//       {/* Playlist Songs */}
//       {playlist.length === 0 ? (
//         <p className="text-gray-400">No songs in playlist yet.</p>
//       ) : (
//         <ul className="space-y-3">
//           {playlist.map((song, index) => (
//             <li
//               key={song.id}
//               className={`flex justify-between items-center p-3 rounded-lg cursor-pointer ${index === currentIndex ? "bg-green-700" : "bg-gray-800 hover:bg-gray-700"}`}
//             >
//               <div className="flex items-center gap-3" onClick={() => handlePlaySong(index)}>
//                 <img src={song.thumbnail} alt={song.title} className="w-12 h-12 rounded-lg" />
//                 <p className="font-semibold">{song.title}</p>
//               </div>

//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => handlePlaySong(index)}
//                   className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition"
//                 >
//                   ▶️
//                 </button>
//                 <button
//                   onClick={() => handleRemove(index)}
//                   className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
//                 >
//                   ❌
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}

//       {/* Player Controls */}
//       {currentIndex !== null && (
//         <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
//           <button onClick={togglePlay} className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-full text-white flex items-center gap-2">
//             {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
//             {isPlaying ? "Pause" : "Play"}
//           </button>
//           <button onClick={() => setVolume(Math.max(0, volume - 0.1))}>
//             <SpeakerXMarkIcon className="w-6 h-6 text-emerald-400 hover:text-emerald-500" />
//           </button>
//           <button onClick={() => setVolume(Math.min(1, volume + 0.1))}>
//             <SpeakerWaveIcon className="w-6 h-6 text-emerald-400 hover:text-emerald-500" />
//           </button>

//           <input
//             type="range"
//             min="0"
//             max={duration}
//             value={progress}
//             onChange={handleSeek}
//             className="flex-grow accent-emerald-500 cursor-pointer"
//           />
//           <span className="text-sm">{formatTime(progress)}</span>
//         </div>
//       )}

//       <audio
//         ref={audioRef}
//         onEnded={handleEnded}
//         onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
//         className="hidden"
//       />
//     </div>
//   );
// }
