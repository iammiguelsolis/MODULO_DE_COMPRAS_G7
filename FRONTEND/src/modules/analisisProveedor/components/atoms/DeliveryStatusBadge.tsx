interface DeliveryStatusBadgeProps {
    isOnTime: boolean;
    isPartial: boolean;
}

const DeliveryStatusBadge: React.FC<DeliveryStatusBadgeProps> = ({ isOnTime, isPartial }) => {
    // Lógica de colores según el mockup:
    // Verde completo = entrega completa en plazo
    // Verde + Rojo = entrega parcial en plazo, final con retraso
    // Rojo + Verde = entrega parcial con retraso, final en plazo
    // Rojo completo = ambas con retraso

    if (isPartial) {
        // Para entrega parcial: solo mostramos el estado de la parcial
        return (
            <div className="flex gap-1">
                <div className={`w-16 h-8 rounded ${isOnTime ? "bg-green-500" : "bg-red-500"}`}></div>
            </div>
        );
    } else {
        // Para entrega final: mostramos combinación si es necesario
        return (
            <div className="flex gap-1">
                <div className={`w-16 h-8 rounded ${isOnTime ? "bg-green-500" : "bg-red-500"}`}></div>
            </div>
        );
    }
};

export default DeliveryStatusBadge;