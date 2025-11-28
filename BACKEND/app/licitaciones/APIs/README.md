# APIs de Gestión de Licitaciones

Este directorio contiene los diseños de API REST para el módulo de licitaciones, divididos en archivos modulares siguiendo el flujo del proceso de negocio.

## Estructura de Archivos

```
apis/
├── licitaciones.json      # Core: Listar, crear y obtener detalles
├── aprobacion.json        # Aprobación/rechazo por supervisor
├── invitaciones.json      # Envío de invitaciones y finalización
├── propuestas.json        # Registro de propuestas y finalización
├── evaluaciones.json      # Evaluaciones técnicas y económicas
├── adjudicacion.json      # Adjudicación (deprecado)
├── contrato.json          # Generación de contratos
├── orden-compra.json      # Envío a orden de compra y finalización
└── proveedores.json       # Gestión de proveedores
```

## Flujo del Proceso

### 1. **Creación** (`licitaciones.json`)

- `POST /licitaciones` - Crea licitación desde solicitud de compra
- Estado inicial: `BORRADOR`

### 2. **Aprobación** (`aprobacion.json`)

- `PUT /licitaciones/{id}/aprobacion` - Supervisor aprueba/rechaza
- Transiciones: `BORRADOR` → `NUEVA` (aprobada) o `CANCELADA` (rechazada)

### 3. **Invitaciones** (`invitaciones.json`)

- `POST /licitaciones/{id}/invitaciones` - Envía invitaciones a proveedores
- `PUT /licitaciones/{id}/finalizarInvitacion` - Finaliza período de invitación
- Transiciones: `NUEVA` → `EN_INVITACION`

### 4. **Propuestas** (`propuestas.json`)

- `POST /licitaciones/{id}/propuestas` - Registra propuesta de proveedor
- `PUT /licitaciones/{id}/finalizarRegistro` - Finaliza registro de propuestas
- Transiciones: `EN_INVITACION` → `CON_PROPUESTAS` (si hay propuestas) o `CANCELADA` (si no hay)

### 5. **Evaluaciones** (`evaluaciones.json`)

- `PUT /licitaciones/{id}/enviarEvaluacion` - Envía a evaluación técnica
- `POST /licitaciones/{id}/evaluacion-tecnica` - Registra evaluaciones del comité técnico
- `POST /licitaciones/{id}/evaluacion-economica` - Registra evaluaciones del comité económico y selecciona ganador
- Transiciones:
  - `CON_PROPUESTAS` → `EVALUACION_TECNICA`
  - `EVALUACION_TECNICA` → `EVALUACION_ECONOMIA` (si hay aprobadas) o `CANCELADA` (si ninguna aprueba)
  - `EVALUACION_ECONOMIA` → `ADJUDICADA` (si hay ganador) o `CANCELADA` (si ninguna aprueba)

### 6. **Contrato** (`contrato.json`)

- `POST /licitaciones/{id}/contrato` - Genera contrato de adjudicación
- `GET /licitaciones/{id}/contrato` - Obtiene información del contrato
- Transiciones: `ADJUDICADA` → `CON_CONTRATO`

### 7. **Orden de Compra** (`orden-compra.json`)

- `POST /licitaciones/{id}/orden-compra` - Crea orden de compra y finaliza proceso
- Transiciones: `CON_CONTRATO` → `FINALIZADA`

### 8. **Proveedores** (`proveedores.json`)

- `GET /proveedores` - Lista proveedores disponibles para invitar
- `GET /proveedores/{id}` - Obtiene detalle de proveedor

## Estados de Licitación

```
BORRADOR             → Creada, pendiente de aprobación
NUEVA                → Aprobada, lista para invitar proveedores
EN_INVITACION        → Invitaciones enviadas, esperando propuestas
CON_PROPUESTAS       → Propuestas registradas, listas para evaluar
EVALUACION_TECNICA   → En evaluación del comité técnico
EVALUACION_ECONOMIA  → En evaluación del comité económico
ADJUDICADA           → Proveedor ganador seleccionado
CON_CONTRATO         → Contrato generado
FINALIZADA           → Orden de compra creada, proceso completo
CANCELADA            → Proceso cancelado (en cualquier etapa)
```

## Endpoints por Archivo

### licitaciones.json (3 endpoints)

- `GET /licitaciones` - Listar con filtros
- `POST /licitaciones` - Crear nueva
- `GET /licitaciones/{id}` - Obtener detalle

### aprobacion.json (1 endpoint)

- `PUT /licitaciones/{id}/aprobacion` - Aprobar/rechazar

### invitaciones.json (2 endpoints)

- `POST /licitaciones/{id}/invitaciones` - Enviar invitaciones
- `PUT /licitaciones/{id}/finalizarInvitacion` - Finalizar invitación

### propuestas.json (2 endpoints)

- `POST /licitaciones/{id}/propuestas` - Registrar propuesta
- `PUT /licitaciones/{id}/finalizarRegistro` - Finalizar registro

### evaluaciones.json (3 endpoints)

- `PUT /licitaciones/{id}/enviarEvaluacion` - Enviar a evaluación
- `POST /licitaciones/{id}/evaluacion-tecnica` - Evaluar técnicamente
- `POST /licitaciones/{id}/evaluacion-economica` - Evaluar económicamente

### contrato.json (2 endpoints)

- `POST /licitaciones/{id}/contrato` - Generar contrato
- `GET /licitaciones/{id}/contrato` - Obtener contrato

### orden-compra.json (1 endpoint)

- `POST /licitaciones/{id}/orden-compra` - Crear orden de compra

### proveedores.json (2 endpoints)

- `GET /proveedores` - Listar proveedores
- `GET /proveedores/{id}` - Detalle de proveedor

## Estándar OpenAPI

Todos los archivos siguen el estándar **OpenAPI 3.0** e incluyen:

- Descripción detallada de cada endpoint
- Parámetros requeridos y opcionales
- Esquemas de request/response
- Ejemplos completos
- Códigos de respuesta HTTP
- Mensajes de error

## Nomenclatura Consistente

Todos los endpoints usan nomenclatura consistente:

- `nombre` (no `titulo`)
- `presupuestoMaximo` (no `limiteMonto` o `presupuesto`)
- `idLicitacion`, `idPropuesta`, `idContrato`
- Documentos con `tipo` (LEGAL, TECNICO, ECONOMICO) y `obligatorio`
- Items separados en `itemsMaterial` e `itemsServicio`

## Notas de Implementación

1. **Validaciones de Estado**: Cada endpoint debe validar que la licitación esté en el estado correcto antes de permitir la operación.

2. **Transiciones Automáticas**: Algunos endpoints cambian automáticamente el estado (ej: evaluación económica que selecciona ganador pasa directamente a ADJUDICADA).

3. **Cancelación**: En varios puntos del flujo, si no hay propuestas válidas, la licitación pasa automáticamente a CANCELADA.

4. **Notificaciones**: Los endpoints de invitaciones y adjudicación deben enviar notificaciones a los proveedores (correo/WhatsApp).

5. **Proveedores**: El módulo debe integrarse con el sistema de gestión de proveedores para obtener la lista de proveedores disponibles.

6. **Orden de Compra**: El endpoint de orden de compra debe comunicarse con el módulo correspondiente para crear la OC.

## Próximos Pasos

1. Validar diseños con el equipo de frontend
2. Implementar controllers en el backend
3. Crear tests de integración
4. Documentar casos de error específicos
5. Configurar autenticación y autorización por rol
