import React from 'react';

const Input = ({
  label,
  error,
  icon: Icon,
  className = '',
  fullWidth = false,
  ...props
}) => {
  const baseStyles = 'block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm';
  const errorStyles = error ? 'border-error-300 text-error-900 placeholder-error-300 focus:border-error-500 focus:ring-error-500' : '';
  const widthStyles = fullWidth ? 'w-full' : '';
  const iconStyles = Icon ? 'pl-10' : '';

  return (
    <div className={`${widthStyles} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          className={`${baseStyles} ${errorStyles} ${iconStyles}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-error-600">{error}</p>
      )}
    </div>
  );
};

export default Input; 