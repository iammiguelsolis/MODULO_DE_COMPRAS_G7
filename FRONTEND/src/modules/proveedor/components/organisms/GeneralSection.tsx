import InputText from "../atoms/InputTextA";
import Button from "../atoms/Button";
import InfoForm from "../atoms/InfoForm";

interface GeneralSectionProps {
    supplier: {
        razonSocial: string;
        ruc: string;
        rubro: string;
        pais: string;
        direccion: string;
        telefono: string;
        email: string;
        moneda: string;
    };
    onChangeField: (field: keyof SupplierGeneral, value: string) => void;
    editMode: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
}

type SupplierGeneral = GeneralSectionProps["supplier"];

export default function GeneralSection({
    supplier,
    onChangeField,
    editMode,
}: GeneralSectionProps) {
    return (
        <div className="grid grid-cols-2 gap-6">
            {/* Información General */}
            <div className="space-y-4 border border-gray-300 rounded-lg p-6">
                <h2 className="font-semibold text-gray-700 mb-4">Información general</h2>
                <div className="grid grid-cols-2 gap-10">
                    <div className="relative col-span-1">
                        <InfoForm
                            value={supplier.razonSocial}
                            label="Razón Social"
                        />
                    </div>
                    <div className="relative col-span-1">
                        <InfoForm
                            value={supplier.ruc}
                            label="RUC"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-10">
                    <div className="relative col-span-1">
                        <InfoForm
                            value={supplier.rubro}
                            label="Rubro"
                        />
                    </div>
                    <div className="relative col-span-1">
                        <InfoForm
                            value={supplier.pais}
                            label="País"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-10">
                    <div className="relative col-span-1">
                        <InfoForm
                            value={supplier.telefono}
                            label="Teléfono"
                        />
                    </div>
                    <div className="relative col-span-1">
                        <InfoForm
                            value={supplier.email}
                            label="Email"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-8 gap-10">
                    <div className="relative col-span-5">
                        <InfoForm
                            value={supplier.direccion}
                            label="Dirección"
                        />
                    </div>
                    <div className="relative col-span-3">
                        <InfoForm
                            value={supplier.moneda}
                            label="Moneda Preferida"
                        />
                    </div>
                </div>
            </div>
            {/* Términos y Estado */}
            <div className="space-y-4 border border-gray-300 rounded-lg p-6">
                <h2 className="font-semibold text-gray-700 mb-4">Términos & Estado</h2>

                <InputText
                    value={supplier.moneda}
                    onChange={(v) => onChangeField("moneda", v.target.value)}
                    placeholder="Moneda preferida"
                    fullWidth
                    disabled={!editMode}
                />
            </div>
        </div>
    );
}
