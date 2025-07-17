import React from 'react';

const LoadingSpinner = () => {
  return (
      <div className="flex h-screen w-5/6 items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
  );
};

export default LoadingSpinner;