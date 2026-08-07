import { Link, useNavigate } from "react-router-dom";
import { SparklesIcon } from "@heroicons/react/24/solid";
import Button from "./Button";
import { useLocation } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();


  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-slate-800">
            HRFlow AI
          </h1>

        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">

         <button
  onClick={() => {
    if (location.pathname !== "/") {
      navigate("/");
    }

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  }}
  className="hover:text-blue-600 transition"
>
  Home
</button>

          <a
            href="#features"
            className="hover:text-blue-600 transition-colors duration-300"
          >
            Features
          </a>

          <a
            href="#about"
            className="hover:text-blue-600 transition-colors duration-300"
          >
            About
          </a>

          <a
            href="#contact"
            className="hover:text-blue-600 transition-colors duration-300"
          >
            Contact
          </a>

        </div>

        {/* Login Button */}
 {
  token ? (
    <div className="flex items-center gap-4">

      <span className="font-semibold text-slate-700">
        Hi, {user?.name}
      </span>

      <Link to="/dashboard">
        <Button text="Dashboard" />
      </Link>

      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl transition"
      >
        Logout
      </button>

    </div>
  ) : (
    <Link to="/login">
      <Button text="Login" />
    </Link>
  )
}

      </div>
    </nav>
  );
}

export default Navbar;