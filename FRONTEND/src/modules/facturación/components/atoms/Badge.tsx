import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'BORRADOR' | 'EN_CONCILIACION' | 'APROBADA' | 'ENVIADA_CXP';
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'BORRADOR' }) => {
  const variants = {
    BORRADOR: 'bg-gray-100 text-gray-700',
    EN_CONCILIACION: 'bg-amber-100 text-amber-700',
    APROBADA: 'bg-emerald-100 text-emerald-700',
    ENVIADA_CXP: 'bg-purple-100 text-purple-700'
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;