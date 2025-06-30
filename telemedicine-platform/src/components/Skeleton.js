import React from 'react';

const Skeleton = ({
  type = 'text',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'animate-pulse bg-gray-200 rounded';

  const types = {
    text: {
      sm: 'h-4',
      md: 'h-5',
      lg: 'h-6',
    },
    circle: {
      sm: 'h-8 w-8 rounded-full',
      md: 'h-12 w-12 rounded-full',
      lg: 'h-16 w-16 rounded-full',
    },
    avatar: {
      sm: 'h-8 w-8 rounded-full',
      md: 'h-12 w-12 rounded-full',
      lg: 'h-16 w-16 rounded-full',
    },
    image: {
      sm: 'h-20',
      md: 'h-32',
      lg: 'h-48',
    },
    button: {
      sm: 'h-8 w-20',
      md: 'h-10 w-24',
      lg: 'h-12 w-32',
    },
    card: {
      sm: 'h-32',
      md: 'h-48',
      lg: 'h-64',
    },
  };

  return (
    <div
      className={`${baseStyles} ${types[type][size]} ${className}`}
      {...props}
    />
  );
};

export const SkeletonText = ({
  lines = 3,
  size = 'md',
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          type="text"
          size={size}
          className={index === lines - 1 ? 'w-3/4' : ''}
        />
      ))}
    </div>
  );
};

export const SkeletonCard = ({
  size = 'md',
  className = '',
  ...props
}) => {
  return (
    <div
      className={`rounded-lg border border-gray-200 p-4 ${className}`}
      {...props}
    >
      <div className="flex items-center space-x-4">
        <Skeleton type="avatar" size={size} />
        <div className="flex-1 space-y-2">
          <Skeleton type="text" size={size} />
          <Skeleton type="text" size={size} className="w-3/4" />
        </div>
      </div>
    </div>
  );
};

export default Skeleton; 