'use client'
import { useState } from "react";

function Navbar() {
    // State to manage mobile menu open/close
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-gray-800 p-4 shadow-black drop-shadow-xl relative z-50">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo or Brand */}
                <div className="text-white text-2xl font-bold">
                    <a href="/">Streaming Hub</a>
                </div>

                {/* Hamburger Icon / Close Button for Mobile */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        type="button"
                        className="text-white focus:outline-none"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                            ></path>
                        </svg>
                    </button>
                </div>

                {/* Links - visible on larger screens */}
                <div className="hidden md:flex items-center space-x-6">
                    <ul className="flex space-x-6 text-white">
                        <li><a href="/" className="hover:text-blue-400">Home</a></li>
                        <li><a href="/live" className="hover:text-blue-400">Live Now</a></li>
                        <li><a href="/channels" className="hover:text-blue-400">Channels</a></li>
                        <li><a href="/favorites" className="hover:text-blue-400">Favorite Channels</a></li>
                        <li><a href="/leaderboard" className="hover:text-blue-400">Leaderboard</a></li>
                        <li><a href="/about" className="hover:text-blue-400">About</a></li>
                        <li><a href="/contact" className="hover:text-blue-400">Contact</a></li>
                    </ul>
                </div>

                {/* Right side (Search, Log In) for larger screens */}
                <div className="hidden md:flex items-center space-x-6 text-white">
                    <ul className="flex space-x-6">
                        <li>Search</li>
                        <li>Log In</li>
                    </ul>
                </div>
            </div>

            {/* Mobile Menu (overlay) */}
            <div
                className={`${
                    isOpen ? "block" : "hidden"
                } absolute top-0 left-0 w-full max-w-sm bg-gray-900 bg-opacity-90 text-white z-50 p-8 shadow-lg`}
            >
                <div className="container mx-auto">
                    {/* Close Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white focus:outline-none"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            </svg>
                        </button>
                    </div>
                    <ul className="flex flex-col space-y-4 mt-4">
                        <li><a href="/" className="hover:text-blue-400" onClick={() => setIsOpen(false)}>Home</a></li>
                        <li><a href="/live" className="hover:text-blue-400" onClick={() => setIsOpen(false)}>Live Now</a></li>
                        <li><a href="/channels" className="hover:text-blue-400" onClick={() => setIsOpen(false)}>Channels</a></li>
                        <li><a href="/favorites" className="hover:text-blue-400" onClick={() => setIsOpen(false)}>Favorite Channels</a></li>
                        <li><a href="/leaderboard" className="hover:text-blue-400" onClick={() => setIsOpen(false)}>Leaderboard</a></li>
                        <li><a href="/about" className="hover:text-blue-400" onClick={() => setIsOpen(false)}>About</a></li>
                        <li><a href="/contact" className="hover:text-blue-400" onClick={() => setIsOpen(false)}>Contact</a></li>
                        <li>Search</li>
                        <li>Log In</li>
                    </ul>
                </div>
            </div>
        </nav>
    );


}

export default Navbar;
