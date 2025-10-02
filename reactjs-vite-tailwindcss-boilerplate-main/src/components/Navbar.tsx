import { useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-gradient-to-r from-amber-500 to-amber-700 shadow-lg px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center transition-all">
      
      {/* Logo */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
          InterviewApp
        </h1>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Menu */}
      <div
        className={`md:flex md:items-center md:gap-4 transition-all duration-300 ease-in-out ${
          open ? "flex flex-col mt-4 gap-3" : "hidden"
        }`}
      >
        <Link
          to="/home"
          className="px-5 py-2 bg-white text-amber-700 font-semibold rounded-full shadow hover:bg-amber-50 hover:text-amber-800 transition transform hover:scale-105"
        >
          Home
        </Link>
        <Link
          to="/interviewer/dashboard"
          className="px-5 py-2 bg-white text-amber-900 font-semibold rounded-full shadow hover:bg-amber-50 hover:text-amber-950 transition transform hover:scale-105"
        >
          Interviewer
        </Link>

        {/* Social Icons */}
        <div className="flex gap-4 mt-2 md:mt-0">
          <a
            href="https://github.com/vikash000x"
            target="_blank"
            rel="noreferrer"
            className="text-white text-2xl hover:text-gray-100 transition transform hover:scale-110"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/vikash-sinha-215000259/"
            target="_blank"
            rel="noreferrer"
            className="text-white text-2xl hover:text-blue-200 transition transform hover:scale-110"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </nav>
  );
}
