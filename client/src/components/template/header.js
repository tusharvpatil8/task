import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../../assets/logo/blog-logo.jpeg";
import { webNavigationLinks } from "../../utils/options/headerOptions";
import Login from "../../views/auth/login";
import Signup from "../../views/auth/signUp";
import { useSelector } from "react-redux";
import useAuth from "../../utils/hooks/useAuth";
import { toast } from "react-toastify";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const modalRef = useRef(null);

  const { authenticated, userSignOut } = useAuth();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

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
    // 🔹 opens the screenshot-like prompt first
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

  // 🔹 Protected navigation for "Task"
  const handleTaskClick = (path) => {
    if (!authenticated) {
      handleOpenAuthPrompt();
      return;
    }
    navigate(path);
  };

  // Helpers to style active for custom buttons (like Task when it's a <button>)
  const isActivePath = (path) => location.pathname.startsWith(path);

  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <NavLink to="/" className="flex items-center space-x-2">
              <img src={logo} alt="Logo" className="h-12 w-12" />
            </NavLink>

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
                        className={`relative text-white font-medium tracking-wide hover:text-yellow-300 transition-colors duration-300 ${
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
                  );
                })}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              {user?.user_name ? (
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
                  onClick={handleOpenModalLogin}
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

          {menuOpen && (
            <div className="md:hidden bg-white shadow-md px-4 py-2 space-y-2">
              {webNavigationLinks.map((link) => {
                const nameLower = link.name?.toLowerCase();
                const isTask = nameLower === "task" || nameLower === "tasks";

                if (isTask) {
                  return (
                    <button
                      key={link.name}
                      onClick={() => {
                        setMenuOpen(false);
                        handleTaskClick(link.path);
                      }}
                      className={`block w-full text-left ${
                        isActivePath(link.path)
                          ? "text-blue-700 font-medium border-l-4 border-blue-700 pl-2"
                          : "text-gray-700 hover:text-blue-700 transition"
                      }`}
                    >
                      {link.name}
                    </button>
                  );
                }

                return (
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
                );
              })}
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

            {showAuthPrompt ? (
              <div className="text-center">
                <div className="mx-auto mt-4 mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50">
                  <div className="w-10 h-12 rounded-md border border-gray-300 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-gray-300" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">Signup or Login</h2>
                <p className="text-gray-600 mb-10">
                  We highly recommend to signup or login to get more
                  information.
                </p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleOpenModalSignup}
                    className="px-6 py-3 rounded-lg border border-indigo-300 hover:bg-indigo-50 font-semibold"
                  >
                    SIGNUP
                  </button>
                  <button
                    onClick={handleOpenModalLogin}
                    className="px-6 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold"
                  >
                    LOGIN
                  </button>
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}

      <style>
        {`
          /* add your keyframes if not already defined in Tailwind config */
          @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
          @keyframes fadeOut { from { opacity: 1 } to { opacity: 0 } }
          .animate-fadeIn { animation: fadeIn .2s ease-out both }
          .animate-fadeOut { animation: fadeOut .2s ease-in both }

          @keyframes modalOpen { from { transform: translateY(10px); opacity:0 } to { transform: translateY(0); opacity:1 } }
          @keyframes modalClose { from { transform: translateY(0); opacity:1 } to { transform: translateY(10px); opacity:0 } }
          .animate-modalOpen { animation: modalOpen .25s ease-out both }
          .animate-modalClose { animation: modalClose .25s ease-in both }
        `}
      </style>
    </>
  );
};

export default Header;

// import React, { useState, useRef, useEffect } from "react";
// import { NavLink } from "react-router-dom";
// import { HiMenu, HiX } from "react-icons/hi";
// import logo from "../../assets/logo/blog-logo.jpeg";
// import { webNavigationLinks } from "../../utils/options/headerOptions";
// import Login from "../../views/auth/login";
// import Signup from "../../views/auth/signUp";
// import { useDispatch, useSelector } from "react-redux";
// import useAuth from "../../utils/hooks/useAuth";
// import { toast } from "react-toastify";
// const Header = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [isClosing, setIsClosing] = useState(false);
//   const [isLogin, setIsLogin] = useState(true);
//   const modalRef = useRef(null);
//   const { authenticated, userSignOut } = useAuth();
//   const { user } = useSelector((state) => state.auth);
//   console.log("authenticated", authenticated);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         handleCloseModal();
//       }
//     };
//     if (modalOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [modalOpen]);

//   const handleOpenModal = () => {
//     setModalOpen(true);
//     setIsClosing(false);
//   };

//   const handleCloseModal = () => {
//     setIsClosing(true);
//     setTimeout(() => {
//       setModalOpen(false);
//       setIsClosing(false);
//     }, 300);
//   };

//   const handleLogout = () => {
//     userSignOut();
//     toast.success("Logged out successfully");
//   };

//   return (
//     <>
//       <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 shadow-lg sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             {/* Logo */}
//             <NavLink to="/" className="flex items-center space-x-2">
//               <img src={logo} alt="Logo" className="h-12 w-12" />
//             </NavLink>

//             {/* Centered Nav */}
//             <nav className="hidden lg:flex lg:justify-around lg:gap-5 xl:gap-10">
//               {webNavigationLinks
//                 .filter((link) => link.name.toLowerCase() !== "login")
//                 .map((link) => (
//                   <NavLink
//                     key={link.name}
//                     to={link.path}
//                     className={({ isActive }) =>
//                       `relative text-white font-medium tracking-wide hover:text-yellow-300 transition-colors duration-300 ${
//                         isActive
//                           ? "after:content-[''] after:absolute after:w-full after:h-[3px] after:bg-yellow-300 after:bottom-[-6px] after:left-0"
//                           : ""
//                       }`
//                     }
//                   >
//                     {link.name}
//                   </NavLink>
//                 ))}
//             </nav>

//             <div className="hidden md:flex items-center gap-4">
//               {user.user_name ? (
//                 <>
//                   <span className="text-white font-medium">
//                     Hi, {user.user_name}
//                   </span>
//                   <button
//                     onClick={handleLogout}
//                     className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-400 text-white font-semibold shadow-md transition-colors"
//                   >
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <button
//                   onClick={() => {
//                     handleOpenModal();
//                     setIsLogin(true);
//                   }}
//                   className={`px-5 py-2 rounded-full font-semibold transition-colors shadow-md ${
//                     modalOpen
//                       ? "bg-yellow-500 text-blue-900"
//                       : "bg-yellow-400 hover:bg-yellow-300 text-blue-900"
//                   }`}
//                 >
//                   Login
//                 </button>
//               )}
//             </div>

//             <div className="md:hidden">
//               <button
//                 onClick={() => setMenuOpen(!menuOpen)}
//                 className="text-2xl text-blue-700 focus:outline-none"
//               >
//                 {menuOpen ? <HiX /> : <HiMenu />}
//               </button>
//             </div>
//           </div>

//           {/* Mobile Dropdown */}
//           {menuOpen && (
//             <div className="md:hidden bg-white shadow-md px-4 py-2 space-y-2">
//               {webNavigationLinks.map((link) => (
//                 <NavLink
//                   key={link.name}
//                   to={link.path}
//                   onClick={() => setMenuOpen(false)}
//                   className={({ isActive }) =>
//                     isActive
//                       ? "block text-blue-700 font-medium border-l-4 border-blue-700 pl-2"
//                       : "block text-gray-700 hover:text-blue-700 transition"
//                   }
//                 >
//                   {link.name}
//                 </NavLink>
//               ))}
//             </div>
//           )}
//         </div>
//       </header>

//       {/* Modal */}
//       {modalOpen && (
//         <div
//           className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ${
//             isClosing ? "animate-fadeOut" : "animate-fadeIn"
//           }`}
//         >
//           <div
//             ref={modalRef}
//             className={`rounded-xl shadow-lg bg-white w-full max-w-md p-6 relative transform transition-all duration-300 ${
//               isClosing ? "animate-modalClose" : "animate-modalOpen"
//             }`}
//           >
//             <button
//               onClick={handleCloseModal}
//               className="absolute top-1 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
//               aria-label="Close modal"
//             >
//               &times;
//             </button>

//             {/* Tabs */}
//             <div className="flex border-b border-gray-300">
//               {isLogin ? (
//                 <button
//                   onClick={() => setIsLogin(true)}
//                   className={`flex-1 py-2 font-bold text-xl text-center ${
//                     isLogin
//                       ? "border-b-4 border-blue-500 text-black"
//                       : "text-gray-500 hover:text-yellow-500"
//                   }`}
//                 >
//                   Login
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => setIsLogin(false)}
//                   className={`flex-1 py-2 font-bold text-xl text-center ${
//                     !isLogin
//                       ? "border-b-4 border-blue-500 text-black"
//                       : "text-gray-500 hover:text-yellow-500"
//                   }`}
//                 >
//                   Sign Up
//                 </button>
//               )}
//             </div>

//             {/* Render Form based on tab */}
//             {isLogin ? (
//               <Login
//                 onSwitchToSignup={() => setIsLogin(false)}
//                 onClose={handleCloseModal}
//               />
//             ) : (
//               <Signup
//                 onSwitchToLogin={() => setIsLogin(true)}
//                 onClose={handleCloseModal}
//               />
//             )}
//           </div>
//         </div>
//       )}

//       {/* Animations */}
//       <style>
//         {`

//         `}
//       </style>
//     </>
//   );
// };

// export default Header;
