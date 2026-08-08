import { XMarkIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function TempPasswordModal({ isOpen, onClose, userData }) {
  if (!isOpen || !userData) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(userData.tempPassword);
    toast.success("Password copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-darktext-primary">
              User Created Successfully
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:text-darktext-muted transition"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl space-y-3">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-darktext-muted">Name</p>
              <p className="text-slate-800 dark:text-darktext-primary font-semibold">{userData.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-darktext-muted">Email</p>
              <p className="text-slate-800 dark:text-darktext-primary font-semibold">{userData.email}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-darktext-secondary mb-2">Temporary Password</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-yellow-50 border border-yellow-200 text-yellow-800 font-mono text-lg font-bold px-4 py-3 rounded-xl tracking-wider text-center">
                {userData.tempPassword}
              </div>
              <button 
                onClick={handleCopy}
                className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition"
                title="Copy Password"
              >
                <DocumentDuplicateIcon className="w-6 h-6" />
              </button>
            </div>
            <p className="text-xs text-orange-600 mt-2 font-medium">
              Important: Please copy this password now. For security reasons, it will never be displayed again.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-6 py-2.5 rounded-xl font-medium text-white bg-slate-800 hover:bg-slate-900 transition"
          >
            Close & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
