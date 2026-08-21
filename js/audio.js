/* ==========================================================================
   IAN IACONO — SOUND PORTFOLIO
   audio.js — control global de sonido

   Es el UNICO lugar del sitio donde se prende o apaga el audio: el boton
   y la barra que estan en el header. Controla el reel del inicio y, en la
   grilla de proyectos, el video que estes mirando con el mouse en ese
   momento. Los embeds de YouTube y Spotify de las paginas de cada proyecto
   tienen sus propios controles nativos y quedan fuera de esto.

   Por como funcionan los navegadores, el sonido siempre arranca apagado:
   hace falta un click real (en este boton) para que el sitio quede
   habilitado a sonar por el resto de la visita.

   No hace falta tocar este archivo para cambiar textos ni videos.
   ========================================================================== */

(function () {
  "use strict";

  var STORAGE_KEY = "ii-volumen";
  var toggle = document.querySelector(".audio-control__toggle");
  var slider = document.querySelector(".audio-control__level");
  if (!toggle || !slider) return;

  var state = { muted: true, volume: 0.8 };

  try {
    var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved && typeof saved.volume === "number" && saved.volume > 0) {
      state.volume = Math.min(1, Math.max(0.05, saved.volume));
    }
  } catch (e) { /* localStorage no disponible: seguimos con los valores por defecto */ }

  var listeners = [];

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ volume: state.volume })); }
    catch (e) {}
  }

  function paint() {
    toggle.setAttribute("aria-pressed", String(!state.muted));
    toggle.setAttribute("aria-label", state.muted ? "Activar sonido del sitio" : "Silenciar el sitio");
    var pct = Math.round(state.volume * 100);
    /* La barra queda siempre activa (nunca "disabled"): arrastrarla es la
       forma mas intuitiva de activar el sonido, ademas del boton. Un input
       deshabilitado tambien desaparece de la navegacion por teclado, y no
       queremos que el volumen se pueda perder de esa forma. */
    var shown = state.muted ? 0 : pct;
    slider.value = String(shown);
    slider.classList.toggle("is-muted", state.muted);
    slider.style.setProperty("--level", shown + "%");
    /* Numero sin unidad, para que el CSS pueda usarlo en un calc() y hacer
       que el resplandor de la barra crezca junto con el volumen. */
    slider.style.setProperty("--level-num", String(shown));
    slider.setAttribute("aria-valuetext", state.muted ? "Silenciado" : pct + "%");
  }

  function notify() {
    listeners.forEach(function (fn) { fn(state); });
  }

  /* API publica: player.js la usa para saber cuanto sonido dar al video
     que este activo en cada momento. */
  window.AudioBus = {
    get muted() { return state.muted; },
    get volume() { return state.volume; },
    setMuted: function (value) {
      state.muted = !!value;
      /* Si te habias quedado en 0 arrastrando la barra, al reactivar el
         sonido con el boton hace falta un volumen audible de verdad. */
      if (!state.muted && state.volume <= 0) state.volume = 0.8;
      persist();
      paint();
      notify();
    },
    setVolume: function (value) {
      state.volume = Math.min(1, Math.max(0, value));
      state.muted = state.volume <= 0;
      persist();
      paint();
      notify();
    },
    subscribe: function (fn) { listeners.push(fn); }
  };

  toggle.addEventListener("click", function () {
    window.AudioBus.setMuted(!state.muted);
  });

  slider.addEventListener("input", function () {
    window.AudioBus.setVolume(Number(slider.value) / 100);
  });

  paint();
})();
