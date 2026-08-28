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
    var panelsWrap = document.querySelector(".portfolio-panels");
    var activeTab = tabs[0];
    var TRANSITION_MS = 250; /* debe coincidir con --dur-slow en css/style.css */

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

    /* Cambia que grilla se ve. En vez de un salto seco, la que entra
       viene con un slide+fade desde un lado y la que sale se va para el
       otro -- la direccion depende de si la pestana nueva esta a la
       derecha o a la izquierda de la que estaba activa, asi que "Sound
       -> Audiovisual" y "Audiovisual -> Sound" van cada uno para su lado.
       skipAnim se usa solo en la carga inicial de la pagina, donde no
       hay "de donde" venir todavia. */
    function selectPortfolio(name, skipAnim) {
      var targetTab = tabs.filter(function (t) { return t.dataset.portfolioTarget === name; })[0];
      if (!targetTab || (targetTab === activeTab && !skipAnim)) return;

      var oldTab = activeTab;
      var oldPanel = document.getElementById(oldTab.getAttribute("aria-controls"));
      var forward = tabs.indexOf(targetTab) > tabs.indexOf(oldTab);

      tabs.forEach(function (tab) {
        var active = tab === targetTab;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      activeTab = targetTab;
      positionThumb(activeTab, skipAnim);

      var newPanel = document.getElementById(targetTab.getAttribute("aria-controls"));
      if (!newPanel) return;

      if (skipAnim || !panelsWrap || reduceMotion.matches) {
        if (oldPanel && oldPanel !== newPanel) oldPanel.hidden = true;
        newPanel.hidden = false;
        observeReveals(newPanel);
        return;
      }

      if (oldPanel === newPanel) return;

      /* Arranca la grilla nueva ya visible pero corrida hacia el lado de
         "entrada" y transparente, sin transicion todavia (asi no anima
         este primer salto) -- forzar el reflow confirma ese punto de
         partida antes de que, un frame despues, se le saque el
         corrimiento CON la transicion prendida: ahi es donde se ve el
         slide+fade. A la vieja se le hace lo mismo pero al lado opuesto. */
      panelsWrap.classList.add("is-transitioning");
      newPanel.hidden = false;
      newPanel.classList.add(forward ? "is-offset-r" : "is-offset-l");
      void newPanel.offsetWidth;

      requestAnimationFrame(function () {
        newPanel.classList.remove("is-offset-r", "is-offset-l");
        if (oldPanel) oldPanel.classList.add(forward ? "is-offset-l" : "is-offset-r");
      });

      observeReveals(newPanel);

      window.setTimeout(function () {
        if (oldPanel) {
          oldPanel.hidden = true;
          oldPanel.classList.remove("is-offset-l", "is-offset-r");
        }
        panelsWrap.classList.remove("is-transitioning");
      }, TRANSITION_MS);
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () { selectPortfolio(tab.dataset.portfolioTarget); });
    });

    /* Un link viejo a #audiovisual (por ejemplo, de un buscador) abre
       directo en esa pestana en vez de la de Sound. */
    if (currentHash() === "audiovisual") selectPortfolio("audiovisual", true);
    else positionThumb(activeTab, true);

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
     6. SCROLL FORZADO: REEL / SELECTED WORKS / CONTACT (SOLO ESCRITORIO)
     Tercera version de esto. La primera (requestAnimationFrame con una
     curva a mano) peleaba contra "scroll-behavior: smooth". La segunda
     (scrollIntoView + limites en pixeles, despues con un candado
     "isSnapping" liberado por el evento "scrollend") corrigio esos
     bugs pero termino con la rueda sin responder igual: un trackpad
     real no manda un solo evento "wheel" por gesto sino decenas, con
     inercia que sigue mandando eventos un buen rato despues de que el
     dedo ya se levanto -- y esos eventos tardios, llegando justo
     cuando "isSnapping" recien se habia liberado, se leian como un
     pedido nuevo y disparaban otro salto no pedido.

     Se probo tambien reemplazar todo esto por scroll-snap NATIVO del
     navegador (scroll-snap-type/scroll-snap-align en CSS, sin JS) --
     soluciona lo de la rueda trabada de raiz porque el motor de scroll
     nativo ya sabe absorber la inercia de un trackpad, pero el
     "asentamiento" final de ese scroll-snap no se sintio tan fluido
     como el scrollIntoView({behavior:"smooth"}) de la version anterior
     (Chrome no siempre le aplica la misma curva suave). Como la
     prioridad es que se sienta igual de fluido que antes, se volvio a
     scrollIntoView -- pero con el problema de la inercia resuelto de
     otra forma: en vez de tratar de detectar el instante exacto en que
     termina la animacion (con "scrollend", propenso a la carrera con
     eventos tardios), hay un enfriamiento (cooldown) de tiempo fijo
     que arranca apenas se dispara un salto y dura mas que la animacion
     Y que la cola tipica de inercia de un trackpad -- mientras dura,
     cualquier "wheel" se ignora (se le hace preventDefault igual, para
     que tampoco se cuele scroll libre por encima). Al ser un simple
     "todavia no paso tanto tiempo", no depende de que ningun evento
     del navegador se dispare para liberarse: no se puede quedar
     trabado.

     OJO -- esto vale SOLO para la pagina de inicio, y hay que forzarlo a
     mano (isHomePage, mas abajo). El sitio es de una sola pagina real:
     cada "proyecto" es un <section class="page"> del mismo index.html que
     el router muestra/esconde (ver punto 1), asi que este listener de
     "wheel", que esta colgado de window, sigue vivo tambien mientras se
     mira un proyecto. Ahi #projects y #contact estan escondidos (hidden),
     asi que su offsetTop es 0, todo matchea como "estoy en el reel", y
     cualquier scroll hacia abajo terminaba haciendo preventDefault() y
     pidiendole scrollIntoView() a un elemento invisible: no pasaba nada
     de nada, la rueda quedaba muerta y NINGUNA pagina de proyecto se
     podia scrollear (era eso, y no un problema de alto de la grilla de
     Selected Works, lo que estaba realmente roto). */

  var heroEl = document.querySelector(".hero");
  var projectsEl = document.getElementById("projects");
  var contactEl = document.getElementById("contact");

  if (heroEl && projectsEl && contactEl && !reduceMotion.matches) {
    function navClearance() {
      var root = getComputedStyle(document.documentElement);
      var pxPerRem = parseFloat(root.fontSize) || 16;
      var navH = (parseFloat(root.getPropertyValue("--nav-h")) || 4.5) * pxPerRem;
      var gap = (parseFloat(root.getPropertyValue("--sp-4")) || 1) * pxPerRem;
      return navH + gap;
    }

    /* En vez de un tiempo de espera fijo despues de cada salto (versiones
       anteriores probaron 900ms, despues 550ms), esto chequea la POSICION
       real para decidir si el scroll "ya llego": mientras todavia esta en
       pleno vuelo (ni cerca del reel, ni de Selected Works, ni de Contact)
       un "wheel" en la direccion CONTRARIA a la que ya se esta animando se
       ignora, exactamente como antes -- eso es lo que evita el bug viejo
       de la rueda trabada (una reversa a mitad de camino interrumpiendo el
       salto en curso). Pero un "wheel" en la MISMA direccion en la que ya
       se esta animando no espera a que termine de asentar: redirige el
       salto en curso directo al siguiente tramo. Asi, scrolleando fuerte y
       seguido, el reel pasa a Selected Works y de ahi a Contact en una
       sola tirada, sin el "freno-pausa-freno" de antes entre los dos
       saltos; scrolleando de a poco (un solo tirón, se suelta, se espera),
       cada tramo se asienta antes de que el siguiente wheel decida hacia
       donde ir, e igual se sigue frenando en cada seccion de a una.

       MIN_LOCK_MS aparte es solo para blindar el primerisimo instante de
       cada salto: recien llamado a scrollIntoView(), el navegador todavia
       no repinto ni un frame, asi que window.scrollY leido en ese instante
       puede seguir marcando la posicion VIEJA -- sin este colchon corto,
       un segundo evento de wheel llegando en la misma tanda que el primero
       podria colarse como si el scroll ya hubiese terminado, cuando en
       realidad recien esta arrancando. */
    var MIN_LOCK_MS = 120;
    /* No tan chico como parece necesario: las posiciones de abajo se
       calculan solo con navClearance() (altura de la barra fija), pero el
       punto donde el scroll REALMENTE queda quieto tambien depende de
       "scroll-margin-top" de cada seccion (#projects tiene el suyo propio,
       -8px, ver css/style.css) -- que este calculo no conoce. Con una
       tolerancia de 6px eso alcanzaba a dejar a #projects justo AFUERA del
       margen (una diferencia real y medida de 8px), asi que nunca se volvia
       a reconocer como "asentado" ahi -- efectivamente trababa la rueda
       para siempre despues del primer salto. 24px cubre esa diferencia con
       margen de sobra sin arriesgarse a confundir un punto con otro (las
       tres secciones estan a cientos de pixeles de distancia entre si). */
    var SNAP_TOLERANCE_PX = 24;
    var animationStartedAt = 0;

    /* ZONES en orden de scroll (arriba a abajo). currentIndex es la zona
       en la que se esta, O la que se esta animando en este momento --
       animDirection es hacia donde. Guardar el INDICE (no re-derivarlo de
       window.scrollY cada vez) es lo que permite redirigir un salto en
       vuelo hacia el siguiente tramo sin tener que esperar a que la
       posicion real "llegue" a ningun lado. */
    var ZONES = [heroEl, projectsEl, contactEl];

    function restingZoneIndex() {
      var clearance = navClearance();
      var y = window.scrollY;
      var positions = [0, projectsEl.offsetTop - clearance, contactEl.offsetTop - clearance];
      for (var i = 0; i < positions.length; i++) {
        if (Math.abs(y - positions[i]) < SNAP_TOLERANCE_PX) return i;
      }
      return -1;
    }

    var currentIndex = Math.max(0, restingZoneIndex());
    var animDirection = 0;

    function snapTo(targetIndex) {
      animDirection = targetIndex > currentIndex ? 1 : -1;
      currentIndex = targetIndex;
      ZONES[targetIndex].scrollIntoView({ behavior: "smooth", block: "start" });
      animationStartedAt = Date.now();
    }

    /* Ver la advertencia grande al principio de esta seccion: sin esto,
       este listener deja sin scroll a todas las paginas de proyecto. Al
       volver al inicio se vuelve a sincronizar currentIndex, porque el
       router pudo haber dejado el scroll en cualquier lado (por ejemplo
       "Back" desde un proyecto entra directo a Selected Works). */
    var isHomePage = true;
    document.addEventListener("page:change", function (e) {
      isHomePage = e.detail.id === homeId;
      if (isHomePage) currentIndex = Math.max(0, restingZoneIndex());
    });

    window.addEventListener("wheel", function (e) {
      if (!isHomePage) return;
      if (window.innerWidth <= 900) return;
      if (Date.now() - animationStartedAt < MIN_LOCK_MS) { e.preventDefault(); return; }

      var direction = e.deltaY > 0 ? 1 : -1;
      var restingAt = restingZoneIndex();

      if (restingAt === -1) {
        /* En pleno vuelo. Misma direccion que el salto en curso: seguir
           de largo al siguiente tramo (si hay uno) en vez de esperar a
           que este termine de asentar -- esto es lo "interrumpible".
           Direccion contraria: se ignora, igual que siempre (ahi es
           donde se evitaba el bug de la rueda trabada). */
        e.preventDefault();
        if (direction === animDirection) {
          var next = currentIndex + direction;
          if (next >= 0 && next <= 2) snapTo(next);
        }
        return;
      }

      /* Asentado de verdad: la logica de siempre, de a un tramo por vez,
         en las dos direcciones -- ya no hay tramo libre entre Selected
         Works y Contact. Contact hacia abajo (footer, etc.) y Reel hacia
         arriba quedan libres a proposito: no hay un cuarto/menos-uno punto
         al que engancharse en esos casos, ninguna rama de abajo matchea. */
      if (direction > 0 && restingAt < 2) {
        e.preventDefault();
        snapTo(restingAt + 1);
      } else if (direction < 0 && restingAt > 0) {
        e.preventDefault();
        snapTo(restingAt - 1);
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

    function evaluateBackToReel() {
      var eligible = contactIntersecting || projectsHalfwayReached();
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

    backToReel.addEventListener("click", function () {
      heroSection.scrollIntoView({
        behavior: reduceMotion.matches ? "auto" : "smooth",
        block: "start"
      });
    });
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
     Arranque
     ====================================================================== */

  route(true);
  observeReveals(document);
})();
