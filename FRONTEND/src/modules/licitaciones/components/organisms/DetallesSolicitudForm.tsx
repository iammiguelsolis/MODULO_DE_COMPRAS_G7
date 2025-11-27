import React from 'react';
import Card from '../atoms/Card';
import CardHeader from '../atoms/CardHeader';
import CardBody from '../atoms/CardBody';
import FormGroup from '../atoms/FormGroup';
import Label from '../atoms/Label';
import Input from '../atoms/Input';
import Textarea from '../atoms/Textarea';
import ErrorMessage from '../atoms/ErrorMessage';
import { DetallesSolicitudProps } from '../../lib/types';

const DetallesSolicitudForm: React.FC<DetallesSolicitudProps> = ({
    title,
    onTitleChange,
    notes,
    onNotesChange,
    titleError
}) => {
    return (
        <Card>
            <CardHeader>
                <h2>Detalles de la Solicitud</h2>
                <p>Ingresa un título y las notas adicionales de manera opcional.</p>
            </CardHeader>
            <CardBody>
                <FormGroup>
                    <Label htmlFor="titulo">Título de la solicitud</Label>
                    <Input
                        id="titulo"
                        type="text"
                        placeholder="Ingrese un título para la solicitud"
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        error={!!titleError}
                    />
                    <ErrorMessage>{titleError}</ErrorMessage>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="notas">Notas adicionales</Label>
                    <Textarea
                        id="notas"
                        placeholder="Agregue notas o comentarios adicionales"
                        rows={4}
                        value={notes}
                        onChange={(e) => onNotesChange(e.target.value)}
                    />
                </FormGroup>
            </CardBody>
        </Card>
    );
};

export default DetallesSolicitudForm;
