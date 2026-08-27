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
     trabado. */

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

    /* Cubre la animacion en si (unos 400-600ms tipico para un salto de
       una pantalla entera) mas un colchon generoso para la cola de
       inercia de un trackpad real. Si algun dia esto se vuelve a sentir
       trabado o, al reves, tarda de mas en responder a un scroll nuevo
       genuino, este es el numero para ajustar. */
    var WHEEL_COOLDOWN_MS = 900;
    var cooldownUntil = 0;

    function snapTo(el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      cooldownUntil = Date.now() + WHEEL_COOLDOWN_MS;
    }

    window.addEventListener("wheel", function (e) {
      if (window.innerWidth <= 900) return;
      if (Date.now() < cooldownUntil) { e.preventDefault(); return; }

      var clearance = navClearance();
      var y = window.scrollY;
      var projectsSnap = projectsEl.offsetTop - clearance;
      var contactSnap = contactEl.offsetTop - clearance;

      /* Los 3 tramos (reel / Selected Works / Contact) quedan enganchados
         de a pares, en las dos direcciones -- ya no hay tramo libre
         entre Selected Works y Contact. Una vez "adentro" de Contact de
         verdad, scrollear mas para abajo (footer, etc.) si queda libre:
         no hay un cuarto punto al que engancharse. */
      if (e.deltaY > 0 && y < projectsSnap - 4) {
        /* Reel, para abajo: a Selected Works. */
        e.preventDefault();
        snapTo(projectsEl);
      } else if (e.deltaY > 0 && y >= projectsSnap - 4 && y < contactSnap - 4) {
        /* Selected Works, para abajo: a Contact. */
        e.preventDefault();
        snapTo(contactEl);
      } else if (e.deltaY < 0 && y >= contactSnap - 4) {
        /* Contact (o mas abajo), para arriba: frena en Selected Works --
           nunca salta directo al reel de un salto. Si se sigue
           scrolleando para arriba una vez ahi, la rama de abajo es la
           que despues sí lleva al reel. */
        e.preventDefault();
        snapTo(projectsEl);
      } else if (e.deltaY < 0 && y >= projectsSnap - 4 && y < contactSnap - 4) {
        /* Selected Works, para arriba: al reel. */
        e.preventDefault();
        snapTo(heroEl);
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
     Arranque
     ====================================================================== */

  route(true);
  observeReveals(document);
})();
