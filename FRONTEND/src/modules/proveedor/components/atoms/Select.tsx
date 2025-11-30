interface SelectProps {
    value?: string;
    onChange: (value: string) => void;
    options: { label: string; value: string }[];
}

export default function Select({ value, onChange, options }: SelectProps) {
    return (
        <select
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        >
            <option value="">Sin seleccionar</option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    );
}
