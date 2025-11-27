import React from 'react';
import './NoteBox.css';

interface NoteBoxProps {
    title?: string;
    children: React.ReactNode;
}

const NoteBox: React.FC<NoteBoxProps> = ({ title = "Nota:", children }) => {
    return (
        <div className="note-box">
            <p className="note-box-title">{title}</p>
            <div className="note-box-content">
                {children}
            </div>
        </div>
    );
};

export default NoteBox;
