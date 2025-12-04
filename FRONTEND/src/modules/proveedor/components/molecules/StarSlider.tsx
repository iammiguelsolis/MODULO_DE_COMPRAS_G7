import { useState } from "react";
import { Star } from "lucide-react";

interface StarSliderProps {
    value: number;
    onChange: (value: number) => void;
}

export default function StarSlider({ value, onChange }: StarSliderProps) {
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    const handleClick = (index: number) => {
        onChange(index + 1);
    };

    const handleMouseEnter = (index: number) => setHoverValue(index + 1);
    const handleMouseLeave = () => setHoverValue(null);

    const displayValue = hoverValue ?? value;

    return (
        <div className="flex flex-col items-left">
            {/* Texto placeholder */}
            <span className="mb-2 text-sm text-gray-600">Calificación</span>

            {/* Contenedor de estrellas */}
            <div className="relative flex justify-center items-center bg-white px-14 py-1 w-full border border-gray-300 rounded-md">
                {Array.from({ length: 5 }, (_, i) => (
                    <Star
                        key={i}
                        size={28}
                        className={`cursor-pointer transition-colors ${displayValue > i ? "text-blue-600" : "text-gray-300"
                            }`}
                        onClick={() => handleClick(i)}
                        onMouseEnter={() => handleMouseEnter(i)}
                        onMouseLeave={handleMouseLeave}
                    />
                ))}

                {/* Botón 'X' para reiniciar */}
                {value > 0 && (
                    <button
                        className="absolute top-2 right-2 w-5 h-5 flex pb-0.5 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition font-bold"
                        onClick={() => onChange(0)}
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
}
