import React from 'react';

const ConfirmModal = ({ 
  isOpen,
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDanger = true
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl">
        <h3 className="text-lg font-bold text-slate-900 dark:text-darktext-primary">{title}</h3>
        <p className="mt-2 text-slate-500 dark:text-darktext-muted">{message}</p>
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-darktext-secondary bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
              isDanger 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
