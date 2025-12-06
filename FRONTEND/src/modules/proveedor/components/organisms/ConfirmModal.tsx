import React from "react";
import { AlertTriangle } from "lucide-react";
import Button from "../atoms/ButtonDetail";

const ConfirmModal: React.FC<{
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: "danger" | "warning";
}> = ({ title, message, onConfirm, onCancel, type = "warning" }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${type === "danger" ? "bg-red-100" : "bg-yellow-100"}`}>
                    <AlertTriangle size={24} className={type === "danger" ? "text-red-600" : "text-yellow-600"} />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{title}</h3>
                    <p className="text-sm text-gray-600">{message}</p>
                </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
                <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button variant="danger" onClick={onConfirm}>Confirmar</Button>
            </div>
        </div>
    </div>
);

export default ConfirmModal;