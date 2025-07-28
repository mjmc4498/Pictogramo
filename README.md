# Sistema de Pictogramas Interactivo para Comunicación Aumentativa

![Captura de pantalla de la aplicación](https://i.imgur.com/4J4zY5A.png)

## Descripción

Este es un sistema de comunicación aumentativa y alternativa (CAA) basado en pictogramas, diseñado para niños y personas con dificultades en la comunicación, como el Trastorno del Espectro Autista (TEA). La aplicación es 100% offline, funciona en cualquier navegador moderno y está construida únicamente con HTML, CSS y JavaScript puro, sin necesidad de servidores ni dependencias complejas.

El objetivo principal es ofrecer una herramienta intuitiva, accesible y altamente personalizable para facilitar la comunicación en entornos educativos, terapéuticos o familiares.

## Características Principales

- **Interfaz Intuitiva:** Diseño visual claro y amigable, con tarjetas grandes y legibles.
- **Base de Datos Extensa:** Más de 300 pictogramas por defecto, organizados en categorías (personas, acciones, comida, lugares, etc.).
- **Síntesis de Voz:** Cada pictograma se lee en voz alta al ser seleccionado, utilizando la API de Síntesis de Voz del navegador.
- **Constructor de Frases:** Permite seleccionar pictogramas para formar frases visuales en una barra de sentencias.
- **Interactividad:** Las frases se pueden reordenar mediante "arrastrar y soltar" (drag and drop) y los pictogramas se pueden eliminar fácilmente.
- **100% Offline:** Funciona sin conexión a internet una vez cargado.
- **Modo Personalizado:**
    - **Añadir:** Crea nuevos pictogramas con texto propio.
    - **Editar:** Modifica los pictogramas personalizados existentes.
    - **Eliminar:** Borra permanentemente los pictogramas que ya no necesites.
    - **Elige tu Icono:** Usa un buscador para seleccionar entre más de 1,800 iconos de Bootstrap o sube una imagen desde tu dispositivo.
- **Persistencia de Datos:** Todas las frases y pictogramas personalizados se guardan en el `localStorage` del navegador, manteniendo la información entre sesiones.
- **Importar y Exportar:** Guarda las frases en un archivo JSON para compartirlas o hacer copias de seguridad, y cárgalas de nuevo en el sistema cuando lo necesites.
- **Diseño Adaptable (Responsive):** Totalmente funcional en ordenadores, tablets y teléfonos móviles.
- **Accesibilidad (WCAG):** Diseñado con estándares de accesibilidad, como alto contraste y navegación por teclado.

## Tecnologías Utilizadas

- **HTML5:** Para la estructura semántica del contenido.
- **CSS3:** Para el diseño, las animaciones y la responsividad, utilizando variables CSS para una fácil personalización.
- **JavaScript (ES6+):** Para toda la lógica funcional, sin frameworks ni librerías externas (excepto Bootstrap).
- **Bootstrap 5:** Utilizado para el sistema de grid, componentes base (modales, botones) y su extensa librería de **Bootstrap Icons**.
- **Bootstrap Iconpicker:** Una librería auxiliar para facilitar la selección de iconos.

## Cómo Usarlo

No se necesita instalación. Simplemente sigue estos pasos:

1.  Clona o descarga este repositorio en tu ordenador.
2.  Abre el archivo `index.html` en tu navegador web preferido (Google Chrome, Firefox, Safari, etc.).
3.  ¡Listo! La aplicación se cargará y estará lista para usar.

## Funcionalidades Detalladas

### Formar una Frase

- **Seleccionar:** Haz clic en cualquier pictograma de la cuadrícula principal. Se añadirá a la barra de frases y escucharás su nombre.
- **Escuchar la Frase Completa:** Presiona el botón **"Leer Frase"** junto a la barra de sentencias para escuchar la secuencia completa.
- **Reordenar:** En la barra de frases, mantén presionado un pictograma y arrástralo a una nueva posición.
- **Eliminar de la Frase:** Cada pictograma en la barra de frases tiene una pequeña "x". Haz clic en ella para quitarlo de la frase.

### Personalización

- **Añadir Pictograma:**
    1.  Haz clic en el botón **"Añadir Pictograma"**.
    2.  En la ventana emergente, escribe el texto y la categoría.
    3.  Elige un icono del selector o sube una imagen desde tu dispositivo.
    4.  Haz clic en "Añadir". El nuevo pictograma aparecerá en su categoría correspondiente.

- **Editar y Eliminar Pictogramas:**
    1.  Pasa el cursor sobre un pictograma que hayas creado tú.
    2.  Aparecerán dos botones: un lápiz (editar) y una papelera (eliminar).
    3.  **Editar:** Abre la misma ventana de personalización con los datos cargados para que los modifiques.
    4.  **Eliminar:** Te pedirá una confirmación antes de borrar el pictograma para siempre.

### Importar y Exportar

- **Exportar:** Con una frase armada en la barra de sentencias, haz clic en **"Exportar Frase"**. Se descargará un archivo `frase.json` con la información.
- **Importar:** Haz clic en **"Importar Frase"**, selecciona un archivo `.json` que hayas exportado previamente y la frase se cargará automáticamente.

## Licencia

Este proyecto está bajo la **Licencia MIT**. Esto significa que eres libre de usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias del software.

Para más detalles, consulta el archivo `LICENSE`.
