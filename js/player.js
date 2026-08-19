/* ==========================================================================
   IAN IACONO — SOUND PORTFOLIO
   player.js — reproductor de video propio

   Lo usan el reel del inicio (en las dos versiones) y los videos del feed
   de la Version B. Que hace cada uno:
     · No se descarga hasta que estas por llegar a el (asi la pagina abre rapido)
     · Arranca solo cuando entra en pantalla y se pausa cuando sale
     · Tiene dos controles y nada mas: silencio si/no, y la linea de tiempo
     · Solo un video puede tener sonido a la vez

   No hace falta tocar este archivo para cambiar textos ni videos.
   ========================================================================== */

(function () {
  "use strict";

  var players = Array.prototype.slice.call(document.querySelectorAll(".player"));
  if (!players.length) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var isTouch = window.matchMedia("(hover: none)").matches;

  /* ---------------------------------------------------------------------
     Utilidades
     --------------------------------------------------------------------- */

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

  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) seconds = 0;
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  /* Recorre los reproductores ya armados (players guarda elementos del DOM,
     y cada uno lleva su objeto de control en la propiedad .player) */
  function eachPlayer(fn) {
    players.forEach(function (root) {
      if (root.player) fn(root.player);
    });
  }

  /* Silencia todos los videos menos el que se pidio dejar con sonido */
  function soloAudio(keep) {
    eachPlayer(function (p) {
      if (p.video !== keep && !p.video.muted) p.setMuted(true);
    });
  }


  /* ---------------------------------------------------------------------
     Carga diferida: el archivo de video se pide recien cuando te acercas
     --------------------------------------------------------------------- */

  var lazyObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          if (entry.target.player) load(entry.target.player);
          lazyObserver.unobserve(entry.target);
        });
      }, { rootMargin: "150% 0px" })
    : null;

  function load(p) {
    if (p.loaded) return;
    p.loaded = true;
    var src = p.video.dataset.src;
    if (src) {
      p.video.src = src;
      p.video.load();
    }
  }


  /* ---------------------------------------------------------------------
     Reproduccion automatica solo mientras el video se ve en pantalla
     --------------------------------------------------------------------- */

  var playObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var p = entry.target.player;
          if (!p) return;
          p.inView = entry.isIntersecting && entry.intersectionRatio >= 0.5;
          sync(p);
        });
      }, { threshold: [0, 0.5, 0.75] })
    : null;

  function sync(p) {
    /* Si la persona pidio menos movimiento, no arrancamos nada solos */
    if (reduceMotion.matches) return;

    if (p.inView && !p.pageHidden) {
      load(p);
      var promise = p.video.play();
      if (promise && promise.catch) promise.catch(function () { /* el navegador lo bloqueo: no pasa nada */ });
    } else if (!p.video.paused) {
      p.video.pause();
    }
  }


  /* ---------------------------------------------------------------------
     Armado de cada reproductor
     --------------------------------------------------------------------- */

  players.forEach(function (root) {
    var video  = root.querySelector("video");
    var mute   = root.querySelector(".player__mute");
    var scrub  = root.querySelector(".player__scrub");
    var time   = root.querySelector(".player__time");
    if (!video) return;

    var p = {
      root: root,
      video: video,
      loaded: false,
      inView: false,
      pageHidden: false,
      scrubbing: false
    };
    root.player = p;
    video.player = p;

    /* Arranca siempre en silencio: es la unica forma de que los navegadores
       permitan la reproduccion automatica */
    video.muted = true;
    video.setAttribute("playsinline", "");

    if (isTouch) root.classList.add("is-touch");

    /* --- Silencio si / no --- */
    p.setMuted = function (value) {
      video.muted = value;
      if (mute) {
        mute.setAttribute("aria-pressed", String(!value));
        mute.setAttribute("aria-label", value ? "Activar sonido" : "Silenciar");
      }
    };
    p.setMuted(true);

    if (mute) {
      mute.addEventListener("click", function () {
        var turningOn = video.muted;
        p.setMuted(!video.muted);
        if (turningOn) {
          soloAudio(video);
          /* Al dar sonido, si estaba pausado por politica del navegador, arranca */
          var promise = video.play();
          if (promise && promise.catch) promise.catch(function () {});
        }
      });
    }

    /* --- Linea de tiempo --- */
    function paint() {
      if (!scrub || !isFinite(video.duration) || video.duration <= 0) return;
      var ratio = video.currentTime / video.duration;
      if (!p.scrubbing) scrub.value = String(Math.round(ratio * 1000));
      scrub.style.setProperty("--progress", (ratio * 100).toFixed(2) + "%");
      scrub.setAttribute("aria-valuetext", formatTime(video.currentTime) + " de " + formatTime(video.duration));
      if (time) time.textContent = formatTime(video.currentTime) + " / " + formatTime(video.duration);
    }

    if (scrub) {
      scrub.addEventListener("input", function () {
        p.scrubbing = true;
        if (isFinite(video.duration)) {
          video.currentTime = (Number(scrub.value) / 1000) * video.duration;
        }
        scrub.style.setProperty("--progress", (Number(scrub.value) / 10).toFixed(2) + "%");
      });
      scrub.addEventListener("change", function () { p.scrubbing = false; });
      /* Al mover la barra, tambien cargamos el video si todavia no estaba */
      scrub.addEventListener("pointerdown", function () { load(p); });
    }

    video.addEventListener("loadedmetadata", paint);
    video.addEventListener("timeupdate", paint);
    video.addEventListener("durationchange", paint);

    /* Si la persona pidio menos movimiento, el video no arranca solo:
       se le da un click al video para reproducir o pausar */
    if (reduceMotion.matches) {
      video.style.cursor = "pointer";
      video.addEventListener("click", function () {
        load(p);
        if (video.paused) video.play().catch(function () {});
        else video.pause();
      });
    }

    /* El reel de la primera pantalla se conecta despues de que la pagina
       termino de cargar: si no, el archivo de video compite con el texto y
       las imagenes, y la pagina tarda en verse. Mientras tanto se ve el poster. */
    var connect = function () {
      if (lazyObserver) lazyObserver.observe(root); else load(p);
      if (playObserver) playObserver.observe(root);
    };
    if (root.hasAttribute("data-hero-main")) afterLoad(connect);
    else connect();

    paint();
  });


  /* ---------------------------------------------------------------------
     Al cambiar de pagina o de pestana, se pausa lo que no se ve
     --------------------------------------------------------------------- */

  document.addEventListener("page:change", function (event) {
    var activePage = event.detail.page;
    eachPlayer(function (p) {
      p.pageHidden = !activePage.contains(p.root);
      if (p.pageHidden) { if (!p.video.paused) p.video.pause(); }
      else sync(p);
    });
  });

  document.addEventListener("visibilitychange", function () {
    eachPlayer(function (p) {
      if (document.hidden) { if (!p.video.paused) p.video.pause(); }
      else sync(p);
    });
  });
})();


/* ==========================================================================
   FONDO BORROSO DEL REEL
   El video grande del fondo es el mismo archivo, agrandado y desenfocado.
   Aca se lo mantiene en el mismo momento que el video principal.
   ========================================================================== */

(function () {
  "use strict";

  var main = document.querySelector("[data-hero-main] video");
  var bg   = document.querySelector("[data-hero-bg]");
  if (!main || !bg) return;

  /* En celulares el fondo no se muestra (lo apaga el CSS): no lo cargamos */
  if (window.matchMedia("(max-width: 768px)").matches) {
    bg.removeAttribute("src");
    return;
  }

  function align(force) {
    if (!isFinite(main.currentTime)) return;
    var drift = Math.abs(bg.currentTime - main.currentTime);
    if (force || drift > 0.35) {
      try { bg.currentTime = main.currentTime; } catch (e) { /* todavia no cargo */ }
    }
  }

  main.addEventListener("play",   function () { bg.play().catch(function () {}); align(true); });
  main.addEventListener("pause",  function () { bg.pause(); });
  main.addEventListener("seeked", function () { align(true); });
  main.addEventListener("timeupdate", function () { align(false); });
  main.addEventListener("loadeddata", function () { bg.load(); });
})();
