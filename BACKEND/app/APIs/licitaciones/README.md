# Documentación de API - Módulo de Licitaciones

Este directorio contiene la definición de los endpoints para el módulo de Licitaciones.

## 🔄 Flujo de Negocio y Endpoints

### 1. Creación (Estado: BORRADOR)

- **POST /api/licitaciones**: Crea una licitación copiando datos de una solicitud.
- **PUT /api/licitaciones/{id}**: Modifica datos (fecha límite, presupuesto) mientras sea borrador.
- **DELETE /api/licitaciones/{id}**: Cancela o elimina la licitación.
- **GET /api/licitaciones/{id}**: Obtiene detalles completos.

### 2. Aprobación (BORRADOR -> NUEVA / CANCELADA)

- **POST /api/licitaciones/{id}/aprobar**: Supervisor aprueba -> Estado NUEVA.
- **POST /api/licitaciones/{id}/rechazar**: Supervisor rechaza -> Estado CANCELADA.

### 3. Invitación (NUEVA -> EN_INVITACION)

- **POST /api/licitaciones/{id}/invitaciones**: Registra proveedores invitados.
- **POST /api/licitaciones/{id}/finalizar-invitacion**: Cierra invitaciones -> Estado EN_INVITACION.

### 4. Recepción de Propuestas (EN_INVITACION -> CON_PROPUESTAS)

- **POST /api/licitaciones/{id}/propuestas**: Crea registro de propuesta para un proveedor.
- **POST /api/licitaciones/{id}/propuestas/{pid}/documentos**: Sube documentos a la propuesta.
- **POST /api/licitaciones/{id}/finalizar-registro-propuestas**: Cierra recepción -> Estado CON_PROPUESTAS.

### 5. Evaluación Técnica (CON_PROPUESTAS -> EVALUACION_TECNICA -> EVALUACION_ECONOMIA)

- **POST /api/licitaciones/{id}/enviar-a-evaluacion**: Inicia evaluación técnica.
- **PUT /api/licitaciones/{id}/propuestas/{pid}/evaluacion-tecnica**: Califica técnicamente.
- **POST /api/licitaciones/{id}/finalizar-evaluacion-tecnica**: Finaliza técnica. Si hay válidos -> EVALUACION_ECONOMIA.

### 6. Evaluación Económica y Adjudicación (EVALUACION_ECONOMIA -> ADJUDICADA)

- **PUT /api/licitaciones/{id}/propuestas/{pid}/evaluacion-economica**: Califica económicamente.
- **POST /api/licitaciones/{id}/adjudicar**: Selecciona ganador por puntaje -> Estado ADJUDICADA.

### 7. Contrato (ADJUDICADA -> CON_CONTRATO)

- **POST /api/licitaciones/{id}/contrato/generar-plantilla**: Genera documento prellenado.
- **POST /api/licitaciones/{id}/contrato/cargar-firmado**: Sube contrato firmado -> Estado CON_CONTRATO.

### 8. Finalización (CON_CONTRATO -> FINALIZADA)

- **POST /api/licitaciones/{id}/finalizar**: Integra con Órdenes de Compra -> Estado FINALIZADA.

## 📂 Archivos de Definición

- `licitaciones.json`: CRUD base y listados.
- `aprobacion.json`: Flujo de aprobación de supervisor.
- `invitaciones.json`: Gestión de invitaciones.
- `propuestas.json`: Registro de propuestas y documentos.
- `evaluaciones.json`: Evaluaciones técnica y económica + adjudicación.
- `contrato.json`: Gestión de contratos.
- `orden-compra.json`: Integración final.

## ⚠️ Notas Importantes

- Todos los endpoints asumen autenticación previa.
- Los documentos se manejan vía URLs (integración con Supabase).
- La lógica de estados es estricta; no se puede saltar pasos.
