import React from 'react';

const EmptyState = ({
  icon: Icon,
  title = "No data available",
  description,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 text-center animate-fadeIn ${className}`}>
      {Icon && (
        <div className="mb-4 text-gray-300 dark:text-gray-600">
          <Icon size={56} strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-400 max-w-xs mx-auto">
          {description}
        </p>
      )}
    </div>
  );
};

export default EmptyState;
