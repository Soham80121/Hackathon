import React from 'react';

const EmptyState = ({ 
  title = "No data found", 
  description = "Get started by creating a new record.", 
  icon,
  actionText,
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-dashed rounded-2xl">
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-slate-50 dark:bg-slate-900/50 text-slate-400">
        {icon || (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-darktext-primary">{title}</h3>
      <p className="max-w-sm mt-2 text-sm text-slate-500 dark:text-darktext-muted">{description}</p>
      
      {actionText && onAction && (
        <button 
          onClick={onAction}
          className="px-5 py-2.5 mt-6 text-sm font-medium text-white transition-colors bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none dark:text-darktext-primary focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
