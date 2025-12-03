interface NavigationButtonsProps {
    onPrevious: () => void;
    onNext: () => void;
    hasPrevious: boolean;
    hasNext: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
    onPrevious,
    onNext,
    hasPrevious,
    hasNext
}) => {
    return (
        <div className="flex justify-center gap-4 my-6">
            <button
                onClick={onPrevious}
                disabled={!hasPrevious}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${hasPrevious
                        ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
            >
                Anterior
            </button>
            <button
                onClick={onNext}
                disabled={!hasNext}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${hasNext
                        ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
            >
                Siguiente
            </button>
        </div>
    );
};

export default NavigationButtons;