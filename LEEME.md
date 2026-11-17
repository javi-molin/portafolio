# Portafolio de diseño — Javi Molin

Sitio estático (HTML, CSS y JavaScript, sin instalación ni compilación) con forma de escritorio: carpetas, ventanas y cada proyecto presentado en láminas.

Para verlo en tu computador, abre `index.html` con doble clic.

## Dónde vive

- Repositorio: `javi-molin/portafolio`. Publicado con GitHub Pages en **https://molin.cl** (archivo `CNAME`).
- Cada cambio que llega a `main` se publica solo en uno o dos minutos.

## Qué hay en cada archivo

| Archivo | Qué contiene |
|---|---|
| `index.html` | El escritorio: barra superior, carpetas, nota de presentación, piezas sueltas y rótulo. |
| `assets/css/style.css` | Todo el diseño. Los colores y tipografías están al inicio, en `:root`. |
| `assets/js/app.js` | Las ventanas, la navegación y el fondo animado e interactivo. |
| `assets/js/data.js` | El contenido: los 12 proyectos con sus textos, créditos y piezas, y el perfil. |
| `assets/img/` | El cursor y el retrato. |
| `muralia/biblioteca.html` | La biblioteca gráfica interactiva de Muralia, enlazada desde su proyecto. |
| `assets/compartir.jpg` | La imagen que aparece al compartir el link (1200 × 630). |
| `mini/` | Miniaturas livianas (200 px) de cada pieza, con la misma ruta que en `img1/`, `img2/` e `img3/`. Si agregas una pieza nueva, agrega también su miniatura. |
| `assets/fonts/` | Las tipografías (Geist, Geist Mono, Pixelify Sans, Jersey 10 y Poppins), incluidas en el sitio. |
| `img1/`, `img2/`, `img3/` | Las piezas de los proyectos, una carpeta por proyecto. |
| `video/` | Los videos de las piezas animadas. |
| `cv/CV-Javi-Molin.pdf` | El currículum que se descarga. |

## Cambios frecuentes

- **Color de las carpetas:** en `style.css`, cambia `--acento`.
- **Colores del fondo:** en `app.js`, edita la lista `paletas`. Cada clic en el escritorio pasa a la siguiente.
- **Texto de la nota:** está en `index.html`, dentro de `<aside class="nota">`.
- **Carrusel de destacadas:** en `assets/js/app.js`, la lista `DESTACADAS`. Cada entrada dice proyecto, sección y pieza (contadas desde 1) y una etiqueta. Arriba de la lista están las cuatro condiciones para que una pieza entre.
- **Enlace directo a una pieza:** `#p/proyecto/sección/pieza`, por ejemplo `#p/dia-del-nino/7/1`.
- **Página web dentro del visor:** en `data.js`, agrega `"web": "ruta/a/la/pagina.html"` a una pieza; se muestra incrustada y `src` queda como miniatura.
- **Portadas de proyecto:** `img3/portadas/`, una por proyecto, al tamaño del visor (2400 × 1644). Son la primera pieza de cada caso.
- **Enlace a un sitio en vivo:** en `data.js`, agrega `"enlace": {"url": "…", "texto": "…"}` a la sección.
- **Textos de un proyecto:** en `data.js`, busca el proyecto por su `slug`.
- **Currículum:** reemplaza `cv/CV-Javi-Molin.pdf` por el nuevo con el mismo nombre.

## Créditos

Las fotos de modelos y producto son material de las marcas; el diseño, la composición y los originales son de Javi Molin, salvo donde se indica otra autoría. Los créditos de cada proyecto aparecen en su ficha.
