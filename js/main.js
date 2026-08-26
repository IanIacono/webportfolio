/* ==========================================================================
   IAN IACONO — SOUND PORTFOLIO
   main.js

   Hace seis cosas:
     1. Cambia de pagina cuando cambia el # de la direccion (igual que Carrd)
     2. Hace aparecer los bloques suavemente al hacer scroll
     3. Vuelve solida la barra de arriba cuando bajas
     4. Alterna Sound / Audiovisual Portfolio sin cambiar de pagina (solo
        existe si el HTML trae el bloque [data-portfolio-tabs])
     5. Manda el formulario de contacto sin salir de la pagina
     6. En escritorio, la primera vez que se scrollea hacia abajo viendo
        el reel, fuerza el scroll directo hasta "Selected Works" (con una
        curva propia, mas fluida que el scroll-snap nativo del navegador)

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

    /* Que seccion esta "activa": el link correspondiente (Projects o
       Contact) se subraya solo cuando esa seccion cruza el centro de la
       pantalla -- no apenas asoma un borde, para que no titile entre
       las dos si estan cerca. */
    var spyLinks = Array.prototype.slice.call(nav.querySelectorAll(".nav__link"));
    var spyTargets = spyLinks
      .map(function (link) {
        var id = (link.getAttribute("href") || "").replace(/^#/, "");
        /* "Showreel" apunta a #home, que es la pagina entera -- no una
           seccion puntual -- asi que no tiene sentido marcarlo "activo"
           segun el scroll. Se lo deja afuera del observer. */
        return { link: link, el: (id && id !== homeId) ? document.getElementById(id) : null };
      })
      .filter(function (t) { return t.el; });

    if (spyTargets.length && "IntersectionObserver" in window) {
      var spyObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var match = spyTargets.filter(function (t) { return t.el === entry.target; })[0];
          if (match) match.link.classList.toggle("is-active", entry.isIntersecting);
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
     6. SCROLL FORZADO: ENTRE EL REEL Y SELECTED WORKS (SOLO ESCRITORIO)
     Mientras se ve el reel, la rueda del mouse/trackpad hacia abajo no
     scrollea libre: salta directo hasta el arranque de "Selected Works".
     Al reves tambien: scrolleando para arriba mientras se esta dentro de
     Selected Works (todavia sin llegar a Contact), vuelve directo al
     reel. Cruzando hacia Contact (para abajo) o volviendo desde Contact
     hacia Selected Works (para arriba), el scroll es 100% libre -- el
     enganche es unicamente en el limite reel/Selected Works, en los dos
     sentidos, y unicamente en pantallas de mas de 900px.

     Un intento anterior reimplementaba el scroll suave a mano (con
     requestAnimationFrame y una curva propia): se sentia trabado, porque
     el <html> ya tiene "scroll-behavior: smooth" puesto (para los links
     con ancla) y cada llamado de esa animacion terminaba peleando con el
     scroll suave nativo del navegador por encima. Esta version usa
     directamente scrollIntoView(), que es el scroll suave DEL NAVEGADOR
     -- mas robusto y mas fluido de verdad que reinventarlo. */

  var heroEl = document.querySelector(".hero");
  var projectsEl = document.getElementById("projects");
  var contactEl = document.getElementById("contact");

  if (heroEl && projectsEl && !reduceMotion.matches) {
    window.addEventListener("wheel", function (e) {
      if (window.innerWidth <= 900) return;

      var y = window.scrollY;
      var projectsTop = projectsEl.offsetTop;
      var contactTop = contactEl ? contactEl.offsetTop : Infinity;

      if (e.deltaY > 0 && y < projectsTop - 4) {
        /* Todavia en el reel, scrolleando para abajo: salta a Selected Works. */
        e.preventDefault();
        projectsEl.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (e.deltaY < 0 && y >= projectsTop - 4 && y < contactTop - 4) {
        /* Dentro de Selected Works (no llego a Contact todavia),
           scrolleando para arriba: vuelve al reel. */
        e.preventDefault();
        heroEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      /* Cualquier otro caso (ya cruzando hacia/desde Contact) no se toca:
         scroll nativo, libre. */
    }, { passive: false });
  }


  /* ======================================================================
     Arranque
     ====================================================================== */

  route(true);
  observeReveals(document);
})();
