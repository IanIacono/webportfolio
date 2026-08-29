/* ==========================================================================
   IAN IACONO — SOUND PORTFOLIO
   main.js

   Hace ocho cosas:
     1. Cambia de pagina cuando cambia el # de la direccion (igual que Carrd)
     2. Hace aparecer los bloques suavemente al hacer scroll
     3. Vuelve solida la barra de arriba cuando bajas
     4. Alterna Sound / Audiovisual Portfolio sin cambiar de pagina (solo
        existe si el HTML trae el bloque [data-portfolio-tabs])
     5. Manda el formulario de contacto sin salir de la pagina
     6. En escritorio, la primera vez que se scrollea hacia abajo viendo
        el reel, fuerza el scroll directo hasta "Selected Works" (con una
        curva propia, mas fluida que el scroll-snap nativo del navegador)
     7. En celular/tablet, centra el boton de sonido de la bienvenida en
        el hueco real entre los links y el video (ver punto 7 mas abajo)
     8. Muestra un boton flotante "volver al reel" mientras se esta
        viendo Contact, que lleva de nuevo arriba del todo con un click

   No hace falta tocar este archivo para cambiar textos ni imagenes.
   ========================================================================== */

(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  /* Respeta la preferencia de "menos movimiento" del sistema operativo */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");


  /* ======================================================================
     1. ROUTER — muestra una pagina por vez segun el # de la direccion
     ====================================================================== */

  var pages = Array.prototype.slice.call(document.querySelectorAll("main > .page"));
  if (!pages.length) return;

  var siteName = document.body.dataset.siteName || "Ian Iacono";
  var homeId = pages[0].id;

  /* Ids que no son paginas sino puntos de la pagina de inicio */
  var anchors = {
    projects: { page: homeId, target: "projects" },
    about: { page: homeId, target: "about" },
    contact: { page: homeId, target: "contact" }
  };

  function pageById(id) {
    for (var i = 0; i < pages.length; i++) if (pages[i].id === id) return pages[i];
    return null;
  }

  function currentHash() {
    return (location.hash || "").replace(/^#/, "").trim();
  }

  function show(id, scrollTargetId, isFirstLoad) {
    var next = pageById(id) || pageById(homeId);
    var wasAlreadyShown = !next.hidden;

    pages.forEach(function (page) {
      var active = page === next;
      page.hidden = !active;
      page.classList.toggle("is-active", active);
    });

    /* Mini animacion de entrada: la pagina que se acaba de mostrar aparece
       con un fade + leve deslizamiento hacia arriba, en vez de aparecer
       de golpe -- pasa lo mismo yendo de home a un proyecto (click en una
       tarjeta) que volviendo de un proyecto a home (Back), porque las dos
       pasan por aca. Solo cuando de verdad cambiamos de pagina (no en la
       carga inicial, ni si ya estabas viendola). */
    if (!isFirstLoad && !wasAlreadyShown && !reduceMotion.matches) {
      next.classList.remove("page-enter");
      void next.offsetWidth; /* fuerza reflow para poder repetir la animacion */
      next.classList.add("page-enter");
    }

    /* El titulo de la pestana del navegador acompana la pagina -- el
       nombre va siempre primero (Ian Iacono — Portfolio / Ian Iacono —
       The Carbon Case), asi la pestana identifica el sitio de un vistazo
       aunque haya varias pestanas abiertas. */
    var pageTitle = next.dataset.title;
    document.title = pageTitle ? siteName + " — " + pageTitle : siteName;

    document.dispatchEvent(new CustomEvent("page:change", { detail: { id: next.id, page: next } }));

    /* Vuelve a preparar las animaciones de entrada de la pagina que se muestra */
    observeReveals(next);

    if (isFirstLoad && !scrollTargetId) return;

    if (scrollTargetId) {
      var target = document.getElementById(scrollTargetId);
      if (target) {
        if (wasAlreadyShown) {
          /* Ya estabas en esta pagina: es un link ancla comun, con scroll
             suave (por ejemplo "Projects" del menu mientras mirás el reel). */
          target.scrollIntoView({
            behavior: reduceMotion.matches ? "auto" : "smooth",
            block: "start"
          });
        } else {
          /* Se acaba de mostrar esta pagina desde otra (por ejemplo "Back"
             en un proyecto): saltar directo, sin pasar un instante por el
             reel y sin animacion — si no, se alcanza a ver un flash del
             reel antes de bajar. Se lee getBoundingClientRect() para forzar
             el layout ahora mismo, antes de que el navegador pinte, y se
             pide "instant" (no "auto") porque el sitio tiene scroll suave
             por CSS: "auto" heredaria ese scroll-behavior y animaria igual. */
          target.getBoundingClientRect();
          target.scrollIntoView({ behavior: "instant", block: "start" });
        }
        return;
      }
    }

    window.scrollTo({ top: 0, behavior: "auto" });

    /* Accesibilidad: manda el foco al titulo de la pagina nueva, para que
       quien navega con teclado o lector de pantalla no quede perdido */
    var heading = next.querySelector("h1, h2");
    if (heading && !isFirstLoad) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  }

  function route(isFirstLoad) {
    var hash = currentHash();

    if (!hash) return show(homeId, null, isFirstLoad);

    if (anchors[hash]) return show(anchors[hash].page, anchors[hash].target, isFirstLoad);

    if (pageById(hash)) return show(hash, null, isFirstLoad);

    /* Un # desconocido no rompe nada: se vuelve al inicio */
    show(homeId, null, isFirstLoad);
  }

  window.addEventListener("hashchange", function () { route(false); });


  /* ======================================================================
     2. ANIMACIONES DE ENTRADA AL SCROLL
     ====================================================================== */

  var revealObserver = null;

  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  }

  function observeReveals(scope) {
    var items = (scope || document).querySelectorAll(".reveal:not(.is-visible)");
    if (!revealObserver) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    items.forEach(function (el) { revealObserver.observe(el); });
  }

  /* Si la persona cambia la preferencia de movimiento en caliente, obedecemos */
  reduceMotion.addEventListener("change", function () {
    if (reduceMotion.matches) {
      document.querySelectorAll(".reveal").forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  });


  /* ======================================================================
     3. BARRA DE ARRIBA
     La marca grande (nombre + subtitulo) solo tiene sentido arriba de
     todo del home -- ahi es una bienvenida, no una barra de navegacion
     todavia. Se encoge a la version chica (links + volumen) apenas se
     scrollea, y tambien en cualquier otra pagina (ahi nunca hay "arriba
     de todo" que valga, asi que arranca encogida directamente).
     ====================================================================== */

  var nav = document.querySelector(".nav");
  if (nav) {
    var navCurrentPage = homeId;
    document.addEventListener("page:change", function (e) {
      navCurrentPage = e.detail.id;
      updateNavMode();
    });

    var ticking = false;
    function updateNavMode() {
      var compact = navCurrentPage !== homeId || window.scrollY > 80;
      nav.classList.toggle("is-stuck", compact);
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        updateNavMode();
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    updateNavMode();

    /* Que seccion esta "activa": el link correspondiente (Showreel,
       Projects o Contact) se subraya solo cuando esa seccion cruza el
       centro de la pantalla -- no apenas asoma un borde, para que no
       titile entre dos si estan cerca.
       Ojo con "document.querySelectorAll" (no "nav.querySelectorAll"):
       los mismos 3 links existen DOS VECES -- la copia de .nav__right
       (siempre en el DOM) y la de .hero__welcome-links (la bienvenida
       movil, ver "07. HERO / REEL" en css/style.css) -- las dos tienen
       que subrayarse juntas, sea cual sea la que este visible en cada
       momento. */
    var spyLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
    var spyTargets = spyLinks
      .map(function (link) {
        var id = (link.getAttribute("href") || "").replace(/^#/, "");
        /* "Showreel" apunta a #home, que es la pagina entera -- no una
           seccion puntual -- asi que en vez de eso se observa .hero (el
           reel), que es a donde ese link en realidad lleva. */
        var el = id === homeId ? document.querySelector(".hero") : (id ? document.getElementById(id) : null);
        return { link: link, el: el };
      })
      .filter(function (t) { return t.el; });

    if (spyTargets.length && "IntersectionObserver" in window) {
      var spyObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          /* forEach, no "el primer match": puede haber mas de un link
             (la copia de .nav__right y la de .hero__welcome-links)
             apuntando al mismo elemento -- las dos se actualizan. */
          spyTargets.forEach(function (t) {
            if (t.el === entry.target) t.link.classList.toggle("is-active", entry.isIntersecting);
          });
        });
      }, { rootMargin: "-40% 0px -40% 0px" });
      spyTargets.forEach(function (t) { spyObserver.observe(t.el); });
    }
  }


  /* ======================================================================
     4. SELECTOR SOUND / AUDIOVISUAL
     Dos botones que alternan cual grilla se ve. No es un cambio de pagina:
     no dispara el router de arriba, no mueve el scroll.
     ====================================================================== */

  var portfolioTabs = document.querySelector("[data-portfolio-tabs]");
  if (portfolioTabs) {
    var tabs = Array.prototype.slice.call(portfolioTabs.querySelectorAll(".portfolio-tab"));
    var thumb = portfolioTabs.querySelector("[data-portfolio-thumb]");
    var projectGrid = document.querySelector("[data-portfolio-grid]");
    var allTiles = projectGrid
      ? Array.prototype.slice.call(projectGrid.querySelectorAll(".tile"))
      : [];
    var activeTab = tabs[0];

    function positionThumb(tab, skipTransition) {
      if (!thumb || !tab) return;
      if (skipTransition) thumb.style.transition = "none";
      thumb.style.width = tab.offsetWidth + "px";
      thumb.style.transform = "translateX(" + tab.offsetLeft + "px)";
      if (skipTransition) {
        void thumb.offsetHeight; /* fuerza reflow antes de reactivar la transicion */
        thumb.style.transition = "";
      }
    }

    /* Antes habia DOS grillas y el selector cambiaba de una a la otra.
       Ahora hay una sola con los diez proyectos (ver index.html) y el
       selector filtra: "all" los muestra todos, y las otras dos dejan
       solo los de su categoria (data-category en cada tarjeta).
       Se esconden con [hidden] y no con una clase: asi tampoco quedan
       en la navegacion por teclado ni para un lector de pantalla, que
       es lo correcto para algo que no se esta mostrando. */
    function selectPortfolio(name, skipAnim) {
      var targetTab = tabs.filter(function (t) { return t.dataset.portfolioTarget === name; })[0];
      if (!targetTab) return;

      tabs.forEach(function (tab) {
        var active = tab === targetTab;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      activeTab = targetTab;
      positionThumb(activeTab, skipAnim);

      allTiles.forEach(function (tile) {
        var show = name === "all" || tile.dataset.category === name;
        tile.hidden = !show;
      });

      /* Las tarjetas que vuelven a aparecer tienen que poder animar su
         entrada otra vez; las que ya se habian mostrado se quedan como
         estan (observeReveals ignora las que ya tienen is-visible). */
      if (projectGrid) observeReveals(projectGrid);

      /* La grilla acaba de cambiar de alto, y de ese alto dependen los
         puntos de enganche del scroll de escritorio (ver punto 6). */
      document.dispatchEvent(new CustomEvent("projects:resize"));
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () { selectPortfolio(tab.dataset.portfolioTarget); });
    });

    /* Un link viejo a #sound o #audiovisual (por ejemplo, de un buscador)
       abre directo con ese filtro puesto; si no, arranca en "all". */
    var startHash = currentHash();
    if (startHash === "sound" || startHash === "audiovisual") selectPortfolio(startHash, true);
    else selectPortfolio("all", true);

    /* Reubica la bolita sin animar si cambia el ancho de las pestanas
       (rotacion de pantalla, resize, o la fuente Alexandria que termina
       de cargar y puede correr el ancho del texto). */
    window.addEventListener("resize", function () { positionThumb(activeTab, true); });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { positionThumb(activeTab, true); });
    }

    /* Bug: si se entra al sitio directo por un link a un proyecto (sin
       pasar por home primero), la home queda "hidden" en ese momento --
       mediciones como offsetWidth/offsetLeft dan 0 en un elemento
       oculto, asi que la bolita se calculaba con ancho 0 y quedaba
       "rota" (el texto de la pestana activa es siempre oscuro, pensado
       para leerse SOBRE la bolita blanca -- sin ella detras, se ve como
       texto negro perdido en el fondo oscuro). Como nada volvia a
       llamar a positionThumb() al volver a home despues (solo pasaba en
       resize o al cargar la fuente), quedaba rota para siempre. Ahora se
       recalcula cada vez que la pagina que se muestra es la que tiene
       las pestanas, para cuando ya esten visibles de verdad. */
    document.addEventListener("page:change", function (e) {
      if (e.detail.page.contains(portfolioTabs)) positionThumb(activeTab, true);
    });
  }


  /* ======================================================================
     5. FORMULARIO DE CONTACTO
     ====================================================================== */
  var contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    /* Respaldo para cuando el fetch de mas abajo no llega a correr (JS
       desactivado, o falla por algun motivo raro): FormSubmit necesita
       una URL absoluta para el redirect de "gracias" (el campo oculto
       "_next") -- no alcanza con una ruta relativa porque el redirect lo
       arma su servidor, no el navegador. Se completa en base a la
       ubicacion actual (origin + pathname) para que funcione igual sin
       hardcodear si el sitio termina viviendo en Vercel, GitHub Pages o
       un dominio propio. */
    var contactNext = contactForm.querySelector('input[name="_next"]');
    if (contactNext) contactNext.value = location.origin + location.pathname + "#contact";

    /* El caso normal: se intercepta el envio y se manda por fetch() al
       endpoint /ajax/ de FormSubmit, que devuelve JSON en vez de
       redirigir -- asi la persona nunca sale de la pagina ni ve
       formsubmit.co, solo el mensajito de data-contact-status. */
    var submitBtn = contactForm.querySelector('button[type="submit"]');
    var status = contactForm.querySelector("[data-contact-status]");
    var btnDefaultText = submitBtn ? submitBtn.textContent : "";

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (submitBtn && submitBtn.disabled) return;

      var ajaxAction = contactForm.action.replace("formsubmit.co/", "formsubmit.co/ajax/");
      var payload = Object.fromEntries(new FormData(contactForm));

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }
      if (status) { status.textContent = ""; status.classList.remove("contact-form__status--error"); }

      fetch(ajaxAction, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (res) { if (!res.ok) throw new Error("bad status"); return res.json(); })
        .then(function () {
          if (status) status.textContent = "Message sent. Thanks for reaching out.";
          contactForm.reset();
        })
        .catch(function () {
          if (status) {
            status.textContent = "Something went wrong. Please try again, or email iaconoian1@gmail.com directly.";
            status.classList.add("contact-form__status--error");
          }
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = btnDefaultText; }
        });
    });
  }


  /* ======================================================================
     6. SCROLL POR SECCIONES (SOLO ESCRITORIO)
     Cuatro paradas: el reel, Selected Works, Sobre mi y Contact. La rueda
     lleva de una a la otra de a una por vez.

     Selected Works es distinta de las demas: con los diez proyectos
     juntos la grilla es mas alta que la pantalla, asi que ahi adentro NO
     hay enganche -- se scrollea libre, como en cualquier pagina. Tiene
     dos bordes:
       - el techo, que es donde se llega viniendo del reel (con el titulo
         "Selected Works" arriba, igual que siempre), y
       - el piso, que deja el final de la seccion apoyado en el borde de
         abajo de la pantalla.
     Entre esos dos bordes la rueda no se toca. Al llegar a un borde el
     scroll FRENA ahi (para no pasarse de largo a Sobre mi sin querer); si
     desde ahi se sigue scrolleando en la misma direccion, recien entonces
     salta a la seccion siguiente.

     Sobre por que nunca se pierde el control de la rueda: en vez de
     recordar "en que seccion estoy", cada evento mira la posicion REAL
     del scroll y decide con eso. Asi, si alguien arrastra la barra de
     scroll del navegador y suelta en cualquier lado -- por ejemplo justo
     entre dos secciones, que antes dejaba la rueda muerta -- el ultimo
     caso de mas abajo igual encuentra la parada mas cercana en la
     direccion en la que se scrollea y va hacia ahi. No hay ningun estado
     guardado que se pueda desincronizar de la pagina. */

  var heroEl = document.querySelector(".hero");
  var projectsEl = document.getElementById("projects");
  var aboutEl = document.getElementById("about");
  var contactEl = document.getElementById("contact");

  if (heroEl && projectsEl && aboutEl && contactEl && !reduceMotion.matches) {
    function navClearance() {
      var root = getComputedStyle(document.documentElement);
      var pxPerRem = parseFloat(root.fontSize) || 16;
      var navH = (parseFloat(root.getPropertyValue("--nav-h")) || 4.5) * pxPerRem;
      var gap = (parseFloat(root.getPropertyValue("--sp-4")) || 1) * pxPerRem;
      return navH + gap;
    }

    /* Las posiciones se calculan con navClearance(), pero donde el scroll
       queda REALMENTE quieto depende ademas del "scroll-margin-top" propio
       de cada seccion (#projects y #about tienen el suyo, ver
       css/style.css). 24px cubre esa diferencia de sobra sin llegar a
       confundir una parada con otra. */
    var SNAP_TOLERANCE_PX = 24;
    /* Cuanto dura, como maximo, un salto. Mientras corre, la rueda no
       arranca otro salto nuevo hacia atras; en la misma direccion si
       encadena (ver mas abajo). Es un tiempo fijo y no un evento del
       navegador a proposito: un tiempo no se puede "no disparar", asi que
       esto no puede quedarse trabado nunca. */
    var SETTLE_MS = 550;

    /* Un scroll seguido (varios eventos con muy poca pausa entre si) cuenta
       como UN gesto. Sirve para el freno de los bordes de Selected Works:
       al llegar a un borde el gesto que llego hasta ahi se da por
       terminado, y recien un gesto NUEVO sigue hacia la seccion
       siguiente. Sin esto, un scroll fuerte se llevaba puesto el freno y
       terminaba en Contact -- que es justo lo que el freno tiene que
       evitar. */
    var GESTURE_GAP_MS = 180;
    var lastWheelAt = 0;
    var edgeStopDir = 0;

    var animStartedAt = 0;
    var animTarget = null;
    var animDir = 0;

    function isAnimating() { return Date.now() - animStartedAt < SETTLE_MS; }

    /* Las cuatro paradas, en orden de scroll. Se recalculan en cada uso:
       la grilla cambia de alto al filtrar por categoria, y la ventana
       puede cambiar de tamano. */
    function stops() {
      var c = navClearance();
      var projectsTop = projectsEl.offsetTop - c;
      /* El piso deja el final de la seccion pegado al borde de abajo de la
         pantalla. Si la grilla llegara a entrar entera (filtrada, o en una
         pantalla muy alta) el piso queda por ENCIMA del techo -- de ahi el
         Math.max: en ese caso las dos paradas son la misma y no hay tramo
         libre, que es exactamente lo que corresponde. */
      var projectsBottom = Math.max(
        projectsTop,
        projectsEl.offsetTop + projectsEl.offsetHeight - window.innerHeight
      );
      return {
        hero: 0,
        projectsTop: projectsTop,
        projectsBottom: projectsBottom,
        about: aboutEl.offsetTop - c,
        contact: contactEl.offsetTop - c
      };
    }

    function orderedStops(s) {
      return [s.hero, s.projectsTop, s.projectsBottom, s.about, s.contact];
    }

    function snapTo(y, dir) {
      animTarget = y;
      animDir = dir;
      animStartedAt = Date.now();
      window.scrollTo({ top: y, behavior: "smooth" });
    }

    /* La parada siguiente a "from" yendo en direccion "dir". */
    function stopAfter(list, from, dir) {
      if (dir > 0) {
        for (var i = 0; i < list.length; i++) if (list[i] > from + 1) return list[i];
      } else {
        for (var j = list.length - 1; j >= 0; j--) if (list[j] < from - 1) return list[j];
      }
      return null;
    }

    window.addEventListener("wheel", function (e) {
      if (window.innerWidth <= 900) return;
      /* Adentro de un proyecto esto no corre: #projects, #about y #contact
         viven en la pagina de inicio, que ahi esta escondida (display:none),
         y lo escondido mide 0 -- todas las paradas darian casi cero y la
         rueda quedaba peleando contra una parada que no existe, dejando la
         pagina del proyecto sin scroll. Se mira en vivo y no con
         page:change porque entrando derecho por url (#lumia) ese evento ya
         paso antes de que esta parte se enganche. */
      if (projectsEl.offsetParent === null) return;

      var dir = e.deltaY > 0 ? 1 : -1;
      var now = Date.now();
      var sameGesture = now - lastWheelAt < GESTURE_GAP_MS;
      lastWheelAt = now;
      /* Gesto nuevo: el freno del borde ya se cobro, vuelve a estar libre. */
      if (!sameGesture) edgeStopDir = 0;

      var s = stops();
      var list = orderedStops(s);
      var y = window.scrollY;
      var tol = SNAP_TOLERANCE_PX;

      /* Salto en curso: en la misma direccion sigue de largo a la parada
         siguiente (asi un scroll sostenido no se frena de a un tramo por
         vez); en la contraria se ignora, que es lo que evita que una
         reversa a mitad de camino deje la rueda peleando con el salto. */
      if (isAnimating()) {
        e.preventDefault();
        if (dir === animDir) {
          var chained = stopAfter(list, animTarget, dir);
          if (chained !== null) snapTo(chained, dir);
        }
        return;
      }

      /* --- Adentro de Selected Works: scroll libre, con freno en los bordes --- */
      if (y > s.projectsTop - tol && y < s.projectsBottom + tol) {
        var room = dir > 0 ? s.projectsBottom - y : y - s.projectsTop;
        if (room > tol) {
          /* Hay lugar: no se toca la rueda, scrollea el navegador. Solo se
             frena si ESTE evento se pasaria del borde, para que el freno
             sea exacto y no quede a mitad de camino entre dos secciones.
             Ahi tambien se marca el borde como "ya frenado" para este
             gesto. */
          if (Math.abs(e.deltaY) > room) {
            e.preventDefault();
            window.scrollTo({ top: dir > 0 ? s.projectsBottom : s.projectsTop, behavior: "auto" });
            edgeStopDir = dir;
          }
          return;
        }
        /* Apoyado en un borde. Si el gesto que lo trajo hasta aca todavia
           sigue (inercia del trackpad, o la rueda girando de corrido), se
           queda quieto: eso es el freno. Un gesto nuevo en la misma
           direccion si pasa a la seccion siguiente. */
        e.preventDefault();
        if (edgeStopDir === dir) return;
        snapTo(dir > 0 ? s.about : s.hero, dir);
        return;
      }

      /* --- Paradas de una sola posicion --- */
      if (Math.abs(y - s.hero) < tol) {
        if (dir > 0) { e.preventDefault(); snapTo(s.projectsTop, dir); }
        return; /* hacia arriba desde el reel no hay nada: scroll normal */
      }
      if (Math.abs(y - s.about) < tol) {
        e.preventDefault();
        snapTo(dir > 0 ? s.contact : s.projectsBottom, dir);
        return;
      }
      if (Math.abs(y - s.contact) < tol) {
        /* Hacia abajo queda libre a proposito: ahi esta el pie de pagina. */
        if (dir < 0) { e.preventDefault(); snapTo(s.about, dir); }
        return;
      }

      /* --- En ningun lado conocido --- */
      /* Se llega aca sobre todo arrastrando la barra de scroll del
         navegador y soltando entre dos secciones. Antes esto dejaba la
         rueda sin efecto; ahora se busca la parada mas cercana hacia
         donde se esta scrolleando y se va hacia ella. */
      var target = stopAfter(list, y, dir);
      if (target !== null) {
        e.preventDefault();
        snapTo(target, dir);
      }
    }, { passive: false });
  }



  /* El pie de pagina no es hijo de #contact (es un solo elemento que
     vive despues de <main>, compartido por todas las paginas -- ver
     index.html), asi que CSS no puede restarle su alto solo. Se mide
     con JS y se deja en una variable para que #contact (min-height,
     ver "14. RESPONSIVE" en css/style.css) pueda descontarselo: asi
     "llegar a Contact" con el scroll forzado de arriba muestra el
     formulario Y el pie juntos, el final real de la pagina, en vez de
     dejar el pie una pantalla mas abajo. */
  var siteFooter = document.querySelector(".site-footer");
  if (siteFooter) {
    var setFooterHeightVar = function () {
      document.documentElement.style.setProperty("--footer-h", siteFooter.getBoundingClientRect().height + "px");
    };
    setFooterHeightVar();
    window.addEventListener("resize", setFooterHeightVar);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(setFooterHeightVar);
  }

  /* ======================================================================
     7. CENTRAR EL BOTON DE SONIDO DE LA BIENVENIDA MOVIL (.hero__welcome)
     Tiene que quedar centrado en el hueco real entre el borde de abajo de
     los links (Showreel/Projects/Contact) y el borde de arriba del video
     -- pero ese hueco no se puede calcular con un numero fijo en CSS:
     .hero centra el marco del reel verticalmente en el aire libre que
     sobra (align-items:center, solo en celular/tablet), asi que ese
     borde de arriba se mueve segun el alto de pantalla. Se mide de
     verdad, con getBoundingClientRect(), y se posiciona a mano.
     ====================================================================== */

  var welcomeLinks = document.querySelector(".hero__welcome-links");
  var welcomeAudioWrap = document.querySelector(".hero__welcome-audio-wrap");
  var welcomeBox = document.querySelector(".hero__welcome");
  var welcomeFrame = document.querySelector(".hero__frame");

  if (welcomeLinks && welcomeAudioWrap && welcomeBox && welcomeFrame) {
    var positionWelcomeAudio = function () {
      if (window.innerWidth > 900) return;
      var boxTop = welcomeBox.getBoundingClientRect().top;
      var linksBottom = welcomeLinks.getBoundingClientRect().bottom;
      var frameTop = welcomeFrame.getBoundingClientRect().top;
      var height = frameTop - linksBottom;
      if (height <= 0) return; /* pantalla muy baja: no forzar nada raro */
      welcomeAudioWrap.style.top = (linksBottom - boxTop) + "px";
      welcomeAudioWrap.style.height = height + "px";
    };
    positionWelcomeAudio();
    window.addEventListener("resize", positionWelcomeAudio);
    /* Si la tipografia todavia no cargo, el alto de los links puede
       correrse un poco al terminar de cargar -- se recalcula. */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(positionWelcomeAudio);
    }
  }


  /* ======================================================================
     8. BOTON "VOLVER AL REEL"
     Flotante, abajo a la derecha. Aparece con un respiro (para no
     aparecer de golpe si solo se esta pasando de largo) y desaparece
     apenas deja de cumplirse la condicion, sea porque se subio
     scrolleando o porque se navego a otra pagina.

     Dos condiciones distintas para "mostrar", una por dispositivo:
     - Escritorio: al llegar a Contact (respiro de 700ms).
     - Celular/tablet: al llegar a Contact, IGUAL QUE ARRIBA, o ya desde
       antes -- al pasar la mitad de "Selected Works" (respiro de
       500ms, mas corto porque en celular el scroll hasta ahi ya es
       largo de por si). Projects en celular es una sola columna larga
       de tarjetas, mucho mas alta que la pantalla, asi que a mitad de
       camino tiene sentido ofrecer el atajo. En escritorio "Selected
       Works" entra entera en una pantalla (ver "14. RESPONSIVE"), asi
       que ahi esa condicion nunca llega a cumplirse antes que Contact
       de todos modos -- no hace falta excluirla a mano. */

  var backToReel = document.querySelector(".back-to-reel");
  var contactSection = document.getElementById("contact");
  var projectsSection = document.getElementById("projects");
  var heroSection = document.querySelector(".hero");

  if (backToReel && contactSection && projectsSection && heroSection) {
    var backToReelTimer = null;
    var backToReelEligible = false;
    var contactIntersecting = false;

    function projectsHalfwayReached() {
      if (window.innerWidth > 900) return false;
      var viewportMid = window.scrollY + window.innerHeight / 2;
      var projectsMid = projectsSection.offsetTop + projectsSection.offsetHeight / 2;
      return viewportMid >= projectsMid;
    }

    /* Este boton sube al reel, asi que solo tiene sentido en el inicio.
       Sin este chequeo se quedaba puesto al entrar a un proyecto teniendolo
       en pantalla: #projects queda escondido (display:none) y un elemento
       escondido mide 0, asi que projectsHalfwayReached() comparaba contra
       una mitad de 0 y daba que si para cualquier posicion de scroll. */
    var onHomePage = true;
    document.addEventListener("page:change", function (event) {
      onHomePage = event.detail.id === homeId;
      evaluateBackToReel();
    });

    function evaluateBackToReel() {
      var eligible = onHomePage && (contactIntersecting || projectsHalfwayReached());
      if (eligible === backToReelEligible) return;
      backToReelEligible = eligible;

      if (eligible) {
        if (backToReelTimer === null) {
          var delay = window.innerWidth <= 900 ? 500 : 700;
          backToReelTimer = window.setTimeout(function () {
            backToReel.classList.add("is-visible");
            backToReelTimer = null;
          }, delay);
        }
      } else {
        if (backToReelTimer !== null) {
          window.clearTimeout(backToReelTimer);
          backToReelTimer = null;
        }
        backToReel.classList.remove("is-visible");
      }
    }

    if ("IntersectionObserver" in window) {
      var contactObserver = new IntersectionObserver(function (entries) {
        contactIntersecting = entries[0].isIntersecting;
        evaluateBackToReel();
      }, { threshold: 0 });
      contactObserver.observe(contactSection);
    }

    window.addEventListener("scroll", evaluateBackToReel, { passive: true });
    window.addEventListener("resize", evaluateBackToReel);

    /* Antes esto era un scrollIntoView({behavior:"smooth"}) y en celular
       fallaba justo cuando mas se lo usa: si la pagina venia con inercia
       (el dedo ya se levanto pero sigue deslizandose), esa inercia pisaba
       al scroll pedido y el boton parecia no hacer nada -- solo respondia
       con la pagina completamente quieta.

       Ahora la subida se anima a mano: en cada cuadro se fija la posicion,
       asi no hay nada con lo que competir -- la inercia no puede ganarle a
       algo que se reescribe sesenta veces por segundo. El toque ademas la
       corta de entrada (el scrollTo a la posicion actual, que es un freno
       en seco sin mover nada). */
    var toTopRaf = null;
    var docEl = document.documentElement;

    /* Mientras dura la subida apagamos el scroll suave del CSS. Si no, el
       scrollTo de CADA cuadro arranca su propia animacion del navegador y
       la nuestra termina persiguiendolas: medido, la subida tardaba 1,3s
       y los primeros 0,6s no se movia un pixel -- justo el sintoma de
       "toco y no pasa nada" que esto venia a arreglar. Apagado, los 520ms
       son 520ms y el primer cuadro ya mueve la pagina. */
    var freezeSmooth = function () { docEl.style.scrollBehavior = "auto"; };
    var releaseSmooth = function () { docEl.style.removeProperty("scroll-behavior"); };

    var stopMomentum = function () {
      freezeSmooth();
      window.scrollTo(0, window.scrollY);
      /* Si al toque no le sigue un click (el dedo se fue del boton sin
         soltar ahi), devolvemos el scroll suave en el cuadro siguiente. */
      requestAnimationFrame(function () { if (toTopRaf === null) releaseSmooth(); });
    };

    backToReel.addEventListener("pointerdown", stopMomentum);

    backToReel.addEventListener("click", function () {
      if (toTopRaf !== null) { cancelAnimationFrame(toTopRaf); toTopRaf = null; }
      stopMomentum();

      if (reduceMotion.matches) { window.scrollTo(0, 0); releaseSmooth(); return; }

      var startY = window.scrollY;
      var startedAt = null;
      var DURATION_MS = 520;

      var step = function (now) {
        if (startedAt === null) startedAt = now;
        var k = Math.min(1, (now - startedAt) / DURATION_MS);
        /* Sale rapido y frena al final, como el scroll suave del navegador. */
        var eased = 1 - Math.pow(1 - k, 3);
        window.scrollTo(0, Math.round(startY * (1 - eased)));
        if (k < 1) {
          toTopRaf = requestAnimationFrame(step);
        } else {
          toTopRaf = null;
          releaseSmooth();
        }
      };
      toTopRaf = requestAnimationFrame(step);
    });

    /* Un scroll deliberado a mitad de camino manda: se corta la subida.
       La inercia de ANTES del toque no cuenta, que es la que rompia esto. */
    window.addEventListener("wheel", function () {
      if (toTopRaf !== null) { cancelAnimationFrame(toTopRaf); toTopRaf = null; releaseSmooth(); }
    }, { passive: true });
  }


  /* ======================================================================
     9. BOTONES "BACK"/"NEXT" SIEMPRE A LA MISMA ALTURA (SOLO ESCRITORIO)
     Cada proyecto tiene distinta cantidad de texto, asi que sus botones
     quedaban a alturas distintas: pasando de uno a otro con Next, saltaban
     hasta ~290px. La idea es que todos queden donde los tiene el proyecto
     mas largo (hoy Detras Del Puesto), que es el punto mas bajo.

     El CSS solo no puede resolverlo: los proyectos son secciones que se
     muestran de a una (display:none el resto, ver punto 1), asi que ninguna
     puede "ver" el alto de las otras para igualarse. Y un numero fijo en el
     CSS tampoco alcanza -- el alto que hace falta depende de como se corta
     el texto, y va de 773px en una ventana de 1440 a 1025px en una de 960.

     Asi que se mide con JS: se recorren las diez secciones, se toma el alto
     natural de la columna de texto de cada una y el mayor se deja en la
     variable --project-info-min-h. El CSS le pone ese alto minimo a la
     columna y manda los botones al fondo (ver "10. PAGINAS DE PROYECTO" en
     css/style.css). Si el JS no corre, la variable no existe, el alto
     minimo queda en "auto" y todo se ve como antes: nada se rompe.

     Para medir una seccion escondida hay que darle layout un instante. Se
     la muestra con alto 0, overflow oculto y visibility:hidden: sus hijos
     igual se acomodan con su alto real (que es lo que se lee), pero no
     ocupa espacio ni se llega a pintar, asi que no hay ningun salto. Las
     animaciones de entrada tampoco se disparan: solo se observan las de la
     pagina que se muestra de verdad (observeReveals en el punto 1), asi que
     una seccion que todavia no se visito no tiene ningun observador puesto.
     ====================================================================== */

  var projectPages = pages.filter(function (page) {
    return page.querySelector(".project__info");
  });

  if (projectPages.length) {
    var equalizeActions = function () {
      /* En celular la columna es una sola y se scrollea: igualar alturas
         solo agregaria huecos enormes. El CSS de abajo esta limitado a
         escritorio igual, pero asi tampoco se gasta el trabajo de medir. */
      if (window.innerWidth <= 900) {
        document.documentElement.style.removeProperty("--project-info-min-h");
        return;
      }

      /* Primero en cero: si quedara el valor de la medicion anterior,
         estariamos midiendo el alto que nosotros mismos impusimos, y el
         numero nunca podria volver a bajar. */
      document.documentElement.style.setProperty("--project-info-min-h", "0px");

      var tallest = 0;
      projectPages.forEach(function (page) {
        var info = page.querySelector(".project__info");
        var wasHidden = page.hidden;
        var prevStyle = page.getAttribute("style");

        if (wasHidden) {
          page.hidden = false;
          page.style.height = "0";
          page.style.overflow = "hidden";
          page.style.visibility = "hidden";
        }

        tallest = Math.max(tallest, info.offsetHeight);

        if (wasHidden) {
          page.hidden = true;
          if (prevStyle === null) page.removeAttribute("style");
          else page.setAttribute("style", prevStyle);
        }
      });

      document.documentElement.style.setProperty("--project-info-min-h", tallest + "px");
    };

    equalizeActions();

    /* El texto cambia de alto cuando termina de cargar la tipografia, y
       vuelve a cambiar si se reacomoda la ventana. */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(equalizeActions);

    var equalizeTimer = null;
    window.addEventListener("resize", function () {
      clearTimeout(equalizeTimer);
      equalizeTimer = setTimeout(equalizeActions, 150);
    });
  }


  /* ======================================================================
     10. SELECTOR DE IDIOMA (SOLO CELULAR)
     En escritorio los textos ESP y ENG se ven los dos, uno al lado del
     otro. En una pantalla angosta eso son dos bloques largos uno abajo
     del otro, y hay que scrollear el doble para leer lo mismo. Ahi se
     muestra uno solo -- arranca en ingles -- con un selector chico en el
     lugar donde estaba la etiqueta del idioma: arriba del texto y
     alineado a la izquierda, igual que antes.

     El selector se arma desde JavaScript y no a mano en el HTML porque
     son once bloques iguales (About y los diez proyectos): escrito una
     vez, vale para todos, y si manana se agrega otro proyecto aparece
     solo.

     El cambio de idioma es un fundido y no un corte: primero se apaga el
     texto que estaba, y recien cuando termino de desaparecer se cambia
     cual es el visible y se enciende el otro. Hacer las dos cosas a la
     vez obligaria a superponerlos, y como no miden lo mismo, la seccion
     daria un salto de alto en el medio de la animacion.
     ====================================================================== */

  var FADE_MS = 200; /* debe coincidir con .lang.is-fading en css/style.css */

  Array.prototype.slice.call(document.querySelectorAll(".project__text, .about__cols"))
    .forEach(function (group) {
      var blocks = Array.prototype.slice.call(group.querySelectorAll(".lang[data-lang]"));
      if (blocks.length < 2) return;

      var swap = document.createElement("div");
      swap.className = "lang-switch";

      var buttons = {};
      ["en", "es"].forEach(function (code, i) {
        if (i === 1) {
          /* La rayita larga entre los dos idiomas: es la misma que ya
             tenia la etiqueta al lado del texto, ahora separandolos. */
          var dash = document.createElement("span");
          dash.className = "lang-switch__dash";
          dash.setAttribute("aria-hidden", "true");
          swap.appendChild(dash);
        }
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "lang-switch__btn";
        btn.dataset.lang = code;
        btn.textContent = code === "en" ? "ENG" : "ESP";
        btn.addEventListener("click", function () { setLang(code); });
        buttons[code] = btn;
        swap.appendChild(btn);
      });

      group.insertBefore(swap, group.firstChild);

      var current = "en";

      function paint() {
        ["en", "es"].forEach(function (code) {
          buttons[code].setAttribute("aria-pressed", String(code === current));
        });
      }

      function show(code, animate) {
        blocks.forEach(function (b) {
          var on = b.dataset.lang === code;
          b.hidden = !on;
          if (on && animate) {
            b.classList.add("is-fading");
            void b.offsetWidth; /* fuerza el punto de partida antes de animar */
            b.classList.remove("is-fading");
          }
        });
      }

      function setLang(code) {
        if (code === current) return;
        var leaving = blocks.filter(function (b) { return b.dataset.lang === current; })[0];
        current = code;
        paint();
        if (!leaving || reduceMotion.matches) { show(code, false); return; }
        leaving.classList.add("is-fading");
        window.setTimeout(function () {
          leaving.classList.remove("is-fading");
          show(code, true);
        }, FADE_MS);
      }

      /* Estado inicial. El [hidden] lo pone el JS y no el HTML a proposito:
         si el JavaScript no llegara a correr, se ven los dos textos --
         que es lo que pasaba antes y se lee perfecto. */
      show(current, false);
      paint();

      /* En escritorio se muestran los dos, asi que hay que deshacer el
         [hidden] al pasar de un ancho al otro (rotar el telefono, o
         agrandar la ventana). El CSS se encarga de esconder el selector
         y de volver a mostrar las etiquetas. */
      var narrow = window.matchMedia("(max-width: 900px)");
      var syncToWidth = function () {
        if (narrow.matches) show(current, false);
        else blocks.forEach(function (b) { b.hidden = false; });
      };
      syncToWidth();
      narrow.addEventListener("change", syncToWidth);
    });


  /* ======================================================================
     Arranque
     ====================================================================== */

  route(true);
  observeReveals(document);
})();
