import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconProps {
    icon: LucideIcon;
    size?: number | 'sm' | 'md' | 'lg';
    className?: string;
}

const Icon: React.FC<IconProps> = ({ icon: IconComponent, size = 'md', className }) => {
    const sizeMap = {
        sm: 16,
        md: 20,
        lg: 24,
    };

    const iconSize = typeof size === 'number' ? size : sizeMap[size];

    return <IconComponent size={iconSize} className={className} />;
};

export default Icon;
