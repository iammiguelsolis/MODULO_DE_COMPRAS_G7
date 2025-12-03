import React from 'react';

interface SelectProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

const Select: React.FC<SelectProps> = ({ 
  label, 
  value, 
  onChange, 
  options, 
  required,
  placeholder,
  disabled = false,
  error
}) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-xs text-gray-600 font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`px-3 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
        error 
          ? 'border-red-500 focus:ring-red-500' 
          : 'border-gray-300 focus:ring-blue-500'
      } ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && (
      <span className="text-xs text-red-500">{error}</span>
    )}
  </div>
);

export default Select;