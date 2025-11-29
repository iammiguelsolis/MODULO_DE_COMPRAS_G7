import React from 'react';
import EvaluatedProviderCard from '../molecules/EvaluatedProviderCard';
import './EvaluatedProvidersList.css';

interface EvaluatedProvider {
    id: number;
    name: string;
    status: 'approved' | 'rejected';
}

interface EvaluatedProvidersListProps {
    evaluatedProviders: EvaluatedProvider[];
}

const EvaluatedProvidersList: React.FC<EvaluatedProvidersListProps> = ({ evaluatedProviders }) => {
    if (evaluatedProviders.length === 0) {
        return null;
    }

    return (
        <div className="evaluated-providers-list">
            <h3 className="list-title">Proveedores Evaluados</h3>
            <div className="providers-container">
                {evaluatedProviders.map((provider) => (
                    <EvaluatedProviderCard
                        key={provider.id}
                        providerName={provider.name}
                        status={provider.status}
                    />
                ))}
            </div>
        </div>
    );
};

export default EvaluatedProvidersList;
