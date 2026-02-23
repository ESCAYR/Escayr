# Checklist de Despliegue en la Nube (Preview Automático)

Esta guía paso a paso te ayudará a publicar el proyecto ESCAYR en la nube para poder visualizarlo en un navegador, de forma completamente gratuita y sin conocimientos técnicos profundos.

---

### Paso 1: Subir el Proyecto a GitHub
*GitHub alojará tu código para que plataformas en la nube puedan leerlo y desplegarlo.*

1. Ve a [GitHub](https://github.com/) e inicia sesión o crea una cuenta.
2. Haz clic en el botón verde **"New"** (o "New Repository") en la esquina superior izquierda.
3. Asigna un nombre (Ej. `escayr-app`), déjalo como "Private" (o "Public", a tu elección) y haz clic en **"Create repository"**.
4. Dado que tu proyecto en la computadora ya está configurado con Git, abre una consola (Terminal o CMD) en la carpeta del proyecto (`c:\Users\HP\Escayr`) y ejecuta estos dos comandos (reemplazando tu usuario):
   ```bash
   git remote add origin https://github.com/TU_USUARIO/escayr-app.git
   git branch -M main
   git push -u origin main
   ```
   *(Si te pide iniciar sesión, autoriza la conexión con tu navegador).*

---

### Paso 2: Importar el Proyecto a Vercel
*Vercel leerá tu código de GitHub y lo publicará en internet.*

1. Ve a [Vercel](https://vercel.com/) e inicia sesión seleccionando la opción **"Continue with GitHub"**.
2. Una vez en tu panel de control, haz clic en **"Add New"** > **"Project"**.
3. En la lista, busca el repositorio que acabas de crear (`escayr-app`) y haz clic en **"Import"**.

---

### Paso 3: Pegar las Variables de Entorno (Supabase)
*Antes de desplegar, debes conectar la aplicación a tu base de datos.*

1. En la pantalla de configuración del proyecto en Vercel, busca el menú desplegable llamado **"Environment Variables"** y ábrelo.
2. Agrega las dos variables de conexión copiándolas desde tu panel de Supabase (*Project Settings -> API*):

   **Variable 1:**
   - **Key:** `VITE_SUPABASE_URL`
   - **Value:** `https://tucodigo.supabase.co`
   - Haz clic en **"Add"**.

   **Variable 2:**
   - **Key:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUz...` *(Cadena de texto larga)*
   - Haz clic en **"Add"**.

---

### Paso 4: Iniciar el Despliegue (Deploy)
1. Haz clic en el botón principal **"Deploy"**.
2. Espera aproximadamente 1-2 minutos mientras Vercel procesa la aplicación. Verás burbujas y confeti cuando haya terminado.

---

### Paso 5: Acceder a la URL de Preview
1. Haz clic en el botón **"Continue to Dashboard"**.
2. Arriba a la derecha, verás un botón llamado **"Visit"**. También verás tus "Domains", que se asemejan a `escayr-app.vercel.app`.
3. ¡Haz clic ahí! El navegador abrirá tu aplicación.
4. Navega a las distintas secciones usando los botones en la página principal, incluyendo: 
   - `Login`
   - `Dashboard`
   - `Formulario de Inspección`
   - `Historial de Equipos`
   - `Verificación de Certificado (QR)`
