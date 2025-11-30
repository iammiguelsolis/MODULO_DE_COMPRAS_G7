interface InputTextProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    fullWidth?: boolean;
}

export default function InputText({ value, onChange, placeholder, fullWidth }: InputTextProps) {
    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none ${fullWidth ? "w-full" : ""}`}
        />
    );
}
