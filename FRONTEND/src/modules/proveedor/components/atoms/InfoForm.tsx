interface InputLabelProps {
    value: string;
    label: string;
    fullWidth?: boolean;
}

export default function InfoForm({ value, label, fullWidth = true }: InputLabelProps) {
    return (
        <>
            <span className="mb-2 text-sm text-gray-600">{label}</span>
            <input
                type="text"
                value={value}
                readOnly
                className={`border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none ${fullWidth ? "w-full" : ""}`}
            />
        </>
    );
}
