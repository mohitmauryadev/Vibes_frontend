import React from "react";
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer({ theme }) {
  const developers = [
    { name: "Mohit Maurya", role: "Owner / Full Stack Developer", avatar: "https://media.licdn.com/dms/image/v2/D5603AQHYqoxkmsm_DQ/profile-displayphoto-scale_200_200/B56ZhsNtRVHMAc-/0/1754162191552?e=2147483647&v=beta&t=ICpZVQhICf00i8p4NCppyUhz6zsNKPY_VdRJ41A68mE" },
    { name: "Piyush Kumar", role: "Backend Developer", avatar: "https://i.pravatar.cc/50?img=14" },
    { name: "Piyush Shakya", role: "Frontend Developer", avatar: "https://i.pravatar.cc/50?img=13" },
    { name: "Pawan Kushwaha", role: "Frontend Developer", avatar: "https://i.pravatar.cc/50?img=11" },
    { name: "Paras Sahu", role: "UI/UX Designer", avatar: "https://i.pravatar.cc/50?img=12" },
    
  ];

  const isDark = theme === "dark";

  const bgGradient = isDark
    ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-950 text-gray-300"
    : "bg-gradient-to-r from-white via-gray-100 to-gray-200 text-gray-900";

  const borderColor = isDark ? "border-gray-700" : "border-gray-300";

  return (
    <footer className={`mt-16 py-12 px-6 ${bgGradient} border-t ${borderColor} transition-all`}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
        
        {/* Left - About App */}
        <div>
          <h2 className={`text-2xl font-bold mb-3 ${isDark ? "text-emerald-400" : "text-blue-600"}`}>🎵 Vibes</h2>
          <p className="text-sm leading-relaxed opacity-70">
            Feel the rhythm of your soul. Discover, play, and share music with a sleek, modern interface. Enjoy playlists, history, and more.
          </p>
        </div>

        {/* Middle - About Developers */}
        <div>
          <h3 className={`text-lg font-semibold mb-3 ${isDark ? "text-emerald-400" : "text-blue-600"}`}>👨‍💻 Meet the Team</h3>
          <div className="space-y-3 text-sm opacity-80">
            {developers.map((dev, idx) => (
              <p key={idx}>
                <span className={`font-semibold ${isDark ? "text-emerald-400" : "text-blue-600"}`}>{dev.name}</span> — {dev.role}
              </p>
            ))}
          </div>
        </div>

        {/* Right - Social */}
        <div>
          <h3 className={`text-lg font-semibold mb-3 ${isDark ? "text-emerald-400" : "text-blue-600"}`}>🌐 Connect</h3>
          <div className="flex items-center gap-4 text-xl mb-3">
            <a href="https://github.com/mohitmauryadev" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-transform hover:scale-110">
              <FaGithub />
            </a>
            <a href="https://www.linkedin.com/in/mohitmauryadev" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-transform hover:scale-110">
              <FaLinkedin />
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-transform hover:scale-110">
              <FaTwitter />
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-transform hover:scale-110">
              <FaInstagram />
            </a>
          </div>
          <p className="text-sm opacity-70">
            Built with ❤️ by <span className={`font-semibold ${isDark ? "text-emerald-400" : "text-blue-600"}`}>Mohit Maurya</span> & team.
          </p>
        </div>
      </div>

      {/* Bottom Line */}
      <div className={`border-t ${borderColor} mt-10 pt-5 text-center text-xs opacity-50`}>
        © {new Date().getFullYear()} Vibes. All rights reserved.
      </div>
    </footer>
  );
}
