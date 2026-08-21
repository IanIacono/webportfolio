/* ==========================================================================
   IAN IACONO — SOUND PORTFOLIO
   main.js

   Hace cuatro cosas:
     1. Cambia de pagina cuando cambia el # de la direccion (igual que Carrd)
     2. Hace aparecer los bloques suavemente al hacer scroll
     3. Vuelve solida la barra de arriba cuando bajas
     4. Alterna Sound / Audiovisual Portfolio sin cambiar de pagina (solo
        existe si el HTML trae el bloque [data-portfolio-tabs])

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
    projects: { page: homeId, target: "projects" }
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

    /* El titulo de la pestana del navegador acompana la pagina */
    var pageTitle = next.dataset.title;
    document.title = pageTitle ? pageTitle + " — " + siteName : siteName;

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
     3. BARRA DE ARRIBA — se vuelve solida al bajar
     ====================================================================== */

  var nav = document.querySelector(".nav");
  if (nav) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        nav.classList.toggle("is-stuck", window.scrollY > 24);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }


  /* ======================================================================
     4. SELECTOR SOUND / AUDIOVISUAL
     Dos botones que alternan cual grilla se ve. No es un cambio de pagina:
     no dispara el router de arriba, no mueve el scroll.
     ====================================================================== */

  var portfolioTabs = document.querySelector("[data-portfolio-tabs]");
  if (portfolioTabs) {
    var tabs = Array.prototype.slice.call(portfolioTabs.querySelectorAll(".portfolio-tab"));

    function selectPortfolio(name) {
      tabs.forEach(function (tab) {
        var active = tab.dataset.portfolioTarget === name;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
        var panel = document.getElementById(tab.getAttribute("aria-controls"));
        if (panel) {
          panel.hidden = !active;
          if (active) observeReveals(panel);
        }
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () { selectPortfolio(tab.dataset.portfolioTarget); });
    });

    /* Un link viejo a #audiovisual (por ejemplo, de un buscador) abre
       directo en esa pestana en vez de la de Sound. */
    if (currentHash() === "audiovisual") selectPortfolio("audiovisual");
  }


  /* ======================================================================
     Arranque
     ====================================================================== */

  route(true);
  observeReveals(document);
})();
