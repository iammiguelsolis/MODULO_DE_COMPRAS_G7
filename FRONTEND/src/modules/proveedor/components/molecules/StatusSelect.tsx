import Select from "../atoms/Select";

export default function StatusSelect({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
    return (
        <div className="flex flex-col items-left">
            <span className="mb-2 text-sm text-gray-600">Estado</span>
            <Select
                value={value}
                onChange={onChange}
                options={[
                    { label: "Activo", value: "ACTIVO" },
                    { label: "Inactivo", value: "INACTIVO" },
                    { label: "Bloqueado", value: "BLOQUEADO" },
                ]}
            />
        </div>
    );
}
