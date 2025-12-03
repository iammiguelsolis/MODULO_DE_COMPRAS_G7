const DeliveryLegend = () => {
    return (
        <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Leyenda sobre código de colores de entregas
            </h3>
            <div className="grid grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="flex flex-col items-center">
                    <div className="flex gap-1 mb-2">
                        <div className="w-12 h-8 bg-green-500 rounded"></div>
                    </div>
                    <p className="text-xs text-center text-gray-700">
                        Completa dentro del plazo
                    </p>
                </div>

                <div className="flex flex-col items-center">
                    <div className="flex gap-1 mb-2">
                        <div className="w-6 h-8 bg-green-500 rounded-l"></div>
                        <div className="w-6 h-8 bg-red-500 rounded-r"></div>
                    </div>
                    <p className="text-xs text-center text-gray-700">
                        Completa fuera del plazo
                    </p>
                </div>

                <div className="flex flex-col items-center">
                    <div className="flex gap-1 mb-2">
                        <div className="w-6 h-8 bg-red-500 rounded-l"></div>
                        <div className="w-6 h-8 bg-green-500 rounded-r"></div>
                    </div>
                    <p className="text-xs text-center text-gray-700">
                        Incompleta dentro del plazo
                    </p>
                </div>

                <div className="flex flex-col items-center">
                    <div className="flex gap-1 mb-2">
                        <div className="w-12 h-8 bg-red-500 rounded"></div>
                    </div>
                    <p className="text-xs text-center text-gray-700">
                        Incompleta fuera del plazo
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DeliveryLegend;