import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const Dropdown = ({
  trigger,
  items,
  align = 'left',
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignments = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div className="relative inline-block" ref={dropdownRef} {...props}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={`absolute z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${alignments[align]} ${className}`}
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {items.map((item, index) => (
              <button
                key={index}
                className={`${
                  item.disabled
                    ? 'cursor-not-allowed opacity-50'
                    : 'hover:bg-gray-100'
                } flex w-full items-center px-4 py-2 text-sm text-gray-700 ${
                  item.icon ? 'gap-2' : ''
                }`}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick?.();
                    setIsOpen(false);
                  }
                }}
                role="menuitem"
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const DropdownTrigger = ({
  children,
  icon: Icon = FaChevronDown,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
      <Icon className="h-4 w-4" />
    </button>
  );
};

export default Dropdown; 