import React from "react";
import InputText from "../atoms/InputTextA";
import Button from "../atoms/Button";

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
    onEdit,
    onSave,
    onCancel,
}: GeneralSectionProps) {
    return (
        <div className="grid grid-cols-2 gap-6">
            {/* Información General */}
            <div className="space-y-4 border border-gray-300 rounded-lg p-6">
                <h2 className="font-semibold text-gray-700 mb-4">Información general</h2>

                <InputText
                    value={supplier.razonSocial}
                    onChange={(v) => onChangeField("razonSocial", v.target.value)}
                    placeholder="Razón social"
                    fullWidth
                    disabled={!editMode}
                />

                <InputText
                    value={supplier.ruc}
                    onChange={(v) => onChangeField("ruc", v.target.value)}
                    placeholder="RUC"
                    fullWidth
                    disabled={!editMode}
                />

                <InputText
                    value={supplier.rubro}
                    onChange={(v) => onChangeField("rubro", v.target.value)}
                    placeholder="Rubro"
                    fullWidth
                    disabled={!editMode}
                />

                <InputText
                    value={supplier.pais}
                    onChange={(v) => onChangeField("pais", v.target.value)}
                    placeholder="País"
                    fullWidth
                    disabled={!editMode}
                />

                <InputText
                    value={supplier.direccion}
                    onChange={(v) => onChangeField("direccion", v.target.value)}
                    placeholder="Dirección"
                    fullWidth
                    disabled={!editMode}
                />
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

                {/* Aquí puedes añadir más campos editables si quieres */}

                {!editMode && (
                    <Button variant="primary" onClick={onEdit}>
                        Editar
                    </Button>
                )}
                {editMode && (
                    <div className="flex gap-2">
                        <Button variant="primary" onClick={onSave}>
                            Guardar
                        </Button>
                        <Button variant="secondary" onClick={onCancel}>
                            Cancelar
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
