import React from 'react';

const Tabs = ({
  tabs,
  activeTab,
  onChange,
  variant = 'line',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const variants = {
    line: 'border-b border-gray-200',
    pill: 'space-x-2',
    enclosed: 'bg-gray-100 p-1 rounded-lg',
  };

  const tabVariants = {
    line: {
      base: 'border-b-2 px-4 py-2 text-sm font-medium',
      active: 'border-primary-500 text-primary-600',
      inactive: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
    },
    pill: {
      base: 'px-4 py-2 text-sm font-medium rounded-full',
      active: 'bg-primary-100 text-primary-700',
      inactive: 'text-gray-500 hover:bg-gray-100 hover:text-gray-700',
    },
    enclosed: {
      base: 'px-4 py-2 text-sm font-medium rounded-md',
      active: 'bg-white text-primary-700 shadow-sm',
      inactive: 'text-gray-500 hover:text-gray-700',
    },
  };

  return (
    <div className={className} {...props}>
      <div className={variants[variant]}>
        <nav
          className={`flex ${fullWidth ? 'w-full' : ''} ${
            variant === 'enclosed' ? 'space-x-1' : ''
          }`}
          aria-label="Tabs"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`${
                tabVariants[variant].base
              } ${
                activeTab === tab.id
                  ? tabVariants[variant].active
                  : tabVariants[variant].inactive
              } ${
                fullWidth ? 'flex-1' : ''
              } ${
                tab.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              }`}
              disabled={tab.disabled}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.icon && (
                <tab.icon
                  className={`mr-2 h-4 w-4 ${
                    activeTab === tab.id ? 'text-primary-500' : 'text-gray-400'
                  }`}
                />
              )}
              {tab.label}
              {tab.badge && (
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default Tabs; 