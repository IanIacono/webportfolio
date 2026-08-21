/* ==========================================================================
   IAN IACONO — SOUND PORTFOLIO
   player.js — reproduccion de video propio

   Maneja tres cosas:
     1. El reel del inicio: arranca solo al entrar en pantalla, con su
        fondo sincronizado y borroso, play/pausa y linea de tiempo.
     2. Las tarjetas de la grilla: el video de cada proyecto arranca al
        pasar el mouse o enfocarla con el teclado.
     3. El foco de sonido: a lo sumo un video suena a la vez. El sonido en
        si lo decide siempre audio.js (el control del header); aca solo se
        decide QUE video es "el que esta sonando" en cada momento.

   No hace falta tocar este archivo para cambiar textos ni videos.
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var isTouch = window.matchMedia("(hover: none)").matches;

  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) seconds = 0;
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  /* Corre la funcion cuando la pagina ya cargo y el navegador esta libre.
     Sirve para no pelear con la carga inicial de la pagina. */
  function afterLoad(fn) {
    var run = function () {
      if ("requestIdleCallback" in window) window.requestIdleCallback(fn, { timeout: 2000 });
      else setTimeout(fn, 250);
    };
    if (document.readyState === "complete") run();
    else window.addEventListener("load", run, { once: true });
  }

  function loadEl(v) {
    if (!v || v.src) return;
    var src = v.dataset.src;
    if (src) { v.src = src; v.load(); }
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
     TARJETAS DE PROYECTO  (grilla de la home)
     Cada tarjeta tiene su propio <video>. No se descarga hasta el primer
     hover o enfoque, arranca ahi mismo, y se detiene al salir. El
     resplandor blanco que se ve al pasar el mouse es puro CSS (no
     necesita JavaScript): ver .tile__link:hover .tile__media en el CSS.
     ====================================================================== */

  var tileLinks = Array.prototype.slice.call(document.querySelectorAll(".tile__link"));

  tileLinks.forEach(function (link) {
    var video = link.querySelector(".tile__video");
    if (!video) return;
    var loaded = false;

    var load = function () {
      if (loaded) return;
      loaded = true;
      loadEl(video);
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

    /* Enfocar la tarjeta con el teclado hace lo mismo que pasarle el mouse. */
    link.addEventListener("focus", enter);
    link.addEventListener("blur", leave);
  });

  document.addEventListener("page:change", function (event) {
    var activePage = event.detail.page;
    tileLinks.forEach(function (link) {
      if (activePage.contains(link)) return;
      var v = link.querySelector(".tile__video");
      if (v && !v.paused) { v.pause(); try { v.currentTime = 0; } catch (e) {} blurVideo(v); }
      link.classList.remove("is-playing");
    });
  });


  /* ======================================================================
     REEL DEL INICIO
     Arranca solo cuando esta a la vista, se pausa al salir de pantalla, y
     tiene boton de pausar/reanudar y una linea de tiempo para saltar a un
     momento concreto. El sonido lo decide siempre el control del header.
     ====================================================================== */

  var hero = document.querySelector("[data-hero-main] video");

  if (hero) {
    var heroRoot = hero.closest(".player");
    var heroControls = heroRoot.querySelector(".player__controls");
    var heroPlayBtn = heroRoot.querySelector("[data-hero-playpause]");
    var heroScrub = heroRoot.querySelector(".player__scrub");
    var heroTime = heroRoot.querySelector(".player__time");
    var heroLoaded = false;
    var heroInView = false;
    var heroUserPaused = false;

    /* En celular no hay "hover": la barra de controles queda siempre
       visible, si no nadie encontraria la linea de tiempo. */
    if (isTouch && heroControls) heroControls.classList.add("is-touch");

    var heroLoad = function () {
      if (heroLoaded) return;
      heroLoaded = true;
      loadEl(hero);
    };

    var paintHeroPlayPause = function (playing) {
      if (!heroPlayBtn) return;
      heroPlayBtn.setAttribute("aria-pressed", String(playing));
      heroPlayBtn.setAttribute("aria-label", playing ? "Pausar" : "Reproducir");
    };

    var playHero = function () {
      heroLoad();
      var pr = hero.play();
      if (pr && pr.then) pr.then(function () { paintHeroPlayPause(true); }).catch(function () { paintHeroPlayPause(false); });
      else paintHeroPlayPause(true);
      focusVideo(hero);
    };

    var pauseHero = function () {
      if (!hero.paused) hero.pause();
      blurVideo(hero);
      paintHeroPlayPause(false);
    };

    if (heroPlayBtn) {
      heroPlayBtn.addEventListener("click", function () {
        if (hero.paused) { heroUserPaused = false; playHero(); }
        else { heroUserPaused = true; pauseHero(); }
      });
    }

    /* Pantalla completa: se agranda el marco entero (no solo el <video>),
       asi los controles propios (pausa, linea de tiempo) siguen andando
       arriba del video en vez de perderse detras de los del navegador. */
    var heroFrame = heroRoot.closest(".hero__frame");
    var heroFsBtn = heroRoot.querySelector("[data-hero-fullscreen]");
    if (heroFsBtn && heroFrame && (heroFrame.requestFullscreen || heroFrame.webkitRequestFullscreen)) {
      heroFsBtn.addEventListener("click", function () {
        var current = document.fullscreenElement || document.webkitFullscreenElement;
        if (current === heroFrame) {
          if (document.exitFullscreen) document.exitFullscreen();
          else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        } else if (heroFrame.requestFullscreen) {
          var pr = heroFrame.requestFullscreen();
          if (pr && pr.catch) pr.catch(function () {});
        } else if (heroFrame.webkitRequestFullscreen) {
          heroFrame.webkitRequestFullscreen();
        }
      });
      var paintFullscreen = function () {
        var active = (document.fullscreenElement || document.webkitFullscreenElement) === heroFrame;
        heroFsBtn.setAttribute("aria-pressed", String(active));
        heroFsBtn.setAttribute("aria-label", active ? "Salir de pantalla completa" : "Pantalla completa");
      };
      document.addEventListener("fullscreenchange", paintFullscreen);
      document.addEventListener("webkitfullscreenchange", paintFullscreen);
    } else if (heroFsBtn) {
      heroFsBtn.hidden = true;
    }

    var paintHero = function () {
      if (!heroScrub || !isFinite(hero.duration) || hero.duration <= 0) return;
      var ratio = hero.currentTime / hero.duration;
      if (document.activeElement !== heroScrub) heroScrub.value = String(Math.round(ratio * 1000));
      heroScrub.style.setProperty("--progress", (ratio * 100).toFixed(2) + "%");
      heroScrub.setAttribute("aria-valuetext", formatTime(hero.currentTime) + " de " + formatTime(hero.duration));
      if (heroTime) heroTime.textContent = formatTime(hero.currentTime) + " / " + formatTime(hero.duration);
    };

    if (heroScrub) {
      heroScrub.addEventListener("input", function () {
        if (isFinite(hero.duration)) hero.currentTime = (Number(heroScrub.value) / 1000) * hero.duration;
        heroScrub.style.setProperty("--progress", (Number(heroScrub.value) / 10).toFixed(2) + "%");
      });
      heroScrub.addEventListener("pointerdown", heroLoad);
    }

    hero.addEventListener("loadedmetadata", paintHero);
    hero.addEventListener("timeupdate", paintHero);
    hero.addEventListener("durationchange", paintHero);

    var heroObserver = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        heroInView = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        if (reduceMotion.matches) return;
        if (heroInView && !heroUserPaused) playHero();
        else if (!heroInView) pauseHero();
      });
    }, { threshold: [0, 0.5] }) : null;

    /* Se conecta despues del load: si no, el archivo de video compite con
       el texto y las imagenes, y la pagina tarda en verse. */
    afterLoad(function () {
      if (heroObserver) heroObserver.observe(heroRoot);
      else if (!heroUserPaused) playHero();
    });

    if (reduceMotion.matches) {
      hero.style.cursor = "pointer";
      hero.addEventListener("click", function () {
        if (hero.paused) { heroUserPaused = false; playHero(); }
        else { heroUserPaused = true; pauseHero(); }
      });
    }

    document.addEventListener("page:change", function (event) {
      if (!event.detail.page.contains(hero)) pauseHero();
    });

    document.addEventListener("visibilitychange", function () {
      if (reduceMotion.matches) return;
      if (document.hidden) {
        if (!hero.paused) hero.pause();
      } else if (heroInView && !heroUserPaused) {
        playHero();
      }
    });

    /* Fondo borroso del hero: el mismo video, agrandado y desenfocado,
       siguiendo siempre el mismo momento que el video principal.

       Antes la correccion se disparaba con "timeupdate", que el navegador
       tira solo un puñado de veces por segundo — entre corrida y corrida
       los dos videos se podian desalinear un rato y se veia entrecortado,
       sobre todo recien arrancada la pagina (recien al buscar manualmente
       un punto del video se forzaba un realineo y ahi se veia fluido).
       Ahora, mientras el hero esta reproduciendose, se chequea y corrige
       en cada cuadro (requestAnimationFrame), asi los dos quedan
       practicamente pegados todo el tiempo. */
    (function () {
      var bg = document.querySelector("[data-hero-bg]");
      if (!bg) return;
      if (window.matchMedia("(max-width: 768px)").matches) { bg.removeAttribute("src"); return; }

      var rafId = null;

      function align(force) {
        if (!isFinite(hero.currentTime)) return;
        var drift = Math.abs(bg.currentTime - hero.currentTime);
        if (force || drift > 0.08) {
          try { bg.currentTime = hero.currentTime; } catch (e) { /* todavia no cargo */ }
        }
      }

      function tick() {
        align(false);
        rafId = requestAnimationFrame(tick);
      }

      function startSync() {
        if (rafId) return;
        rafId = requestAnimationFrame(tick);
      }

      function stopSync() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
      }

      hero.addEventListener("play", function () { bg.play().catch(function () {}); align(true); startSync(); });
      hero.addEventListener("pause", stopSync);
      hero.addEventListener("ended", stopSync);
      hero.addEventListener("seeked", function () { align(true); });
      hero.addEventListener("loadeddata", function () { bg.load(); });
    })();
  }
})();
