# Configuración de Despliegue en Cloud (Preview)

Esta aplicación fue configurada para ser desplegada como una Single Page Application (SPA) usando **Vercel** de manera gratuita, conectándose a tu entorno de **Supabase**. No requieres ejecutar Node.js localmente.

## Pasos para Desplegar (Vercel)

1. **Subir el código a GitHub**:
   Inicia un repositorio en GitHub y sube todo el contenido actual del proyecto Escayr.

2. **Crear Proyecto en Vercel**:
   - Ingresa a [Vercel](https://vercel.com/) e inicia sesión con tu cuenta de GitHub.
   - Haz clic en **Add New -> Project**.
   - Selecciona el repositorio de GitHub donde subiste el código. Vercel detectará automáticamente que es un proyecto **Vite**.

3. **Configurar Variables de Entorno (Environment Variables)**:
   Antes de hacer clic en "Deploy", despliega la sección de *Environment Variables* y añade:
   *   **Name:** `VITE_SUPABASE_URL` | **Value:** *(La URL de tu proyecto en Supabase)*
   *   **Name:** `VITE_SUPABASE_ANON_KEY` | **Value:** *(La clave pública ANON de tu proyecto en Supabase)*
   
   *Nota: Puedes encontrar estos valores en tu panel de Supabase > Project Settings > API.*

4. **Desplegar**:
   - Haz clic en **Deploy**.
   - Vercel construirá la aplicación y te entregará un dominio público (ej. `escayr-app.vercel.app`).
   - El archivo `vercel.json` incluido en el proyecto se encargará de que todas las rutas secundarias funcionen correctamente.

## Rutas Mínimas Disponibles en la Preview

Al acceder a la URL proporcionada por Vercel, el sistema base mostrará un enrutador minimalista con acceso a:

- `/login`: Flujo de inicio de sesión (Mock).
- `/dashboard`: Panel de administración (Mock).
- `/equipments`: Historial completo de equipos (Mock interactivo).
- `/equipments/EQ-001`: Detalle específico, Línea de Tiempo y Análisis de Reinspección de un equipo.
- `/inspections/new`: Formulario offline-first y checklist por categorías de una inspección.
- `/verificar/ESCAYR-84B9A2`: Vista pública de un Certificado Emitido con verificación criptográfica.

*(El Entry point `/` tiene botones de acceso rápido a todas estas rutas).*
