import { Sparkles } from "lucide-react";
import Button from "./Button";
import { SparklesIcon } from "@heroicons/react/24/solid";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200">

      <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-blue-600 flex justify-center items-center">

            <SparklesIcon className="w-6 h-6 text-white" />

          </div>

          <h1 className="text-2xl font-bold text-slate-800">
            HRFlow AI
          </h1>

        </div>

        <div className="hidden md:flex gap-8 text-gray-600 font-medium">

          <a href="#" className="hover:text-blue-600 transition">
            Home
          </a>

          <a href="#" className="hover:text-blue-600 transition">
            Features
          </a>

          <a href="#" className="hover:text-blue-600 transition">
            About
          </a>

          <a href="#" className="hover:text-blue-600 transition">
            Contact
          </a>

        </div>

        <Button text="Login" />

      </div>

    </nav>
  );
}

export default Navbar;