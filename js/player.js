/* ==========================================================================
   IAN IACONO — SOUND PORTFOLIO
   player.js — reproduccion de video propio

   Maneja cuatro cosas:
     1. El reel del inicio (Version A): arranca solo al entrar en pantalla,
        con su fondo sincronizado y borroso, y linea de tiempo.
     2. El carrusel del inicio (Version B): flechas, puntos, play/pausa,
        linea de tiempo, y el "Ver mas" que aparece a los pocos segundos.
     3. Las tarjetas de las grillas (las dos versiones): el video de cada
        proyecto arranca al pasar el mouse o enfocarla con el teclado.
     4. El foco de sonido: a lo sumo un video suena a la vez. El sonido en
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
     CARRUSEL DEL INICIO  (solo Version B)
     ====================================================================== */

  var carousel = document.querySelector("[data-carousel]");

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".carousel__slide"));
    var frame = carousel.querySelector(".carousel__frame");
    var prevBtn = carousel.querySelector("[data-carousel-prev]");
    var nextBtn = carousel.querySelector("[data-carousel-next]");
    var dots = Array.prototype.slice.call(carousel.querySelectorAll(".carousel__dot"));
    var playBtn = carousel.querySelector("[data-carousel-playpause]");
    var scrub = carousel.querySelector("[data-carousel-scrub]");
    var timeEl = carousel.querySelector("[data-carousel-time]");
    var controlsBar = carousel.querySelector(".player__controls");

    if (isTouch && controlsBar) controlsBar.classList.add("is-touch");

    var current = 0;
    var activeVideo = null;
    var inView = false;
    var userPaused = false;
    var moreTimer = null;

    function videoOf(s) { return s.querySelector(".carousel__video"); }
    function auraOf(s) { var a = s.querySelector(".aura__video"); return a; }

    function paintPlayPause(playing) {
      if (!playBtn) return;
      playBtn.setAttribute("aria-pressed", String(playing));
      playBtn.setAttribute("aria-label", playing ? "Pausar" : "Reproducir");
    }

    function paintScrub() {
      var v = activeVideo;
      if (!v || !scrub || !isFinite(v.duration) || v.duration <= 0) return;
      var ratio = v.currentTime / v.duration;
      if (document.activeElement !== scrub) scrub.value = String(Math.round(ratio * 1000));
      scrub.style.setProperty("--progress", (ratio * 100).toFixed(2) + "%");
      scrub.setAttribute("aria-valuetext", formatTime(v.currentTime) + " de " + formatTime(v.duration));
      if (timeEl) timeEl.textContent = formatTime(v.currentTime) + " / " + formatTime(v.duration);
    }

    function playActive() {
      var v = activeVideo, a = auraOf(slides[current]);
      if (!v) return;
      loadEl(v); loadEl(a);
      focusVideo(v);
      /* El boton recien muestra "reproduciendo" cuando el video realmente
         arranco: si el navegador bloquea el play(), no queremos un boton
         de pausa mintiendo sobre un video que sigue quieto. */
      var pr = v.play();
      if (pr && pr.then) {
        pr.then(function () { paintPlayPause(true); }).catch(function () { paintPlayPause(false); });
      } else {
        paintPlayPause(true);
      }
      if (a) { var pr2 = a.play(); if (pr2 && pr2.catch) pr2.catch(function () {}); }
    }

    function pauseActive() {
      var v = activeVideo, a = auraOf(slides[current]);
      if (v && !v.paused) v.pause();
      if (a && !a.paused) a.pause();
      if (v) blurVideo(v);
      paintPlayPause(false);
    }

    function goTo(index) {
      index = (index + slides.length) % slides.length;
      if (index === current && activeVideo) return;

      var prevSlide = slides[current];
      if (prevSlide) {
        var pv = videoOf(prevSlide), pa = auraOf(prevSlide);
        if (pv && !pv.paused) pv.pause();
        if (pa && !pa.paused) pa.pause();
        if (pv) blurVideo(pv);
        prevSlide.classList.remove("is-active", "show-more");
        clearTimeout(moreTimer);
      }

      current = index;
      var next = slides[current];
      next.classList.add("is-active");
      activeVideo = videoOf(next);

      dots.forEach(function (d, i) { d.setAttribute("aria-selected", String(i === current)); });

      loadEl(activeVideo);
      loadEl(auraOf(next));

      if (!reduceMotion.matches && inView && !userPaused) playActive();
      else paintPlayPause(false);

      /* "Ver mas" aparece recien despues de unos segundos mirando el proyecto */
      moreTimer = setTimeout(function () { next.classList.add("show-more"); }, 2700);

      paintScrub();
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(current + 1); });
    dots.forEach(function (d, i) { d.addEventListener("click", function () { goTo(i); }); });

    if (playBtn) {
      playBtn.addEventListener("click", function () {
        if (activeVideo && activeVideo.paused) { userPaused = false; playActive(); }
        else { userPaused = true; pauseActive(); }
      });
    }

    if (scrub) {
      scrub.addEventListener("input", function () {
        var v = activeVideo;
        if (v && isFinite(v.duration)) v.currentTime = (Number(scrub.value) / 1000) * v.duration;
        scrub.style.setProperty("--progress", (Number(scrub.value) / 10).toFixed(2) + "%");
      });
      scrub.addEventListener("pointerdown", function () { loadEl(activeVideo); });
    }

    slides.forEach(function (s) {
      var v = videoOf(s);
      var repaint = function () { if (s.classList.contains("is-active")) paintScrub(); };
      v.addEventListener("timeupdate", repaint);
      v.addEventListener("loadedmetadata", repaint);
      v.addEventListener("durationchange", repaint);
    });

    /* Se pausa solo cuando el carrusel sale de pantalla, y se retoma al
       volver (salvo que lo hayas pausado vos con el boton). */
    var carouselObserver = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        inView = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        if (reduceMotion.matches) return;
        if (inView && !userPaused) playActive();
        else if (!inView) pauseActive();
      });
    }, { threshold: [0, 0.5] }) : null;

    afterLoad(function () {
      goTo(0);
      if (carouselObserver) carouselObserver.observe(frame);
      else { inView = true; playActive(); }
    });

    document.addEventListener("page:change", function (event) {
      if (!event.detail.page.contains(carousel) && activeVideo && !activeVideo.paused) pauseActive();
    });

    document.addEventListener("visibilitychange", function () {
      if (reduceMotion.matches) return;
      if (document.hidden) {
        if (activeVideo && !activeVideo.paused) pauseActive();
      } else if (inView && !userPaused) {
        playActive();
      }
    });
  }


  /* ======================================================================
     TARJETAS DE PROYECTO  (grillas de las dos versiones)
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
     REEL DEL INICIO  (solo Version A)
     Arranca solo cuando esta a la vista, se pausa al salir de pantalla, y
     tiene una linea de tiempo para saltar a un momento concreto. El sonido
     lo decide siempre el control del header.
     ====================================================================== */

  var hero = document.querySelector("[data-hero-main] video");

  if (hero) {
    var heroRoot = hero.closest(".player");
    var heroControls = heroRoot.querySelector(".player__controls");
    var heroScrub = heroRoot.querySelector(".player__scrub");
    var heroTime = heroRoot.querySelector(".player__time");
    var heroLoaded = false;
    var heroInView = false;

    /* En celular no hay "hover": la barra de controles queda siempre
       visible, si no nadie encontraria la linea de tiempo. */
    if (isTouch && heroControls) heroControls.classList.add("is-touch");

    var heroLoad = function () {
      if (heroLoaded) return;
      heroLoaded = true;
      loadEl(hero);
    };

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

    if (reduceMotion.matches) {
      hero.style.cursor = "pointer";
      hero.addEventListener("click", function () {
        heroLoad();
        if (hero.paused) { hero.play().catch(function () {}); focusVideo(hero); }
        else { hero.pause(); blurVideo(hero); }
      });
    }

    document.addEventListener("page:change", function (event) {
      if (!event.detail.page.contains(hero)) {
        if (!hero.paused) hero.pause();
        blurVideo(hero);
      }
    });

    document.addEventListener("visibilitychange", function () {
      if (reduceMotion.matches) return;
      if (document.hidden) {
        if (!hero.paused) hero.pause();
      } else if (heroInView) {
        var pr = hero.play();
        if (pr && pr.catch) pr.catch(function () {});
        focusVideo(hero);
      }
    });

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
})();
