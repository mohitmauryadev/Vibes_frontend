import React, { useState, useEffect } from "react";

const teamMembers = [
  {
    name: "Piyush Kumar",
    role: "Backend Developer",
    image:
      "https://media.licdn.com/dms/image/v2/D5603AQE94aPw7wC-mA/profile-displayphoto-crop_800_800/B56ZjTrgdOHMAI-/0/1755898056761?e=1763596800&v=beta&t=-cQJWWvUHUf-pqeVyTrhvuiVz86vn1mbeYt3FOULss4",
  },
  {
    name: "Piyush Shakya",
    role: "Frontend Developer",
    image:
      "https://media.licdn.com/dms/image/v2/D5603AQGbTTjDvDxzsQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1723461978425?e=1763596800&v=beta&t=L183DUpjg17JLiFXXrp9kABo9QUhV6oBdRFKtJa33HA",
  },
  {
    name: "Pawan Kushwaha",
    role: "Frontend Developer",
    image:
      "https://media.licdn.com/dms/image/v2/D4D35AQE4LA1A7mIotg/profile-framedphoto-shrink_800_800/B4DZnZ0qEiGkAk-/0/1760296084045?e=1761238800&v=beta&t=YgOLe_5s4f0cSW3dfNIjgczqbuaImQzXvl6a_baDbh4",
  },
  {
    name: "Paras Sahu",
    role: "UI/UX Designer",
    image:
      "https://media.licdn.com/dms/image/v2/D5603AQHwYcm4POj25Q/profile-displayphoto-shrink_800_800/B56Zby7KbZG4Ac-/0/1747832319436?e=1763596800&v=beta&t=rUHEuQ_szmxjcO4DbJrVh6UWG6KIFt_vjIwJSyGPoL4",
  },
];

// ✅ Add all your profile images here
const profileImages = [
  "https://i.ibb.co/7JxVM2Md/IMG-20251012-135845-2.jpg",
  "https://i.ibb.co/PbVhfdt/IMG-20241218-195217.jpg",
  "https://i.ibb.co/nMB96Jfn/IMG-20241218-195217-2.jpg",
  "https://media.licdn.com/dms/image/v2/D5603AQHYqoxkmsm_DQ/profile-displayphoto-scale_200_200/B56ZhsNtRVHMAc-/0/1754162191552?e=2147483647&v=beta&t=ICpZVQhICf00i8p4NCppyUhz6zsNKPY_VdRJ41A68mE",
];

export default function Developer({ theme }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔁 Image change effect every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % profileImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const bgClass =
    theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";
  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const textGray = theme === "dark" ? "text-gray-300" : "text-gray-600";

  return (
    <div className={`min-h-screen p-6 ${bgClass}`}>
      {/* About Me Section */}
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center mb-12 relative">
        <div className="w-48 h-48 mb-4 relative">
          {/* 🔄 Smooth Fade Transition */}
          <img
            key={currentIndex}
            src={profileImages[currentIndex]}
            alt="Mohit Maurya"
            className="w-48 h-48 rounded-full object-cover shadow-lg absolute top-0 left-0 transition-opacity duration-700 ease-in-out opacity-100"
          />
        </div>
        <h1 className="text-3xl font-bold mb-2">
          Mohit Maurya
          <div className="text-xl font-bold">
            (Lead Developer & Full Stack Developer)
          </div>
        </h1>
        <p className={`text-lg max-w-2xl ${textGray}`}>
          Hi! I'm Mohit Maurya, a passionate software developer focused on
          building modern web and mobile applications. I love creating
          innovative solutions and exploring new technologies.
        </p>
      </div>

      {/* Team Members */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-500">
          🚀 Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className={`flex flex-col items-center text-center p-4 rounded-2xl shadow-lg hover:scale-105 transform transition ${cardBg}`}
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
              <h3 className="font-semibold text-xl">{member.name}</h3>
              <p className={`${textGray}`}>{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
