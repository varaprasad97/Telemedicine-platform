import React from 'react';
import { FaTimes, FaInfoCircle, FaExclamationTriangle, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const Alert = ({
  type = 'info',
  title,
  children,
  onClose,
  className = '',
  ...props
}) => {
  const variants = {
    info: {
      icon: FaInfoCircle,
      styles: 'bg-blue-50 text-blue-800',
      iconStyles: 'text-blue-400',
    },
    success: {
      icon: FaCheckCircle,
      styles: 'bg-success-50 text-success-800',
      iconStyles: 'text-success-400',
    },
    warning: {
      icon: FaExclamationTriangle,
      styles: 'bg-warning-50 text-warning-800',
      iconStyles: 'text-warning-400',
    },
    error: {
      icon: FaExclamationCircle,
      styles: 'bg-error-50 text-error-800',
      iconStyles: 'text-error-400',
    },
  };

  const { icon: Icon, styles, iconStyles } = variants[type];

  return (
    <div
      className={`rounded-lg p-4 ${styles} ${className}`}
      role="alert"
      {...props}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconStyles}`} aria-hidden="true" />
        </div>
        <div className="ml-3">
          {title && (
            <h3 className="text-sm font-medium">{title}</h3>
          )}
          <div className={`text-sm ${title ? 'mt-2' : ''}`}>{children}</div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  type === 'info'
                    ? 'bg-blue-50 text-blue-500 hover:bg-blue-100 focus:ring-blue-600'
                    : type === 'success'
                    ? 'bg-success-50 text-success-500 hover:bg-success-100 focus:ring-success-600'
                    : type === 'warning'
                    ? 'bg-warning-50 text-warning-500 hover:bg-warning-100 focus:ring-warning-600'
                    : 'bg-error-50 text-error-500 hover:bg-error-100 focus:ring-error-600'
                }`}
                onClick={onClose}
              >
                <span className="sr-only">Dismiss</span>
                <FaTimes className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert; 