import React from 'react';
import './DocCategoryBlock.css';

interface DocCategoryBlockProps {
    icon: React.ReactNode;
    title: string;
    documents: string[];
}

const DocCategoryBlock: React.FC<DocCategoryBlockProps> = ({ icon, title, documents }) => {
    return (
        <div className="doc-category-block">
            <div className="doc-category-header">
                <div className="doc-category-icon">
                    {icon}
                </div>
                <h4 className="doc-category-title">{title}</h4>
            </div>
            <div className="doc-list">
                {documents.map((doc, index) => (
                    <div key={index} className="doc-item">
                        {doc}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DocCategoryBlock;
