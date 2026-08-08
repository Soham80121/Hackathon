import React from 'react';

const ErrorState = ({ 
  title = "Something went wrong", 
  message = "An error occurred while loading the data. Please try again later.",
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full p-8 text-center bg-red-50/50 border border-red-100 rounded-2xl">
      <div className="flex items-center justify-center w-14 h-14 mb-4 bg-red-100 rounded-full text-red-500">
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-red-800">{title}</h3>
      <p className="max-w-md mt-2 text-sm text-red-600/80">{message}</p>
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-5 py-2 mt-6 text-sm font-medium text-red-700 transition-colors bg-red-100 rounded-xl hover:bg-red-200 focus:outline-none dark:text-darktext-primary focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
