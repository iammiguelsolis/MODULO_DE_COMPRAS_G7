import { Star } from "lucide-react";

interface StarProps {
    filled: boolean;
    half?: boolean;
    onClick: () => void;
    onHover?: () => void;
}

export default function StarIcon({ filled, half, onClick, onHover }: StarProps) {
    return (
        <div onClick={onClick} onMouseEnter={onHover} className="cursor-pointer">
            <Star
                size={24}
                fill={filled ? "#FFD700" : half ? "url(#halfGradient)" : "none"}
                stroke={filled || half ? "#FFD700" : "#CCCCCC"}
            />
        </div>
    );
}
