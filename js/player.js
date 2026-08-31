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
      /* En tactil no hay hover posible, asi que esta vista previa nunca
         se ve -- ni vale la pena descargar el video. "focus" puede
         disparar esto igual con un toque (el navegador enfoca el link al
         tocarlo, antes de navegar), asi que el chequeo va aca, no solo en
         el listener de pointerenter de mas abajo. */
      if (reduceMotion.matches || isTouch) return;
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

  /* ======================================================================
     TARJETA CON TITILEO + SONIDO  (hoy solo La Llamada Fatal)
     Es el unico proyecto que no tiene video de hover. En vez de eso, al
     pasar el mouse por su tarjeta la portada titila -- como la luz de un
     tubo que hace contacto flojo -- y suena un fragmento del podcast.

     El titileo se hace por JavaScript y no con una animacion de CSS
     porque tiene que ser IRREGULAR: una animacion es siempre el mismo
     ciclo repitiendose, y a los pocos segundos se le ve el patron. Aca
     cada destello elige un brillo y una duracion al azar, asi que no se
     repite nunca.

     El sonido es un <audio> comun, no un embed de Spotify (que fue el
     primer intento): asi pasa por el mismo control de volumen del header
     que el resto del sitio -- se calla si el sitio esta en silencio y
     sigue la barra de volumen -- y no depende de ningun script de
     terceros ni de los permisos de autoplay de otro dominio.

     El archivo no se pide hasta el primer hover ("preload: none" + load()
     recien ahi), y como en celular no hay hover, nunca se descarga: son
     ~870 KB que el telefono no gasta. */

  var flickerLinks = Array.prototype.slice.call(document.querySelectorAll(".tile__link[data-tile-flicker]"));

  flickerLinks.forEach(function (link) {
    var poster = link.querySelector(".tile__poster");
    if (!poster) return;

    var flickerTimer = null;

    var stopFlicker = function () {
      if (flickerTimer !== null) { clearTimeout(flickerTimer); flickerTimer = null; }
      /* Se borra el estilo puesto a mano para que vuelva a mandar el CSS
         (el brillo normal y el de hover, ver .tile__poster). */
      poster.style.filter = "";
      link.classList.remove("is-flickering");
    };

    var flickerStep = function () {
      /* Un rango angosto a proposito: tiene que leerse como un parpadeo
         de la luz, no como que la imagen cambia de color. */
      var brightness = 0.82 + Math.random() * 0.36;
      poster.style.filter = "saturate(1) brightness(" + brightness.toFixed(3) + ")";
      /* Tiempos tambien al azar: con un intervalo fijo, aunque el brillo
         variara, el ojo igual encuentra el pulso. */
      flickerTimer = window.setTimeout(flickerStep, 35 + Math.random() * 190);
    };

    var startFlicker = function () {
      if (flickerTimer !== null) return;
      link.classList.add("is-flickering");
      flickerStep();
    };

    /* --- Fragmento de audio --- */
    var audioUrl = link.dataset.tileAudio;
    var clip = null;

    var buildClip = function () {
      if (clip || !audioUrl) return;
      clip = new Audio();
      clip.preload = "none";
      clip.loop = true;
      clip.src = audioUrl;
      clip.load();
    };

    var enterTile = function () {
      if (reduceMotion.matches || isTouch) return;
      startFlicker();
      buildClip();
      if (clip) {
        try { clip.currentTime = 0; } catch (e) {}
        var pr = clip.play();
        if (pr && pr.catch) pr.catch(function () {});
        /* Entra al mismo foco de sonido que los videos de las otras
           tarjetas: focusVideo/applyAudio solo tocan .muted y .volume, asi
           que sirven igual para un <audio> que para un <video>. */
        focusVideo(clip);
      }
    };

    var leaveTile = function () {
      stopFlicker();
      if (clip) {
        clip.pause();
        try { clip.currentTime = 0; } catch (e) {}
        blurVideo(clip);
      }
    };

    link.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") enterTile(); });
    link.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") leaveTile(); });
    link.addEventListener("focus", enterTile);
    link.addEventListener("blur", leaveTile);
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
     VIDEOS DE YOUTUBE EN LAS PAGINAS DE PROYECTO
     Un iframe de YouTube sigue sonando de fondo si te vas a otro proyecto
     mientras esta reproduciendose (la seccion vieja solo queda "hidden",
     nunca se destruye). No hay manera de pausarlo desde afuera sin la API
     de YouTube, asi que se lo manda a about:blank al salir -- mismo efecto
     que si la pagina se hubiera cerrado. El src original se guarda en
     data-embed-src y se lo restaura recien al volver a entrar a esa misma
     pagina, nunca antes: estos iframes tienen loading="lazy", y pedirles
     el src real mientras su seccion todavia esta "hidden" (display:none)
     hace que el navegador posponga la carga indefinidamente -- ni siquiera
     se termina pidiendo al volver. Restaurando el src justo cuando la
     seccion ya esta visible (el "page.hidden = false" en main.js corre
     antes de este evento) el navegador lo pide de una, como la primera vez.
     Los de Spotify (.embed--audio) quedan afuera: solo se pidio esto para
     YouTube. */
  document.querySelectorAll(".embed:not(.embed--audio) iframe").forEach(function (frame) {
    frame.dataset.embedSrc = frame.src;
  });

  document.addEventListener("page:change", function (event) {
    var activePage = event.detail.page;
    /* Se busca en el documento AHORA, no una lista guardada al cargar la
       pagina: embed-lazy.js reemplaza estos iframes por una miniatura
       (y recien crea el iframe de verdad al tocarla), asi que una lista
       vieja termina apuntando a elementos que ya no estan en la pagina --
       cambiarles el src no hace absolutamente nada. El data-embed-src que
       se marca arriba solo lo tienen los iframes originales del HTML, asi
       que los que crea embed-lazy.js al tocar la miniatura no matchean y
       quedan afuera a proposito: de esos se encarga el propio
       embed-lazy.js, devolviendolos a su miniatura. */
    document.querySelectorAll(".embed:not(.embed--audio) iframe").forEach(function (frame) {
      var original = frame.dataset.embedSrc;
      if (!original) return;
      if (activePage.contains(frame)) {
        if (frame.src !== original) frame.src = original;
      } else if (frame.src !== "about:blank") {
        frame.src = "about:blank";
      }
    });
  });


  /* ======================================================================
     VIDEOS PROPIOS EN LAS PAGINAS DE PROYECTO
     Los que no vienen de YouTube sino de assets/video/ (hoy los dos de
     Detras Del Puesto). Mismo problema que los iframes de aca arriba: la
     seccion vieja solo queda "hidden", nunca se destruye, asi que un video
     puesto se queda sonando detras al pasar al proyecto siguiente. Con
     estos alcanza con pausarlos -- son elementos nuestros, no un iframe de
     otro dominio -- y se los deja de nuevo en cero para que al volver
     arranquen del principio, igual que los de YouTube al volver a su
     miniatura. Se busca en el documento cada vez y no una lista guardada
     al cargar, para que sirva tambien si algun dia se agrega otro.
     ====================================================================== */

  document.addEventListener("page:change", function (event) {
    var activePage = event.detail.page;
    document.querySelectorAll(".embed > video").forEach(function (video) {
      if (activePage.contains(video) || video.paused) return;
      video.pause();
      try { video.currentTime = 0; } catch (e) {}
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
    var heroLoading = heroRoot.querySelector("[data-hero-loading]");
    var heroLoaded = false;
    var heroInView = false;
    var heroUserPaused = false;

    /* En celular no hay "hover": los controles se muestran al tocar el
       video (no los controles mismos, para no interferir con lo que ya
       hacen el boton y la barra) y se esconden solos a los 3s de no
       tocarlos, este pausado o reproduciendose. Toca de nuevo el video
       para esconderlos antes de tiempo. */
    if (isTouch && heroControls) {
      var heroControlsHideTimer = null;
      var showHeroControls = function () {
        heroControls.classList.add("is-touch");
        clearTimeout(heroControlsHideTimer);
        heroControlsHideTimer = setTimeout(function () {
          heroControls.classList.remove("is-touch");
        }, 3000);
      };
      var hideHeroControls = function () {
        heroControls.classList.remove("is-touch");
        clearTimeout(heroControlsHideTimer);
      };
      heroRoot.addEventListener("click", function (e) {
        if (heroControls.contains(e.target)) return;
        if (heroControls.classList.contains("is-touch")) hideHeroControls();
        else showHeroControls();
      });
      /* Reinicia la cuenta si estan tocando la barra o el boton, asi no
         se esconden a mitad de un arrastre. */
      heroControls.addEventListener("pointerdown", function () {
        if (heroControls.classList.contains("is-touch")) showHeroControls();
      });
      hero.addEventListener("pause", showHeroControls);
      hero.addEventListener("play", function () {
        if (heroControls.classList.contains("is-touch")) showHeroControls();
      });
    }

    var heroLoad = function () {
      if (heroLoaded) return;
      heroLoaded = true;
      loadEl(hero);
    };

    if (heroLoading) {
      var hideHeroLoading = function () { heroLoading.classList.add("is-hidden"); };
      hero.addEventListener("canplay", hideHeroLoading);
      hero.addEventListener("error", hideHeroLoading);
    }

    /* A diferencia del resto de la pagina (que espera a "afterLoad" para no
       competir con el texto y las imagenes), este video arranca a
       descargarse ya mismo: es el contenido principal de arriba de todo, y
       cuanto antes empiece, antes deja de verse el spinner de carga. */
    heroLoad();

    var paintHeroPlayPause = function (playing) {
      if (!heroPlayBtn) return;
      heroPlayBtn.setAttribute("aria-pressed", String(playing));
      heroPlayBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
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
        heroFsBtn.setAttribute("aria-label", active ? "Exit fullscreen" : "Fullscreen");
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

      /* El fondo tiene que seguir al reel 1:1, no solo en la posicion: si
         el reel se pausa (o termina), el fondo se pausa tambien y se queda
         quieto ahi -- nunca solo, reproduciendose de fondo por su cuenta. */
      hero.addEventListener("play", function () { bg.play().catch(function () {}); align(true); startSync(); });
      hero.addEventListener("pause", function () { bg.pause(); stopSync(); });
      hero.addEventListener("ended", function () { bg.pause(); stopSync(); });
      hero.addEventListener("seeked", function () { align(true); });
      hero.addEventListener("loadeddata", function () { bg.load(); });
    })();

    /* ====================================================================
       PANTALLA DE CARGA INICIAL
       Tapa toda la pagina (ver .site-blur en css/style.css) con blur + 3
       puntitos hasta que el reel -- y, solo en escritorio, el video de
       cada tarjeta de proyecto (las dos grillas, Sound y Audiovisual,
       esten a la vista o no) -- esten listos para reproducirse -- asi
       nunca se ve la pagina "a medio cargar". El blur se va reduciendo
       de a poco, no todo o nada, a medida que cada video queda listo. Un
       tope maximo de espera evita que un video lento (o roto) deje la
       pagina trabada.

       En celular/tablet (isTouch) los videos de las tarjetas NUNCA se
       piden aca: no hay hover posible en tactil (se navega directo al
       tocar una tarjeta, ver "TARJETAS DE PROYECTO" mas arriba), asi que
       esperarlos era descargar ~9 videos que jamas se iban a ver --
       puro desperdicio de datos y tiempo de carga. Ahi el preloader solo
       espera el reel. */
    (function () {
      var blurWrap = document.querySelector("[data-site-blur]");
      var preloader = document.querySelector("[data-preloader]");
      if (!blurWrap) return;

      if (reduceMotion.matches) {
        blurWrap.classList.add("is-ready");
        if (preloader) preloader.hidden = true;
        return;
      }

      var pending = [hero].concat(
        isTouch ? [] : tileLinks.map(function (link) { return link.querySelector(".tile__video"); })
      ).filter(Boolean);
      var total = pending.length;
      var ready = 0;
      var revealed = false;

      var reveal = function () {
        if (revealed) return;
        revealed = true;
        blurWrap.classList.add("is-ready");
        if (preloader) {
          preloader.classList.add("is-hidden");
          window.setTimeout(function () { preloader.hidden = true; }, 600);
        }
        /* El reel puede haber quedado con datos bufferizados (o incluso
           en reproduccion, si alguien lo apuro a mano) mientras estaba
           tapado -- se lo manda de vuelta al arranque para que la
           primera imagen que se vea, ya destapada, sea siempre 0:00. */
        try { hero.currentTime = 0; } catch (e) {}
        if (!heroUserPaused) playHero();
      };

      var mark = function () {
        ready++;
        blurWrap.style.setProperty("--load-ratio", String(ready / total));
        if (ready >= total) reveal();
      };

      if (!total) {
        reveal();
      } else {
        pending.forEach(function (v) {
          if (v.readyState >= 3) { mark(); return; }
          var done = function () {
            v.removeEventListener("canplay", done);
            v.removeEventListener("error", done);
            mark();
          };
          v.addEventListener("canplay", done);
          v.addEventListener("error", done);
          loadEl(v);
        });
        window.setTimeout(reveal, 8000);
      }
    })();
  }
})();
