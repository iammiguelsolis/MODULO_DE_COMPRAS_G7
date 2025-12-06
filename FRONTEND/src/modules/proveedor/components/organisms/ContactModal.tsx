import React, { useState } from "react";
import type { ContactoProveedor } from "../../../../services/proveedor/types";
import NumericInputField from "../atoms/NumericInputField";
import InputField from "../atoms/InputField";
import Button from "../atoms/ButtonDetail";
import { X } from "lucide-react";


const ContactModal: React.FC<{
    contact: ContactoProveedor | null;
    onClose: () => void;
    onSave: (contact: Omit<ContactoProveedor, "id">) => void;
}> = ({ contact, onClose, onSave }) => {
    const [formData, setFormData] = useState<Omit<ContactoProveedor, "id">>({
        nombre: contact?.nombre || "",
        cargo: contact?.cargo || "",
        email: contact?.email || "",
        telefono: contact?.telefono || ""
    });

    const handleSave = () => {
        if (!formData.nombre || !formData.email) {
            alert("Por favor completa los campos obligatorios");
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                        {contact ? "Editar Contacto" : "Agregar Contacto"}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <InputField
                        label="Nombre *"
                        value={formData.nombre}
                        onChange={(v) => setFormData({ ...formData, nombre: v })}
                        placeholder="Juan Pérez"
                    />
                    <InputField
                        label="Cargo"
                        value={formData.cargo}
                        onChange={(v) => setFormData({ ...formData, cargo: v })}
                        placeholder="Gerente de Ventas"
                    />
                    <InputField
                        label="Email *"
                        value={formData.email}
                        onChange={(v) => setFormData({ ...formData, email: v })}
                        placeholder="contacto@empresa.com"
                        type="email"
                    />
                    <NumericInputField
                        label="Teléfono"
                        value={formData.telefono}
                        onChange={(v) => setFormData({ ...formData, telefono: v })}
                        placeholder="+51999888777"
                        allowedChars="+ "
                    />
                </div>

                <div className="flex gap-2 justify-end mt-6">
                    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSave}>Guardar</Button>
                </div>
            </div>
        </div>
    );
};

export default ContactModal;