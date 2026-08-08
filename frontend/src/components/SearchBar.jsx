import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchBar({ placeholder = "Search...", onChange, className = "" }) {
  return (
    <div className={`relative w-full ${className}`}>
      <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        className="w-full pl-12 pr-5 py-3 border border-gray-300 dark:border-slate-700 rounded-xl focus:outline-none dark:text-darktext-primary focus:ring-2 focus:ring-blue-500 transition-all bg-white dark:bg-slate-900"
      />
    </div>
  );
}
