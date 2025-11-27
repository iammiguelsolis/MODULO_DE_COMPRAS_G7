import React from 'react';
import Card from '../atoms/Card';
import CardHeader from '../atoms/CardHeader';
import CardBody from '../atoms/CardBody';
import DocCategoryBlock from '../molecules/DocCategoryBlock';
import { DocumentCategory } from '../../lib/types';

interface LicitacionRequiredDocsProps {
    documentCategories: DocumentCategory[];
}

const LicitacionRequiredDocs: React.FC<LicitacionRequiredDocsProps> = ({ documentCategories }) => {
    return (
        <Card>
            <CardHeader>
                <h2>Documentos Requeridos</h2>
            </CardHeader>
            <CardBody>
                {documentCategories.map((category, index) => (
                    <DocCategoryBlock
                        key={index}
                        icon={category.icon}
                        title={category.title}
                        documents={category.documents}
                    />
                ))}
            </CardBody>
        </Card>
    );
};

export default LicitacionRequiredDocs;
