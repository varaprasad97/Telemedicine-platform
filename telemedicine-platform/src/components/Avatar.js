import React from 'react';

const Avatar = ({
  src,
  alt,
  size = 'md',
  status,
  className = '',
  ...props
}) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
  };

  const statusColors = {
    online: 'bg-success-500',
    offline: 'bg-gray-400',
    busy: 'bg-error-500',
    away: 'bg-warning-500',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
  };

  const statusPositions = {
    xs: 'bottom-0 right-0',
    sm: 'bottom-0 right-0',
    md: 'bottom-0 right-0',
    lg: 'bottom-0 right-0',
    xl: 'bottom-0 right-0',
  };

  return (
    <div className="relative inline-block" {...props}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${sizes[size]} rounded-full object-cover ${className}`}
        />
      ) : (
        <div
          className={`${sizes[size]} rounded-full bg-primary-100 flex items-center justify-center ${className}`}
        >
          <span className="text-primary-600 font-medium">
            {alt?.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      {status && (
        <span
          className={`absolute ${statusPositions[size]} ${statusSizes[size]} rounded-full border-2 border-white ${statusColors[status]}`}
        />
      )}
    </div>
  );
};

export default Avatar; 