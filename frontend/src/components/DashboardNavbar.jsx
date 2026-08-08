import {
  BellIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  SunIcon,
  MoonIcon
} from "@heroicons/react/24/outline";
import { useSidebar } from "../context/SidebarContext";
import NotificationPanel from "./NotificationPanel";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function DashboardNavbar() {
  const { setIsOpen } = useSidebar();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};

  let displayName = user.name || "User";
  if (user.role === "admin") {
    displayName = "Admin";
  }

  let roleLabel = user.designation || "Employee";
  if (user.role === "admin") {
    roleLabel = "System Administrator";
  }

  const initial = user.name ? user.name.charAt(0).toUpperCase() : "A";

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState({ employees: [], leaves: [], policies: [], pages: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const ALL_PAGES = [
    { title: "Dashboard", path: "/dashboard", roles: ["admin", "hr", "employee"] },
    { title: "Employees", path: "/employees", roles: ["admin", "hr"] },
    { title: "Policies", path: "/policies", roles: ["admin", "hr", "employee"] },
    { title: "My Leave", path: user.role === "hr" ? "/hr/my-leave" : "/employee/my-leave", roles: ["employee", "hr"] },
    { title: "Leave Approvals", path: user.role === "admin" ? "/admin/leave-approvals" : "/hr/leave-approvals", roles: ["admin", "hr"] },
    { title: "AI Assistant", path: "/assistant", roles: ["admin", "hr", "employee"] },
    { title: "Reports", path: "/reports", roles: ["admin"] },
    { title: "Settings", path: "/settings", roles: ["admin", "hr", "employee"] },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setResults({ employees: [], leaves: [], policies: [], pages: [] });
      setShowDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      setShowDropdown(true);
      try {
        const res = await api.get(`/api/search?q=${searchQuery}`);
        
        // Filter local pages
        const matchedPages = ALL_PAGES.filter(p => 
          p.roles.includes(user.role) && 
          p.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setResults({ ...res.data, pages: matchedPages });
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, user.role]);

  const handleResultClick = (path) => {
    setShowDropdown(false);
    setSearchQuery("");
    navigate(path);
  };

  return (

    <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-800">

      <div className="flex justify-between items-center px-8 py-5">

        {/* Left Side */}

        <div className="flex items-center gap-4">

          <button 
            onClick={() => setIsOpen(true)}
            className="md:hidden p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:bg-slate-800 transition"
          >
            <Bars3Icon className="w-6 h-6 text-slate-800 dark:text-darktext-primary" />
          </button>

          <div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-darktext-primary">

            Dashboard

          </h1>

          <p className="text-gray-500 dark:text-darktext-muted mt-1">

            Welcome back, {displayName} 👋

          </p>

        </div>
        </div>

        {/* Right Side */}

        <div className="flex items-center gap-5">

          {/* Search */}
          <div className="relative hidden sm:block" ref={searchRef}>
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (searchQuery.trim()) setShowDropdown(true); }}
              className="pl-10 pr-4 py-2 w-72 border border-gray-300 dark:border-slate-700 rounded-xl focus:outline-none dark:text-darktext-primary focus:ring-2 focus:ring-blue-500"
            />
            
            {showDropdown && (
              <div className="absolute top-12 left-0 w-80 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-xl rounded-xl z-50 max-h-96 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-sm text-gray-500 dark:text-darktext-muted text-center">Searching...</div>
                ) : (
                  results.pages.length === 0 && results.employees.length === 0 && results.leaves.length === 0 && results.policies.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500 dark:text-darktext-muted text-center">No results found</div>
                  ) : (
                    <div className="py-2">
                      {results.pages.length > 0 && (
                        <div className="mb-2">
                          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-1">Pages</h4>
                          {results.pages.map(page => (
                            <div key={page.path} onClick={() => handleResultClick(page.path)} className="px-4 py-2 hover:bg-gray-50 dark:bg-slate-900/50 cursor-pointer text-sm text-gray-700 dark:text-darktext-secondary">
                              <span className="font-medium">{page.title}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {results.employees.length > 0 && (
                        <div className="mb-2">
                          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-1">Employees</h4>
                          {results.employees.map(emp => (
                            <div key={emp._id} onClick={() => handleResultClick("/employees")} className="px-4 py-2 hover:bg-gray-50 dark:bg-slate-900/50 cursor-pointer text-sm text-gray-700 dark:text-darktext-secondary">
                              <span className="font-medium">{emp.name}</span> — <span className="text-gray-500 dark:text-darktext-muted text-xs">{emp.department}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {results.leaves.length > 0 && (
                        <div className="mb-2">
                          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-1">Leaves</h4>
                          {results.leaves.map(leave => {
                            const isOwnLeave = leave.userId?._id === user.id || leave.userId === user.id;
                            let destPath = "/employee/my-leave";
                            if (user.role === "admin") destPath = "/admin/leave-approvals";
                            else if (user.role === "hr") destPath = isOwnLeave ? "/hr/my-leave" : "/hr/leave-approvals";
                            
                            return (
                              <div key={leave._id} onClick={() => handleResultClick(destPath)} className="px-4 py-2 hover:bg-gray-50 dark:bg-slate-900/50 cursor-pointer text-sm text-gray-700 dark:text-darktext-secondary">
                                <span className="font-medium">{leave.userId?.name ? `${leave.userId.name} — ` : ''}{leave.leaveType}</span> — <span className="text-gray-500 dark:text-darktext-muted text-xs">{leave.status}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {results.policies.length > 0 && (
                        <div className="mb-2">
                          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-1">Policies</h4>
                          {results.policies.map(policy => (
                            <div key={policy._id} onClick={() => handleResultClick("/policies")} className="px-4 py-2 hover:bg-gray-50 dark:bg-slate-900/50 cursor-pointer text-sm text-gray-700 dark:text-darktext-secondary truncate">
                              <span className="font-medium">{policy.title}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative inline-flex h-7 w-14 items-center rounded-full bg-slate-200 dark:bg-slate-700 transition-colors focus:outline-none dark:text-darktext-primary"
            aria-label="Toggle Dark Mode"
          >
            <span
              className={`${
                theme === "dark" ? "translate-x-8" : "translate-x-1"
              } inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white transition-transform shadow-sm`}
            >
              {theme === "light" ? (
                <SunIcon className="w-3.5 h-3.5 text-orange-400" />
              ) : (
                <MoonIcon className="w-3.5 h-3.5 text-indigo-500" />
              )}
            </span>
          </button>

          {/* Notification */}
          <NotificationPanel />

          {/* Avatar */}

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">

              {initial}

            </div>

            <div className="hidden md:block">

              <p className="font-semibold">

                {displayName}

              </p>

              <p className="text-sm text-gray-500 dark:text-darktext-muted">

                {roleLabel}

              </p>

            </div>

          </div>

        </div>

      </div>

    </header>

  );

}
