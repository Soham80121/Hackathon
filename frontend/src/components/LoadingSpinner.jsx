import React from 'react';

const LoadingSpinner = ({ text = "Loading...", size = "md", fullScreen = false }) => {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizeClasses[size] || sizeClasses.md} animate-spin`}>
        <svg className="text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      {text && <p className="text-sm font-medium text-slate-500 dark:text-darktext-muted animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-slate-900/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center p-8">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
