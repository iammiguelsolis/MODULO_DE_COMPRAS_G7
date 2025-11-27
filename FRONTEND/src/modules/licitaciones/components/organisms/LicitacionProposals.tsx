import React from 'react';
import Card from '../atoms/Card';
import CardHeader from '../atoms/CardHeader';
import CardBody from '../atoms/CardBody';
import EmptyState from '../molecules/EmptyState';
import ProposalCard, { Proposal } from '../molecules/ProposalCard';
import './LicitacionProposals.css';

interface LicitacionProposalsProps {
    proposals?: Proposal[];
}

const LicitacionProposals: React.FC<LicitacionProposalsProps> = ({ proposals = [] }) => {
    return (
        <Card>
            <CardHeader>
                <h2>Propuestas Recibidas ({proposals.length})</h2>
            </CardHeader>
            <CardBody>
                {proposals.length === 0 ? (
                    <EmptyState message="No hay propuestas recibidas" variant="error" />
                ) : (
                    <div className="proposals-list">
                        {proposals.map(proposal => (
                            <ProposalCard key={proposal.id} proposal={proposal} />
                        ))}
                    </div>
                )}
            </CardBody>
        </Card>
    );
};

export default LicitacionProposals;
