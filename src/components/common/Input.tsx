import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  icon: Icon, 
  error, 
  className = '',
  fullWidth = true,
  ...props 
}) => {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          className={`
            block w-full rounded-lg border-gray-300 shadow-sm
            focus:ring-blue-500 focus:border-blue-500 
            text-base py-3
            ${Icon ? 'pl-10' : 'pl-4'}
            ${error ? 'border-red-300' : 'border-gray-300'}
            dark:bg-gray-800 dark:border-gray-600 dark:text-white
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;