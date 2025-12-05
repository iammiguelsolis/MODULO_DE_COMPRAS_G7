
const Button: React.FC<{
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "danger";
    size?: "sm" | "md";
    onClick?: () => void;
    icon?: React.ReactNode;
}> = ({ children, variant = "primary", size = "md", onClick, icon }) => {
    const baseClasses = "rounded-lg font-medium transition-colors flex items-center gap-2";
    const sizeClasses = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-base";
    const variantClasses = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
        danger: "bg-red-600 text-white hover:bg-red-700"
    };

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${sizeClasses} ${variantClasses[variant]}`}
        >
            {icon}
            {children}
        </button>
    );
};

export default Button;