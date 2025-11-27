import React from 'react';
import './EconomicCriteriaInfo.css';

const EconomicCriteriaInfo: React.FC = () => {
    return (
        <div className="economic-criteria-info">
            <h3 className="criteria-title">Criterios de Evaluación</h3>

            <div className="criteria-item criteria-score">
                <div className="criteria-header">Puntuación (0-100)</div>
                <div className="criteria-description">
                    Se evalúa el precio, condiciones de pago, plazo de entrega y garantías ofrecidas
                </div>
            </div>

            <div className="criteria-item criteria-score">
                <div className="criteria-header">Cumplimiento Presupuestal</div>
                <div className="criteria-description">
                    La oferta debe estar dentro del presupuesto máximo establecido
                </div>
            </div>

            <div className="criteria-item criteria-score">
                <div className="criteria-header">Justificación Obligatoria</div>
                <div className="criteria-description">
                    Tanto aprobaciones como rechazos requieren justificación detallada
                </div>
            </div>
        </div>
    );
};

export default EconomicCriteriaInfo;
