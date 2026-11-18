/* Portafolio de diseño de Javi Molin — lógica del escritorio.
   Sin dependencias. El contenido vive en data.js (window.PORTAFOLIO). */
(function () {
  'use strict';

  var DATA = window.PORTAFOLIO || { proyectos: [], perfil: {} };
  var proyectos = DATA.proyectos;
  var ripley = proyectos.filter(function (p) { return p.grupo === 'ripley'; });

  var ventana = document.getElementById('ventana');
  var cuerpo = document.getElementById('cuerpo');
  var ruta = document.getElementById('ruta');
  var estado = { vista: '', slug: null, sec: 0, pieza: 0 };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function porSlug(slug) { return proyectos.filter(function (p) { return p.slug === slug; })[0]; }
  function n2(n) { return (n < 10 ? '0' : '') + n; }
  /* Miniatura liviana (200 px) de cada pieza, en mini/ con la misma ruta. */
  function mini(src) { return String(src).replace(/^(img\d)\//, 'mini/$1/'); }
  var PIE = 'Las fotos de modelos y producto son material de las marcas; el diseño, la composición y los originales son míos, salvo donde se indica otra autoría.';

  /* ---------- Vistas ---------- */

  function vistaCarpeta() {
    var items = ripley.map(function (p) {
      return '<a class="sub" href="#p/' + p.slug + '">' +
        '<span class="sub__pestana" aria-hidden="true"></span>' +
        '<span class="sub__cuerpo"><img src="' + esc(p.cover.src) + '" alt="" loading="lazy" style="object-position:' + esc(p.cover.focus) + '"></span>' +
        '<span class="sub__nombre">' + esc(p.titulo) + '</span>' +
        '<span class="sub__tipo">' + esc(p.n) + ' · ' + esc(p.estado || p.tipo) + '</span>' +
        '</a>';
    }).join('');
    return '<div class="carpeta">' +
      '<div class="carpeta__cabeza"><div>' +
      '<p class="sobre">Carpeta · Diseñadora de Marketing</p>' +
      '<h2 class="titulo titulo--xl">Ripley</h2></div>' +
      '<dl class="ficha"><dt>Cargo</dt><dd>Diseñadora de Marketing</dd><dt>Mercados</dt><dd>Chile y Perú</dd><dt>Proyectos</dt><dd>' + ripley.length + '</dd></dl>' +
      '</div><div class="carpeta__grilla">' + items + '</div></div>';
  }

  function vistaProyecto(p) {
    var secs = p.secciones;
    var sec = secs[Math.min(estado.sec, secs.length - 1)];
    var piezas = sec.piezas || [];
    var i = Math.min(estado.pieza, Math.max(0, piezas.length - 1));
    var pz = piezas[i];

    var ficha = '<dt>Cliente</dt><dd>' + esc(p.cliente) + '</dd>' +
      '<dt>Año</dt><dd>' + esc(p.ano) + '</dd>' +
      '<dt>Rol</dt><dd>' + esc(p.rol) + '</dd>' +
      (p.estado ? '<dt>Estado</dt><dd>' + esc(p.estado) + '</dd>' : '') +
      (p.formatos && p.formatos.length ? '<dt>Formatos</dt><dd>' + esc(p.formatos.join(' · ')) + '</dd>' : '') +
      (p.creditos && p.creditos.length ? '<dt>Créditos</dt><dd>' + p.creditos.map(esc).join('<br>') + '</dd>' : '');

    /* Contenido de la sección activa: se despliega bajo su ítem del índice. */
    var colores = sec.colores ? '<ul class="colores">' + sec.colores.map(function (c) {
      return '<li class="color" style="background:' + esc(c.hex) + ';color:' + esc(c.ink) + '">' + esc(c.name) + '<br>' + esc(c.hex) + '</li>';
    }).join('') + '</ul>' : '';
    var texto = sec.texto ? sec.texto.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') : '';
    var lista = sec.lista ? (sec.listaTitulo ? '<p class="sobre">' + esc(sec.listaTitulo) + '</p>' : '') +
      '<ul class="seccion__lista">' + sec.lista.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '';
    var enlace = sec.enlace ? '<p><a class="boton boton--chico" href="' + esc(sec.enlace.url) + '" target="_blank" rel="noopener">' + esc(sec.enlace.texto) + ' ↗</a></p>' : '';
    var detalle = (texto || lista || colores || enlace) ? '<div class="seccion">' + texto + lista + colores + enlace + '</div>' : '';

    /* Índice vertical: todas las secciones a la vista, numeradas. */
    var indice = '<ol class="indice" aria-label="En este proyecto">' + secs.map(function (s, n) {
      var activa = s === sec;
      return '<li class="indice__item' + (activa ? ' es-activa' : '') + '">' +
        '<button class="indice__boton" type="button" data-sec="' + n + '" aria-current="' + activa + '">' +
        '<span class="indice__n">' + (n + 1 < 10 ? '0' : '') + (n + 1) + '</span>' +
        '<span class="indice__titulo">' + esc(s.titulo) + '</span>' +
        '<span class="indice__cuenta">' + (s.piezas || []).length + '</span></button>' +
        (activa ? detalle : '') + '</li>';
    }).join('') + '</ol>';

    var visor = '';
    if (pz) {
      var alta = pz.h / pz.w > 1.9;
      var medio = pz.web
        ? '<iframe class="lamina__web" src="' + esc(pz.web) + '" title="' + esc(pz.nombre) + '" loading="lazy"></iframe>'
        : pz.video
        ? '<video src="' + esc(pz.video) + '" poster="' + esc(pz.src) + '" preload="metadata" controls muted loop playsinline autoplay aria-label="' + esc(pz.alt) + '"></video>'
        : '<img src="' + esc(pz.src) + '" alt="' + esc(pz.alt) + '" width="' + pz.w + '" height="' + pz.h + '" data-ampliar>';
      var hayVarias = piezas.length > 1 || secs.length > 1;
      visor = '<figure class="lamina">' +
        '<div class="lamina__marco' + (alta ? ' es-alta' : '') + '">' + medio +
        (hayVarias ? '<button class="lamina__flecha lamina__flecha--ant" type="button" data-mover="-1" aria-label="Pieza anterior"><svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14"><path d="M9 2 4 7l5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button>' +
          '<button class="lamina__flecha lamina__flecha--sig" type="button" data-mover="1" aria-label="Pieza siguiente"><svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14"><path d="m5 2 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button>' : '') +
        '<button class="lamina__ampliar" type="button" data-ampliar aria-label="Ver a pantalla completa"><svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" shape-rendering="crispEdges"><path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" stroke="currentColor" stroke-width="2" fill="none"/></svg><span>Ampliar</span></button>' +
        '</div>' +
        '<figcaption class="lamina__pie"><span><b>' + esc(pz.nombre) + '</b>' + (pz.formato ? ' · ' + esc(pz.formato) : '') +
        (pz.nota ? '<span class="lamina__nota"> — ' + esc(pz.nota) + '</span>' : '') + '</span>' +
        '<span class="mono suave">' + (n2(estado.sec + 1)) + ' · ' + (i + 1) + ' / ' + piezas.length + '</span></figcaption></figure>';
      if (piezas.length > 1) {
        visor += '<div class="minis">' + piezas.map(function (q, n) {
          return '<button class="mini" type="button" data-pieza="' + n + '" aria-current="' + (n === i) + '" aria-label="' + esc(q.nombre) + '">' +
            '<img src="' + esc(mini(q.src)) + '" alt="" loading="lazy"></button>';
        }).join('') + '</div>';
      }
    }

    /* Anterior y siguiente recorren los 12 proyectos en orden; en los extremos vuelven a la carpeta o al escritorio. */
    var pos = proyectos.indexOf(p);
    var ant = proyectos[pos - 1];
    var sig = proyectos[pos + 1];
    var enlaceAnt = ant
      ? '<a class="enlace" href="#p/' + ant.slug + '"><span>Anterior</span>' + esc(ant.titulo) + '</a>'
      : '<a class="enlace" href="#ripley"><span>Volver</span>Carpeta Ripley</a>';
    var enlaceSig = sig
      ? '<a class="enlace enlace--sig" href="#p/' + sig.slug + '"><span>Siguiente</span>' + esc(sig.titulo) + '</a>'
      : '<a class="enlace enlace--sig" href="#"><span>Volver</span>Escritorio</a>';

    return '<article class="proyecto">' +
      '<div class="proyecto__datos">' +
      '<p class="sobre">' + (p.n ? esc(p.n) + ' · ' : '') + esc(p.tipo) + '</p>' +
      '<h2 class="titulo titulo--m">' + esc(p.titulo) + '</h2>' +
      '<p class="proyecto__resumen">' + esc(p.resumen) + '</p>' +
      '<p class="sobre indice__sobre">En este proyecto</p>' + indice +
      '<details class="proyecto__ficha"><summary>Ficha del proyecto</summary><dl class="ficha">' + ficha + '</dl></details>' +
      '<p class="proyecto__creditos">' + esc(PIE) + '</p>' +
      '<nav class="proyecto__pie" aria-label="Otros proyectos">' + enlaceAnt + enlaceSig + '</nav>' +
      '</div>' +
      '<div class="proyecto__visor">' + visor + '</div></article>';
  }

  function vistaSobre() {
    var pf = DATA.perfil;
    var exp = (pf.experiencia || []).map(function (e) {
      return '<div class="fila"><span class="fila__cuando">' + esc(e.periodo) + '</span><div class="fila__que"><b>' + esc(e.cargo) + ' · ' + esc(e.lugar) + '</b>' +
        '<p>' + esc(e.detalle) + '</p>' +
        (e.logros ? '<ul>' + e.logros.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul>' : '') +
        '</div></div>';
    }).join('');
    var form = (pf.formacion || []).map(function (f) {
      return '<div class="fila"><span class="fila__cuando">' + esc(f.periodo) + '</span><div class="fila__que"><b>' + esc(f.titulo) + '</b><p>' + esc(f.lugar) + '</p></div></div>';
    }).join('');
    var chips = function (xs) { return '<ul class="chips">' + (xs || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'; };
    return '<div class="sobremi">' +
      '<div class="sobremi__yo">' +
      '<img src="assets/img/retrato.webp" alt="Retrato de Javi Molin." width="132" height="132">' +
      '<p class="sobre">María Javiera Molin Aguad</p>' +
      '<h2 class="titulo titulo--l">Sobre mí</h2>' +
      '<p>Soy Diseñadora Integral UC. Diseño campañas, eventos y piezas de tienda para marcas en Chile y Perú, pensadas para funcionar igual en un pendón de dos metros que en un mensaje de WhatsApp.</p>' +
      '<p>En 2025 fui Diseñadora de Marketing en Ripley. Hoy trabajo como freelance para Muralia y Neorigen.</p>' +
      '<p><a class="boton boton--acento" href="cv/CV-Javi-Molin.pdf" download>Descargar currículum</a></p>' +
      '</div>' +
      '<div class="sobremi__listas">' +
      '<section class="bloque"><h3>Experiencia</h3>' + exp + '</section>' +
      '<section class="bloque"><h3>Formación</h3>' + form + '</section>' +
      '<section class="bloque"><h3>Qué hago</h3>' + chips(pf.hace) + '</section>' +
      '<section class="bloque"><h3>Herramientas</h3>' + chips(pf.herramientas) + '</section>' +
      '</div></div>';
  }

  function vistaContacto() {
    return '<div class="contacto">' +
      '<p class="sobre">Santiago, Chile</p>' +
      '<h2 class="titulo titulo--xl">¿Conversamos?</h2>' +
      '<p style="max-width:52ch;font-size:18px">Escríbeme para conversar sobre un proyecto o un equipo de diseño.</p>' +
      '<div class="contacto__acciones">' +
      '<a class="boton boton--acento" href="mailto:javimolin@gmail.com">javimolin@gmail.com</a>' +
      '<a class="boton" href="https://www.linkedin.com/in/javimolin/" target="_blank" rel="noopener">LinkedIn</a>' +
      '<a class="boton" href="cv/CV-Javi-Molin.pdf" download>Currículum</a>' +
      '</div>' +
      '<p class="mono">Teléfono: <a href="tel:+56966303974">+56 9 6630 3974</a></p>' +
      '</div>';
  }

  /* ---------- Ruteo ---------- */

  function leerRuta() {
    var h = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    var partes = h.split('/');
    /* #p/slug abre el proyecto; #p/slug/3/2 abre la sección 3, pieza 2. */
    if (partes[0] === 'p' && porSlug(partes[1])) {
      return { vista: 'proyecto', slug: partes[1], sec: Math.max(0, (parseInt(partes[2], 10) || 1) - 1), pieza: Math.max(0, (parseInt(partes[3], 10) || 1) - 1) };
    }
    if (['ripley', 'sobre', 'contacto'].indexOf(partes[0]) > -1) return { vista: partes[0], slug: null };
    return { vista: '', slug: null };
  }

  function pintarRuta(p) {
    var migas = '<a href="#">Javi Molin</a><span aria-hidden="true">/</span>';
    if (estado.vista === 'proyecto') {
      if (p.grupo === 'ripley') migas += '<a href="#ripley">Ripley</a><span aria-hidden="true">/</span>';
      migas += '<span>' + esc(p.titulo) + '</span>';
    } else {
      migas += '<span>' + { ripley: 'Ripley', sobre: 'sobre-mi.txt', contacto: 'Contacto' }[estado.vista] + '</span>';
    }
    ruta.innerHTML = migas;
  }

  function marcarIcono() {
    var actual = estado.vista === 'proyecto'
      ? (porSlug(estado.slug).grupo === 'ripley' ? '#ripley' : '#p/' + estado.slug)
      : (estado.vista ? '#' + estado.vista : '');
    Array.prototype.forEach.call(document.querySelectorAll('.icono'), function (a) {
      a.classList.toggle('es-actual', !!actual && a.getAttribute('href') === actual);
    });
  }

  function pintar(conservarScroll) {
    var scroll = conservarScroll ? cuerpo.scrollTop : 0;
    if (!estado.vista) {
      estado.ampliado = false;
      pintarAmpliado(null);
      ventana.hidden = true;
      cuerpo.innerHTML = '';
      document.title = 'Javi Molin — Portafolio de diseño';
      marcarIcono();
      return;
    }
    var p = estado.vista === 'proyecto' ? porSlug(estado.slug) : null;
    /* Al cambiar de pieza o pestaña se conserva dónde estaba cada zona con scroll y si la ficha estaba abierta. */
    var zonas = ['.proyecto__datos', '.minis'];
    var antes = conservarScroll ? zonas.map(function (s) {
      var e = cuerpo.querySelector(s); return e ? [e.scrollTop, e.scrollLeft] : null;
    }) : [];
    var ficha = cuerpo.querySelector('.proyecto__ficha');
    if (conservarScroll && ficha) estado.ficha = ficha.open;
    cuerpo.innerHTML = estado.vista === 'ripley' ? vistaCarpeta()
      : estado.vista === 'proyecto' ? vistaProyecto(p)
      : estado.vista === 'sobre' ? vistaSobre()
      : vistaContacto();
    cuerpo.classList.toggle('es-proyecto', estado.vista === 'proyecto');
    /* El proyecto abre maximizado (tapa los íconos) y lleva los créditos dentro de su columna. */
    ventana.classList.toggle('es-max', estado.vista === 'proyecto');
    pintarAmpliado(p);
    ficha = cuerpo.querySelector('.proyecto__ficha');
    if (ficha && conservarScroll && estado.ficha != null) ficha.open = estado.ficha;
    antes.forEach(function (v, n) {
      var e = cuerpo.querySelector(zonas[n]); if (e && v) { e.scrollTop = v[0]; e.scrollLeft = v[1]; }
    });
    /* Mantiene a la vista la sección activa del índice y la miniatura actual, sin mover la página. */
    var datos = cuerpo.querySelector('.proyecto__datos');
    var item = cuerpo.querySelector('.indice__item.es-activa');
    if (datos && item && datos.scrollHeight > datos.clientHeight) {
      var arriba = item.offsetTop - datos.offsetTop;
      if (arriba < datos.scrollTop) datos.scrollTop = arriba - 8;
      else if (arriba + 40 > datos.scrollTop + datos.clientHeight - 90) datos.scrollTop = arriba - 60;
    }
    var minis = cuerpo.querySelector('.minis'), miniActual = cuerpo.querySelector('.mini[aria-current="true"]');
    if (minis && miniActual) {
      var izq = miniActual.offsetLeft - minis.offsetLeft;
      if (izq < minis.scrollLeft || izq + miniActual.offsetWidth > minis.scrollLeft + minis.clientWidth) minis.scrollLeft = izq - minis.clientWidth / 2;
    }
    pintarRuta(p);
    marcarIcono();
    var estabaCerrada = ventana.hidden;
    ventana.hidden = false;
    cuerpo.scrollTop = scroll;
    document.title = (p ? p.titulo : { ripley: 'Ripley', sobre: 'Sobre mí', contacto: 'Contacto' }[estado.vista]) + ' — Javi Molin, portafolio de diseño';
    if (estabaCerrada || !conservarScroll) cuerpo.focus({ preventScroll: true });
  }

  function alCambiarRuta() {
    var r = leerRuta();
    estado.vista = r.vista; estado.slug = r.slug; estado.sec = r.sec || 0; estado.pieza = r.pieza || 0;
    estado.ampliado = false;
    pintar(false);
  }

  /* Avanza o retrocede una pieza; al terminar una sección pasa a la siguiente. */
  function mover(d) {
    var p = porSlug(estado.slug);
    if (!p) return;
    var secs = p.secciones;
    var n = (secs[estado.sec].piezas || []).length;
    var i = estado.pieza + d;
    if (i >= 0 && i < n) { estado.pieza = i; }
    else {
      var s = estado.sec;
      do { s = (s + d + secs.length) % secs.length; } while (!(secs[s].piezas || []).length && s !== estado.sec);
      estado.sec = s;
      estado.pieza = d > 0 ? 0 : Math.max(0, (secs[s].piezas || []).length - 1);
    }
    pintar(true);
  }

  cuerpo.addEventListener('click', function (e) {
    if (e.target.closest('[data-ampliar]')) { estado.ampliado = true; pintarAmpliado(porSlug(estado.slug)); return; }
    var t = e.target.closest('[data-sec],[data-pieza],[data-mover]');
    if (!t) return;
    if (t.dataset.sec != null) { estado.sec = +t.dataset.sec; estado.pieza = 0; pintar(true); }
    else if (t.dataset.pieza != null) { estado.pieza = +t.dataset.pieza; pintar(true); }
    else { mover(+t.dataset.mover); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && estado.ampliado) { cerrarAmpliado(); return; }
    if (e.key === 'Escape' && estado.vista) { location.hash = ''; return; }
    if (estado.vista !== 'proyecto' || e.altKey || e.metaKey || e.ctrlKey) return;
    if (e.target && /^(INPUT|TEXTAREA|VIDEO)$/.test(e.target.tagName)) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); mover(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); mover(-1); }
  });

  /* ---------- Pieza a pantalla completa ---------- */

  var ampliado = document.createElement('div');
  ampliado.className = 'ampliado';
  ampliado.hidden = true;
  ampliado.setAttribute('role', 'dialog');
  ampliado.setAttribute('aria-modal', 'true');
  ampliado.setAttribute('aria-label', 'Pieza a pantalla completa');
  document.body.appendChild(ampliado);

  function pintarAmpliado(p) {
    if (!estado.ampliado || !p) { ampliado.hidden = true; ampliado.innerHTML = ''; return; }
    var sec = p.secciones[Math.min(estado.sec, p.secciones.length - 1)];
    var piezas = sec.piezas || [];
    var pz = piezas[Math.min(estado.pieza, piezas.length - 1)];
    if (!pz) { ampliado.hidden = true; return; }
    var medio = pz.video
      ? '<video src="' + esc(pz.video) + '" poster="' + esc(pz.src) + '" controls muted loop playsinline autoplay aria-label="' + esc(pz.alt) + '"></video>'
      : '<img src="' + esc(pz.src) + '" alt="' + esc(pz.alt) + '">';
    if (pz.web) medio = '<iframe class="ampliado__web" src="' + esc(pz.web) + '" title="' + esc(pz.nombre) + '"></iframe>';
    var estabaOculto = ampliado.hidden;
    ampliado.innerHTML =
      '<div class="ampliado__barra"><span><b>' + esc(p.titulo) + '</b> / ' + esc(sec.titulo) + '</span>' +
      '<button class="ampliado__cerrar" type="button" data-cerrar aria-label="Cerrar pantalla completa">Cerrar ✕</button></div>' +
      '<div class="ampliado__pieza">' + medio + '</div>' +
      '<button class="lamina__flecha lamina__flecha--ant" type="button" data-mover="-1" aria-label="Pieza anterior"><svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14"><path d="M9 2 4 7l5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button>' +
      '<button class="lamina__flecha lamina__flecha--sig" type="button" data-mover="1" aria-label="Pieza siguiente"><svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14"><path d="m5 2 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button>' +
      '<p class="ampliado__pie"><b>' + esc(pz.nombre) + '</b>' + (pz.formato ? ' · ' + esc(pz.formato) : '') + '</p>';
    ampliado.hidden = false;
    if (estabaOculto) { var c = ampliado.querySelector('[data-cerrar]'); if (c) c.focus({ preventScroll: true }); }
  }
  function cerrarAmpliado() {
    estado.ampliado = false;
    pintarAmpliado(null);
    var b = cuerpo.querySelector('.lamina__ampliar');
    if (b) b.focus({ preventScroll: true });
  }
  ampliado.addEventListener('click', function (e) {
    var t = e.target.closest('[data-mover]');
    if (t) { mover(+t.dataset.mover); return; }
    if (e.target.closest('[data-cerrar]') || e.target === ampliado || e.target.classList.contains('ampliado__pieza')) cerrarAmpliado();
  });

  /* Deslizar con el dedo cambia de pieza, en el visor y a pantalla completa. */
  var toque = null;
  function alTocar(e) { if (e.touches.length === 1) toque = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }
  function alSoltar(e) {
    if (!toque || estado.vista !== 'proyecto') return;
    var dx = e.changedTouches[0].clientX - toque.x, dy = e.changedTouches[0].clientY - toque.y;
    toque = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5 && (e.target.closest('.lamina__marco') || e.target.closest('.ampliado'))) mover(dx < 0 ? 1 : -1);
  }
  document.addEventListener('touchstart', alTocar, { passive: true });
  document.addEventListener('touchend', alSoltar, { passive: true });

  /* ---------- Carrusel de piezas destacadas ----------
     Entra una pieza solo si cumple las cuatro condiciones, todas comprobables:
     1. está producida o publicada (no es propuesta);
     2. el diseño es enteramente de Javi (sin concepto de agencia: queda fuera Toys"R"Us);
     3. su original mide 1600 px o más por el lado mayor, o es una animación;
     4. entre todas cubren disciplinas distintas: evento, sistema gráfico, identidad,
        campaña y animación, sin repetir más de dos veces un mismo proyecto. */
  var DESTACADAS = [
    { p: 'dia-del-nino', s: 1, z: 2, tipo: 'Evento producido' },
    { p: 'muralia', s: 3, z: 9, tipo: 'Identidad y biblioteca' },
    { p: 'ventas-privadas', s: 5, z: 6, tipo: 'Animación' },
    { p: 'dia-del-nino', s: 2, z: 1, tipo: 'Sistema gráfico' },
    { p: 'ventas-privadas', s: 2, z: 1, tipo: 'Sistema de piezas' },
    { p: 'activaciones', s: 4, z: 5, tipo: 'Animación' },
    { p: 'campeones-sin-limites', s: 5, z: 1, tipo: 'Campaña en Metro' },
    { p: 'muralia', s: 3, z: 8, tipo: 'Construcción de iconos' }
  ].map(function (d) {
    var p = porSlug(d.p), sec = p && p.secciones[d.s - 1], pz = sec && sec.piezas && sec.piezas[d.z - 1];
    return pz ? { p: p, pz: pz, tipo: d.tipo, href: '#p/' + d.p + '/' + d.s + '/' + d.z } : null;
  }).filter(Boolean);

  var caja = document.querySelector('.destacadas');
  if (caja && DESTACADAS.length) {
    var pantalla = caja.querySelector('.destacadas__pantalla');
    var texto = caja.querySelector('.destacadas__texto');
    var cuenta = caja.querySelector('.destacadas__cuenta');
    var pausa = caja.querySelector('.destacadas__pausa');
    var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var actual = 0, reloj = null, pausado = quieto, encima = false;

    pantalla.innerHTML = DESTACADAS.map(function (d, n) {
      var pz = d.pz;
      var medio = pz.video
        ? '<video src="' + esc(pz.video) + '" poster="' + esc(pz.src) + '" muted loop playsinline preload="none" aria-label="' + esc(pz.alt) + '"></video>'
        : '<img src="' + esc(pz.src) + '" alt="' + esc(pz.alt) + '" width="' + pz.w + '" height="' + pz.h + '"' + (n ? ' loading="lazy"' : '') + '>';
      return '<a class="destacada' + (n === 0 ? ' es-activa' : '') + '" href="' + d.href + '" tabindex="' + (n === 0 ? '0' : '-1') +
        '" aria-hidden="' + (n !== 0) + '" aria-roledescription="diapositiva" aria-label="' + (n + 1) + ' de ' + DESTACADAS.length + ': ' + esc(pz.nombre) + '">' + medio + '</a>';
    }).join('');
    var slides = pantalla.querySelectorAll('.destacada');

    function mostrar(n) {
      var antes = slides[actual];
      actual = (n + DESTACADAS.length) % DESTACADAS.length;
      var d = DESTACADAS[actual], ahora = slides[actual];
      if (antes !== ahora) {
        antes.classList.remove('es-activa'); antes.setAttribute('aria-hidden', 'true'); antes.tabIndex = -1;
        var va = antes.querySelector('video'); if (va) va.pause();
      }
      ahora.classList.add('es-activa'); ahora.setAttribute('aria-hidden', 'false'); ahora.tabIndex = 0;
      var v = ahora.querySelector('video');
      if (v) { v.preload = 'auto'; if (!quieto) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } }
      texto.href = d.href;
      texto.innerHTML = '<b>' + esc(d.p.titulo) + '</b><span>' + esc(d.pz.nombre) + '</span><i>' + esc(d.tipo) + '</i>';
      cuenta.textContent = n2(actual + 1) + ' / ' + n2(DESTACADAS.length);
      programar();
    }
    function programar() {
      clearTimeout(reloj);
      if (pausado || encima) return;
      reloj = setTimeout(function () { mostrar(actual + 1); }, DESTACADAS[actual].pz.video ? 9000 : 5000);
    }
    function pintarPausa() {
      pausa.setAttribute('aria-pressed', String(pausado));
      pausa.setAttribute('aria-label', pausado ? 'Reanudar el carrusel' : 'Pausar el carrusel');
      pausa.textContent = pausado ? '▶' : 'II';
    }
    caja.addEventListener('click', function (e) {
      var b = e.target.closest('[data-paso]');
      if (b) { mostrar(actual + Number(b.dataset.paso)); return; }
      if (e.target.closest('.destacadas__pausa')) { pausado = !pausado; pintarPausa(); programar(); }
    });
    caja.addEventListener('mouseenter', function () { encima = true; programar(); });
    caja.addEventListener('mouseleave', function () { encima = false; programar(); });
    caja.addEventListener('focusin', function () { encima = true; programar(); });
    caja.addEventListener('focusout', function (e) { if (!caja.contains(e.relatedTarget)) { encima = false; programar(); } });
    var toqueC = null;
    pantalla.addEventListener('touchstart', function (e) { toqueC = e.touches[0].clientX; }, { passive: true });
    pantalla.addEventListener('touchend', function (e) {
      if (toqueC === null) return;
      var dx = e.changedTouches[0].clientX - toqueC; toqueC = null;
      if (Math.abs(dx) > 40) { e.preventDefault(); mostrar(actual + (dx < 0 ? 1 : -1)); }
    });
    document.addEventListener('visibilitychange', function () { if (document.hidden) clearTimeout(reloj); else programar(); });
    pintarPausa();
    mostrar(0);
  }

  window.addEventListener('hashchange', alCambiarRuta);
  alCambiarRuta();

  /* ---------- Fondo animado e interactivo ---------- */

  (function () {
    var fondo = document.getElementById('fondo');
    var luz = document.getElementById('luz');
    if (!fondo) return;
    var quieto = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var paletas = [
      ['#ffa9c6', '#b9aeff', '#ffc58f', '#9fdcff', '#fff3b0'],
      ['#ff9e8a', '#ffd08a', '#c4b5ff', '#a8f0d4', '#ffe9f3'],
      ['#9ad7ff', '#d3b6ff', '#ffb5d8', '#ffe08f', '#e8fbff'],
      ['#c7f0a8', '#ffc9a3', '#ffa8c9', '#b3c7ff', '#fffbd1']
    ];
    var n = 0;
    function aplicar(k) {
      paletas[k].forEach(function (c, i) { fondo.style.setProperty('--c' + (i + 1), c); });
    }
    /* Un clic en el escritorio (fuera de ventanas, nota e íconos) cambia la paleta. */
    document.getElementById('escritorio').addEventListener('click', function (e) {
      if (e.target.closest('.ventana, .nota, .icono, a, button')) return;
      n = (n + 1) % paletas.length;
      aplicar(n);
    });

    if (quieto) return;
    var manchas = Array.prototype.slice.call(fondo.querySelectorAll('.mancha'));
    var fuerza = [130, -170, -110, 150];
    var meta = { x: 0, y: 0, px: innerWidth / 2, py: innerHeight / 2 };
    var act = { x: 0, y: 0, px: innerWidth / 2, py: innerHeight / 2 };
    window.addEventListener('pointermove', function (e) {
      meta.x = (e.clientX / innerWidth) * 2 - 1;
      meta.y = (e.clientY / innerHeight) * 2 - 1;
      meta.px = e.clientX; meta.py = e.clientY;
      luz.classList.add('activa');
    }, { passive: true });
    document.addEventListener('pointerleave', function () { luz.classList.remove('activa'); });
    function cuadro() {
      act.x += (meta.x - act.x) * 0.05;
      act.y += (meta.y - act.y) * 0.05;
      act.px += (meta.px - act.px) * 0.09;
      act.py += (meta.py - act.py) * 0.09;
      for (var i = 0; i < manchas.length; i++) {
        manchas[i].style.transform = 'translate3d(' + (act.x * fuerza[i]).toFixed(1) + 'px,' + (act.y * fuerza[i] * 0.8).toFixed(1) + 'px,0)';
      }
      luz.style.transform = 'translate3d(' + act.px.toFixed(1) + 'px,' + act.py.toFixed(1) + 'px,0)';
      requestAnimationFrame(cuadro);
    }
    requestAnimationFrame(cuadro);
  })();
})();
