import Select from "../atoms/Select";

const countries = [
    { label: "Perú", value: "Peru" },
    { label: "Chile", value: "Chile" },
    { label: "México", value: "México" },
    { label: "Argentina", value: "Argentina" },
    { label: "Colombia", value: "Colombia" },
];

export default function CountrySelect({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
    return (
        <div className="flex flex-col items-left">
            <span className="mb-2 text-sm text-gray-600">País</span>
            <Select
                value={value}
                onChange={onChange}
                options={countries}
            />
        </div>
    );
}
