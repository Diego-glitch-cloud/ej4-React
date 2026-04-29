# Music Blog (Nivel Senior) 🎵

Un blog de música editorial y premium construido con React, Vite y React Router. Diseñado para ofrecer una experiencia estética, dinámica e inmersiva a la hora de descubrir discos legendarios.

## 🏆 Nivel Declarado: **Senior (100 Puntos)**

Este proyecto ha sido rigurosamente construido para cumplir (y superar) todos los requisitos del Nivel Senior:

### Requerimientos Base (Completados)
- ✅ Proyecto generado con `npm create vite@latest`.
- ✅ Uso de `react-router-dom v6`.
- ✅ Mínimo 4 rutas implementadas: `/`, `/items`, `/items/:id`, y `/favorites`.
- ✅ Los datos viven en un espacio separado (`src/data/constants.js`) y provienen de una API externa. **0 datos hardcodeados en los componentes.**
- ✅ Uso de `useParams` en la página de detalle (`ItemDetail.jsx`).
- ✅ Navegación exclusiva con componentes `<Link>` y `useNavigate` de React Router. **0 uso de etiquetas `<a>` estáticas.**
- ✅ Repo público en GitHub con este README.md detallado.
- ✅ Video de demostración en la carpeta `/demo` (asegúrate de grabar y subir el video antes de la entrega).

### Requerimientos Mid (Completados)
- ✅ **Página 404 (`NotFound.jsx`):** Para manejar cualquier ruta no existente con gracia.
- ✅ **Búsqueda y Filtros (`ItemsList.jsx`):** Búsqueda global en la API, más filtros por Género y Año.
- ✅ **Botón "Elemento Aleatorio":** Ubicado en el Navbar, genera un término sorpresa, busca en la API y navega al detalle usando `useNavigate`.
- ✅ **Componente Reutilizable Documentado:** `AlbumCard.jsx` es 100% modular (ver sección de Props más abajo).

### Requerimientos Senior (Completados)
- ✅ **Estado Global con Context API:** Implementación de `ThemeContext` (para Modo Claro/Oscuro) y `FavoritesContext` (para persistir los álbumes favoritos).
- ✅ **Validación de Tipos (PropTypes):** Aplicada estrictamente en 3 componentes: `AlbumCard.jsx`, `ThemeContext.jsx` y `FavoritesContext.jsx`.
- ✅ **Implementación de Base de Datos / API:** Consumo dinámico y en tiempo real de la **iTunes Search API** (`src/services/itunesApi.js`).

---

## 🛠 Instalación y Ejecución

Sigue estos pasos para correr el proyecto en tu entorno local:

1. **Clonar el repositorio:**
   ```bash
   git clone <url-de-tu-repo>
   cd ej4-React
   ```

2. **Instalar las dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. Abre tu navegador en `http://localhost:5173`.

---

## 🧩 Componentes Reutilizables: `AlbumCard`

El componente `AlbumCard` está diseñado para ser usado en cualquier grilla de la aplicación y recibe las siguientes propiedades (documentadas y validadas vía PropTypes):

| Prop | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `number` | **Sí** | El ID único del álbum (`collectionId` de iTunes). Necesario para el enrutamiento y favoritos. |
| `title` | `string` | **Sí** | El nombre del álbum a mostrar. |
| `artist` | `string` | **Sí** | El nombre del artista o banda. |
| `coverUrl` | `string` | **Sí** | La URL de la portada del álbum proporcionada por la API. |
| `releaseDate` | `string` | No | Fecha de lanzamiento (ISO 8601). El componente se encarga de extraer solo el año de publicación. |

---

## ✨ Features Especiales de esta Versión
- **Modo Claro / Oscuro Editorial:** Las variables CSS globales se actualizan instantáneamente usando el ThemeContext, conservando una estética sofisticada de "revista musical".
- **Debounce Inteligente:** El buscador tiene un *debounce* de 1 segundo para no saturar la API de Apple mientras escribes.
- **Botón Aleatorio Verdadero:** La exploración aleatoria no depende de una lista predefinida; genera una semilla sorpresa y busca verdaderamente en el catálogo entero de iTunes.
- **Gracia ante Errores:** La aplicación está blindada contra metadatos faltantes de la API (como cuando algunos discos no traen imagen de portada).

**¡Listo para la entrega! 🎉**
