# [🏥 Sweet Medical — Plataforma de Gestión de Turnos Médicos y Centro de Salud](https://github.com/matuaponte/sweet-medical-ddso/blob/develop/%5BDDS%20UTN%5D%20Trabajo%20Pr%C3%A1ctico%20Integrador%20-%201C%202026%20-%20P%C3%BAblico.pdf)

> **Trabajo Práctico Integrador — Desarrollo de Software (DDSO / UTN FRBA)**  
> **Curso:** 1C 2026 (Lunes y Sábados) | **Grupo:** 05  
> **Stack:** Monorepo (Node.js, Express.js, React.js, MongoDB / Mongoose, Docker, Cypress)  
> **Arquitectura:** Layered Architecture (Controllers, Services, Repositories, Domain, Schedulers)  

---

## 📌 Descripción del Proyecto

**Sweet Medical** es un sistema web integral diseñado para la reserva, gestión y seguimiento de turnos en centros de atención médica. Permite a los pacientes buscar profesionales por especialidad, consultar disponibilidad horaria en tiempo real, reservar citas médicas y calcular automáticamente las coberturas según su obra social o plan médico.

Este repositorio está estructurado como un **monorepo** administrado con **`npm workspaces`**, integrando un servidor API RESTful en Express.js con MongoDB y una aplicación cliente interactiva desarrollada en React.

---

## 🏗️ Componentes del Proyecto

### ⚙️ 1. Backend (`packages/backend`)
Servidor API REST desarrollado con **Express.js** y **Node.js**, aplicando una arquitectura limpia por capas:

- **Controllers:** Capa de entrada HTTP para gestionar las peticiones y respuestas.
- **Services:** Lógica de negocio (gestión de turnos `TurnoService`, cálculo de costos, validación de coberturas médicas y disponibilidad).
- **Repositories:** Abstracción de acceso a datos utilizando **Mongoose ODM** para la persistencia en **MongoDB**.
- **Middlewares:** Autenticación y autorización basada en tokens **JWT**, control de acceso CORS y manejo global centralizado de errores.
- **Schedulers & Services:** Procesos programados para vencimiento de turnos, recordatorios y actualizaciones de estado.

### 🎨 2. Frontend (`packages/frontend`)
Aplicación web cliente construida en **React.js**:

- **Interfaz de Usuario:** Componentes responsivos para la búsqueda de especialidades, agenda de turnos, gestión de perfil del paciente y panel de administración.
- **Integración con API:** Cliente HTTP configurado para gestionar solicitudes asincrónicas, persistencia de sesión local y manejo elegante de estados de carga y errores.
- **Testing E2E:** Suite de pruebas end-to-end implementada con **Cypress**.

---

## 📦 Estructura del Monorepo

El repositorio está organizado de la siguiente manera:

```
.
├── packages/
│   ├── backend/        # Servidor API RESTful (Node.js + Express + MongoDB)
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── domain/
│   │   ├── middlewares/
│   │   ├── schedulers/
│   │   └── Dockerfile
│   └── frontend/       # Aplicación Web Cliente (React.js)
│       ├── src/
│       ├── cypress/
│       └── Dockerfile
├── package.json        # Configuración raíz del monorepo (npm workspaces)
├── README.md           # Este archivo
└── .env.example        # Plantilla de variables de entorno para desarrollo
```

---

## ⚙️ Paquetes y Dependencias

Este monorepo utiliza **`npm workspaces`** para coordinar y compartir paquetes de forma eficiente.

### Backend (`packages/backend`)

- **`express`**: Framework web para la construcción de la API REST.
- **`mongoose`**: ODM para el modelado e interacción con la base de datos MongoDB.
- **`cors`**: Middleware para habilitar el acceso seguro Cross-Origin desde el cliente Frontend.
- **`jsonwebtoken`**: Generación y verificación de tokens de autenticación JWT.
- **`dotenv`**: Gestión de variables de entorno desde archivos `.env`.

### Frontend (`packages/frontend`)

- **`react` & `react-dom`**: Librería para la construcción de interfaces de usuario compuestas.
- **`cypress`**: Framework de testing end-to-end para validación de flujos de usuario.

---

## 🚀 Inicio Rápido

Seguí estos pasos para poner en marcha el proyecto en tu entorno local:

### 1. Instalación de Dependencias

Desde la raíz del monorepo, ejecutá:

```bash
npm install
```

Esto instalará todas las dependencias necesarias tanto para la raíz como para los paquetes `frontend` y `backend`.

### 2. Configuración de Variables de Entorno

Creá un archivo `.env` en el directorio `packages/backend`. Podés copiar la plantilla `.env.example` que se encuentra en `packages/backend/`:

```env
# packages/backend/.env
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001
SERVER_PORT=3001
JWT_SECRET=escriba_aqui_su_secreto_local
JWT_EXPIRATION=1h
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=Sweet-Medical-Local
ITEMS_PER_PAGE=10
```

> 📌 **Detalle de variables**:
> - **`ALLOWED_ORIGINS`**: Orígenes permitidos por CORS (debe incluir la URL de tu frontend React).
> - **`SERVER_PORT`**: Puerto HTTP en el que se escuchará el servidor Express (ej: `3001`).
> - **`JWT_SECRET` & `JWT_EXPIRATION`**: Secreto y tiempo de validez para firmar los tokens de sesión.
> - **`MONGODB_URI` & `MONGODB_DB_NAME`**: Cadena de conexión y nombre de la base de datos MongoDB.

### 3. Ejecución de la Aplicación

Podés iniciar cada proyecto por separado o ambos simultáneamente en modo desarrollo:

#### Ejecutar el Backend
```bash
npm run start:backend
```
Para desarrollo con reinicio automático (nodemon):
```bash
npm run dev:backend
```

#### Ejecutar el Frontend
```bash
npm run start:frontend
```

#### Ejecutar Ambos Simultáneamente (Modo Desarrollo)
Para iniciar el servidor backend y la aplicación frontend al mismo tiempo:
```bash
npm run start:dev
```

---

## 🛠️ Tecnologías Utilizadas

- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Docker
- **Frontend:** React.js, HTML5, CSS3, JavaScript (ES6+), Cypress
- **Gestor de Monorepo:** npm workspaces
- **Universidad:** Universidad Tecnológica Nacional (UTN FRBA)
- **Materia:** Desarrollo de Software (DDS)
