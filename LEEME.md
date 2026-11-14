# Portafolio de diseño — Javi Molin

Sitio estático (HTML, CSS y JavaScript, sin instalación ni compilación) con forma de escritorio: carpetas, ventanas y cada proyecto presentado en láminas.

Para verlo en tu computador, abre `index.html` con doble clic.

## Cómo publicarlo en GitHub Pages

Conviene usar un **repositorio nuevo** (por ejemplo `javimolin-rgb/escritorio`). Si subes estos archivos al repositorio `portafolio`, conviven mal con el sitio actual en Astro y lo reemplazan.

1. En GitHub, crea el repositorio nuevo, público y vacío.
2. Entra a **Add file → Upload files**.
3. El subidor web acepta hasta 100 archivos por vez, así que sube el contenido de esta carpeta en **cuatro tandas**, arrastrando cada grupo y presionando **Commit changes** antes de seguir con el siguiente:
   - Tanda 1: `index.html`, `favicon.svg`, `LEEME.md` y las carpetas `assets`, `cv` y `video`.
   - Tanda 2: la carpeta `img1`.
   - Tanda 3: la carpeta `img2`.
   - Tanda 4: la carpeta `img3`.

   Arrastra las carpetas completas, no los archivos de adentro, para que se mantenga la estructura.
4. Ve a **Settings → Pages**. En "Build and deployment", elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`, y guarda.
5. En uno o dos minutos el sitio queda en `https://javimolin-rgb.github.io/NOMBRE-DEL-REPO/`.

## Qué hay en cada archivo

| Archivo | Qué contiene |
|---|---|
| `index.html` | El escritorio: barra superior, carpetas, nota de presentación y rótulo. |
| `assets/css/style.css` | Todo el diseño. Los colores y tipografías están al inicio, en `:root`. |
| `assets/js/app.js` | Las ventanas, la navegación y el fondo animado e interactivo. |
| `assets/js/data.js` | El contenido: los 12 proyectos con sus textos, créditos y piezas, y el perfil. |
| `assets/img/` | El cursor y el retrato. |
| `assets/fonts/` | Las tipografías (Geist, Geist Mono, Pixelify Sans, Jersey 10 y Poppins), incluidas en el sitio. |
| `img1/`, `img2/`, `img3/` | Las piezas de los proyectos, una carpeta por proyecto. |
| `video/` | Los videos de las piezas animadas. |
| `cv/CV-Javi-Molin.pdf` | El currículum que se descarga. |

## Cambios frecuentes

- **Color de las carpetas:** en `style.css`, cambia `--acento`.
- **Colores del fondo:** en `app.js`, edita la lista `paletas`. Cada clic en el escritorio pasa a la siguiente.
- **Texto de la nota:** está en `index.html`, dentro de `<aside class="nota">`.
- **Textos de un proyecto:** en `data.js`, busca el proyecto por su `slug`.
- **Currículum:** reemplaza `cv/CV-Javi-Molin.pdf` por el nuevo con el mismo nombre.

## Créditos

Las fotos de modelos y producto son material de las marcas; el diseño, la composición y los originales son de Javi Molin, salvo donde se indica otra autoría. Los créditos de cada proyecto aparecen en su ficha.
