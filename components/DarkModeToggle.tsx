"use client";

import React, { useEffect, useState } from "react";

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);

    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Light
      </span>
      <button
        onClick={toggleDarkMode}
        className={`relative w-14 h-8 bg-gray-300 dark:bg-gray-600 rounded-full transition-all`}
      >
        <span
          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
            isDarkMode ? "translate-x-6" : ""
          }`}
        />
      </button>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Dark
      </span>
    </div>
  );
};

export default DarkModeToggle;
