/* ==========================================================================
   IAN IACONO — SOUND PORTFOLIO
   player.js — reproduccion de video propio

   Maneja dos cosas:
     1. El reel del inicio: arranca solo cuando esta a la vista, se pausa
        cuando sale de pantalla, y tiene una linea de tiempo para saltar
        a un momento concreto.
     2. La grilla de proyectos (Version B): el video de cada tarjeta arranca
        al pasar el mouse (o al enfocarla con el teclado) y se detiene al
        sacarlo.

   El sonido lo decide siempre audio.js (el control del header). Este
   archivo solo se encarga de que, en cada momento, a lo sumo UN video este
   sonando: el que este "en foco" (el reel mientras se ve, o la tarjeta que
   se esta mirando).

   No hace falta tocar este archivo para cambiar textos ni videos.
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) seconds = 0;
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  /* Corre la funcion cuando la pagina ya cargo y el navegador esta libre.
     Sirve para no pelear con la carga inicial: el reel pesa varios MB. */
  function afterLoad(fn) {
    var run = function () {
      if ("requestIdleCallback" in window) window.requestIdleCallback(fn, { timeout: 2000 });
      else setTimeout(fn, 250);
    };
    if (document.readyState === "complete") run();
    else window.addEventListener("load", run, { once: true });
  }


  /* ======================================================================
     FOCO DE SONIDO
     Solo un video puede sonar a la vez. "Enfocar" un video lo vuelve el
     candidato a sonar (si el header no esta silenciado); "desenfocarlo"
     lo devuelve a mudo. audio.js decide el volumen real.
     ====================================================================== */

  var focused = null;

  function applyAudio(video, isFocused) {
    var bus = window.AudioBus;
    var on = isFocused && bus && !bus.muted;
    video.muted = !on;
    if (bus) video.volume = bus.volume;
  }

  function focusVideo(video) {
    if (focused === video) return;
    if (focused) applyAudio(focused, false);
    focused = video;
    applyAudio(video, true);
  }

  function blurVideo(video) {
    if (focused !== video) return;
    applyAudio(video, false);
    focused = null;
  }

  if (window.AudioBus) {
    window.AudioBus.subscribe(function () {
      if (focused) applyAudio(focused, true);
    });
  }


  /* ======================================================================
     REEL DEL INICIO
     ====================================================================== */

  var hero = document.querySelector("[data-hero-main] video");

  if (hero) {
    var heroRoot = hero.closest(".player");
    var scrub = heroRoot.querySelector(".player__scrub");
    var time = heroRoot.querySelector(".player__time");
    var heroLoaded = false;
    var heroInView = false;

    /* En celular no hay "hover": la barra de controles queda siempre
       visible, si no nadie encontraria la linea de tiempo. */
    if (window.matchMedia("(hover: none)").matches) heroRoot.classList.add("is-touch");

    var heroLoad = function () {
      if (heroLoaded) return;
      heroLoaded = true;
      var src = hero.dataset.src;
      if (src) { hero.src = src; hero.load(); }
    };

    var paintHero = function () {
      if (!scrub || !isFinite(hero.duration) || hero.duration <= 0) return;
      var ratio = hero.currentTime / hero.duration;
      if (document.activeElement !== scrub) scrub.value = String(Math.round(ratio * 1000));
      scrub.style.setProperty("--progress", (ratio * 100).toFixed(2) + "%");
      scrub.setAttribute("aria-valuetext", formatTime(hero.currentTime) + " de " + formatTime(hero.duration));
      if (time) time.textContent = formatTime(hero.currentTime) + " / " + formatTime(hero.duration);
    };

    if (scrub) {
      scrub.addEventListener("input", function () {
        if (isFinite(hero.duration)) hero.currentTime = (Number(scrub.value) / 1000) * hero.duration;
        scrub.style.setProperty("--progress", (Number(scrub.value) / 10).toFixed(2) + "%");
      });
      scrub.addEventListener("pointerdown", heroLoad);
    }

    hero.addEventListener("loadedmetadata", paintHero);
    hero.addEventListener("timeupdate", paintHero);
    hero.addEventListener("durationchange", paintHero);

    var heroObserver = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        heroInView = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        if (reduceMotion.matches) return;
        if (heroInView) {
          heroLoad();
          var pr = hero.play();
          if (pr && pr.catch) pr.catch(function () {});
          focusVideo(hero);
        } else {
          if (!hero.paused) hero.pause();
          blurVideo(hero);
        }
      });
    }, { threshold: [0, 0.5] }) : null;

    /* Se conecta despues del load: si no, el archivo de video compite con
       el texto y las imagenes, y la pagina tarda en verse. */
    afterLoad(function () {
      if (heroObserver) heroObserver.observe(heroRoot);
      else { heroLoad(); hero.play().catch(function () {}); }
    });

    /* Si la persona pidio menos movimiento, el reel no arranca solo:
       un click sobre el video lo reproduce o lo pausa. */
    if (reduceMotion.matches) {
      hero.style.cursor = "pointer";
      hero.addEventListener("click", function () {
        heroLoad();
        if (hero.paused) { hero.play().catch(function () {}); focusVideo(hero); }
        else { hero.pause(); blurVideo(hero); }
      });
    }

    /* Fondo borroso del hero: el mismo video, agrandado y desenfocado,
       siguiendo siempre el mismo momento que el video principal. */
    (function () {
      var bg = document.querySelector("[data-hero-bg]");
      if (!bg) return;
      if (window.matchMedia("(max-width: 768px)").matches) { bg.removeAttribute("src"); return; }

      function align(force) {
        if (!isFinite(hero.currentTime)) return;
        var drift = Math.abs(bg.currentTime - hero.currentTime);
        if (force || drift > 0.35) {
          try { bg.currentTime = hero.currentTime; } catch (e) { /* todavia no cargo */ }
        }
      }
      hero.addEventListener("play", function () { bg.play().catch(function () {}); align(true); });
      hero.addEventListener("pause", function () { bg.pause(); });
      hero.addEventListener("seeked", function () { align(true); });
      hero.addEventListener("timeupdate", function () { align(false); });
      hero.addEventListener("loadeddata", function () { bg.load(); });
    })();
  }


  /* ======================================================================
     GRILLA CON VISTA PREVIA AL PASAR EL MOUSE  (Version B)
     Cada tarjeta tiene su propio <video>. No se descarga hasta el primer
     hover o enfoque, arranca ahi mismo, y se detiene al salir.
     ====================================================================== */

  var hoverLinks = Array.prototype.slice.call(document.querySelectorAll(".hovercard__link"));

  hoverLinks.forEach(function (link) {
    var video = link.querySelector(".hovercard__video");
    if (!video) return;
    var loaded = false;

    var load = function () {
      if (loaded) return;
      loaded = true;
      var src = video.dataset.src;
      if (src) { video.src = src; video.load(); }
    };

    var enter = function () {
      if (reduceMotion.matches) return;
      load();
      var pr = video.play();
      if (pr && pr.catch) pr.catch(function () {});
      focusVideo(video);
    };

    var leave = function () {
      if (!video.paused) video.pause();
      try { video.currentTime = 0; } catch (e) {}
      blurVideo(video);
      link.classList.remove("is-playing");
    };

    video.addEventListener("playing", function () { link.classList.add("is-playing"); });

    /* El mouse dispara la vista previa; el toque en celular no (ahi se
       navega directo al tocar, como es de esperar en un telefono). */
    link.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") enter(); });
    link.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") leave(); });

    /* Enfocar la tarjeta con el teclado hace lo mismo que pasarle el mouse,
       para que la vista previa tambien este disponible sin mouse. */
    link.addEventListener("focus", enter);
    link.addEventListener("blur", leave);
  });


  /* ======================================================================
     Pausar todo lo que no se ve al cambiar de pagina o de pestana
     ====================================================================== */

  document.addEventListener("page:change", function (event) {
    var activePage = event.detail.page;

    if (hero && !activePage.contains(hero)) {
      if (!hero.paused) hero.pause();
      blurVideo(hero);
    }
    hoverLinks.forEach(function (link) {
      var v = link.querySelector(".hovercard__video");
      if (v && !v.paused) {
        v.pause();
        try { v.currentTime = 0; } catch (e) {}
        blurVideo(v);
        link.classList.remove("is-playing");
      }
    });
  });

  document.addEventListener("visibilitychange", function () {
    if (!hero || reduceMotion.matches) return;
    if (document.hidden) {
      if (!hero.paused) hero.pause();
    } else if (heroInView) {
      var pr = hero.play();
      if (pr && pr.catch) pr.catch(function () {});
      focusVideo(hero);
    }
  });
})();
