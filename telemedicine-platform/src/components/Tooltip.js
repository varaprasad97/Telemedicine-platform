import React, { useState, useRef, useEffect } from 'react';

const Tooltip = ({
  content,
  children,
  position = 'top',
  delay = 0,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const tooltipRef = useRef(null);

  const positions = {
    top: {
      base: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      arrow: 'bottom-[-6px] left-1/2 -translate-x-1/2 border-t-gray-900',
    },
    bottom: {
      base: 'top-full left-1/2 -translate-x-1/2 mt-2',
      arrow: 'top-[-6px] left-1/2 -translate-x-1/2 border-b-gray-900',
    },
    left: {
      base: 'right-full top-1/2 -translate-y-1/2 mr-2',
      arrow: 'right-[-6px] top-1/2 -translate-y-1/2 border-l-gray-900',
    },
    right: {
      base: 'left-full top-1/2 -translate-y-1/2 ml-2',
      arrow: 'left-[-6px] top-1/2 -translate-y-1/2 border-r-gray-900',
    },
  };

  const showTooltip = () => {
    if (delay) {
      const id = setTimeout(() => setIsVisible(true), delay);
      setTimeoutId(id);
    } else {
      setIsVisible(true);
    }
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      {...props}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 ${positions[position].base} ${className}`}
          role="tooltip"
        >
          <div className="relative rounded bg-gray-900 px-2 py-1 text-xs font-medium text-white">
            {content}
            <div
              className={`absolute h-0 w-0 border-4 border-transparent ${positions[position].arrow}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip; 