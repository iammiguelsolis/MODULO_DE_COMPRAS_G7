import React from "react";

interface NumericInputLabelProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    fullWidth?: boolean;
    allowPlus?: boolean;
}

const NumericInputLabel: React.FC<NumericInputLabelProps> = ({
    label,
    value,
    onChange,
    placeholder,
    fullWidth,
    allowPlus = false
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        // Si allowPlus está activado, permitir "+" al inicio y números
        if (allowPlus) {
            if (inputValue === "" || /^(\+)?\d*$/.test(inputValue)) {
                onChange(inputValue);
            }
        } else {
            // Solo números
            if (inputValue === "" || /^\d*$/.test(inputValue)) {
                onChange(inputValue);
            }
        }
    };

    return (
        <div className={fullWidth ? "w-full" : ""}>
            <label className="mb-2 text-sm text-gray-600">{label}</label>
            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
        </div>
    );
};

export default NumericInputLabel;