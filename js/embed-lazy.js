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

  /* Un video abierto (ya cambiado de miniatura a iframe real) por cada
     embed, para poder volver a cerrarlo al salir del proyecto -- ver el
     listener de "page:change" al final. */
  var opened = [];

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

    var entry = { facade: facade, live: null };
    opened.push(entry);

    facade.addEventListener("click", function () {
      var real = document.createElement("iframe");
      real.src = src + (src.indexOf("?") > -1 ? "&" : "?") + "autoplay=1";
      real.title = title;
      if (allow) real.setAttribute("allow", allow);
      if (referrerPolicy) real.setAttribute("referrerpolicy", referrerPolicy);
      real.setAttribute("allowfullscreen", "");
      entry.live = real;
      facade.replaceWith(real);
      real.focus({ preventScroll: true });
    });

    iframe.replaceWith(facade);
  });

  /* Al irse del proyecto (Next, Back, o volver al inicio) el video que
     estaba puesto se cierra: se lo reemplaza de vuelta por su miniatura.
     Hace falta hacerlo a mano porque el sitio no descarga nada al navegar
     -- el router solo esconde la seccion (ver punto 1 de main.js), y una
     seccion escondida sigue siendo un documento vivo: el iframe de YouTube
     se queda reproduciendo detras, sin nada a la vista que lo delate. Peor
     todavia, se iban acumulando: tres proyectos abiertos eran tres videos
     sonando a la vez.

     Sacar el iframe del todo (en vez de pausarlo) es lo que hace que
     ademas quede "reiniciado": no hay forma de pausar un iframe de YouTube
     desde afuera sin cargar su API entera, y volviendo a la miniatura el
     video arranca de cero la proxima vez, que es lo que se espera al
     volver a entrar. La miniatura es la misma de antes, con su listener
     de click intacto, asi que se puede volver a reproducir sin mas.

     Los <iframe> de YouTube que por algun motivo no hayan pasado por esta
     miniatura (por ejemplo si su URL no matchea el patron de arriba)
     quedan cubiertos aparte en player.js, que los manda a about:blank. */
  document.addEventListener("page:change", function (event) {
    var activePage = event.detail.page;
    opened.forEach(function (entry) {
      if (!entry.live || activePage.contains(entry.live)) return;
      entry.live.replaceWith(entry.facade);
      entry.live = null;
    });
  });
})();
