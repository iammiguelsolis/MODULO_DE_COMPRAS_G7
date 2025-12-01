import React, { useState } from "react";
import InputText from "../atoms/InputTextA";
import Button from "../atoms/Button";

interface EstadoSectionProps {
    supplier: {
        id: number;
        razonSocial: string;
        ruc: string;
        rubro: string;
        pais: string;
        direccion: string;
        telefono: string;
        email: string;
        moneda: string;
        estado: string;
        historialCambios: any[];
    };
    onChangeState: (
        newState: string,
        motivo: string,
        fechaInicio: string,
        fechaFin?: string
    ) => void;
}

const STATES = ["Activo", "Bloqueado", "Suspendido"];

export default function EstadoSection({ supplier, onChangeState }: EstadoSectionProps) {
    const [newState, setNewState] = useState(supplier.estado);
    const [motivo, setMotivo] = useState("");
    const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().slice(0, 10));
    const [fechaFin, setFechaFin] = useState("");

    function handleApplyChange() {
        if (!motivo) {
            alert("Por favor, ingresa un motivo para el cambio de estado.");
            return;
        }
        onChangeState(newState, motivo, fechaInicio, fechaFin);
        setMotivo("");
    }

    function handleReset() {
        setNewState(supplier.estado);
        setMotivo("");
        setFechaInicio(new Date().toISOString().slice(0, 10));
        setFechaFin("");
    }

    return (
        <div className="space-y-6 border border-gray-300 rounded-lg p-6">
            <h2 className="font-semibold text-gray-700 mb-4">Cambiar estado del proveedor</h2>

            <div className="grid grid-cols-2 gap-4">
                <InputText value={supplier.razonSocial || ""} onChange={() => { }} placeholder="Proveedor" disabled />
                <InputText value={supplier.ruc || ""} onChange={() => { }} placeholder="RUC" disabled />
            </div>

            <div className="grid grid-cols-4 gap-4 mt-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Estado actual</label>
                    <InputText value={supplier.estado || ""} onChange={() => { }} disabled />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Nuevo estado</label>
                    <select
                        value={newState}
                        onChange={(e) => setNewState(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        {STATES.map((state) => (
                            <option key={state} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Fecha inicio</label>
                    <input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Fecha fin (opcional)</label>
                    <input
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            <div className="flex gap-2 justify-end mt-6">
                <Button variant="primary" onClick={handleApplyChange}>
                    Aplicar cambio
                </Button>
                <Button variant="secondary" onClick={handleReset}>
                    Cancelar
                </Button>
            </div>
        </div>
    );
}
