import React from "react";

export const Loader = () => {
  return (
    <div className="flex grow flex-col items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-500 border-t-gray-600"></div>
    </div>
  );
};
