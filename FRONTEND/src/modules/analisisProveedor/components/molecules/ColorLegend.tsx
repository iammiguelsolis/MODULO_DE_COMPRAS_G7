const ColorLegend = () => {
    return (
        <div className="bg-white border border-gray-300 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Leyenda sobre código de colores
            </h3>
            <div className="space-y-3">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-10 bg-blue-200 rounded border border-blue-300"></div>
                    <p className="text-sm text-gray-700">
                        Significa que no cumple con los criterios de la Ley 27912 para formar sindicatos.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-20 h-10 bg-red-200 rounded border border-red-300"></div>
                    <p className="text-sm text-gray-700">
                        Cumple los req. pero no tiene
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-20 h-10 bg-green-300 rounded border border-green-400"></div>
                    <p className="text-sm text-gray-700">
                        Cumple los req. y tiene sindicato
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ColorLegend;