# Finder de Quintas

Una aplicación web para buscar, rastrear y puntuar anuncios de casas de veraneo. Utiliza la API de Gemini para analizar de forma inteligente el contenido HTML extraído de sitios de bienes raíces, extraer información relevante y puntuar los anuncios basándose en criterios personalizables.

## Características

- **Análisis con IA**: Pega el HTML de cualquier sitio de bienes raíces y Gemini extraerá los detalles de los anuncios.
- **Puntuación Personalizable**: Ajusta la ponderación de precio, confort y proximidad para encontrar la propiedad perfecta para ti.
- **Seguimiento de Anuncios**: Guarda, comenta y edita los anuncios para llevar un registro de tus opciones.
- **Registro de Actividad**: Todas tus acciones se registran en un historial para que puedas ver los cambios recientes.
- **Configuración Flexible**: Personaliza el prompt de la IA, los sitios de búsqueda y tu API Key de Gemini.
- **Múltiples Vistas**: Visualiza los anuncios en formato de cuadrícula o de lista.
- **Filtros Avanzados**: Filtra por palabra clave, comodidades, capacidad y distancia.

## Cómo Probar Localmente

Esta aplicación es un proyecto autocontenido (HTML, CSS, y JS del lado del cliente). No requiere un servidor ni un proceso de compilación.

**Pasos:**

1.  **Descarga los archivos**: Asegúrate de tener todos los archivos del proyecto (`index.html`, `index.tsx`, `App.tsx`, etc.) en una misma carpeta en tu computadora.
2.  **Abre `index.html`**: Simplemente abre el archivo `index.html` en tu navegador web preferido (como Google Chrome, Firefox, o Edge).
3.  **Configura tu API Key**:
    - Ve a la sección de **Configuración** (icono de engranaje).
    - Pega tu [API Key de Google Gemini](https://aistudio.google.com/app/apikey) en el campo correspondiente. La clave se guardará de forma segura en el almacenamiento local de tu navegador.

¡Y listo! La aplicación ya está funcionando en tu máquina local.

## Cómo Usar el Scraping Manual

La aplicación está diseñada para funcionar con el contenido HTML de páginas web de bienes raíces. Dado que el scraping directo desde el navegador está restringido por razones de seguridad (políticas de CORS), el método de uso es copiar manualmente el HTML de la página de interés.

### Método 1: Usando las Herramientas de Desarrollo de Google Chrome

Este es el método más rápido para una prueba puntual.

1.  **Navega a la página de anuncios**: Ve a un sitio como Mercado Libre, Zonaprop, o Airbnb y realiza una búsqueda que muestre varios anuncios en una página.
2.  **Abre las Herramientas de Desarrollo**: Presiona `F12` o haz clic derecho en la página y selecciona "Inspeccionar".
3.  **Copia el HTML**:
    - En el panel de Herramientas de Desarrollo, ve a la pestaña **"Elements"** (Elementos).
    - Busca el elemento HTML principal que contiene todos los anuncios. A menudo es `<body>` o `<main>`.
    - Haz clic derecho sobre ese elemento, selecciona **"Copy"** (Copiar) > **"Copy outerHTML"** (Copiar HTML externo).
4.  **Usa los datos en la aplicación**:
    - En el código fuente, abre el archivo `constants.ts`.
    - Busca la constante `MOCK_SCRAPED_DATA`.
    - **Reemplaza** el contenido de ejemplo de esa constante con el HTML que acabas de copiar.
    - Guarda el archivo `constants.ts` y refresca la aplicación en tu navegador.
    - Haz clic en el botón **"Investigar"** en el Dashboard. La IA procesará el HTML que pegaste y poblará la aplicación con los anuncios encontrados.

### Método 2: Usando Playwright (Más Avanzado)

Si prefieres automatizar la obtención del HTML, puedes usar una herramienta como Playwright.

1.  **Instala Playwright**: Si no tienes Node.js, instálalo primero. Luego, en tu terminal, ejecuta:
    ```bash
    npm init -y
    npm i playwright
    ```
2.  **Crea un script de scraping**: Crea un archivo, por ejemplo `scrape.js`, y pega el siguiente código:
    ```javascript
    const { chromium } = require('playwright');
    const fs = require('fs');

    (async () => {
      const browser = await chromium.launch();
      const page = await browser.newPage();
      
      // Cambia esta URL por la que quieras scrapear
      await page.goto('https://inmuebles.mercadolibre.com.ar/quintas/alquiler/temporal/');
      
      // Espera a que la red esté inactiva para asegurar que todo el contenido se cargue
      await page.waitForLoadState('networkidle');

      const content = await page.content();
      
      // Guarda el contenido en un archivo o imprímelo en la consola
      fs.writeFileSync('output.html', content);
      console.log('HTML guardado en output.html');
      // console.log(content); 
      
      await browser.close();
    })();
    ```
3.  **Ejecuta el script**:
    ```bash
    node scrape.js
    ```
4.  **Usa el resultado**: El contenido HTML completo de la página se guardará en `output.html`. Cópialo y pégalo en la constante `MOCK_SCRAPED_DATA` dentro de `constants.ts` como se describe en el Método 1.
