import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { HiMenu, HiX } from "react-icons/hi";
import Image from "next/image";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Login from "@/pages/login";
import Signup from "@/pages/signUp";
import useAuth from "@/utils/hooks/useAuth";
import logo from "@/assets/logo/logo.png";
import { webNavigationLinks } from "@/utils/options/headerOptions";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const modalRef = useRef(null);
  const menuRef = useRef(null);

  const { authenticated, userSignOut } = useAuth();
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleCloseModal();
      }
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.closest('button[aria-label="Toggle menu"]')
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (menuOpen || modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen, modalOpen]);

  const handleOpenModalLogin = () => {
    setShowAuthPrompt(false);
    setIsLogin(true);
    setModalOpen(true);
    setIsClosing(false);
  };

  const handleOpenModalSignup = () => {
    setShowAuthPrompt(false);
    setIsLogin(false);
    setModalOpen(true);
    setIsClosing(false);
  };

  const handleOpenAuthPrompt = () => {
    setShowAuthPrompt(true);
    setModalOpen(true);
    setIsClosing(false);
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setModalOpen(false);
      setIsClosing(false);
      setShowAuthPrompt(false);
    }, 300);
  };

  const handleLogout = () => {
    userSignOut();
    toast.success("Logged out successfully");
  };

  const handleTaskClick = (path) => {
    if (!authenticated) {
      handleOpenAuthPrompt();
      return;
    }
    router.push(path);
    setMenuOpen(false);
  };

  const isActivePath = (path) =>
    router.pathname === path || router.pathname.startsWith(path + "/");

  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={logo}
                alt="Logo"
                className="w-36 h-12 md:w-40 md:h-12"
              />
            </Link>

            <nav className="hidden lg:flex lg:justify-around lg:gap-5 xl:gap-10">
              {webNavigationLinks
                .filter((link) => link.name.toLowerCase() !== "login")
                .map((link) => {
                  const nameLower = link.name?.toLowerCase();
                  const isTask = nameLower === "task" || nameLower === "tasks";

                  if (isTask) {
                    return (
                      <button
                        key={link.name}
                        onClick={() => handleTaskClick(link.path)}
                        className={`relative text-white font-medium tracking-wide hover:text-yellow-300 transition-colors duration-300 px-2 py-1 ${
                          isActivePath(link.path)
                            ? "after:content-[''] after:absolute after:w-full after:h-[3px] after:bg-yellow-300 after:bottom-[-6px] after:left-0"
                            : ""
                        }`}
                      >
                        {link.name}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={link.name}
                      href={link.path}
                      className={`relative text-white font-medium tracking-wide hover:text-yellow-300 transition-colors duration-300 px-2 py-1 ${
                        isActivePath(link.path)
                          ? "after:content-[''] after:absolute after:w-full after:h-[3px] after:bg-yellow-300 after:bottom-[-6px] after:left-0"
                          : ""
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              {user?.user_name ? (
                <>
                  <span className="text-white font-medium text-sm lg:text-base">
                    Hi, {user.user_name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-400 text-white font-semibold shadow-md transition-colors text-sm lg:text-base"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={handleOpenModalLogin}
                  className={`px-5 py-2 rounded-full font-semibold transition-colors shadow-md text-sm lg:text-base ${
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
                className="text-3xl text-white p-1 focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded-md"
                aria-label="Toggle menu"
              >
                {menuOpen ? <HiX /> : <HiMenu />}
              </button>
            </div>
          </div>

          <div
            ref={menuRef}
            className={`md:hidden bg-white shadow-md absolute left-0 right-0 transition-all duration-300 ease-in-out ${
              menuOpen
                ? "max-h-96 opacity-100 visible"
                : "max-h-0 opacity-0 invisible"
            } overflow-hidden`}
          >
            <div className="px-4 py-3 space-y-3">
              {webNavigationLinks
                .filter((link) => link.name.toLowerCase() !== "login")
                .map((link) => {
                  const nameLower = link.name?.toLowerCase();
                  const isTask = nameLower === "task" || nameLower === "tasks";

                  if (isTask) {
                    return (
                      <button
                        key={link.name}
                        onClick={() => handleTaskClick(link.path)}
                        className={`block w-full text-left py-3 px-4 rounded-lg ${
                          isActivePath(link.path)
                            ? "text-blue-700 font-medium bg-blue-50"
                            : "text-gray-700 hover:text-blue-700 hover:bg-gray-50 transition"
                        }`}
                      >
                        {link.name}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={link.name}
                      href={link.path}
                      onClick={() => setMenuOpen(false)}
                      className={`block w-full py-3 px-4 rounded-lg ${
                        isActivePath(link.path)
                          ? "text-blue-700 font-medium bg-blue-50"
                          : "text-gray-700 hover:text-blue-700 hover:bg-gray-50 transition"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}

              <div className="pt-4 border-t border-gray-200">
                {user?.user_name ? (
                  <div className="flex flex-col space-y-3">
                    <div className="px-4 py-2 text-gray-700">
                      Hi, <span className="font-medium">{user.user_name}</span>
                    </div>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full px-4 py-3 rounded-lg bg-red-500 hover:bg-red-400 text-white font-semibold shadow-md transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleOpenModalLogin();
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-semibold shadow-md transition-colors"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

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
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              aria-label="Close modal"
            >
              &times;
            </button>

            {showAuthPrompt ? (
              <div className="text-center py-2">
                <div className="mx-auto mt-4 mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50">
                  <div className="w-10 h-12 rounded-md border border-gray-300 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-gray-300" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">Signup or Login</h2>
                <p className="text-gray-600 mb-6 md:mb-10 px-2">
                  We highly recommend to signup or login to get more
                  information.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  <button
                    onClick={handleOpenModalSignup}
                    className="w-full sm:w-auto px-6 py-3 rounded-lg border border-indigo-300 hover:bg-indigo-50 font-semibold transition-colors"
                  >
                    SIGNUP
                  </button>
                  <button
                    onClick={handleOpenModalLogin}
                    className="w-full sm:w-auto px-6 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-colors"
                  >
                    LOGIN
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex border-b border-gray-300 mb-4">
                  {isLogin ? (
                    <button
                      onClick={() => setIsLogin(true)}
                      className={`flex-1 py-3 font-bold text-2xl text-center ${
                        isLogin
                          ? "border-b-2 border-blue-500 text-black"
                          : "text-gray-500 hover:text-blue-500"
                      }`}
                    >
                      Login
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsLogin(false)}
                      className={`flex-1 py-3 font-bold text-2xl text-center ${
                        !isLogin
                          ? "border-b-2 border-blue-500 text-black"
                          : "text-gray-500 hover:text-blue-500"
                      }`}
                    >
                      Sign Up
                    </button>
                  )}
                </div>

                <div className="max-h-[70vh] overflow-y-auto">
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
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out both;
        }
        .animate-fadeOut {
          animation: fadeOut 0.3s ease-in both;
        }

        @keyframes modalOpen {
          from {
            transform: scale(0.95) translateY(10px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        @keyframes modalClose {
          from {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
          to {
            transform: scale(0.95) translateY(10px);
            opacity: 0;
          }
        }
        .animate-modalOpen {
          animation: modalOpen 0.3s ease-out both;
        }
        .animate-modalClose {
          animation: modalClose 0.3s ease-in both;
        }
      `}</style>
    </>
  );
};

export default Header;
