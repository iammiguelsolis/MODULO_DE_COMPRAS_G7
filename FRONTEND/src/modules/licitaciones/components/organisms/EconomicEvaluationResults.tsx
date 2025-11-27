import React from 'react';
import EvaluatedProviderCard from '../molecules/EvaluatedProviderCard';
import type { EconomicEvaluation } from '../../lib/types';
import './EconomicEvaluationResults.css';

interface EconomicEvaluationResultsProps {
    evaluatedProviders: EconomicEvaluation[];
}

const EconomicEvaluationResults: React.FC<EconomicEvaluationResultsProps> = ({ evaluatedProviders }) => {
    if (evaluatedProviders.length === 0) {
        return null;
    }

    return (
        <div className="economic-evaluation-results">
            <h3 className="results-title">Resultados de Evaluación</h3>

            <div className="results-list">
                {evaluatedProviders.map(provider => (
                    <EvaluatedProviderCard
                        key={provider.providerId}
                        providerName={provider.providerName}
                        status={provider.status}
                        score={provider.status === 'approved' ? provider.score : undefined}
                    />
                ))}
            </div>
        </div>
    );
};

export default EconomicEvaluationResults;
