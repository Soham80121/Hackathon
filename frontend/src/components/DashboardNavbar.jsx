import {
  BellIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function DashboardNavbar() {

  const user = JSON.parse(localStorage.getItem("user"));

  return (

    <header className="bg-white shadow-sm border-b border-gray-200">

      <div className="flex justify-between items-center px-8 py-5">

        {/* Left Side */}

        <div>

          <h1 className="text-3xl font-bold text-slate-800">

            Dashboard

          </h1>

          <p className="text-gray-500 mt-1">

            Welcome back, {user?.name || "Admin"} 👋

          </p>

        </div>

        {/* Right Side */}

        <div className="flex items-center gap-5">

          {/* Search */}

          <div className="relative">

            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />

            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-72 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* Notification */}

          <button className="relative p-2 rounded-xl hover:bg-gray-100 transition">

            <BellIcon className="w-7 h-7 text-gray-700" />

            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>

          </button>

          {/* Avatar */}

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">

              {user?.name?.charAt(0).toUpperCase() || "A"}

            </div>

            <div>

              <p className="font-semibold">

                {user?.name || "Admin"}

              </p>

              <p className="text-sm text-gray-500">

                HR Manager

              </p>

            </div>

          </div>

        </div>

      </div>

    </header>

  );

}