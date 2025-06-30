import React from 'react';

const ProgressBar = ({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  labelPosition = 'inside',
  className = '',
  ...props
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4',
  };

  const variants = {
    primary: 'bg-primary-600',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
    info: 'bg-blue-500',
  };

  const labelSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const labelPositions = {
    inside: 'absolute inset-0 flex items-center justify-center text-white',
    outside: 'mt-1 text-gray-700',
  };

  return (
    <div className={className} {...props}>
      <div className="relative">
        <div className="overflow-hidden rounded-full bg-gray-200">
          <div
            className={`${sizes[size]} ${variants[variant]} transition-all duration-300 ease-in-out`}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
          />
        </div>
        {showLabel && labelPosition === 'inside' && (
          <div className={labelPositions.inside}>
            <span className={`font-medium ${labelSizes[size]}`}>
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
      {showLabel && labelPosition === 'outside' && (
        <div className={labelPositions.outside}>
          <span className={`font-medium ${labelSizes[size]}`}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar; 