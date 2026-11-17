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
      '<p class="sobre">Carpeta · Diseñadora de Marketing, 2025</p>' +
      '<h2 class="titulo titulo--xl">Ripley</h2></div>' +
      '<dl class="ficha"><dt>Cargo</dt><dd>Diseñadora de Marketing</dd><dt>Año</dt><dd>2025</dd><dt>Mercados</dt><dd>Chile y Perú</dd><dt>Proyectos</dt><dd>' + ripley.length + '</dd></dl>' +
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

    /* Pestañas compactas: número y título corto; el título completo queda en el tooltip. */
    var tabs = secs.map(function (s, n) {
      return '<button class="tab" type="button" role="tab" title="' + esc(s.titulo) + '" aria-selected="' + (s === sec) + '" data-sec="' + n + '">' +
        '<span class="tab__n">' + (n + 1 < 10 ? '0' : '') + (n + 1) + '</span>' + esc(s.titulo) + '</button>';
    }).join('');

    var visor = '';
    if (pz) {
      var alta = pz.h / pz.w > 1.9;
      var medio = pz.video
        ? '<video src="' + esc(pz.video) + '" poster="' + esc(pz.src) + '" preload="metadata" controls muted loop playsinline autoplay aria-label="' + esc(pz.alt) + '"></video>'
        : '<img src="' + esc(pz.src) + '" alt="' + esc(pz.alt) + '" width="' + pz.w + '" height="' + pz.h + '">';
      var hayVarias = piezas.length > 1 || secs.length > 1;
      visor = '<figure class="lamina">' +
        '<div class="lamina__marco' + (alta ? ' es-alta' : '') + '">' + medio +
        (hayVarias ? '<button class="lamina__flecha lamina__flecha--ant" type="button" data-mover="-1" aria-label="Pieza anterior">←</button>' +
          '<button class="lamina__flecha lamina__flecha--sig" type="button" data-mover="1" aria-label="Pieza siguiente">→</button>' : '') +
        '</div>' +
        '<figcaption class="lamina__pie"><span><b>' + esc(pz.nombre) + '</b>' + (pz.formato ? ' · ' + esc(pz.formato) : '') +
        (pz.nota ? '<span class="lamina__nota"> — ' + esc(pz.nota) + '</span>' : '') + '</span>' +
        '<span class="mono suave">' + (i + 1) + ' / ' + piezas.length + '</span></figcaption></figure>';
      if (piezas.length > 1) {
        visor += '<div class="minis">' + piezas.map(function (q, n) {
          return '<button class="mini" type="button" data-pieza="' + n + '" aria-current="' + (n === i) + '" aria-label="' + esc(q.nombre) + '">' +
            '<img src="' + esc(q.src) + '" alt="" loading="lazy"></button>';
        }).join('') + '</div>';
      }
    }

    var colores = sec.colores ? '<ul class="colores">' + sec.colores.map(function (c) {
      return '<li class="color" style="background:' + esc(c.hex) + ';color:' + esc(c.ink) + '">' + esc(c.name) + '<br>' + esc(c.hex) + '</li>';
    }).join('') + '</ul>' : '';
    var texto = sec.texto ? sec.texto.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') : '';
    var lista = sec.lista ? (sec.listaTitulo ? '<p class="sobre">' + esc(sec.listaTitulo) + '</p>' : '') +
      '<ul class="seccion__lista">' + sec.lista.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '';
    var seccion = (texto || lista || colores)
      ? '<section class="seccion"><p class="sobre">' + esc(sec.titulo) + '</p>' + texto + lista + colores + '</section>' : '';

    /* Anterior y siguiente recorren los 12 proyectos en orden, así nunca apuntan al mismo. */
    var pos = proyectos.indexOf(p);
    var ant = proyectos[(pos - 1 + proyectos.length) % proyectos.length];
    var sig = proyectos[(pos + 1) % proyectos.length];

    return '<article class="proyecto">' +
      '<div class="proyecto__datos">' +
      '<p class="sobre">' + (p.n ? esc(p.n) + ' · ' : '') + esc(p.tipo) + '</p>' +
      '<h2 class="titulo titulo--m">' + esc(p.titulo) + '</h2>' +
      '<p class="proyecto__resumen">' + esc(p.resumen) + '</p>' +
      seccion +
      '<details class="proyecto__ficha"' + (seccion ? '' : ' open') + '><summary>Ficha del proyecto</summary><dl class="ficha">' + ficha + '</dl></details>' +
      '<nav class="proyecto__pie" aria-label="Otros proyectos">' +
      '<a class="enlace" href="#p/' + ant.slug + '"><span>← Anterior</span>' + esc(ant.titulo) + '</a>' +
      '<a class="enlace enlace--sig" href="#p/' + sig.slug + '"><span>Siguiente →</span>' + esc(sig.titulo) + '</a>' +
      '</nav>' +
      '</div>' +
      '<div class="proyecto__visor">' +
      '<div class="tabs" role="tablist" aria-label="Secciones del proyecto">' + tabs + '</div>' +
      visor +
      '</div></article>';
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
      '<p>Hoy trabajo freelance para Muralia y Neorigen, y busco un rol in-house en diseño.</p>' +
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
      '<p style="max-width:52ch;font-size:18px">Busco un rol in-house en diseño y tomo proyectos freelance.</p>' +
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
    if (partes[0] === 'p' && porSlug(partes[1])) return { vista: 'proyecto', slug: partes[1] };
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
      ventana.hidden = true;
      cuerpo.innerHTML = '';
      document.title = 'Javi Molin — Portafolio de diseño';
      marcarIcono();
      return;
    }
    var p = estado.vista === 'proyecto' ? porSlug(estado.slug) : null;
    /* Al cambiar de pieza o pestaña se conserva dónde estaba cada zona con scroll y si la ficha estaba abierta. */
    var zonas = ['.proyecto__datos', '.tabs', '.minis'];
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
    ficha = cuerpo.querySelector('.proyecto__ficha');
    if (ficha && conservarScroll && estado.ficha != null) ficha.open = estado.ficha;
    antes.forEach(function (v, n) {
      var e = cuerpo.querySelector(zonas[n]); if (e && v) { e.scrollTop = v[0]; e.scrollLeft = v[1]; }
    });
    if (!conservarScroll) {
      var activa = cuerpo.querySelector('.tab[aria-selected="true"]');
      if (activa && activa.scrollIntoView) activa.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
    var miniActual = cuerpo.querySelector('.mini[aria-current="true"]');
    if (miniActual && miniActual.scrollIntoView) miniActual.scrollIntoView({ block: 'nearest', inline: 'nearest' });
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
    estado.vista = r.vista; estado.slug = r.slug; estado.sec = 0; estado.pieza = 0;
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
    var t = e.target.closest('[data-sec],[data-pieza],[data-mover]');
    if (!t) return;
    if (t.dataset.sec != null) { estado.sec = +t.dataset.sec; estado.pieza = 0; pintar(true); }
    else if (t.dataset.pieza != null) { estado.pieza = +t.dataset.pieza; pintar(true); }
    else { mover(+t.dataset.mover); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && estado.vista) { location.hash = ''; return; }
    if (estado.vista !== 'proyecto' || e.altKey || e.metaKey || e.ctrlKey) return;
    if (e.target && /^(INPUT|TEXTAREA|VIDEO)$/.test(e.target.tagName)) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); mover(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); mover(-1); }
  });

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
