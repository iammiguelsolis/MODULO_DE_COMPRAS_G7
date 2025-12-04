import React from 'react';

interface InputProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  disabled?: boolean;
  error?: string;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required, 
  type = "text",
  disabled = false,
  error
}) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-xs text-gray-600 font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`px-3 py-2.5 text-sm bg-white rounded-lg focus:outline-none focus:ring-2 transition-all border ${
        error 
          ? 'border-red-500 focus:ring-red-500' 
          : 'border-gray-300 focus:ring-blue-500'
      } ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
    />
    {error && (
      <span className="text-xs text-red-500">{error}</span>
    )}
  </div>
);

export default Input;