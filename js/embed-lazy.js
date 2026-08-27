/* ==========================================================================
   IAN IACONO — SOUND PORTFOLIO
   embed-lazy.js — los videos de YouTube cargan recien al tocarlos

   Un iframe de YouTube es pesado (trae su propio reproductor entero) y
   dejaba la caja en blanco varios segundos apenas se entraba a un proyecto,
   sobre todo en mobile -- y con eso ocupado, hasta el texto de al lado
   tardaba en aparecer. Ahora se muestra la miniatura del video con un
   boton de play; el iframe real (con autoplay) se crea recien al tocarlo,
   asi la pagina del proyecto aparece de una.

   No hace falta tocar este archivo para cambiar textos ni videos: alcanza
   con editar el <iframe> de YouTube en index.html como siempre.
   ========================================================================== */

(function () {
  "use strict";

  var PLAY_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';

  var iframes = Array.prototype.slice.call(
    document.querySelectorAll('.embed > iframe[src*="youtube.com/embed/"]')
  );

  iframes.forEach(function (iframe) {
    var src = iframe.getAttribute("src");
    var match = src.match(/\/embed\/([^?&/]+)/);
    if (!match) return;

    var videoId = match[1];
    var title = iframe.getAttribute("title") || "YouTube video";
    var allow = iframe.getAttribute("allow") || "";
    var referrerPolicy = iframe.getAttribute("referrerpolicy") || "";

    var facade = document.createElement("button");
    facade.type = "button";
    facade.className = "embed__facade";
    facade.setAttribute("aria-label", "Play video: " + title);

    var img = document.createElement("img");
    img.className = "embed__facade-img";
    img.src = "https://i.ytimg.com/vi/" + videoId + "/hqdefault.jpg";
    img.alt = "";
    img.loading = "lazy";
    facade.appendChild(img);

    var play = document.createElement("span");
    play.className = "embed__facade-play";
    play.setAttribute("aria-hidden", "true");
    play.innerHTML = PLAY_ICON;
    facade.appendChild(play);

    facade.addEventListener("click", function () {
      var real = document.createElement("iframe");
      real.src = src + (src.indexOf("?") > -1 ? "&" : "?") + "autoplay=1";
      real.title = title;
      if (allow) real.setAttribute("allow", allow);
      if (referrerPolicy) real.setAttribute("referrerpolicy", referrerPolicy);
      real.setAttribute("allowfullscreen", "");
      facade.replaceWith(real);
      real.focus({ preventScroll: true });
    });

    iframe.replaceWith(facade);
  });
})();
