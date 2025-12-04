import React from "react";

interface SelectLabelProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    fullWidth?: boolean;
}

const SelectLabel: React.FC<SelectLabelProps> = ({
    label,
    value,
    onChange,
    options,
    placeholder,
    fullWidth
}) => (
    <div className={fullWidth ? "w-full" : ""}>
        <label className="text-sm text-gray-600 mb-2">{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 text-sm"
        >
            <option value="">{placeholder || "Seleccionar..."}</option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);

export default SelectLabel;