import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  icon: Icon,
  footer,
  className = '',
  hover = false,
  onClick,
  ...props
}) => {
  const baseStyles = 'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden';
  const hoverStyles = hover ? 'transition-all duration-200 hover:shadow-md hover:border-primary-100 cursor-pointer' : '';
  const clickableStyles = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${clickableStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {(title || subtitle || Icon) && (
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="flex-shrink-0">
                <Icon className="w-6 h-6 text-primary-600" />
              </div>
            )}
            <div className="flex-1">
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card; 