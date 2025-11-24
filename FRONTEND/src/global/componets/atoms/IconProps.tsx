interface IconsProps {
  size?: number;
  icon: React.ElementType;
  className?: string;
}
  
export const Icon: React.FC<IconsProps> = ({ size = 5, icon: IconComponent, className = '' }) => {
  return <IconComponent className={`w-${size} h-${size} ${className}`} />;
}