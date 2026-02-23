# Guía Visual de Despliegue en Vercel para ESCAYR (SaaS Platform)

Esta guía paso a paso describe la secuencia exacta de clics dentro del panel (dashboard) de Vercel para conectar automáticamente la plataforma ESCAYR desde GitHub y desplegarla online. **No se requiere ejecución de Node.js local.**

## Preparación: Validación de Repositorio GitHub y Enrutamiento SPA
El repositorio `ESCAYR` ya cuenta con el archivo `vercel.json` en su raíz, el cual contiene la configuración SPA (Single Page Application) requerida:
```json
{
  "version": 2,
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```
*Validación completada:* Esta configuración asegura que una vez finalizado el despliegue, cualquier navegación directa a rutas profundas como `/login`, `/dashboard`, `/inspections/new`, `/equipments/EQ-001` y `/verificar/ESCAYR-84B9A2` funcionarán correctamente sin arrojar errores "404 Not Found" del servidor. Vercel delegará el enrutamiento interno a la aplicación React subyacente.

---

## 1. Importar el Repositorio de GitHub

### Pantalla: Panel Principal de Vercel (Vercel Dashboard)
*Descripción Visual:* 
Verás un botón principal de color negro en la esquina superior derecha o en el centro de la pantalla si no tienes proyectos previos. A tu izquierda verás menús de navegación, y el área principal mostrará tus proyectos actuales o te invitará a crear uno.

**Acciones:**
1. Inicia sesión en [Vercel](https://vercel.com/) con tu cuenta de GitHub conectada.
2. Localiza y haz clic en el botón negro superior derecho llamado **"Add New..."** (Añadir Nuevo...).
3. En el menú desplegable que aparece, selecciona **"Project"** (Proyecto).

### Pantalla: Import Git Repository (Importar Repositorio Git)
*Descripción Visual:* 
Una pantalla con un buscador grande en la parte superior y una lista de tus repositorios de GitHub debajo. Cada repositorio tendrá un botón al lado derecho.

**Acciones:**
4. En el campo de búsqueda "Search your repositories...", escribe **ESCAYR**.
5. Localiza el repositorio en la lista filtrada.
6. Haz clic en el botón con letras blancas y borde gris **"Import"** (Importar) situado junto al nombre de tu repositorio.

---

## 2. Configurar el Entorno del Proyecto

### Pantalla: Configure Project (Configurar Proyecto)
*Descripción Visual:* 
A la izquierda, Vercel te mostrará un panel lateral. A la derecha, verás el logotipo de tu repositorio, un campo para el "Project Name" (Nombre del proyecto) que pre-rellenará "escayr", y debajo de él un selector "Framework Preset" (Pre-configuración del Framwork) con el logo de Vite. Más abajo verás 3 secciones colapsadas representadas con flechas (`>`); la última y principal que vamos a usar es **"Environment Variables"** (Variables de Entorno).

**Acciones:**
7. Verifica que en **Framework Preset**, Vercel haya auto-seleccionado **Vite**. *(Lo detecta visualmente gracias a los archivos `package.json` y `vite.config.ts`, no hace falta cambiar nada).*
8. Desciende hacia abajo y haz clic encima del texto **"Environment Variables"** para expandir la sección. Se revelarán dos casillas largas en blanco alineadas horizontalmente, junto a un botón "Add".

### Entrada de Variables (Claves de Supabase)
Para que la aplicación SaaS funcione y se comunique con la base de datos de los equipos y certificados, debe conocer a dónde enviar la información usando estas variables:

**Acción 9:** Agrega la URL de Supabase.
- En el campo izquierdo ("NAME" - Nombre), escribe/pega exactamente: `VITE_SUPABASE_URL`
- En el campo derecho ("VALUE" - Valor), pega la dirección web proporcionada desde el panel de *Supabase* (Ejemplo: `https://xxxxxx.supabase.co`).
- Haz clic en el botón negro lateral **"Add"**.

**Acción 10:** Agrega la llave pública de conexión de Supabase.
- Vercel vaciará inmediatamente las dos casillas.
- Ahora, en el campo izquierdo ("NAME"), escribe/pega exactamente: `VITE_SUPABASE_ANON_KEY`
- En el campo derecho ("VALUE"), pega el código alfanumérico largo proporcionado desde tu panel de *Supabase* (Específicamente la llave marcada como "anon public").
- Haz clic de nuevo en **"Add"**.

*(Debajo de las casillas, deberías ver una pequeña lista con las dos variables que acabas de guardar, mostrando el nombre a la izquierda, y su valor encriptado visualmente a la derecha en color gris).*

---

## 3. Desplegar y Finalizar

**Acción 11:** Despliegue *(Deploying)*
- Ahora simplemente baja todo hasta el final del panel lateral derecho y haz clic en el botón negro rectangular de **"Deploy"** (Desplegar).

### Pantalla: Building State (Generación/Construcción)
*Descripción Visual:* 
Aparecerá una ventana terminal mostrando líneas oscuras parpadeantes que indican que el código se está validando y subiendo (esto simula internamente lo que tradicionalmente haría el Node.js local pero dentro de la robusta infraestructura de Vercel). Espera aproximadamente unos 45 segundos a que la barra complete todo el proceso automáticamente.

### Pantalla: ¡Felicidades, Proyecto Desplegado! (Success!)
*Descripción Visual:* 
Un aluvión repentino de confeti digital lloverá en la pantalla felicitándote junto con una ventana mostrando una vista previa inicial y pequeña (captura viva) de la aplicación de ESCAYR. Debajo aparecerá un enlace a un dominio.

**Acciones:**
12. Haz clic en el botón secundario grande **"Continue to Dashboard"** (Continuar al panel del proyecto).
13. En esta pantalla principal de Vercel de tu nuevo proyecto, en la esquina superior derecha verás un botón claro que dice **"Visit"** (Visitar). De forma alternativa, notarás la URL permanente asignada debajo debajo del título principal en letras azules (Ej. `escayr-platform.vercel.app`).
14. Haz clic en el botón o en la URL azul.

## Resultado de Validación Esperado
Se abrirá una nueva pestaña del navegador dirigiendo a la URL pública proporcionada por Vercel. 
- La vista cargará instantáneamente. 
- Tendrás navegación completa (SPA Routing de `vercel.json` funcionando) hacia las secciones críticas de certificados (`/verificar`), portal de inspección y herramientas dashboard. 
- Y sobretodo, debido a las variables de entorno configuradas durante los clics, el sistema **podrá autenfificar** usuarios y recuperar las líneas de tiempo/historial de los equipos interactuando en caliente con Supabase.
