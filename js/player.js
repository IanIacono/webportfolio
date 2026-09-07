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
     FUNDIDOS DE VOLUMEN DE LAS VISTAS PREVIAS  (0.1s)
     Las tarjetas de la grilla arrancaban y cortaban el sonido de golpe.
     Sacar el mouse a mitad de una palabra sonaba como un click: es el
     "pop" clasico de cortar una onda que no esta pasando por cero.
     Entrando y saliendo con 100ms de rampa no queda ningun corte seco, y
     es tan corto que no se percibe como un desvanecido -- se percibe como
     que arranca y para limpio.

     Es solo para los hovers de la grilla, que existen unicamente en
     escritorio (en tactil no hay hover: ver el chequeo de isTouch). El
     reel del inicio y los videos de las paginas de proyecto no pasan por
     aca, siguen como estaban.

     COMO se hace la rampa importa. El primer intento la hacia desde
     JavaScript, moviendo el .volume del elemento un poco en cada cuadro
     de pantalla, y SEGUIA sonando el click: el .volume solo se puede
     cambiar una vez por cuadro, y en esta pagina (con videos
     descargandose y decodificandose) los cuadros llegan cada 40-50ms
     medidos. Una rampa de 100ms terminaba siendo una escalera de dos o
     tres escalones de 0.3 de volumen cada uno -- o sea, tres cortes
     secos en vez de uno. Peor todavia si el navegador se traba justo
     ahi: la escalera se vuelve un solo salto.

     Asi que la rampa la hace el motor de audio del navegador (Web Audio)
     y no JavaScript: cada elemento pasa por un control de ganancia y se
     le pide "llega a este volumen en 0.1 segundos". Eso se calcula
     MUESTRA POR MUESTRA en el hilo de audio -- 4800 pasitos en vez de
     dos o tres -- y no se entera de si la pagina se traba. Es la
     diferencia entre una rampa de verdad y una escalera.

     Al enchufar un elemento a ese grafo, su .volume y su .muted dejan de
     mandar (el sonido sale por el grafo), asi que de ahi en mas el
     volumen lo decide unicamente la ganancia. applyAudio, aca abajo,
     tiene eso en cuenta.

     Si el navegador no tuviera Web Audio -- o si enchufar el elemento
     fallara por lo que sea -- se cae a la rampa vieja por .volume, que
     es peor pero mejor que nada.
     ====================================================================== */

  var FADE_S = 0.1;
  var FADE_MS = FADE_S * 1000;

  var AudioCtx = window.AudioContext || window.webkitAudioContext;
  var audioCtx = null;
  /* elemento -> su control de ganancia (o null si no se pudo enchufar).
     Es un WeakMap para no dejar vivo un <video> que ya no esta. */
  var gains = (AudioCtx && window.WeakMap) ? new WeakMap() : null;
  var stopTimers = window.WeakMap ? new WeakMap() : null;

  /* El navegador arranca el motor de audio "suspendido" hasta que la
     persona toca algo. En este sitio el sonido ya requiere un click en el
     boton del header, asi que ahi hay de sobra -- pero se lo intenta
     tambien en cada hover por las dudas. */
  function resumeCtx() {
    if (!audioCtx || audioCtx.state !== "suspended") return;
    var p = audioCtx.resume();
    if (p && p.catch) p.catch(function () {});
  }

  function gainFor(el) {
    if (!gains) return null;
    if (gains.has(el)) return gains.get(el);
    var gain = null;
    try {
      if (!audioCtx) audioCtx = new AudioCtx();
      var src = audioCtx.createMediaElementSource(el);
      gain = audioCtx.createGain();
      /* Arranca en silencio: el primer hover lo sube con su rampa. Si
         empezara en 1, enchufarlo seria justo el golpe que se evita. */
      gain.gain.value = 0;
      src.connect(gain);
      gain.connect(audioCtx.destination);
      /* Desde aca manda la ganancia: el elemento se deja abierto del todo
         y sin mutear, si no estaria cortando el sonido antes de entrar al
         grafo. */
      el.volume = 1;
      el.muted = false;
    } catch (e) {
      gain = null;
    }
    gains.set(el, gain);
    return gain;
  }

  function rampGain(gain, to) {
    resumeCtx();
    var now = audioCtx.currentTime;
    var p = gain.gain;
    /* Cortar lo que estaba programado SIN saltar: se lee el valor que tiene
       AHORA, se lo clava en ese punto y desde ahi arranca la rampa nueva.
       Sin esto, entrar y salir rapido encadena rampas que se pisan y el
       valor pega saltos -- que es exactamente el click que se esta
       sacando.

       Y NO se usa cancelAndHoldAtTime, que es el metodo que existe
       justamente para esto: medido en este navegador, hace saltar el
       valor de 0.8 a 0.27 en el primer instante y recien despues rampea
       -- o sea, mete el click que se venia a evitar. Con
       cancelScheduledValues + setValueAtTime la rampa sale pareja
       (0.8, 0.71, 0.64, 0.55, 0.48, 0.38, 0.31, 0.22, 0.15, 0.08, 0).
       Si algun dia se lo quiere volver a probar, la sonda que mide las
       dos formas esta en el historial de esta sesion. */
    var v = p.value;
    p.cancelScheduledValues(now);
    p.setValueAtTime(v, now);
    p.linearRampToValueAtTime(to, now + FADE_S);
  }

  function clearStop(el) {
    if (!stopTimers || !stopTimers.has(el)) return;
    clearTimeout(stopTimers.get(el));
    stopTimers["delete"](el);
  }

  /* Lo que se hace DESPUES de que la rampa llego a cero: pausar y volver
     al principio. Con un margen chico para no cortar la ultima muestra. */
  function scheduleStop(el, fn) {
    clearStop(el);
    var id = setTimeout(function () {
      if (stopTimers) stopTimers["delete"](el);
      fn();
    }, FADE_MS + 30);
    if (stopTimers) stopTimers.set(el, id);
  }

  function fadeState(el) {
    if (!el.__fade) el.__fade = { raf: 0, to: -1, done: null };
    return el.__fade;
  }

  /* Corta el fundido en curso SIN ejecutar lo que tenia pendiente (pausar
     y volver a cero). Se usa al volver a entrar antes de que termine de
     salir: ahi se retoma, no se reinicia. */
  function cancelFade(el) {
    var st = fadeState(el);
    if (st.raf) cancelAnimationFrame(st.raf);
    st.raf = 0;
    st.to = -1;
    st.done = null;
  }

  function isFadingOut(el) {
    var st = el.__fade;
    return !!(st && st.raf && st.to === 0);
  }

  function fadeTo(el, to, done) {
    var st = fadeState(el);
    if (st.raf) cancelAnimationFrame(st.raf);
    var from = el.volume;
    st.to = to;
    st.done = done || null;

    var finish = function () {
      st.raf = 0;
      st.to = -1;
      var fin = st.done;
      st.done = null;
      if (fin) fin();
    };

    /* Ya esta donde tiene que estar (el sitio en volumen cero, por
       ejemplo): no hay nada que fundir, pero lo que quedaba pendiente
       igual tiene que correr. */
    if (Math.abs(to - from) < 0.001) { finish(); return; }

    var t0 = performance.now();
    var step = function (t) {
      /* El "t" que da requestAnimationFrame es el del ARRANQUE del cuadro,
         y puede ser anterior al performance.now() de recien: si fadeTo se
         llamo desde un evento que corrio con el cuadro ya empezado, la
         primera vuelta da un k negativo. Sin este piso el volumen se
         pasaba del destino por un cuadro (medido: 0.828 con el header en
         0.80) y, con el header al maximo, pedirle mas de 1 al .volume es
         un error que tira el navegador. */
      var k = (t - t0) / FADE_MS;
      if (k < 0) k = 0;
      if (k > 1) k = 1;
      var v = from + (to - from) * k;
      if (v < 0) v = 0;
      if (v > 1) v = 1;
      try { el.volume = v; } catch (e) {}
      if (k < 1) { st.raf = requestAnimationFrame(step); return; }
      finish();
    };
    st.raf = requestAnimationFrame(step);
  }

  function busVolume() {
    var bus = window.AudioBus;
    return bus ? bus.volume : 1;
  }

  /* Fija el volumen respetando un fundido en curso: si esta SUBIENDO se le
     cambia el destino (paso que movieron la barra del header a mitad de
     rampa), y si esta BAJANDO se lo deja llegar a cero tranquilo. */
  function setLevel(el, vol) {
    var st = el.__fade;
    if (st && st.raf) {
      if (st.to !== 0) fadeTo(el, vol, st.done);
      return;
    }
    el.volume = vol;
  }

  /* Arranca una vista previa con fundido de entrada. */
  function startPreview(el) {
    /* Si venia saliendo, lo primero es cancelar el apagado pendiente: asi
       volver a entrar rapido RETOMA desde el volumen en el que iba en vez
       de bajar a cero y arrancar de nuevo. */
    clearStop(el);
    var gain = gainFor(el);
    if (gain) {
      resumeCtx();
      var pr = gain && el.play();
      if (pr && pr.catch) pr.catch(function () {});
      focusVideo(el);
      /* Explicito ademas de focusVideo: si este elemento ya era el
         enfocado (justo lo que pasa al volver a entrar antes de que
         termine de salir), focusVideo se va sin hacer nada y la ganancia
         se quedaria bajando hacia cero. */
      applyAudio(el, true);
      return;
    }

    /* --- Sin Web Audio: la rampa vieja, cuadro a cuadro --- */
    var st = el.__fade;
    var resumeFrom = (st && st.raf) ? el.volume : 0;
    cancelFade(el);
    var pr2 = el.play();
    if (pr2 && pr2.catch) pr2.catch(function () {});
    focusVideo(el);
    try { el.volume = resumeFrom; } catch (e) {}
    fadeTo(el, busVolume());
  }

  /* Apaga una vista previa: primero la rampa a cero y recien cuando llego
     se pausa, se vuelve al principio y se apaga. Lo usan el pointerleave,
     el blur del teclado y el cambio de pagina (hacer click en una tarjeta
     tambien tiene que apagarla sin el click de audio). */
  function stopPreview(el, link) {
    if (link) link.classList.remove("is-playing");
    var gain = gains && gains.get(el);
    if (gain) {
      rampGain(gain, 0);
      scheduleStop(el, function () {
        if (!el.paused) el.pause();
        try { el.currentTime = 0; } catch (e) {}
        blurVideo(el);
      });
      return;
    }

    /* --- Sin Web Audio: la rampa vieja, cuadro a cuadro --- */
    fadeTo(el, 0, function () {
      if (!el.paused) el.pause();
      try { el.currentTime = 0; } catch (e) {}
      /* A mano ademas de blurVideo: si mientras tanto otra tarjeta se
         quedo con el foco, blurVideo se va sin hacer nada y este quedaria
         sin mutear. Aca ya esta en cero, asi que mutear no suena. */
      el.muted = true;
      blurVideo(el);
    });
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

    /* Enchufado al grafo de audio: el .volume y el .muted del elemento ya
       no mandan, y ademas tocarlos seria un corte seco. Todo lo decide la
       ganancia, que siempre llega a destino con una rampa -- tambien
       cuando el corte viene de apretar mute o de que otra tarjeta se lleve
       el foco. */
    var gain = gains && gains.get(video);
    if (gain) {
      rampGain(gain, on ? bus.volume : 0);
      return;
    }

    /* En pleno fundido de salida no se lo toca: mutearlo ahora seria
       exactamente el corte que el fundido esta evitando. Su propio
       fundido lo deja en cero y ahi lo apaga. */
    if (!on && isFadingOut(video)) return;
    video.muted = !on;
    if (bus) setLevel(video, bus.volume);
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
    window.AudioBus.subscribe(function (state) {
      /* Prender el sonido es un click de verdad, que es lo que el
         navegador pide para dejar arrancar el motor de audio. */
      if (state && !state.muted) resumeCtx();
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
      startPreview(video);
    };

    var leave = function () {
      stopPreview(video, link);
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
        /* Entra al mismo foco de sonido y al mismo fundido que los videos
           de las otras tarjetas: todo esto toca solo .muted y .volume, asi
           que sirve igual para un <audio> que para un <video>. */
        startPreview(clip);
      }
    };

    var leaveTile = function () {
      stopFlicker();
      if (clip) stopPreview(clip, null);
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
      /* Con fundido tambien aca: al hacer click en una tarjeta el mouse
         se queda encima, asi que no hay pointerleave que apague la vista
         previa -- la apaga este cambio de pagina, y de golpe sonaba al
         mismo click que se esta evitando. */
      if (v && !v.paused) stopPreview(v, link);
      else link.classList.remove("is-playing");
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
