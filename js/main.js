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
       selector filtra por la categoria de cada tarjeta (data-category).
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
        tile.hidden = tile.dataset.category !== name;
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

    /* Un link a #sound o #audiovisual (por ejemplo, de un buscador) abre
       directo con ese filtro puesto; si no, arranca en Sound, que es la
       primera pestana. */
    var startHash = currentHash();
    if (startHash === "audiovisual") selectPortfolio(startHash, true);
    else selectPortfolio("sound", true);

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
     Cinco paradas, en este orden:
       1. el reel,
       2. Selected Works con el titulo arriba,
       3. Selected Works con el ultimo proyecto apoyado en el borde de
          abajo de la pantalla,
       4. Sobre mi,
       5. Contact.
     La rueda lleva de una a la otra de a UNA por vez. No hay tramo
     libre en ningun lado: Selected Works no entra en una pantalla, y en
     vez de scrollearse libre entre sus dos bordes son dos paradas mas,
     como cualquier otra.

     Un salto en curso no bloquea la rueda: scrollear rapido no obliga a
     esperar a que cada salto termine, el siguiente engancha en el acto y
     arranca desde donde el anterior iba a terminar. Lo que si se cuida es
     que un solo tiron de trackpad -- que es una rafaga larga de eventos y
     no uno -- no se lleve puestas todas las paradas: cuenta el primer
     evento de cada gesto, y despues uno cada tanto mientras el scroll
     siga. Cuanto mas fuerte y sostenido, mas paradas cubre.

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
       arranca ninguno nuevo. Es un tiempo fijo y no un evento del
       navegador a proposito: un tiempo no se puede "no disparar", asi que
       esto no puede quedarse trabado nunca. */
    var SETTLE_MS = 550;

    /* Un tiron de trackpad no es un evento: es una rafaga que sigue
       llegando sola mientras la inercia se apaga, y puede durar mas que
       un salto entero. Para que esa rafaga cuente como UN scroll y no
       como varios, un salto nuevo pide que la rueda haya estado quieta un
       momento: mientras los eventos vienen pegados, son el mismo gesto.

       La segunda condicion es para el mouse de rueda, que girando de
       corrido manda eventos sin pausa nunca: pasado MAX_HOLD_MS desde el
       ultimo salto se avanza igual, asi girar sin parar sigue bajando en
       vez de quedar clavado en una parada. */
    var GESTURE_GAP_MS = 180;
    /* Scrolleando sin parar (la rueda girando de corrido, o dos dedos
       arrastrando) no hay pausa nunca, asi que no alcanza con el gap: se
       avanza otra parada cada tanto. Cuanto mas corto, mas rapido baja un
       scroll sostenido. */
    var HOLD_STEP_MS = 350;
    /* Debajo de esto los eventos ya son la inercia apagandose sola, no
       alguien scrolleando: no cuentan para lo de arriba. */
    var LIVE_DELTA = 4;
    var lastWheelAt = 0;
    var lastJumpAt = 0;

    var animStartedAt = 0;
    var animTarget = 0;

    function isAnimating() { return Date.now() - animStartedAt < SETTLE_MS; }

    /* Las CINCO paradas, en orden de scroll: el reel, Selected Works con
       el titulo arriba, Selected Works con el ultimo proyecto abajo,
       About y Contact. Se recalculan en cada uso: la grilla cambia de
       alto al filtrar por categoria, y la ventana puede cambiar de
       tamano. */
    function stops() {
      var c = navClearance();
      var projectsTop = projectsEl.offsetTop - c;
      /* El piso deja el final de la seccion pegado al borde de abajo de la
         pantalla, o sea el ultimo proyecto abajo de todo. Si la grilla
         llegara a entrar entera (filtrada por Audiovisual, que son tres,
         o en una pantalla muy alta) el piso quedaria por ENCIMA del techo
         -- de ahi el Math.max: ahi las dos paradas son la misma, y
         orderedStops se queda con una sola. */
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

    /* Las paradas en orden, sin repetidas: dos paradas en el mismo lugar
       (Selected Works cuando entra entera en la pantalla) dejarian un
       salto que no mueve nada y se comeria un tiron de rueda. */
    function orderedStops(s) {
      var all = [s.hero, s.projectsTop, s.projectsBottom, s.about, s.contact];
      var out = [];
      for (var i = 0; i < all.length; i++) {
        if (!out.length || all[i] - out[out.length - 1] > 1) out.push(all[i]);
      }
      return out;
    }

    function snapTo(y) {
      animStartedAt = lastJumpAt = Date.now();
      animTarget = y;
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

    /* En cual de las paradas estamos parados, si es que en alguna. La
       tolerancia cubre la diferencia entre la posicion calculada y donde
       el scroll queda realmente quieto (cada seccion tiene su propio
       "scroll-margin-top", ver css/style.css). */
    function stopIndexAt(list, y) {
      for (var i = 0; i < list.length; i++) {
        if (Math.abs(y - list[i]) <= SNAP_TOLERANCE_PX) return i;
      }
      return -1;
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
      var newGesture = now - lastWheelAt > GESTURE_GAP_MS;
      lastWheelAt = now;

      /* Un salto en curso NO bloquea la rueda: si bloqueara, scrollear
         rapido obligaria a esperar a que cada salto termine antes de que
         el siguiente arranque, y se siente trabado. Un scroll nuevo
         engancha en el acto y sale desde donde el salto iba a terminar,
         no desde donde la pagina esta en este instante -- que es un lugar
         de paso y no una parada. */
      var from = isAnimating() ? animTarget : window.scrollY;

      var list = orderedStops(stops());
      var here = stopIndexAt(list, from);

      /* Parados en una parada: se pasa a la de al lado. Si no hay (arriba
         del reel, o debajo de Contact) la rueda queda libre -- abajo de
         Contact esta el pie de pagina y ahi el scroll es normal.
         Si no estamos en ninguna (tipico de arrastrar la barra de scroll
         del navegador y soltar entre dos secciones) se va a la mas
         cercana hacia donde apunta la rueda. */
      var target = here >= 0 ? list[here + dir] : stopAfter(list, from, dir);
      if ((target === undefined || target === null) && !isAnimating()) return;

      /* De aca en adelante la rueda es nuestra: aunque este evento no
         mueva nada, dejarlo pasar scrollearia la pagina a mano por encima
         del salto. */
      e.preventDefault();

      /* Un tiron de trackpad es una rafaga larga de eventos, no uno: si
         cada uno avanzara una parada, un solo tiron se llevaria puestas
         todas. Cuenta el primero de cada gesto (los que llegan despues de
         una pausa), y mientras el scroll siga sin pausas, uno mas cada
         HOLD_STEP_MS -- asi cuanto mas fuerte y sostenido el scroll, mas
         paradas cubre, pero nunca de golpe. */
      var deliberate = newGesture ||
        (Math.abs(e.deltaY) >= LIVE_DELTA && now - lastJumpAt >= HOLD_STEP_MS);
      if (!deliberate) return;
      if (target === undefined || target === null) return;

      snapTo(target);
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
       fallaba justo cuando mas se lo usa: si la pagina venia deslizandose
       sola (el dedo ya se levanto pero sigue andando), ese envion pisaba
       al scroll pedido y el boton parecia no hacer nada.

       Ahora la subida se anima a mano: en cada cuadro se fija la posicion,
       asi no hay nada con lo que competir -- el envion no puede ganarle a
       algo que se reescribe sesenta veces por segundo. */
    var toTopRaf = null;
    var rideStartedAt = 0;
    var touchStartedY = 0;
    var docEl = document.documentElement;

    /* Mientras dura la subida apagamos el scroll suave del CSS. Si no, el
       scrollTo de CADA cuadro arranca su propia animacion del navegador y
       la nuestra termina persiguiendolas: medido, la subida tardaba 1,3s
       y los primeros 0,6s no se movia un pixel. Apagado, los 520ms son
       520ms y el primer cuadro ya mueve la pagina. */
    var freezeSmooth = function () { docEl.style.scrollBehavior = "auto"; };
    var releaseSmooth = function () { docEl.style.removeProperty("scroll-behavior"); };

    var cancelRide = function () {
      if (toTopRaf !== null) { cancelAnimationFrame(toTopRaf); toTopRaf = null; }
      releaseSmooth();
    };

    var rideToTop = function () {
      /* Un mismo toque puede llegar por dos caminos (el toque y el click
         que viene despues): el segundo no tiene que reiniciar la subida. */
      if (Date.now() - rideStartedAt < 700) return;
      rideStartedAt = Date.now();
      if (toTopRaf !== null) { cancelAnimationFrame(toTopRaf); toTopRaf = null; }

      freezeSmooth();
      window.scrollTo(0, window.scrollY); /* freno en seco, sin mover nada */

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
    };

    /* En el celular la subida arranca con el TOQUE y no con el click.
       Cuando la pagina viene deslizandose sola, el navegador se queda con
       el primer toque para frenarla y el click nunca llega al boton: por
       eso la flecha seguia sin responder justo en pleno scroll, que es
       cuando mas se la usa. El toque si llega. Con mouse se sigue
       esperando el click, que es lo normal -- deja arrepentirse soltando
       el boton afuera. */
    backToReel.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse") {
        freezeSmooth();
        window.scrollTo(0, window.scrollY);
        requestAnimationFrame(function () { if (toTopRaf === null) releaseSmooth(); });
        return;
      }
      touchStartedY = e.clientY;
      rideToTop();
    });
    /* Safari sin eventos de puntero: el mismo camino por touch. */
    backToReel.addEventListener("touchstart", function (e) {
      if (e.touches && e.touches[0]) touchStartedY = e.touches[0].clientY;
      rideToTop();
    }, { passive: true });

    /* Si el dedo se arrastra en vez de tocar, no era un toque: se cancela.
       Se mide contra donde empezo y no cuadro a cuadro porque el dedo
       quieto no se mueve aunque la pagina si. */
    var dragAway = function (y) {
      if (toTopRaf !== null && Math.abs(y - touchStartedY) > 12) cancelRide();
    };
    backToReel.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") dragAway(e.clientY);
    });
    backToReel.addEventListener("touchmove", function (e) {
      if (e.touches && e.touches[0]) dragAway(e.touches[0].clientY);
    }, { passive: true });

    backToReel.addEventListener("click", rideToTop);

    /* Un scroll deliberado a mitad de camino manda: se corta la subida.
       El envion de ANTES del toque no cuenta, que es el que rompia esto. */
    window.addEventListener("wheel", function () {
      if (toTopRaf !== null) cancelRide();
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

  /* Los dos numeros de abajo tienen que coincidir con .lang y con
     .is-lang-sliding en css/style.css. */
  var SLIDE_MS = 300;
  var SLIDE_PX = 24;

  Array.prototype.slice.call(document.querySelectorAll(".project__text, .about__cols"))
    .forEach(function (group) {
      var blocks = Array.prototype.slice.call(group.querySelectorAll(".lang[data-lang]"));
      if (blocks.length < 2) return;

      var swap = document.createElement("div");
      swap.className = "lang-switch";

      var buttons = {};
      ["en", "es"].forEach(function (code) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "lang-switch__btn";
        btn.dataset.lang = code;
        btn.textContent = code === "en" ? "ENG" : "ESP";
        buttons[code] = btn;
        swap.appendChild(btn);
      });

      /* La pastilla ENTERA es el control, no cada palabra por su cuenta:
         un toque en cualquier parte de ella cambia al otro idioma. Antes
         habia que acertarle a "ENG" o a "ESP", y son dos palabras de
         once pixeles con cuatro de aire alrededor -- errarle era lo
         normal. Es un interruptor de dos posiciones: no hace falta
         elegir a cual se va, solo hay una.
         El click va en el contenedor y no en cada boton porque asi el
         toque cuenta igual en el borde, en el hueco del medio o en
         cualquiera de las dos palabras (desde los botones el click
         burbujea hasta aca, asi que el teclado sigue andando igual). */
      swap.addEventListener("click", function () {
        setLang(current === "en" ? "es" : "en");
      });

      group.insertBefore(swap, group.firstChild);

      var current = "en";
      var animating = false;
      var settleTimer = null;

      function paint() {
        ["en", "es"].forEach(function (code) {
          buttons[code].setAttribute("aria-pressed", String(code === current));
        });
      }

      function byLang(code) {
        return blocks.filter(function (b) { return b.dataset.lang === code; })[0];
      }

      function showOnly(code) {
        blocks.forEach(function (b) { b.hidden = b.dataset.lang !== code; });
      }

      /* Deja el bloque como estaba: sin alto fijo, sin nada fuera de
         flujo y sin clases de animacion. Corre al terminar el cambio, y
         tambien al arrancar uno nuevo si el anterior seguia a mitad de
         camino (dos toques seguidos). */
      function settle() {
        if (settleTimer !== null) { window.clearTimeout(settleTimer); settleTimer = null; }
        group.classList.remove("is-lang-sliding");
        group.style.height = "";
        blocks.forEach(function (b) {
          b.classList.remove("is-lang-off");
          b.style.position = "";
          b.style.top = "";
          b.style.left = "";
          b.style.width = "";
          b.style.removeProperty("--lang-slide");
        });
        showOnly(current);
        animating = false;
      }

      /* El cambio de idioma es un deslizamiento y no un corte. Los dos
         textos se mueven para el MISMO lado -- de ingles a espanol, los
         dos hacia la izquierda; de espanol a ingles, los dos hacia la
         derecha -- asi se lee como un solo movimiento y no como dos
         cosas sueltas pasando a la vez.

         Para que puedan cruzarse, el que se va sale del flujo clavado
         donde estaba y el que entra ocupa su lugar. Eso deja al bloque
         midiendo el alto NUEVO, que casi nunca es el mismo (el mismo
         texto en dos idiomas no ocupa lo mismo): por eso el alto se
         anima tambien, y asi los videos y embeds de mas abajo acompanan
         el cambio en vez de aparecer de golpe mas arriba o mas abajo. */
      function setLang(code) {
        if (code === current) return;
        if (animating) settle();

        var leaving = byLang(current);
        var entering = byLang(code);
        var dir = code === "es" ? -1 : 1;

        current = code;
        paint();

        if (!narrow.matches || reduceMotion.matches || !leaving || !entering) {
          showOnly(code);
          return;
        }

        animating = true;

        var gRect = group.getBoundingClientRect();
        var lRect = leaving.getBoundingClientRect();
        var startH = Math.round(gRect.height);

        group.classList.add("is-lang-sliding");
        group.style.height = startH + "px";

        leaving.style.top = Math.round(lRect.top - gRect.top) + "px";
        leaving.style.left = Math.round(lRect.left - gRect.left) + "px";
        leaving.style.width = Math.round(lRect.width) + "px";
        leaving.style.position = "absolute";

        /* El que entra se coloca corrido y transparente ANTES de que se
           vea: si no, la animacion arrancaria a mitad de camino. */
        entering.style.setProperty("--lang-slide", (SLIDE_PX * -dir) + "px");
        entering.classList.add("is-lang-off");
        entering.hidden = false;

        /* Cuanto va a medir con el texto nuevo. Se suelta el alto, se
           mide, y se vuelve al de antes para que la animacion tenga de
           donde salir. El corrimiento del que entra no cuenta para esta
           medida: un transform no ocupa lugar. */
        group.style.height = "";
        var endH = Math.round(group.getBoundingClientRect().height);
        group.style.height = startH + "px";
        void group.offsetHeight;

        group.style.height = endH + "px";
        entering.classList.remove("is-lang-off");
        leaving.style.setProperty("--lang-slide", (SLIDE_PX * dir) + "px");
        leaving.classList.add("is-lang-off");

        settleTimer = window.setTimeout(settle, SLIDE_MS + 60);
      }

      /* En escritorio se muestran los dos, asi que hay que deshacer el
         [hidden] al pasar de un ancho al otro (rotar el telefono, o
         agrandar la ventana). El CSS se encarga de esconder el selector
         y de volver a mostrar las etiquetas. */
      var narrow = window.matchMedia("(max-width: 900px)");
      var syncToWidth = function () {
        settle();
        if (narrow.matches) showOnly(current);
        else blocks.forEach(function (b) { b.hidden = false; });
      };

      /* Estado inicial. El [hidden] lo pone el JS y no el HTML a proposito:
         si el JavaScript no llegara a correr, se ven los dos textos --
         que es lo que pasaba antes y se lee perfecto. */
      syncToWidth();
      paint();
      narrow.addEventListener("change", syncToWidth);
    });


  /* ======================================================================
     Arranque
     ====================================================================== */

  route(true);
  observeReveals(document);
})();
