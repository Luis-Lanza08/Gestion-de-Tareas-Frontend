
# Frontend - Gestor de Tareas

Este es el frontend del proyecto **Gestor de Tareas**, desarrollado con React + Vite. Consume una API REST para gestionar autenticación y tareas (crear, editar, eliminar, filtrar).

## Tecnologías

- React
- Vite
- Axios
- React Router DOM

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu_usuario/tu_repo_frontend.git
cd frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=https://gestion-de-tareas-backend-xxxxx.onrender.com/api
```

---

## ▶Ejecutar localmente

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## Funcionalidades

- Registro e inicio de sesión con JWT
- Gestión de tareas (crear, editar, eliminar)
- Filtros:
  - Por estado: pendiente, en progreso, completada
  - Por texto: título o descripción
  - Por fecha de creación
  - Por fecha de vencimiento
- Validaciones:
  - No se puede eliminar si la tarea no está completada
  - No se puede completar directamente desde pendiente
- Alertas visuales de éxito o error
- Estilo responsivo y centrado

---

## Despliegue

Este frontend fue desplegado en [Vercel](https://vercel.com/).  
Solo debes enlazar tu repositorio y configurar la variable `VITE_API_URL` correspondiente.

---
