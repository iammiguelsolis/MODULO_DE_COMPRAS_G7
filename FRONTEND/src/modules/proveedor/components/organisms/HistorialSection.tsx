import React, { useState } from "react";
import Button from "../atoms/Button";
import InputText from "../atoms/InputText";

interface CambioEstado {
    fecha: string;
    usuario: string;
    cambio: string;
    motivo: string;
}

interface HistorialSectionProps {
    supplier: {
        historialCambios: CambioEstado[];
        // Campos editables para historial (puedes agregar aquí más si quieres)
        razonSocial: string;
        ruc: string;
        rubro: string;
        pais: string;
        direccion: string;
        telefono: string;
        email: string;
        moneda: string;
    };
    onSaveChanges: (updatedSupplier: any) => void;
}

export default function HistorialSection({ supplier, onSaveChanges }: HistorialSectionProps) {
    const [editData, setEditData] = useState({
        razonSocial: supplier.razonSocial,
        ruc: supplier.ruc,
        rubro: supplier.rubro,
        pais: supplier.pais,
        direccion: supplier.direccion,
        telefono: supplier.telefono,
        email: supplier.email,
        moneda: supplier.moneda,
    });

    function onChangeField(field: keyof typeof editData, value: string) {
        setEditData((prev) => ({ ...prev, [field]: value }));
    }

    function handleSave() {
        // Actualizar datos y agregar registro en historial
        const fechaHoy = new Date().toISOString().slice(0, 10);
        const nuevoCambio = {
            fecha: fechaHoy,
            usuario: "usuarioActual",
            cambio: "Actualización de datos",
            motivo: "Edición desde historial",
        };

        const updatedSupplier = {
            ...supplier,
            ...editData,
            historialCambios: [nuevoCambio, ...supplier.historialCambios],
        };

        onSaveChanges(updatedSupplier);
    }

    function handleCancel() {
        setEditData({
            razonSocial: supplier.razonSocial,
            ruc: supplier.ruc,
            rubro: supplier.rubro,
            pais: supplier.pais,
            direccion: supplier.direccion,
            telefono: supplier.telefono,
            email: supplier.email,
            moneda: supplier.moneda,
        });
    }

    return (
        <div>
            {/* Formulario para editar datos generales */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                <InputText
                    value={editData.razonSocial}
                    onChange={(v) => onChangeField("razonSocial", v)}
                    placeholder="Razón social"
                    fullWidth
                />
                <InputText
                    value={editData.ruc}
                    onChange={(v) => onChangeField("ruc", v)}
                    placeholder="RUC"
                    fullWidth
                />
                <InputText
                    value={editData.rubro}
                    onChange={(v) => onChangeField("rubro", v)}
                    placeholder="Rubro"
                    fullWidth
                />
                <InputText
                    value={editData.pais}
                    onChange={(v) => onChangeField("pais", v)}
                    placeholder="País"
                    fullWidth
                />
                <InputText
                    value={editData.direccion}
                    onChange={(v) => onChangeField("direccion", v)}
                    placeholder="Dirección"
                    fullWidth
                />
                <InputText
                    value={editData.telefono}
                    onChange={(v) => onChangeField("telefono", v)}
                    placeholder="Teléfono"
                    fullWidth
                />
                <InputText
                    value={editData.email}
                    onChange={(v) => onChangeField("email", v)}
                    placeholder="Email"
                    fullWidth
                />
                <InputText
                    value={editData.moneda}
                    onChange={(v) => onChangeField("moneda", v)}
                    placeholder="Moneda"
                    fullWidth
                />
            </div>

            <div className="flex gap-2 justify-end mb-6">
                <Button variant="primary" onClick={handleSave}>
                    Aplicar cambios
                </Button>
                <Button variant="secondary" onClick={handleCancel}>
                    Cancelar
                </Button>
            </div>

            {/* Tabla historial */}
            <div className="overflow-x-auto border border-gray-300 rounded-2xl">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-blue-600 text-white uppercase text-sm">
                            <th className="px-6 py-4 text-left">Fecha</th>
                            <th className="px-6 py-4 text-left">Usuario</th>
                            <th className="px-6 py-4 text-left">Cambio</th>
                            <th className="px-6 py-4 text-left">Motivo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {supplier.historialCambios.map((cambio, i) => (
                            <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm">{cambio.fecha}</td>
                                <td className="px-6 py-4 text-sm">{cambio.usuario}</td>
                                <td className="px-6 py-4 text-sm">{cambio.cambio}</td>
                                <td className="px-6 py-4 text-sm">{cambio.motivo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
