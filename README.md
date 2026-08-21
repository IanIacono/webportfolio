# Sitio de Ian Iacono — Sound Portfolio

Este es tu sitio web, hecho con archivos propios. Ya no depende de Carrd.

**No hace falta saber programar para editarlo.** Todo lo que vas a querer
cambiar (textos, imágenes, colores) está explicado acá abajo, paso a paso.

---

## 📑 Índice

1. [Ver el sitio en tu computadora](#1-ver-el-sitio-en-tu-computadora)
2. [Cambiar un texto](#2-cambiar-un-texto)
3. [Cambiar una imagen](#3-cambiar-una-imagen)
4. [Cambiar un video](#4-cambiar-un-video)
5. [Cambiar los colores](#5-cambiar-los-colores)
6. [Completar la sección Contact](#6-completar-la-sección-contact)
7. [Poner tu dominio](#7-poner-tu-dominio)
8. [Publicar los cambios](#8-publicar-los-cambios)
9. [Qué es cada archivo](#9-qué-es-cada-archivo)
10. [Cosas que decidí y podés cambiar](#10-cosas-que-decidí-y-podés-cambiar)

---

## 1. Ver el sitio en tu computadora

Abrir `index.html` haciendo doble click **no funciona bien** (las imágenes y
los estilos no cargan). Hay que levantar un servidor chiquito. Es un solo
comando.

**En Mac o Linux**, abrí la Terminal, entrá a la carpeta del sitio y escribí:

```
python3 -m http.server 8080
```

**En Windows**, abrí la aplicación "Símbolo del sistema", entrá a la carpeta y
escribí:

```
py -m http.server 8080
```

Después abrí el navegador en http://localhost:8080

Para apagarlo, apretá `Ctrl + C` en esa ventana.

---

## 2. Cambiar un texto

Abrí `index.html` con cualquier editor de texto. **Recomiendo
[VS Code](https://code.visualstudio.com)**, que es gratis, pero sirve el
Bloc de notas también.

El archivo está dividido en secciones con carteles bien visibles, así:

```html
<!-- ==========================================================
     SECCION 2 de 11  —  PROYECTO: THE CARBON CASE   (direccion: #thecarboncase)
     ========================================================== -->
```

Buscá el cartel de la sección que querés tocar (con `Ctrl+F` / `Cmd+F`) y
cambiá **solo lo que está entre las etiquetas**. Nunca borres las etiquetas
(las cosas entre `<` y `>`).

### Qué es cada texto de una página de proyecto

```html
<h1 class="project__title">The Carbon Case</h1>          ← el TÍTULO grande
<p class="project__role">Sound design, Mix &amp; Master</p>  ← el SUBTÍTULO en violeta

<div class="lang">
  <p class="label lang__label">ESP</p>                    ← la etiqueta del idioma
  <p class="prose">Cortometraje sobre la creación...</p>  ← el TEXTO en español
</div>
<div class="lang">
  <p class="label lang__label">ENG</p>
  <p class="prose" lang="en">Short film about...</p>      ← el TEXTO en inglés
</div>
```

Para cambiar el texto en español de The Carbon Case, cambiás solamente lo que
está entre `<p class="prose">` y `</p>`. Nada más.

### El título de las tarjetas de la home

```html
<h2 class="tile__title">The Carbon Case</h2>
```

### Dos cosas para tener cuidado

1. **El símbolo `&`** se escribe `&amp;` dentro del HTML.
   Ejemplo: `Mix &amp; Master` se ve como "Mix & Master".
2. **Los acentos y las eñes** se escriben normal: `creación`, `año`. No hay
   problema con eso.

---

## 3. Cambiar una imagen

Las imágenes viven en `assets/img/`. Cada proyecto tiene **tres archivos**:

| Archivo | Para qué sirve |
|---|---|
| `lumia.webp` | el original grande |
| `lumia-480.webp` | versión chica (celulares) |
| `lumia-960.webp` | versión mediana (pantallas grandes) |

Suena complicado, pero **no tenés que generarlas a mano**. Hacé esto:

1. Guardá tu imagen nueva en `assets/img/` con un nombre sin espacios ni
   acentos, por ejemplo `lumia-nueva.jpg`.
2. En el HTML, buscá el nombre viejo y reemplazá **las tres apariciones**:

```html
<img src="/assets/img/lumia-960.webp"
     srcset="/assets/img/lumia-480.webp 480w, /assets/img/lumia-960.webp 960w"
     ...>
```

queda:

```html
<img src="/assets/img/lumia-nueva.jpg"
     srcset="/assets/img/lumia-nueva.jpg 480w, /assets/img/lumia-nueva.jpg 960w"
     ...>
```

3. Cambiá también el `alt="..."`, que es la descripción para personas ciegas
   y para Google. Escribí qué se ve en la imagen.

> 💡 **Lo ideal** es pedirme (o pedirle a quien te ayude) que genere las
> versiones optimizadas. Si ponés una foto de 5 MB directamente, el sitio va a
> cargar lento. Una imagen de hasta 1600 píxeles de ancho está bien.
>
> Si podés, mandala ya recortada bien apaisada (más ancha que alta, tipo
> 1600×900 o más ancha todavía) y con lo importante (título, logo) cerca del
> centro vertical: las tarjetas de la grilla son todas 16:9, así que
> cualquier imagen que no venga en ese formato se recorta un poco arriba y
> abajo para llenar el recuadro.

Los **originales del Carrd** quedaron guardados en `assets/img/_originales/`
por si alguna vez los necesitás. No hace falta que toques esa carpeta.

---

## 4. Cambiar un video

### Los videos de los proyectos (páginas internas)

Son de YouTube. Buscá esta línea en el HTML:

```html
<iframe src="https://www.youtube-nocookie.com/embed/2TYgE3qMO4k?rel=0&amp;loop=0&amp;controls=1&amp;cc_load_policy=0"
```

`2TYgE3qMO4k` es el **código del video de YouTube**. Lo sacás de la dirección
del video: en `youtube.com/watch?v=ABC123`, el código es `ABC123`.
Reemplazalo y listo.

### Los videos de las tarjetas (la grilla)

Ahora **todos usan tu reel como provisorio**. Cuando tengas el video de cada
proyecto:

1. Guardá el archivo `.mp4` en `assets/video/`, por ejemplo `lumia.mp4`.
2. En el HTML, buscá la tarjeta de ese proyecto (`class="tile"`) y vas a ver
   un único video adentro. Cambiá su `data-src`:

```html
<video class="tile__video" data-src="/assets/video/reel.mp4" ...>
```

por:

```html
<video class="tile__video" data-src="/assets/video/lumia.mp4" ...>
```

**Recomendaciones para los videos:**
- Formato **MP4** (códec H.264 + audio AAC). Es el que anda en todos lados.
- Proporción **16:9** (apaisado). La tarjeta siempre recorta al video a ese
  formato (con `object-fit: cover`), así que si tu video es muy vertical o
  muy cuadrado, va a perder los bordes izquierdo/derecho o arriba/abajo.
- Que no pesen más de 8–10 MB cada uno. Si pesan más, el sitio carga lento.
- Como el video arranca apenas pasás el mouse, conviene que los primeros
  segundos ya muestren algo representativo del proyecto.

### El reel del inicio

Es el video grande de la portada, con su fondo sincronizado y borroso atrás.
Buscá el bloque marcado `hero` cerca del principio de `index.html` y vas a
ver dos videos con el mismo `data-src`, uno chico (`data-hero-main`, el que
se ve nítido) y otro grande (`data-hero-bg`, el fondo borroso — es
automático, no hace falta tocarlo aparte):

```html
<video data-hero-bg ... data-src="/assets/video/reel.mp4"></video>
...
<video ... data-src="/assets/video/reel.mp4"></video>
```

Cambiá **los dos** `data-src` al mismo archivo nuevo. También hay una imagen
de portada mientras el video carga (`assets/img/reel-poster.webp`, referida
como `poster="..."` en el video principal) — si querés reemplazarla, guardá
tu propia imagen ahí con el mismo nombre, o cambiá la ruta en el HTML.

El reel tiene su propio botón de pausar/reanudar (aparece al pasar el mouse,
o siempre en celular) y una línea de tiempo para saltar a un momento
concreto — ninguno de los dos controla el sonido, eso lo sigue manejando
únicamente el control del header (ver más abajo).

### El control de sonido

No hay un botón de mute en cada video. Hay **un solo control, en el header,
arriba a la derecha**: un altavoz con una barra de volumen al lado, más larga
y con un brillo cyan que crece a medida que subís el volumen. Prende o apaga
el sonido de lo que se esté reproduciendo en cada momento — el reel, o el
proyecto que estés mirando con el mouse en la grilla.

Esto es así por como funcionan los navegadores: la primera vez que entrás al
sitio, todo arranca en silencio a la fuerza (ningún sitio puede sonar solo,
sin que vos lo pidas). Apenas tocás ese control una vez (el botón, o
arrastrando la barra), el sitio queda habilitado a sonar por el resto de la
visita.

El volumen se guarda en tu navegador: si volvés a entrar más tarde, va a
recordar el nivel que dejaste (aunque siempre arranca en silencio, por lo de
arriba).

No hay nada para configurar en el control de sonido: es un comportamiento
del sitio, no un texto para editar. Los videos de YouTube y los podcasts de
Spotify de las páginas de cada proyecto quedan afuera de este control — esos
tienen sus propios botones, porque son de otra plataforma.

---

## 5. Cambiar los colores

**Todos** los colores del sitio salen de un solo lugar. Abrí `css/style.css` y
buscá arriba de todo el bloque que dice `01. SISTEMA DE DISENO`:

```css
:root {
  --c-bg:            #0a0910;   /* fondo general, casi negro con tinte violeta */
  --c-bg-raised:     #131019;   /* superficies elevadas (tarjetas)           */

  --c-text:          #f4f3f7;   /* texto principal */
  --c-text-muted:    #a9a6b4;   /* texto secundario */
  --c-text-faint:    #7d7a8a;   /* texto terciario */

  --c-accent:        #8b7cf6;   /* violeta: el unico acento del sitio */
  --c-accent-soft:   #b3a8fa;   /* violeta claro, para hover */
}
```

Cambiás un código de color ahí y **se actualiza en todo el sitio solo**.
No busques colores en otro lado: no hay. El control de volumen del header
también usa `--c-accent`: en reposo es blanco/gris, y a medida que subís el
nivel se va mezclando con este violeta (y le crece el brillo alrededor) —
es automático, no hay un color aparte para eso.

> ⚠️ Si cambiás `--c-accent` por un color muy oscuro, va a perder contraste
> contra el fondo negro y va a costar leerlo. Probá en
> [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/)
> que dé **4.5 o más** contra `#0a0910`.

En ese mismo bloque también están los tamaños de letra (`--fs-...`), los
espacios (`--sp-...`), los redondeos (`--r-...`) y las sombras (`--sh-...`).

**El degradado del final de la página** (negro arriba, violeta muy oscuro y
sutil abajo, solo en Contact y el pie de página) usa un color propio,
`--c-bloom-violet` — cambialo si querés otro tono. Es un `linear-gradient`
simple en `#contact` y `.site-footer` (buscalos en `css/style.css`, sección
"10b. FORMULARIO DE CONTACTO" y "15. PIE DE PAGINA"), no una imagen, así
que también se edita solo ahí.

---

## 6. Completar la sección Contact

En el Carrd original esta sección **estaba vacía**. Ahora vive al final del
home (abajo de los proyectos) con un formulario y dos links, pero todavía
apuntan a datos de ejemplo.

Buscá en el HTML el comentario que dice `CONTACTO` y vas a ver esto:

```html
<form class="contact-form reveal" action="mailto:TUMAIL@ejemplo.com" ...>
  ...
</form>
<div class="contact-form__links reveal">
  <a class="btn" href="https://instagram.com/TUUSUARIO" ...>Instagram</a>
  <a class="btn" href="https://wa.me/5491100000000" ...>WhatsApp</a>
</div>
```

Para activarlo con tus datos:

1. Reemplazá `TUMAIL@ejemplo.com` (en el `action` del `<form>`) por tu mail.
2. Reemplazá `TUUSUARIO` por tu usuario de Instagram (aparece dos veces: acá
   y en el pie de página, al final del todo).
3. Reemplazá el número de WhatsApp (`5491100000000` = código de país 54 + 9
   + característica sin el 0 + número sin el 15).
4. Borrá el botón que no quieras usar.

**Importante sobre el formulario:** al enviarlo, `action="mailto:..."` abre
el cliente de correo de quien lo llena, con lo escrito ya cargado — no lo
manda solo. Es la única forma de tener un formulario que funcione en un
sitio estático, sin servidor propio. Si más adelante preferís que se mande
directo sin abrir nada, hace falta conectar un servicio como
[Formspree](https://formspree.io) (tiene un plan gratis) — cambia el
`action` del formulario por la URL que te den, y listo.

---

## 7. Poner tu dominio

Mientras uses la dirección gratis de Vercel no hace falta tocar nada. Cuando
compres tu dominio, buscá en el HTML las 4 líneas marcadas con
`<!-- DOMINIO -->` y cambiá `https://ianiacono.vercel.app` por tu dirección
real.

Sirve para que Google y las redes sociales sepan cuál es la dirección
verdadera de tu sitio.

---

## 8. Publicar los cambios

Una vez conectado a Vercel (ver más abajo), publicar es así:

1. Guardá los archivos que cambiaste.
2. Subilos a GitHub.
3. **Listo.** Vercel detecta el cambio y republica solo, en menos de un minuto.

### La forma fácil, sin usar la terminal

1. Entrá a https://github.com/IanIacono/webportfolio
2. Navegá hasta el archivo que querés cambiar y clickeá el **lápiz** (✏️).
3. Editá el texto ahí mismo, en el navegador.
4. Abajo, escribí en una línea qué cambiaste (por ejemplo:
   `nuevo texto de Lumia`) y apretá **Commit changes**.
5. Vercel republica solo.

### Si preferís la terminal

```
git add .
git commit -m "cambio los textos de Lumia"
git push
```

---

## 9. Qué es cada archivo

```
webportfolio/
│
├── index.html          ← reel + grilla de tarjetas + los proyectos
│
├── css/
│   └── style.css       ← TODOS los estilos: colores, tamaños, espacios
│
├── js/
│   ├── main.js         ← cambia de página y hace aparecer los bloques al scrollear
│   ├── audio.js        ← el control global de sonido del header
│   └── player.js       ← reproduce los videos: el reel y las tarjetas de la grilla
│
├── assets/
│   ├── img/            ← todas las imágenes
│   │   ├── reel-poster.webp ← portada del reel mientras carga el video
│   │   └── _originales/← respaldo del Carrd: las imágenes y los textos
│   │                      originales, por si alguna vez los necesitás
│   ├── video/
│   │   └── reel.mp4    ← tu demo reel (el video del inicio, y también el
│   │                      placeholder de las tarjetas)
│   └── fonts/          ← la tipografía Space Grotesk, guardada acá adentro
│
├── favicon.ico         ← el iconito de la pestaña del navegador
├── apple-touch-icon.png← el icono cuando alguien guarda el sitio en el celular
├── vercel.json         ← le dice a Vercel cuánto tiempo guardar los archivos
└── README.md           ← este instructivo
```

---

## 10. Cosas que decidí y podés cambiar

Estas decisiones las tomé yo durante la migración. Todas se pueden revertir.

**1. El reel del inicio ya no viene de Vimeo — vive en `assets/video/`, en tu
propio sitio (carga mucho más rápido).**
Arranca con el reel a pantalla completa (con su fondo sincronizado y
borroso) y se desvanece con un degradé hacia la grilla de proyectos, en vez
de cortarse de golpe. El marco del reel tampoco corta en seco en sus otros
tres bordes (abajo, izquierda, derecha): se disuelven con un difuminado fino,
pegado al borde. En mobile, abajo del reel queda el cartel "SEE PROJECTS ↓"
invitando a scrollear; en escritorio no hace falta, así que no se muestra.

**2. El reel tiene su propio botón de pausar/reanudar.**
Aparece al pasar el mouse (o siempre, en celular, donde no existe el
"hover"). No toca el sonido — eso lo sigue decidiendo únicamente el control
del header.

**3. El botón "Back" de cada proyecto ya no vuelve al principio de la
página — vuelve directo a la grilla, sin ningún salto ni destello del reel
de por medio.**
Antes, si estabas en `#lumia` y apretabas Back, terminabas arriba de todo (el
reel) y recién ahí el scroll bajaba animado hasta la grilla — se alcanzaba a
ver un flash del reel antes de asentarse. Ahora ese salto es instantáneo. Al
lado de "Back" hay un botón **"Next"** que te lleva al siguiente proyecto en
orden — y al llegar al último, vuelve a empezar por el primero.

**4. En Audiovisual Portfolio pasé de páginas separadas a un selector con dos
botones.**
Antes "Audiovisual Portfolio" era otra página (otro `#`, otro scroll al
tope). Ahora Sound y Audiovisual conviven en la misma página: los botones de
arriba solo cambian qué grilla se ve, sin mover el scroll ni recargar nada.

**5. Los puntos sueltos (`.`) desaparecieron.**
El Carrd tenía títulos que decían solamente un punto. Eran separadores para
hacer espacio, no texto. Ahora ese espacio lo hace el diseño.

**6. Los textos del `title` y de la descripción los escribí yo.**
En el Carrd decían literalmente "a". Puse:
*"Ian Iacono — sound design, mezcla y master. Portfolio de sonido y audiovisual…"*.
Cambialo cuando quieras: está arriba de todo en el HTML, bien marcado.

**7. Le agregué un botón "Back" a la página de Te Lo Aseguro | Analipsis.**
Era la única sin botón de volver: se entraba y quedabas encerrado.

**8. El sitio es oscuro siempre.**
No cambia según la configuración del celular o la computadora. Es una decisión
de marca: tus portadas y tus videos son oscuros y se ven mejor sobre negro.

**9. Los colores pasaron de ámbar a violeta + cyan.**
Me dijiste que el ámbar no te convencía y que preferías algo entre violeta y
cyan oscuros. Te dejé esa combinación puesta (violeta para textos y links,
cyan para el control de volumen). Si preferís otra, la cambiamos en un
momento: son 4 líneas en `css/style.css` (ver sección 5).

**10. El CSS y el JavaScript no están comprimidos.**
Se podrían achicar un poco, pero quedarían ilegibles y vos no podrías editarlos.
Preferí que puedas entenderlos.

**11. Solo un video suena a la vez.**
Si pasás el mouse de una tarjeta a otra, el video anterior se silencia solo y
empieza a sonar el nuevo. Es a propósito: nunca vas a tener dos proyectos
sonando al mismo tiempo.

**12. Todas las tarjetas de la grilla miden lo mismo (16:9).**
Antes cada una tenía el tamaño de su imagen original, así que quedaban
bordes borrosos rellenando el espacio sobrante dentro de algunas. Ahora el
recuadro siempre es 16:9 y la imagen (o el video, al hacer hover) lo llena
por completo — recortando un poco los bordes si hace falta, nunca
estirando ni dejando espacio vacío. En celular la grilla pasó de 1 a 2
columnas: con una sola, cada tarjeta ocupaba casi toda la pantalla y ese
recorte se notaba mucho más que en la computadora, aunque fuera el mismo
porcentaje. Además, "The Carbon Case" es la única portada donde el título
arranca pegado al borde de arriba — el recorte automático (que por defecto
recorta desde el centro) se lo comía. Le ajusté el punto de enfoque para que
el título completo quede siempre visible.

**13. La portada del reel (el ecualizador con "IAN IACONO") la volví a
pintar en violeta.**
Era un placeholder que hice al principio, cuando el color de acento todavía
era ámbar. Al cambiar la paleta (punto 9) se quedó con el color viejo.

**14. Probamos una segunda versión de la home (con un carrusel arriba en vez
del reel) y la descartamos.**
Durante el proceso armamos dos diseños para comparar. Te quedaste con este
(el del reel), así que borré el otro por completo — no queda ningún archivo
ni código suyo dando vueltas.

**15. El header (el menú de arriba) ya no se corre de lugar al cambiar de
página.**
En algunas páginas de proyecto se movía uno o dos píxeles apenas entrabas o
apretabas Back/Next. Pasaba porque el navegador reserva un espacio para la
barra de scroll solo cuando hace falta: una página larga (como la home) la
tiene, una corta (como algunos proyectos) no, y como el header está
centrado, ese cambio de ancho disponible lo corría un poquito. Ahora ese
espacio se reserva siempre, así el ancho nunca cambia entre páginas.

**16. El control de volumen dejó el cyan y ahora es blanco/gris → violeta.**
Era el único lugar del sitio con un color aparte (`--c-accent-2`, cyan) —
ese token ya no existe. Ahora usa el mismo violeta que el resto de la
interfaz: en reposo la barra y el círculo son blancos/grises, y a medida
que subís el volumen se van poniendo violeta con un brillo que crece
alrededor. También la alargué (240px, antes 168px) para que sea más cómoda
de agarrar y de leer el nivel de un vistazo.

**17. El botón de pausa y la línea de tiempo del reel tienen un brillo
violeta permanente.**
Antes eran simples (blanco sobre gris oscuro); ahora, mientras están
visibles (al pasar el mouse, o siempre en celular), tienen un resplandor
violeta que los hace más fáciles de encontrar sobre el video.

**18. El difuminado de los bordes del reel es más ancho y gradual.**
La primera versión (14px) se notaba como una línea de gradiente en vez de
un desvanecido suave. Los costados (que tienen lugar de sobra) ahora se
difuminan en 40px; el borde de abajo se quedó en uno más corto (22px)
porque el botón de pausa y la línea de tiempo están a menos de 10px de
ese borde, y un difuminado más ancho ahí se los empezaba a comer.

**19. El fondo borroso del reel debería ir más fluido.**
Primero até el costo de repintado (el `blur` sobre un video grande en cada
cuadro) — ayuda, pero me dijiste que el problema real era otro: al cargar
la página se veía entrecortado, pero apenas buscabas un punto del video con
la línea de tiempo (o volvías a él) se ponía fluido. Esa pista apuntaba al
mecanismo que mantiene sincronizados el video de adelante y su copia
borrosa de atrás: antes se corregía el desvío entre los dos solo cuando el
navegador avisaba "timeupdate" (un puñado de veces por segundo), así que
podían quedar un rato notoriamente desalineados entre corrección y
corrección — buscar un punto forzaba una resincronización manual al
instante, por eso ahí se veía bien. Ahora la corrección se chequea en cada
cuadro (no unas pocas veces por segundo), así los dos quedan pegados todo
el tiempo, desde el arranque. Como en este entorno no puedo reproducir
video de verdad, no lo pude confirmar a ojo — avisame si en tu navegador
se sigue viendo entrecortado.

**20. El reel se puede ver a pantalla completa.**
Nuevo botón en los controles (el de las flechitas en las esquinas). Agranda
todo el marco del reel, no solo el video, así el botón de pausa y la línea
de tiempo lo siguen acompañando arriba de la pantalla completa en vez de
perderse.

**21. La línea de tiempo del reel ya no es de un violeta plano.**
Ahora el tramo ya recorrido va de un violeta profundo (al principio) a uno
claro con brillo (justo en la bolita) — como si el resplandor se
acumulara a medida que avanza, en vez de un solo color parejo.

**22. El control de volumen "respira" cuando el sitio está silenciado.**
La bolita blanca se agranda y achica de a poco todo el tiempo que el sonido
esté apagado, como invitando a subirlo. Se para sola en cuanto lo activás.

**23. El control de volumen tiene más relieve.**
El tramo vacío de la barra ahora tiene una sombra hacia adentro (como un
canal tallado); el tramo ya subido tiene un brillo violeta de dos capas
(uno claro pegado a la barra, uno más profundo alrededor) en vez de un
resplandor parejo — un poco más tridimensional, como pediste.

**24. El difuminado del reel volvió a ser solo abajo.**
Habíamos probado agregarlo también a los costados; lo sacamos de ahí y
quedó como al principio: solo el borde inferior se disuelve hacia la
página, izquierda y derecha quedan con el corte normal.

**25. En celular el reel ya no tiene difuminado abajo.**
Ahí el marco ocupa todo el ancho pegado al video, sin el mismo "aire"
alrededor que en desktop, y el difuminado se terminaba viendo como un
corte raro en vez de un desvanecido. En desktop sigue igual.

**26. La pantalla completa del reel ya no recorta los bordes en celular.**
Antes el video llenaba la pantalla completa recortando lo que sobraba
(`object-fit: cover`), y en un celular en vertical eso significaba perder
casi todo el video a los costados. Ahora, a pantalla completa, el video
respeta su proporción real y deja franjas negras en vez de recortar —
como cualquier reproductor de video de verdad.

**27. La tipografía cambió de Alexandria a Space Grotesk.**
Me dijiste que la anterior era muy fina y elegante, y que querías algo
más grueso y moderno — parecido al título de una imagen que me
mandaste. Elegí Space Grotesk (gratis, de Google Fonts) por ese estilo
geométrico y contundente. Los títulos pasaron a negrita (antes eran
livianos) y el cuerpo de texto también subió un poco de peso. Está
autoalojada igual que la anterior — no depende de Google en cada visita.

> ⚠️ El logo del reel (el ecualizador con "IAN IACONO") sigue siendo la
> imagen placeholder vieja, con la tipografía del sistema, no Space
> Grotesk — es una imagen fija, no texto. Cuando subas tu reel real,
> esto deja de importar.

**28. Te generé dos paletas de color nuevas para comparar, a partir de las
imágenes que mandaste — no elegí ninguna, quedan como archivos aparte
hasta que decidas.**
Mantuve el fondo oscuro (es la decisión de marca del punto 8) y adapté
el color dominante de cada imagen como acento, en vez de copiar los 5
colores literales de cada una — meterlos todos tal cual rompía los
degradados de los controles. Te mandé un archivo único por cada opción
para que las compares vos.

**29. El selector Sound Portfolio / Audiovisual Portfolio ahora tiene una
bolita blanca que desliza de un botón al otro, con un brillo suave — y
volvió a usar la tipografía anterior (Alexandria), pero solo ahí.**
Pediste que ese control anime en vez de simplemente cambiar de color, así
que ahora hay una sola "bolita" de fondo (blanca, con glow) que se mueve
con `transform` — es más fluida que animar el ancho o el color a mano, y
se acomoda sola aunque "Sound Portfolio" y "Audiovisual Portfolio" midan
distinto. También pediste mantener Space Grotesk en el resto del sitio
pero volver a la tipografía anterior solo en este selector: recuperé del
historial de git los archivos de Alexandria y los dejé exclusivos de
`.portfolio-tab` con una variable aparte (`--font-tabs`), así el resto del
sitio no se toca.

**30. Te generé dos versiones más para comparar — "Versión Z" (la paleta
violeta actual, sin tocar nada) y una versión radical con la paleta
completa de "Daily Bloom" — y todavía no elegiste ninguna, así que el
sitio real sigue en violeta.**
La versión radical usa los 5 colores exactos de esa imagen (blanco,
magenta, coral, azul pizarra y ciruela — la vez anterior solo había usado
3) y el fondo dejó de ser un color plano: es un degradado pintado a mano,
con varias manchas de color superpuestas en vez de un degradado lineal de
dos puntas, como pediste. Se nota más donde el diseño ya tenía lugar
libre — debajo del reel, en celular, y en los márgenes alrededor del
video — porque el reel en sí sigue ocupando la pantalla como decidimos en
el punto 1. El logo del reel también cambia de color para acompañar
(mismo aviso del punto 27: es una imagen fija). Los dos arreglos del punto
29 (bolita animada + tipografía del selector) ya están **en las dos
versiones nuevas**, porque son arreglos de verdad — no dependen de qué
paleta elijas.

**31. Elegiste la Versión Z: quedó como el sitio real, y todo lo que sigue se
construyó sobre ella.**
Las paletas "Daily Bloom" (simplificada y radical) y "Philippe" quedan
descartadas — si mas adelante las queres retomar, siguen en el historial
de git.

**32. Saqué la sombra que se veía debajo del reel; solo queda el difuminado
alpha del borde inferior.**
Era un `box-shadow` grande (el mismo que usan las tarjetas de proyecto),
pensado para superficies planas — abajo del reel se leía como una mancha
oscura de más. El difuminado del borde (que ya existía) es el único efecto
que queda ahí. También hice que el fondo borroso detrás del reel se
apague por completo (alpha 0) en vez de terminar en un color plano — así
no hay un corte duro entre el reel y lo que sigue.

**33. El fondo de la página deja de ser negro liso cerca del final: ahí
aparece un degradado pintado a mano, violeta oscuro y naranja.**
No es un degradado lineal de dos puntas — son varias manchas de color
superpuestas (el mismo recurso de la "Versión radical" que habías visto,
pero con esta paleta nueva). Queda anclado siempre al final de la página
(`background-position: bottom`), así que no importa cuánto mida — arriba
sigue siendo negro (donde está el reel) y recién cerca del pie de página
se pinta. Usé el violeta que ya tenían los subtítulos de cada proyecto
(`#8b7cf6`) como uno de los colores del degradado, para que tenga sentido
con el resto de la página en vez de ser un agregado suelto.

**34. En desktop, Sound y Audiovisual ya no se alternan con botones: conviven
bajo un título "Selected Works".**
Audiovisual queda a la izquierda (1 columna) y Sound a la derecha (2
columnas), separadas por una línea fina y un poco más de aire que el
espacio interno de cada grilla. En celular no cambié nada: ahí siguen los
dos botones de siempre, alternando una grilla a la vez (no entran 3
columnas de tarjetas en una pantalla chica).

**35. Reorganicé qué va en Audiovisual y qué en Sound, y de paso corregí las
tarjetas repetidas.**
Audiovisual ahora es, en este orden: Rèport Travel Media, Detras del
Puesto, Te Lo Aseguro y Juleriaque. Sound se quedó igual (Carbon Case,
Lumia, Red Bull Batallas, La Llamada Fatal, Koupe). De paso: Detras del
Puesto aparecía dos veces — dejé una sola. Y la tarjeta que decía "Rèport
Travel Media" pero mostraba el logo de *Juleriaque* (y llevaba a la página
de Rèport) ahora es una tarjeta y una página propias de Juleriaque — la
imagen ya existía en el sitio, solo estaba mal etiquetada. Como nunca tuve
el texto real de Juleriaque, por ahora tiene Lorem ipsum, igual que "Te Lo
Aseguro" (ver la lista de pendientes más abajo).

**36. Escribí el texto real de The Carbon Case y de Detras del Puesto (en
inglés y en español) — antes ambos tenían el texto de relleno de "la
creación del cosmos".**
Para The Carbon Case usé el resumen que me pasaste (la producción de Helmi
sobre mercados de carbono en Paraguay, Mozambique, Tailandia y Singapur) y
lo extendí un poco, agregando una oración sobre tu trabajo de sonido —
mezcla y masterización — para que quede parejo en longitud con los demás
textos del sitio. Para Detras del Puesto investigué de qué trata el
podcast (entrevistas de carrera profesional con referentes de turismo,
tecnología, marketing y liderazgo corporativo) y escribí una descripción
breve, mencionando la animación del logo, la identidad sonora y la
cortina musical de los créditos que me dijiste que hiciste. Revisalos
igual — es texto nuevo, no una traducción de algo que ya hubieras escrito.

**37. Contact ya no es una página aparte: vive al final del home, con un
formulario de verdad.**
El link "Contact" del header ahora hace scroll hasta esa sección en vez de
cambiar de página (igual que "Projects"). El formulario (nombre, email,
mensaje) manda un mail con lo escrito — funciona sin backend, pero abre el
cliente de correo de quien escribe en vez de mandarlo directo. Si más
adelante preferís que se mande solo, sin abrir nada, hace falta conectar
un servicio como Formspree (tiene plan gratis) — avisame y lo armamos.
Mientras tanto hay que reemplazar `TUMAIL@ejemplo.com`, el usuario de
Instagram y el número de WhatsApp por los tuyos — el comentario arriba del
formulario, en `index.html`, dice exactamente dónde.

**38. Agregué un pie de página con el ícono de Instagram, igual en todas las
páginas.**
Por ahora linkea a un usuario de ejemplo (`TUUSUARIO`) — reemplazalo por
el tuyo cuando quieras.

**39. Ajusté "Selected Works" con tu segunda ronda de feedback — pildoras,
degradado más discreto, tarjetas más grandes, y te mandé el archivo esta
vez.**
Las etiquetas "Sound" y "Audiovisual" volvieron a verse como pildora
blanca, igual que los botones de celular de antes — ahora las dos se ven
"seleccionadas" al mismo tiempo, ya que conviven en vez de alternar. Saqué
el degradado pintado (violeta y naranja) que había puesto en el fondo
general: ahora es mucho más discreto, solo violeta muy oscuro sobre negro,
y vive únicamente en Contact y el pie de página — no sube más arriba de
los proyectos. Las tarjetas de proyecto volvieron a su tamaño de antes (se
habían achicado al dividir la grilla en dos columnas) y además agrandé el
ancho máximo del sitio, así se aprovechan los costados que quedaban
vacíos; también achiqué el espacio entre Audiovisual y Sound. Te mando dos
archivos para comparar: uno con Sound y Audiovisual separados (el que
quedó en el sitio real) y otro con "Selected Works" mostrando **todos**
los proyectos juntos, sin distinción — decime cuál te gusta más.

### Y estas siguen tal cual estaban, esperando decisión tuya

- Cuatro proyectos todavía comparten el texto de relleno (*"Cortometraje
  sobre la creación del cosmos…"*): Lumia, Rèport Travel Media, Koupe y
  Polvora Podcast.
- **Te Lo Aseguro | Analipsis** tiene Lorem ipsum y el subtítulo dice `V`.
- **Juleriaque** también tiene Lorem ipsum (ver el punto 35) — nunca tuve
  su texto real ni un video para esa página.
- **Polvora Podcast** existe en `#section12` pero **no hay ningún link que
  lleve ahí**. Se entra solo escribiendo la dirección.
- La primera tarjeta de Audiovisual Portfolio (*"Las cenizas no se apagan"*)
  **no tiene título** debajo.
