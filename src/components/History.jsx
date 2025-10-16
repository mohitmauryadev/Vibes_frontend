import React from "react";

export default function History({ history, deleteFromHistory, theme }) {
  return (
    <div className={`p-6 min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <h1 className="text-3xl font-bold mb-6">Listening History</h1>

      {history.length === 0 ? (
        <p className="text-gray-400">No songs in history yet 🎵</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((song, i) => (
            <div key={i} className={`p-4 rounded-2xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"} transition`}>
              <img src={song.artwork} alt={song.trackName} className="w-full h-48 rounded-xl object-cover mb-3" />
              <h2 className="font-semibold text-lg">{song.trackName}</h2>
              <p className="text-sm text-gray-400">{song.artistName}</p>
              <button
                onClick={() => deleteFromHistory(song.trackName)}
                className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
