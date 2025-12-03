import React from 'react';
import { ComparacionTemplate } from '../components/templates/ComparacionTemplate';

// En una app real, aquí obtendríamos el ID de la URL y pasaríamos props si fuera necesario
// o dejaríamos que el template maneje su propia carga de datos como lo hace ahora.
export const ComparacionPage: React.FC = () => {
    return <ComparacionTemplate />;
};
