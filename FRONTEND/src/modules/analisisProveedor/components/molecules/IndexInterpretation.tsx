const IndexInterpretation = () => {
    return (
        <div className="bg-white border border-gray-300 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Interpretación del índice
            </h3>
            <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-700">0 &lt; ID =&lt; 0.5</span>
                    <span className="text-sm text-gray-600">Bajo</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-700">0.5 &lt; ID =&lt; 1.5</span>
                    <span className="text-sm text-gray-600">Medio</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-700">1.5 &lt; ID =&lt; 3</span>
                    <span className="text-sm text-gray-600">Alto</span>
                </div>
                <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-700">3 &lt; ID</span>
                    <span className="text-sm text-gray-600">No Aceptable</span>
                </div>
            </div>
        </div>
    );
};

export default IndexInterpretation;