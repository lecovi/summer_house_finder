# Finder de Quintas

Una aplicación web para buscar, rastrear y puntuar anuncios de casas de veraneo. Utiliza un backend local para realizar scraping en sitios de bienes raíces y luego usa la API de Gemini para analizar de forma inteligente el contenido, extraer información relevante y puntuar los anuncios basándose en criterios personalizables.

## Características

- **Búsqueda Automatizada**: Configura una lista de URLs y la aplicación, a través de un backend, buscará nuevos anuncios con un solo clic.
- **Análisis con IA**: Gemini extrae automáticamente los detalles clave de los anuncios obtenidos.
- **Puntuación Personalizable**: Ajusta la ponderación de precio, confort y proximidad para encontrar la propiedad perfecta para ti.
- **Seguimiento de Anuncios**: Guarda, comenta y edita los anuncios para llevar un registro de tus opciones.
- **Registro de Actividad**: Todas tus acciones se registran en un historial para que puedas ver los cambios recientes.
- **Configuración Flexible**: Personaliza el prompt de la IA, los sitios de búsqueda y tu API Key de Gemini.
- **Múltiples Vistas**: Visualiza los anuncios en formato de cuadrícula o de lista.
- **Filtros Avanzados**: Filtra por palabra clave, comodidades, capacidad y distancia.

## Cómo Funciona la Búsqueda (con Backend)

La aplicación está diseñada para funcionar con un pequeño servidor backend que se ejecuta en tu máquina local. Este enfoque resuelve las restricciones de seguridad del navegador (CORS) y permite una automatización real.

1.  **Frontend (lo que ves en el navegador)**: Cuando haces clic en el botón **"Investigar"**, la aplicación envía la lista de sitios configurados y tu prompt de IA a tu servidor backend local de Python.
2.  **Backend (servidor local en Python)**: Este servidor recibe la petición, visita cada una de las URLs para descargar su contenido HTML, lo une todo y se lo envía a la API de Gemini para su análisis.
3.  **API de Gemini**: Procesa el HTML y devuelve los datos estructurados de los anuncios.
4.  **Respuesta**: El backend envía los anuncios procesados de vuelta al frontend, que los muestra en tu pantalla.

## Cómo Configurar y Ejecutar el Proyecto

Este proyecto tiene dos partes: el frontend (que se ejecuta en el navegador) y el backend (que se ejecuta en tu terminal).

### Parte 1: Configurar el Backend (Python)

Necesitarás [Python 3](https://www.python.org/downloads/) instalado en tu computadora.

1.  **Abre una terminal o línea de comandos**: Navega a la carpeta donde tienes los archivos del proyecto.

2.  **Crea un entorno virtual**: Esto aísla las dependencias del proyecto.
    ```bash
    # En macOS o Linux
    python3 -m venv venv
    source venv/bin/activate

    # En Windows
    python -m venv venv
    .\venv\Scripts\activate
    ```

3.  **Instala las dependencias**: Con el entorno virtual activado, instala las librerías necesarias desde el archivo `requirements.txt`.
    ```bash
    pip install -r requirements.txt
    ```

4.  **Inicia el servidor**: En tu terminal (con el entorno virtual todavía activado), ejecuta el siguiente comando y mantenlo corriendo mientras usas la aplicación:
    ```bash
    python server.py
    ```
    Deberías ver un mensaje similar a: `* Running on http://127.0.0.1:5001`.

### Parte 2: Ejecutar el Frontend

1.  **Abre `index.html`**: Con el servidor backend corriendo, simplemente abre el archivo `index.html` en tu navegador web (como Google Chrome, Firefox, o Edge).
2.  **Configura tu API Key**:
    - Ve a la sección de **Configuración** (icono de engranaje).
    - Pega tu [API Key de Google Gemini](https://aistudio.google.com/app/apikey) en el campo correspondiente. La clave se guardará de forma segura en el almacenamiento local de tu navegador.
    - En esta misma pantalla, puedes agregar o quitar las URLs de los sitios que quieres investigar.
    - Guarda los cambios.

¡Y listo! Ahora puedes ir al Dashboard y usar el botón **"Investigar"** para buscar anuncios automáticamente.
