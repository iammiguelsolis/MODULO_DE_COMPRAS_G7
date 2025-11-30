import Select from "../atoms/Select";

export default function RiskSelect({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
    return (
        <div className="flex flex-col items-left">
            <span className="mb-2 text-sm text-gray-600">Riesgo</span>
            <Select
                value={value}
                onChange={onChange}
                options={[
                    { label: "Bajo", value: "low" },
                    { label: "Medio", value: "medium" },
                    { label: "Alto", value: "high" },
                ]}
            />
        </div>
    );
}
