import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../../assets/logo/blog-logo.jpeg";
import { webNavigationLinks } from "../../utils/options/headerOptions";
import Login from "../../views/auth/login";
import Signup from "../../views/auth/signUp";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../../utils/hooks/useAuth";
import { toast } from "react-toastify";
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const modalRef = useRef(null);
  const { userSignOut } = useAuth();
  const { user } = useSelector((state) => state.auth);
  console.log("user", user);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleCloseModal();
      }
    };
    if (modalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalOpen]);

  const handleOpenModal = () => {
    setModalOpen(true);
    setIsClosing(false);
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setModalOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const handleLogout = () => {
    userSignOut();
    toast.success("Logged out successfully");
  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <NavLink to="/" className="flex items-center space-x-2">
              <img src={logo} alt="Logo" className="h-12 w-12" />
            </NavLink>

            {/* Centered Nav */}
            <nav className="hidden lg:flex lg:justify-around lg:gap-5 xl:gap-10">
              {webNavigationLinks
                .filter((link) => link.name.toLowerCase() !== "login")
                .map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                      `relative text-white font-medium tracking-wide hover:text-yellow-300 transition-colors duration-300 ${
                        isActive
                          ? "after:content-[''] after:absolute after:w-full after:h-[3px] after:bg-yellow-300 after:bottom-[-6px] after:left-0"
                          : ""
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              {user.user_name ? (
                <>
                  <span className="text-white font-medium">
                    Hi, {user.user_name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-400 text-white font-semibold shadow-md transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleOpenModal();
                    setIsLogin(true);
                  }}
                  className={`px-5 py-2 rounded-full font-semibold transition-colors shadow-md ${
                    modalOpen
                      ? "bg-yellow-500 text-blue-900"
                      : "bg-yellow-400 hover:bg-yellow-300 text-blue-900"
                  }`}
                >
                  Login
                </button>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-2xl text-blue-700 focus:outline-none"
              >
                {menuOpen ? <HiX /> : <HiMenu />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          {menuOpen && (
            <div className="md:hidden bg-white shadow-md px-4 py-2 space-y-2">
              {webNavigationLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "block text-blue-700 font-medium border-l-4 border-blue-700 pl-2"
                      : "block text-gray-700 hover:text-blue-700 transition"
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Modal */}
      {modalOpen && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ${
            isClosing ? "animate-fadeOut" : "animate-fadeIn"
          }`}
        >
          <div
            ref={modalRef}
            className={`rounded-xl shadow-lg bg-white w-full max-w-md p-6 relative transform transition-all duration-300 ${
              isClosing ? "animate-modalClose" : "animate-modalOpen"
            }`}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-1 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>

            {/* Tabs */}
            <div className="flex border-b border-gray-300">
              {isLogin ? (
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 font-bold text-xl text-center ${
                    isLogin
                      ? "border-b-4 border-blue-500 text-black"
                      : "text-gray-500 hover:text-yellow-500"
                  }`}
                >
                  Login
                </button>
              ) : (
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 font-bold text-xl text-center ${
                    !isLogin
                      ? "border-b-4 border-blue-500 text-black"
                      : "text-gray-500 hover:text-yellow-500"
                  }`}
                >
                  Sign Up
                </button>
              )}
            </div>

            {/* Render Form based on tab */}
            {isLogin ? (
              <Login
                onSwitchToSignup={() => setIsLogin(false)}
                onClose={handleCloseModal}
              />
            ) : (
              <Signup
                onSwitchToLogin={() => setIsLogin(true)}
                onClose={handleCloseModal}
              />
            )}
          </div>
        </div>
      )}

      {/* Animations */}
      <style>
        {`
          
        `}
      </style>
    </>
  );
};

export default Header;
