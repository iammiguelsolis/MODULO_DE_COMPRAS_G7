# Documentación de API - Sistema de Licitaciones

**Esta documentación detalla los endpoints necesarios para completar el flujo de una licitación, desde la solicitud inicial hasta la generación de la orden de compra**

**Base URL** : `{{host}}/api`

## 1. Módulo de Solicitudes

### 1.1 Crear Solicitud de Alto Valor

Crea una nueva solicitud de requerimiento. **Si el monto total supera el umbral (ej. > 10,000), el sistema sugerirá un proceso de "LICITACION**.

- **Método:** `POST`
- **Endpoint:**`<span class="citation-108">/solicitudes</span>`^^
- **Cuerpo de la Petición (JSON):**

**JSON**

```
{
  "titulo": "Adquisición Servidores Data Center",
  "notas_adicionales": "Urgente para migración a nube híbrida.",
  "items": [
    {
      "tipo": "MATERIAL",
      "nombre": "Servidor Rack Dell PowerEdge",
      "cantidad": 2,
      "precio_unitario": 8000.00,
      "comentario": "Incluir rieles de montaje"
    }
  ]
}
```

> **Nota:** La respuesta incluirá un `<span class="citation-107">id</span>` (id_solicitud) que debes guardar para el siguiente paso.

### 1.2 Aprobar Solicitud

**Aprueba la solicitud creada para permitir que avance hacia el proceso de adquisición**^^.

- **Método:** `PUT`
- **Endpoint:**`<span class="citation-105">/solicitudes/{id_solicitud}/aprobar</span>`^^

---

## 2. Módulo de Adquisiciones (Generación del Proceso)

### 2.1 Generar Proceso de Licitación

**El servicio de adquisiciones detecta el monto y genera la licitación en estado **`<span class="citation-104">BORRADOR</span>`.

- **Método:** `POST`
- **Endpoint:**`<span class="citation-103">/adquisiciones/generar</span>`^^
- **Cuerpo de la Petición (JSON):**

**JSON**

```
{
  "id_solicitud": 2
}
```

- **Respuesta Exitosa (Ejemplo):**
  **Devuelve el **`<span class="citation-102">id</span>` de la licitación (`<span class="citation-102">id_licitacion</span>`) necesario para los pasos subsiguientes^^.

**JSON**

```
{
  "tipo": "LICITACION",
  "mensaje": "Se ha generado una Licitación en estado BORRADOR...",
  "data": { "id": 5, "estado": "BORRADOR" }
}
```

---

## 3. Gestión de Licitaciones (Supervisor)

### 3.1 Aprobar Licitación (Publicar)

**Cambia el estado de la licitación de **`<span class="citation-101">BORRADOR</span>` a `<span class="citation-101">NUEVA</span>` para hacerla pública^^.

- **Método:** `POST`
- **Endpoint:**`<span class="citation-100">/licitaciones/{id_licitacion}/aprobar</span>`^^
- **Cuerpo de la Petición (JSON):**

**JSON**

```
{
  "supervisor_id": 1,
  "comentarios": "Presupuesto verificado. Proceder con invitaciones."
}
```

### 3.2 Invitar Proveedores

Envía invitaciones a una lista de proveedores. **El estado cambia a **`<span class="citation-99">EN_INVITACION</span>`^^^^^^^^.

- **Método:** `POST`
- **Endpoint:**`<span class="citation-98">/licitaciones/{id_licitacion}/invitaciones</span>`^^
- **Cuerpo de la Petición (JSON):**

**JSON**

```
{
  "proveedores": [1, 2, 3]
}
```

### 3.3 Cerrar Recepción de Propuestas

Finaliza la etapa de recepción de ofertas. Nadie más puede postular. **El estado cambia a **`<span class="citation-97">CON_PROPUESTAS</span>`^^^^^^^^.

- **Método:** `POST`
- **Endpoint:**`<span class="citation-96">/licitaciones/{id_licitacion}/finalizar-registro-propuestas</span>`^^

### 3.4 Iniciar Evaluación Técnica

**Cambia el estado de la licitación a **`<span class="citation-95">EVALUACION_TECNICA</span>` para permitir la calificación de propuestas^^^^^^^^.

- **Método:** `POST`
- **Endpoint:**`<span class="citation-94">/licitaciones/{id_licitacion}/enviar-a-evaluacion</span>`^^

### 3.5 Finalizar Evaluación Técnica

**Cierra la etapa técnica y pasa el estado a **`<span class="citation-93">EVALUACION_ECONOMIA</span>`^^^^^^^^.

- **Método:** `POST`
- **Endpoint:**`<span class="citation-92">/licitaciones/{id_licitacion}/finalizar-evaluacion-tecnica</span>`^^

### 3.6 Adjudicar (Elegir Ganador)

**El sistema selecciona la propuesta con el puntaje más alto y cambia el estado a **`<span class="citation-91">ADJUDICADA</span>`^^^^^^^^.

- **Método:** `POST`
- **Endpoint:**`<span class="citation-90">/licitaciones/{id_licitacion}/adjudicar</span>`^^

---

## 4. Gestión de Propuestas (Proveedores)

### 4.1 Registrar Propuesta

Permite a un proveedor registrar su participación. **Retorna un **`<span class="citation-89">id_propuesta</span>`^^^^^^^^.

- **Método:** `POST`
- **Endpoint:**`<span class="citation-88">/licitaciones/{id_licitacion}/propuestas</span>`^^
- **Cuerpo de la Petición (JSON):**

**JSON**

```
{ "proveedor_id": 1 }
```

### 4.2 Subir Documento (Ej. Económico)

**Adjunta documentos requeridos a una propuesta específica (ej. **`<span class="citation-87">id_propuesta: 10</span>`)^^^^^^.

- **Método:** `POST`
- **Endpoint:**`<span class="citation-86">/licitaciones/{id_licitacion}/propuestas/{id_propuesta}/documentos</span>`^^
- **Cuerpo de la Petición (JSON):**

**JSON**

```
{
  "nombre": "Propuesta Económica Firmada",
  "url_archivo": "https://bucket.s3/propuesta_p1.pdf",
  "tipo": "ECONOMICO",
  "documento_requerido_id": 1
}
```

---

## 5. Evaluación de Propuestas

### 5.1 Calificar Técnicamente

**Permite al evaluador aprobar o rechazar técnicamente una propuesta específica**^^.

- **Método:** `PUT`
- **Endpoint:**`<span class="citation-84">/licitaciones/{id_licitacion}/propuestas/{id_propuesta}/evaluacion-tecnica</span>`^^
- **Cuerpo de la Petición (JSON):**

**JSON**

```
{
  "aprobada_tecnicamente": true,
  "documentos": []
}
```

### 5.2 Calificar Económicamente

Asigna puntuación económica a una propuesta. **Fundamental para decidir el ganador**^^^^^^.

- **Método:** `PUT`
- **Endpoint:**`<span class="citation-82">/licitaciones/{id_licitacion}/propuestas/{id_propuesta}/evaluacion-economica</span>`^^
- **Cuerpo de la Petición (JSON):**

**JSON**

```
{
  "aprobada_economicamente": true,
  "puntuacion_economica": 95.0,
  "justificacion_economica": "Mejor precio del mercado."
}
```

---

## 6. Contrato y Cierre

### 6.1 Generar Plantilla de Contrato

**Genera el documento preliminar del contrato**^^.

- **Método:** `POST`
- **Endpoint:**`<span class="citation-80">/licitaciones/{id_licitacion}/contrato/generar</span>`^^
- **Cuerpo de la Petición (JSON):**

**JSON**

```
{ "supervisorId": 1 }
```

### 6.2 Cargar Contrato Firmado

Sube el PDF final firmado por el proveedor. **El estado cambia a **`<span class="citation-79">CON_CONTRATO</span>`^^^^^^^^.

- **Método:** `POST`
- **Endpoint:**`<span class="citation-78">/licitaciones/{id_licitacion}/contrato/cargar-firmado</span>`^^
- **Cuerpo de la Petición (JSON):**

**JSON**

```
{ "url_archivo": "https://bucket.s3/contrato_firmado_final.pdf" }
```

### 6.3 Finalizar e Integrar

Cierra el proceso y notifica al módulo de logística. **Genera la Orden de Compra y cambia el estado a **`<span class="citation-77">FINALIZADA</span>`^^^^^^^^.

- **Método:** `POST`
- **Endpoint:**`<span class="citation-76">/licitaciones/{id_licitacion}/finalizar</span>`^^
- **Respuesta Esperada:**

**JSON**

```
{
  "orden_compra_generada": true,
  "estado": "FINALIZADA"
}
```

### 6.4 Consultar Detalle Final

**Verificación final del objeto completo de la licitación**^^.

- **Método:** `GET`
- **Endpoint:**`<span class="citation-74">/licitaciones/{id_licitacion}</span>`
