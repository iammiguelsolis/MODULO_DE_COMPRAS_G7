import { Icon } from "../atoms/IconProps";

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({ icon, label, isActive = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-6 py-3 transition-colors duration-200 ${isActive ? "" : "hover:bg-white/30"} cursor-pointer`}
    >
      <div
        className={`
          flex items-center gap-3 px-4 py-2 
          rounded-xl transition-all duration-300 w-full
          ${isActive ? "bg-white/90" : ""}
        `}
      >
        <Icon
          icon={icon}
          className={`${isActive ? "text-black" : "text-white"}`}
        />

        <span
          className={`${isActive ? "text-black" : "text-white"} font-medium text-left`}
        >
          {label}
        </span>
      </div>
    </button>
  );
};
