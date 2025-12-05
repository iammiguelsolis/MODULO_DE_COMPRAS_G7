import React, { useState } from "react";
import type { CuentaBancaria } from "../../../../services/proveedor/types";
import SelectField from "../atoms/SelectField";
import NumericInputField from "../atoms/NumericInputField";
import InputField from "../atoms/InputField";
import Button from "../atoms/ButtonDetail";
import { X } from "lucide-react";

const BankAccountModal: React.FC<{
    account: CuentaBancaria | null;
    onClose: () => void;
    onSave: (account: Omit<CuentaBancaria, "id">) => void;
}> = ({ account, onClose, onSave }) => {
    const [formData, setFormData] = useState<Omit<CuentaBancaria, "id">>({
        banco: account?.banco || "",
        moneda: account?.moneda || "",
        numeroCuenta: account?.numeroCuenta || "",
        cci: account?.cci || "",
        titular: account?.titular || ""
    });

    const bancoOptions = [
        { value: "BCP", label: "BCP - Banco de Crédito del Perú" },
        { value: "BBVA", label: "BBVA Continental" },
        { value: "Interbank", label: "Interbank" },
        { value: "Scotiabank", label: "Scotiabank Perú" },
        { value: "Banbif", label: "Banbif" },
        { value: "Pichincha", label: "Banco Pichincha" },
        { value: "GNB", label: "GNB Perú" },
        { value: "Santander", label: "Santander Perú" },
        { value: "Otro", label: "Otro" }
    ];

    const monedaOptions = [
        { value: "PEN", label: "PEN - Soles" },
        { value: "USD", label: "USD - Dólares" },
        { value: "EUR", label: "EUR - Euros" }
    ];

    const handleSave = () => {
        if (!formData.banco || !formData.moneda || !formData.numeroCuenta || !formData.titular) {
            alert("Por favor completa todos los campos obligatorios (*)");
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                        {account ? "Editar Cuenta Bancaria" : "Agregar Cuenta Bancaria"}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <SelectField
                        label="Banco *"
                        value={formData.banco}
                        onChange={(v) => setFormData({ ...formData, banco: v })}
                        options={bancoOptions}
                        placeholder="Seleccionar banco"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <SelectField
                            label="Moneda *"
                            value={formData.moneda}
                            onChange={(v) => setFormData({ ...formData, moneda: v })}
                            options={monedaOptions}
                            placeholder="Seleccionar"
                        />
                        <NumericInputField
                            label="Número de Cuenta *"
                            value={formData.numeroCuenta}
                            onChange={(v) => setFormData({ ...formData, numeroCuenta: v })}
                            placeholder="001122333444"
                            allowedChars="-"
                        />
                    </div>
                    <NumericInputField
                        label="CCI"
                        value={formData.cci}
                        onChange={(v) => setFormData({ ...formData, cci: v })}
                        placeholder="002-011-0222033344-55"
                        allowedChars="-"
                    />
                    <InputField
                        label="Titular *"
                        value={formData.titular}
                        onChange={(v) => setFormData({ ...formData, titular: v })}
                        placeholder="Nombre del titular"
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

export default BankAccountModal;