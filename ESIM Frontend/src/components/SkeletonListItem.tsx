import React from 'react';

const SkeletonListItem: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 w-full mx-auto">
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-3 py-1">
          <div className="flex items-center space-x-3">
            <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
            <div className="h-6 w-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonListItem;