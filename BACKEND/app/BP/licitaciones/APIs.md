# Guía de APIs - Flujo Completo de Licitación

Esta guía documenta todos los endpoints del sistema, organizados por flujo de negocio. Puedes usar esta documentación para hacer pruebas end-to-end.

**NOTA:** Reemplaza `{{host}}` con tu URL base (ej: `http://localhost:5000`).

---

## � FASE 0: Consulta de Licitaciones

Endpoints para ver licitaciones existentes antes de empezar el flujo.

### 1. Listar Todas las Licitaciones

Obtén una lista paginada de licitaciones con filtros opcionales.

- **Método:** `GET`
- **URL:** `{{host}}/api/licitaciones`
- **Query Params (Opcionales):**
  - `page=1` - Número de página
  - `per_page=10` - Items por página
  - `estado=NUEVA` - Filtrar por estado (NUEVA, EN_INVITACION, etc.)
  - `titulo=Servidores` - Búsqueda parcial por título
  - `fechaDesde=2024-01-01` - Fecha inicio
  - `fechaHasta=2024-12-31` - Fecha fin
  - `limiteMontoMin=5000` - Monto mínimo
  - `limiteMontoMax=50000` - Monto máximo
  - `id=5` - Buscar por ID exacto

**Ejemplo Completo:**

```
GET {{host}}/api/licitaciones
```

### 2. Ver Detalle de una Licitación

Obtén toda la información de una licitación específica.

- **Método:** `GET`
- **URL:** `{{host}}/api/licitaciones/{id_licitacion}`

**Ejemplo:**

```
GET {{host}}/api/licitaciones/5
```

**Respuesta:** Retorna el objeto completo con items, propuestas, documentos, etc.

---

## 🚀 FASE 1: El Disparador (Solicitud > 10,000)

Para activar una licitación, necesitamos una solicitud que supere el umbral de monto.

### 1. Crear Solicitud de Alto Valor

Vamos a pedir Servidores. 2 unidades a $8,000 c/u = $16,000 (Mayor a 10k → Licitación).

- **Método:** `POST`
- **URL:** `{{host}}/api/solicitudes`
- **Body (JSON):**

```json
{
  "titulo": "Adquisición Servidores Data Center",
  "notas_adicionales": "Urgente para migración a nube híbrida.",
  "items": [
    {
      "tipo": "MATERIAL",
      "nombre": "Servidor Rack Dell PowerEdge",
      "cantidad": 2,
      "precio_unitario": 8000.0,
      "comentario": "Incluir rieles de montaje"
    }
  ]
}
```

**Nota:** Guarda el `id` de la respuesta (ej: `id_solicitud: 2`). Verás que `tipo_proceso_sugerido` dice "LICITACION".

### 2. Aprobar la Solicitud

El supervisor aprueba la solicitud para que pueda convertirse en licitación.

- **Método:** `PUT`
- **URL:** `{{host}}/api/solicitudes/{id_solicitud}/aprobar`

**Ejemplo:**

```
PUT {{host}}/api/solicitudes/2/aprobar
```

---

## ⚙️ FASE 2: Generación del Proceso

Aquí es donde el `AdquisicionService` detecta el monto e invoca al `LicitacionService`.

### 3. Generar el Proceso (El sistema decide)

- **Método:** `POST`
- **URL:** `{{host}}/api/adquisiciones/generar`
- **Body (JSON):**

```json
{
  "id_solicitud": 2
}
```

**Respuesta Esperada:**

```json
{
  "tipo": "LICITACION",
  "mensaje": "Se ha generado una Licitación en estado NUEVA...",
  "data": {
    "id": 5,
    "estado": "NUEVA",
    ...
  }
}
```

**IMPORTANTE:** Guarda el `id` devuelto en `data`. Este será tu `{id_licitacion}` para el resto de pasos.

---

## 👥 FASE 3: Invitación a Proveedores

La licitación nace en **NUEVA**. Procedemos a invitar proveedores.

### 4. Invitar Proveedores

- **Método:** `POST`
- **URL:** `{{host}}/api/licitaciones/{id_licitacion}/invitaciones`
- **Body (JSON):**

```json
{
  "proveedores": [1, 2, 3]
}
```

**Nota:** Asegúrate de tener proveedores con estos IDs en tu BD. El estado cambiará automáticamente a **EN_INVITACION**.

---

## 📝 FASE 4: Recepción de Propuestas (Proveedores)

Simularemos 2 proveedores. Uno ganará, el otro perderá.

### 5. Registrar Propuesta Proveedor A (El Ganador)

- **Método:** `POST`
- **URL:** `{{host}}/api/licitaciones/{id_licitacion}/propuestas`
- **Body (JSON):**

```json
{
  "proveedor_id": 1
}
```

**Nota:** Guarda el `id_propuesta` retornado (ej: `10`).

### 5.1. Subir Documento Económico (Obligatorio)

- **Método:** `POST`
- **URL:** `{{host}}/api/licitaciones/{id_licitacion}/propuestas/10/documentos`
- **Body (JSON):**

```json
{
  "nombre": "Propuesta Económica Firmada",
  "url_archivo": "a.pdf",
  "tipo": "ECONOMICO",
  "documento_requerido_id": 1
}
```

### 6. Registrar Propuesta Proveedor B (El Perdedor)

- **Método:** `POST`
- **URL:** `{{host}}/api/licitaciones/{id_licitacion}/propuestas`
- **Body (JSON):**

```json
{
  "proveedor_id": 2
}
```

**Nota:** Guarda el `id_propuesta` (ej: `11`).

### 7. Cerrar Recepción de Propuestas

Ya nadie más puede postular. Pasamos a evaluación.

- **Método:** `POST`
- **URL:** `{{host}}/api/licitaciones/{id_licitacion}/finalizar-registro-propuestas`

**Efecto:** El estado cambia a **CON_PROPUESTAS**.

---

## 🔍 FASE 5: Evaluación Técnica

### 8. Iniciar Evaluación Técnica

- **Método:** `POST`
- **URL:** `{{host}}/api/licitaciones/{id_licitacion}/enviar-a-evaluacion`

**Nota:** El estado cambia a **EVALUACION_TECNICA**.

### 9. Calificar Técnicamente (Aprobar a ambos)

Vamos a decir que ambos cumplen los requisitos técnicos.

**Proveedor A (ID 10):**

- **Método:** `PUT`
- **URL:** `{{host}}/api/licitaciones/{id_licitacion}/propuestas/10/evaluacion-tecnica`
- **Body:**

```json
{
  "aprobada_tecnicamente": true,
  "documentos": []
}
```

**Proveedor B (ID 11):**

- **Método:** `PUT`
- **URL:** `{{host}}/api/licitaciones/{id_licitacion}/propuestas/11/evaluacion-tecnica`
- **Body:**

```json
{
  "aprobada_tecnicamente": true,
  "documentos": []
}
```

### 10. Finalizar Evaluación Técnica

- **Método:** `POST`
- **URL:** `{{host}}/api/licitaciones/{id_licitacion}/finalizar-evaluacion-tecnica`

**Nota:** El estado cambia a **EVALUACION_ECONOMIA**.

---

## 💰 FASE 6: Evaluación Económica y Adjudicación

### 11. Calificar Económicamente

Aquí decidimos quién gana por puntaje o precio.

**Proveedor A (Ganador): Puntuación alta.**

- **Método:** `PUT`
- **URL:** `{{host}}/api/licitaciones/{id_licitacion}/propuestas/10/evaluacion-economica`
- **Body:**

```json
{
  "aprobada_economicamente": true,
  "puntuacion_economica": 95.0,
  "justificacion_economica": "Mejor precio del mercado."
}
```

**Proveedor B (Perdedor): Puntuación baja.**

- **Método:** `PUT`
- **URL:** `{{host}}/api/licitaciones/{id_licitacion}/propuestas/11/evaluacion-economica`
- **Body:**

```json
{
  "aprobada_economicamente": true,
  "puntuacion_economica": 80.0
}
```

### 12. Adjudicar (Elegir Ganador)

El sistema buscará el puntaje más alto (Propuesta 10) y la marcará como ganadora.

- **Método:** `POST`
- **URL:** `{{host}}/api/licitaciones/{id_licitacion}/adjudicar`

**Nota:** El estado cambia a **ADJUDICADA**.

---

## 📄 FASE 7: Contrato y Cierre

### 13. Generar Plantilla de Contrato

- **Método:** `POST`
- **URL:** `{{host}}/api/licitaciones/{id_licitacion}/contrato/generar`
- **Body:**

```json
{
  "supervisorId": 1
}
```

### 14. Cargar Contrato Firmado

Simulamos que el proveedor devolvió el PDF firmado.

- **Método:** `POST`
- **URL:** `{{host}}/api/licitaciones/{id_licitacion}/contrato/cargar-firmado`
- **Body:**

```json
{
  "url_archivo": "https://contratofinal.pdf"
}
```

**Nota:** El estado cambia a **CON_CONTRATO**.

### 15. Finalizar e Integrar con Orden de Compra

El paso final que cierra todo y avisa al módulo de logística.

- **Método:** `POST`
- **URL:** `{{host}}/api/licitaciones/{id_licitacion}/finalizar`

**Respuesta Esperada:**

```json
{
  "orden_compra_generada": true,
  "estado": "FINALIZADA"
}
```

---

## ✅ FASE 8: Verificación Final

### 16. Consultar el Detalle Final

- **Método:** `GET`
- **URL:** `{{host}}/api/licitaciones/{id_licitacion}`

Deberías ver el objeto completo con estado **FINALIZADA**, el `ganador_id` lleno, y el contrato vinculado.
