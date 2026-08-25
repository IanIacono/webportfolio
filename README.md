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

**El degradado violeta muy sutil sobre negro, cerca del final de la
página** (solo en la sección Contact — el pie de página es negro sólido,
sin degradado) usa un color propio, `--c-bloom-violet` — cambialo si
querés otro tono. Es un `linear-gradient` simple en `.contact-band`
(buscalo en `css/style.css`, sección "10b. FORMULARIO DE CONTACTO"), no
una imagen, así que también se edita solo ahí.

---

## 6. Completar la sección Contact

En el Carrd original esta sección **estaba vacía**. Ahora vive al final del
home (abajo de los proyectos) con un formulario y un link a Instagram, pero
todavía apuntan a datos de ejemplo.

Buscá en el HTML el comentario que dice `CONTACTO` y vas a ver esto:

```html
<form class="contact-form reveal" action="mailto:TUMAIL@ejemplo.com" ...>
  ...
</form>
<div class="contact-form__links reveal">
  <a class="contact-form__social" href="https://instagram.com/TUUSUARIO" ...>
    ...
  </a>
</div>
```

Para activarlo con tus datos:

1. Reemplazá `TUMAIL@ejemplo.com` (en el `action` del `<form>`) por tu mail.
2. Reemplazá `TUUSUARIO` por tu usuario real de Instagram.

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

**40. Rediseñé la barra de arriba: arranca como una bienvenida (tu nombre y
subtítulo, grandes y centrados) y se convierte en la barra chica de
siempre al scrollear — basado en el header de jeffmoberg.tv/films que me
pasaste.**
Arriba de todo del home vas a ver "Ian Iacono" grande y centrado, con el
subtítulo "Sound Designer // Multimedia Post Production" debajo — ahí no
hay links ni control de volumen todavía, es más una bienvenida que una
barra de navegación. Apenas empezás a scrollear (o en cualquier otra
página, donde no hay "arriba de todo" que valga) se desvanece y aparece la
barra chica con Projects, Contact y el volumen, como antes. Además, el
link de la sección que estás mirando (Projects o Contact) ahora se
subraya solo, seteado con un observer que mira qué sección cruza el medio
de la pantalla.

**41. Achiqué el control de volumen del header (de 240px a 120px).**

**42. Corregí el degradado de Contact: estaba mal (te diste cuenta) —
quedaba como una caja angosta en vez de ocupar todo el ancho de la
página.**
El problema era que lo había puesto en el `<div>` del formulario, que es
angosto a propósito (para que el texto no estire de punta a punta). Ahora
el color va en una franja nueva, de ancho completo, que envuelve a ese
mismo div angosto — así el degradado sí ocupa toda la página de lado a
lado, pero el violeta sigue sin subir más arriba de Contact (eso no
cambió).

**43. Saqué el pie de página por ahora (el que agregué en el punto 38) y
en Contact dejé solo el ícono de Instagram, sin el botón de WhatsApp.**
Si más adelante lo volvés a querer, avisame — quedó en el historial de
git, no hay que rehacerlo de cero.

**44. Corregí que Contact no se veía centrado — tenías razón.**
El formulario tenía su propio ancho máximo, más angosto que el título de
arriba, y sin nada que lo centrara — quedaba pegado a la izquierda de su
propia sección en vez de alinearse con el título. Ahora comparte el mismo
ancho que el título "Contact" y el ícono de Instagram de abajo.

**45. Volví atrás en Selected Works: Sound y Audiovisual alternan con el
selector de pestañas, como antes de esa idea — en todos los tamaños de
pantalla, no solo en celular.**
La versión con las dos categorías lado a lado no te convenció, así que
saqué esa parte y dejé el selector original (con la bolita blanca que
desliza). Audiovisual ahora se ve en 2 columnas en vez de 3 — con 4
proyectos nomás, 3 por fila dejaba una tarjeta sola y todo se veía chico;
en 2 quedan parejas y más grandes.

**46. Rediseñé el header de arriba de todo: ahora el nombre y subtítulo
conviven con Showreel, Projects, Contact y el volumen — no aparecen
recién al scrollear.**
Agregué "Showreel" como tercer link, al lado de Projects y Contact —
lleva de vuelta al reel del principio. Tu nombre ahora usa una tipografía
distinta a la del resto del sitio (Instrument Serif, itálica) para que
funcione como firma, y está más grande. En pantallas angostas (celular y
tablet) los links y el volumen se ocultan hasta que se scrollea, igual
que antes — si los dejaba siempre visibles ahí, se superponían con el
nombre grande.

**47. Separé el reel del header: más espacio arriba, y sumé un difuminado
también en el borde superior del video (antes solo estaba abajo).**
Con el nombre y los links ahora conviviendo arriba, el reel quedaba
pegado contra ese texto. Le di más aire arriba (el reel es un poco más
chico para que siempre entre completo en pantalla, sin scrollear) y el
borde superior del video ahora se disuelve igual que el de abajo, en vez
de cortar en seco contra el header.

**48. El reel: más grande y bastante más separado de tu nombre — el
punto 47 se había quedado corto.**
El margen libre alrededor del reel antes se repartía igual arriba y
abajo, así que agrandar el reel comía espacio de los dos lados por
igual y el margen de arriba nunca crecía solo. Ahora ese reparto es
al revés: casi todo el margen quedó arriba (separando el reel de tu
nombre) y abajo quedó lo mínimo, lo que además deja lugar para que el
reel sea un poco más grande. Sigue entrando completo en pantalla al
cargar la página, sin necesidad de scrollear, en todos los tamaños que
probé (celular incluido).

**49. Volvió el pie de página (lo había sacado en el punto 43): tu
nombre, el subtítulo y el © 2026, en negro sólido.**
Repite la misma marca del header — mismo nombre, mismo trazo
tipográfico — para que abrir y cerrar el sitio se sientan parte del
mismo diseño. A diferencia del header, que es transparente y flota
sobre el reel, el pie de página tiene fondo negro sólido: ahí abajo no
hay ningún video atrás sobre el que flotar.

**50. El video de fondo borroso (el que se agranda detrás del reel)
ahora sigue al reel también en play/pausa, no solo en qué momento del
video muestra.**
Antes, si pausabas el reel con su botón, el de fondo seguía
reproduciéndose solo — quedaban desincronizados. Ahora se pausa junto
con el reel, y si el reel llega al final, también — van a estar
pegados todo el tiempo, tanto en el momento del video como en si está
sonando o quieto.

**51. Rediseñé el pie de página otra vez (el del punto 49 no era lo que
buscabas): ahora copia el estilo del footer de jorgeserrano.com.ar que
me pasaste.**
Antes era una versión chica del header (nombre grande, todo apilado y
centrado). Ahora es una sola fila discreta — nombre, subtítulo y
copyright repartidos de punta a punta, separados del resto de la
página solo por una línea fina arriba, sin caja ni fondo propio (se
mezcla con el fondo de la página, como en el sitio de referencia). En
celular esa fila pasa a apilarse. El sitio de referencia también tiene
un "dock" flotante con íconos (GitHub, Twitch, LinkedIn, CV) que se
queda pegado en un costado al scrollear — eso es un elemento aparte
del footer ahí, no lo agregué porque no lo pediste y el ícono de
Instagram ya vive en Contact.

**52. Sumé el título "Selected Works" al lado del selector de Sound /
Audiovisual, centrado y compartiendo el mismo borde inferior que las
pestañas.**
Los dos comparten una fila: el título más grande a la izquierda, las
pestañas a la derecha, alineados por abajo (no por el medio) para que
se vean como una sola unidad. En celular se apilan, título arriba y
pestañas abajo, ambos centrados.

**53. El reel: lo subí un poco más, y encontré y corregí el "aura
negra" que se veía en el borde de abajo.**
La separación con el nombre del punto 48 se quedó, achicada apenas un
poco. Lo del aura era un elemento viejo (una franja con degradado,
`.hero::after`) que quedó de una versión anterior a que el reel tuviera
su propio difuminado arriba y abajo — hacía el mismo trabajo por su
cuenta, pero ahora se superponía con el difuminado del reel y se veía
como un halo oscuro extra solo abajo (arriba nunca existió ese
elemento, por eso ahí se veía bien). Lo saqué: el difuminado propio del
reel ya alcanza solo.

**54. Cambié la tipografía del nombre de Instrument Serif itálica a
Unbounded Black — por ahora, mientras seguís decidiendo.**
Me dijiste que no te terminaba de cerrar ninguna opción de la primera
ronda del todo, así que dejé aplicada Unbounded (la que habías
elegido) y armé una segunda ronda de opciones inspiradas en el header
de jeffmoberg.tv que me pasaste — ese sitio usa una tipografía con
licencia (Adobe Typekit) que no se puede autohospedar directo, así que
busqué alternativas libres parecidas a las dos que encontré ahí
(Source Code Pro para el nombre chico de la barra, Abel para el título
grande de portada). Están en el mismo link de antes, actualizado.

**55. De paso, probando el punto 52 en celular, encontré y corregí un
error: el texto "Audiovisual Portfolio" se salía de la pantalla en vez
de entrar en su pestaña.**
Era un problema de flexbox ya viejo (no algo que rompí yo esta ronda,
simplemente nunca se había visto en una captura de celular con las
pestañas a la vista): el texto tenía prohibido partirse en dos líneas,
así que cuando no entraba en una sola, se salía del botón en vez de
acomodarse. Ahora "Audiovisual Portfolio" se parte en dos líneas
("Audiovisual" / "Portfolio") cuando hace falta, centrado dentro de su
pestaña.

**56. "Selected Works" pasó a estar arriba del selector Sound /
Audiovisual (antes estaban lado a lado) y el selector en sí es un poco
más chico.**
Los dos quedan apilados y centrados, en todos los tamaños de pantalla
(antes solo se apilaba en celular).

**57. Sumé un video de fondo, propio de cada pestaña, detrás del
título, el selector y la grilla — con los dos videos que me pasaste.**
Con Sound Portfolio elegido se ve tu video "8319438" anclado a la
izquierda, disolviéndose hacia la derecha; con Audiovisual Portfolio,
el otro video ("15315hd"), espejado — anclado a la derecha,
disolviéndose hacia la izquierda. Los dos en baja exposición (más
oscuros, para no competir con las tarjetas de proyecto) y disueltos
también arriba y abajo, sin bordes en escuadra. Al cambiar de pestaña
los dos videos se cruzan con una transición suave. Los autohospedé
igual que el resto de los videos del sitio — de paso les corregí un
detalle técnico del archivo (cómo está ordenado por dentro) para que
se reproduzcan bien en el navegador. En celular no aparecen: las
tarjetas ocupan casi todo el ancho ahí, así que no queda lugar donde
se note el efecto, y no vale la pena bajar 2 videos más solo para eso.

**58. El reel: lo subí un poco más — te había quedado con un poco de
aire de más respecto al punto 53.**

**59. Achiqué el pie de página (menos alto).**

**60. Subí el reel de nuevo y esta vez probé que el borde de abajo
entre en pantalla sin scrollear en un rango grande de altos de
ventana, incluso chicos (desde 568px) — en todos entra.**
Si en tu pantalla lo seguís viendo cortado, decime el ancho y el alto
de tu ventana del navegador (no de la pantalla completa) para
probarlo exacto. Y una posibilidad real: como el push a GitHub sigue
fallando toda la sesión, es probable que estés mirando la versión
publicada en Vercel, que todavía no tiene ninguno de los cambios de
hoy ni de la ronda anterior — solo el archivo que te mando en cada
ronda los tiene.

**61. Tu nombre estaba pegado contra el borde de arriba de todo: le di
un poco más de aire (y todo lo que va con él — el volumen, los links —
bajó con él, ya que se mueven juntos).**

**62. El reel ahora tiene las esquinas redondeadas.**

**63. Reemplacé el video de fondo de Sound Portfolio por el que me
pasaste (la onda de sonido) y le puse fusión "add" (`plus-lighter` en
CSS) — el negro del video desaparece solo (sumarle negro a algo no lo
cambia) y queda prendida únicamente la onda blanca sobre lo que sea que
haya atrás. De paso corregí un bug real que encontré al probarlo: sin
un ajuste de apilado, ese brillo se filtraba por encima de las
tarjetas de proyecto en vez de quedar atrás — ahora se queda atrás,
como corresponde, y solo se ve en los espacios vacíos alrededor.**
También comprimí el archivo que me pasaste (era 4K y pesaba 16MB) a
1080p, que para un fondo alcanza de sobra — quedó en 3MB.

**64. En celular, arriba de todo de la página, ahora se ven los links
(Showreel, Projects, Contact) debajo de tu nombre y subtítulo — antes
quedaban escondidos hasta que scrolleabas.**
Antes de esta ronda, en pantallas angostas el nombre grande y los
links no entraban juntos en la misma fila (se superponían), así que
los links se ocultaban hasta que aparecía la barra chica al scrollear
— quedaba un rato, arriba de todo, sin ninguna forma de navegar salvo
scrollear a mano. Ahora hay una segunda fila, solo en celular/tablet,
debajo del subtítulo, con los mismos tres links — se desvanece junto
con el nombre al scrollear, momento en el que la barra chica (con sus
propios links) ya está visible. Le di un poco más de aire al reel para
que le entre esta fila nueva sin quedar pegados.

**65. Volví atrás con los videos de fondo de Selected Works (puntos
57 y 63): saqué los dos, la sección quedó con el fondo normal de
antes.**

**66. Saqué las esquinas redondeadas del reel — vuelve a ser en
escuadra.**

**67. El difuminado de arriba y abajo del reel era muy brusco (se
notaba como una línea en vez de una disolución). Lo hice bastante más
gradual — la distancia del degradé pasó de 22px a 72px.**

**68. Saqué el cartel violeta "VISTA PREVIA..." que aparecía abajo de
todo en el archivo que te mando cada ronda.**

**69. Aumenté el desenfoque del fondo borroso detrás del reel (de 44px
a 64px de blur).**

**70. El difuminado del punto 67 se había ido al otro extremo: 72px
comía demasiado video. En vez de adivinar un cuarto número, te mando
una comparación real (mismo reel, distintas distancias) para que
elijas vos — quedó en 28px mientras tanto, ni el original (22px, muy
brusco) ni el de la ronda pasada (72px).**

**71. El punto 69 fue un malentendido mío: no pedías más blur, pedías
que el fondo borroso tuviera un degradé alpha en su borde de abajo,
para que se funda con el fondo de la página en vez de cortar en seco
contra la sección que sigue. Volví el blur a 44px (como estaba antes
del punto 69) y agregué ese degradé.**
No revivé el `.hero::after` del punto 53 (ese fue el que causaba el
aura negra) — en cambio extendí `.hero__bg::after`, que ya vive bien
atrás de todo (detrás del reel, nunca se le superpone), agregándole
`var(--c-bg)` como último color del degradé. Así el fondo borroso se
disuelve hacia el mismo color exacto del resto de la página según vas
bajando, sin repetir el bug viejo.

**72. El botón Back/Next de las páginas de proyecto quedaba a una
altura distinta en cada página, según cuánto texto tuviera esa página
en particular — ahora queda siempre a la misma altura, en todas.**
La fila de video+texto ahora tiene un piso de altura fijo (52rem) y el
botón se ancla siempre abajo de ese piso, en vez de quedar pegado justo
después del último párrafo (antes, un texto corto lo dejaba mucho más
arriba que uno largo). En celular esto no aplica — ahí todo se apila y
se scrollea, así que no hacía falta.
_(Nota: esto es preciso en pantallas grandes. En anchos intermedios
tipo tablet, si el texto de un proyecto es mucho más largo que el
resto — como The Carbon Case — puede que su botón quede un poco más
abajo que en los demás, porque el texto en ese ancho ocupa más líneas.
Avisame si se nota y lo afino.)_

**73. Le agregué a "La Llamada Fatal" el tercer episodio de Spotify
que me pasaste.**

**74. "Polvora Podcast" existía como página pero no estaba en ninguna
grilla — solo se llegaba ahí apretando "Next" desde otro proyecto.
Ahora está en la grilla de Audiovisual. De paso, emparejé las dos
grillas (Sound y Audiovisual) para que se vean igual: 2 tarjetas por
fila, 3 filas, en las dos.**
Como portada le puse la misma miniatura que ya tenía su video de
YouTube — el sitio original tampoco tenía una imagen de tapa propia
para este proyecto, así que no había otra de donde sacarla.

**75. Entendí mal el punto 74: "3 filas horizontalmente" era pedirme 3
tarjetas POR fila (3 columnas), no 3 filas en total — hice justo lo
contrario. Ya está: las dos grillas (Sound y Audiovisual) volvieron a
3 tarjetas por fila, 2 filas cada una. Polvora Podcast se queda donde
quedó en el punto 74, en la grilla de Audiovisual.**

**76. En desktop saqué los botones Back/Next de las páginas de
proyecto — con textos largos quedaban muy abajo para llegar sin
scrollear. Ahora, en cualquier momento, tocar el borde izquierdo de
la pantalla vuelve a proyectos y el borde derecho lleva al siguiente.
Se iluminan apenas al pasar el mouse, para que se note que están ahí
sin competir visualmente con el resto. En celular sigue el botón de
siempre — ahí los bordes ya los usan los dedos para el gesto de
"volver" del sistema.**

**77. Al cambiar entre Sound y Audiovisual ya no es un salto seco: la
grilla vieja se desliza y se desvanece hacia un lado, la nueva entra
deslizándose desde el otro — hacia la izquierda al pasar a
Audiovisual, hacia la derecha al volver a Sound.**

**78. Subí un poco tu nombre y el subtítulo (con todo lo que va
alineado a eso), así queda un poco más separado del reel de abajo.**

### Y estas siguen tal cual estaban, esperando decisión tuya

- **Koupe** todavía comparte el texto de relleno de Lumia (*"Cortometraje
  sobre la creación del cosmos…"*) — no me lo pediste esta vez, así que no
  lo toqué (Rèport Travel Media y Polvora Podcast, que también lo
  compartían, ya tienen su texto propio desde el punto 93).
- **Te Lo Aseguro | Analipsis** ya tiene texto real (punto 93), pero el
  subtítulo/rol de esa página todavía dice `V` — no sé cuál es tu rol real
  ahí, así que lo dejé sin tocar.
- **Juleriaque** también tiene Lorem ipsum (ver el punto 35) — nunca tuve
  su texto real ni un video para esa página.
- La primera tarjeta de Audiovisual Portfolio (*"Las cenizas no se apagan"*)
  **no tiene título** debajo.

**79. Volví atrás con lo del punto 76 (los bordes clickeables): saqué
esa navegación y volvieron los botones Back/Next de siempre — visibles
en desktop y celular por igual.**
Esta vez, sin el piso de altura artificial que le había puesto antes
(punto 72): el botón va pegado justo debajo del último párrafo, con el
mismo margen que separa a los demás bloques — ni "recontra abajo" para
todos como cuando forzaba la misma altura en cada página, ni escondido
atrás de un borde invisible. En la mayoría de las páginas ya queda
visible sin scrollear apenas entrás; la única excepción real es The
Carbon Case, que tiene bastante más texto que el resto — ahí sí hace
falta bajar un poco para verlo, porque el texto en sí ya no entra
entero en una pantalla.

**80. Subí un poco el reel y lo agrandé apenas — bajé
`--hero-top-clearance` de 9.5rem a 8.75rem.** Volví a chequear que
siga entrando entero en la pantalla al cargar la página, en alturas
de 568px a 1080px — sigue entrando en todas.

**81. Me mandaste una captura marcando con una línea roja hasta dónde
querías que llegara el reel, agrandándolo pero sin mover el borde de
abajo. Bajé `--hero-top-clearance` de 8.75rem a 7.5rem para eso.**
El borde de abajo del reel depende únicamente de
`--hero-bottom-clearance` (no toqué ese) — por eso pude agrandarlo
solo hacia arriba sin que el de abajo se corra ni un pixel: lo medí
antes y después del cambio y quedó exactamente en el mismo lugar
(937.98px con la ventana en 1920×950, por si querés el número). Volví
a chequear que el reel entre entero en la pantalla al cargar, de
568px a 1080px de alto — sigue entrando en todas.

**82. Punto medio entre el tamaño del punto 80 y el del punto 81:
`--hero-top-clearance` quedó en 8.125rem (exactamente entre 8.75rem
y 7.5rem).** Mismo mecanismo de siempre: el borde de abajo no se
movió (sigue en 937.98px), sólo el de arriba. Volví a chequear que
entre entero en pantalla de 568px a 1080px de alto.

**83. Volvimos al tamaño del reel de antes de que empezara a
pedirte que lo agrandara — me mandaste el archivo de esa ronda como
referencia, así que `--hero-top-clearance` volvió a 8.75rem (el del
punto 80) en vez del punto medio del 82.** Todo lo demás en ese
archivo (botones Back/Next, grillas de 3 por fila, etc.) ya coincidía
con lo que hay ahora, así que no hubo que tocar nada más.

**84. Los embeds de YouTube: cambié el dominio de youtube-nocookie.com
a youtube.com (el modo "sin cookies" a veces valida más estricto de
dónde viene la página, y es el sospechoso más común en estos casos).**
Ojo: esto no soluciona por sí solo el problema de fondo, que es cómo
estás probando el sitio, no el código del embed — ver el mensaje en el
chat para la explicación completa y la forma real de probarlo.

**85. Al apretar Back en un proyecto, ahora hace la misma mini
animación (fade + deslizamiento hacia arriba) que al entrar a un
proyecto — antes volvía de golpe, sin transición.** Es la misma
animación en los dos sentidos porque las dos pasan por la misma
función del router (`show()` en main.js), y ahora se repite cada vez
que cambiás de página — no solo la primera vez que la ves, a
diferencia del fade-in de los bloques al scrollear.

**86. GitHub Pages te mostraba la página sin ningún estilo (sin CSS,
sin JS, sin imágenes) — arreglado: era un problema de rutas.** Todo el
sitio usaba rutas "absolutas" que empiezan con `/` (por ejemplo
`/css/style.css`). Esas rutas funcionan en Vercel porque ahí el sitio
vive en la raíz del dominio (`tudominio.com/css/style.css`), pero
GitHub Pages publica los repos dentro de una subcarpeta
(`ianiacono.github.io/webportfolio/`), y una ruta que arranca con `/`
siempre apunta a la raíz del dominio (`ianiacono.github.io/css/...`,
que no existe) sin importar en qué subcarpeta esté la página. Cambié
todas esas rutas a relativas (sin el `/` adelante): así el navegador
las busca relativas a donde está la propia página, y funciona igual
de bien colgado en la raíz de un dominio o en una subcarpeta — no hay
que tocar nada distinto según dónde lo publiques. Lo probé armando una
copia del sitio local que simula exactamente la misma estructura de
carpetas que usa GitHub Pages, y confirmé que las 16 cosas que pide la
página (CSS, fuentes, imágenes, JS) cargan bien, sin ningún error.

**87. Saqué el subtítulo de Contact ("Tenés un proyecto en mente?
Contame de qué se trata."), y el formulario ahora manda el mail
directo a tu casilla real (`iaconoian1@gmail.com`) en vez del
placeholder de ejemplo.**

**88. Toda la sección de Contact ahora está centrada de verdad.** El
`.wrap` que la contiene ya estaba centrado en la página, pero el
título "Contact" y el ícono de Instagram de abajo quedaban pegados al
borde izquierdo de esa caja (alineación de texto/flex por defecto),
lo que daba la sensación óptica de que todo estaba corrido a la
izquierda. Centré el título y el ícono — el formulario en sí ya
ocupaba el ancho completo de forma simétrica, así que no hacía falta
tocarlo.

**89. Todo el texto del sitio pasa a inglés, salvo el bloque marcado
"ESP" de cada proyecto, que se queda en español como corresponde.**
Traduje toda la navegación, el reproductor del reel, las tarjetas de
proyecto, el selector Sound/Audiovisual, el formulario de contacto y
la descripción para buscadores — botones, aria-labels (para lectores
de pantalla), todo. Los párrafos "ESP" de cada proyecto no se
tocaron: siguen en español exactamente como estaban, y ahora llevan
`lang="es"` (antes era el bloque "ENG" el que llevaba la marca
`lang="en"`, porque el idioma por defecto de toda la página era
español — ahora es al revés: el `<html>` pasa a `lang="en"` y es el
bloque en español el que se marca como la excepción). Esto es más que
estética: le dice correctamente a los lectores de pantalla y a Google
en qué idioma está cada párrafo.

**90. El formulario de Contact no andaba: Chrome (y Google en general)
lo marcaban como "no seguro" y bloqueaban el envío — arreglado, era el
método `mailto:` que usaba.** `action="mailto:..."` no es una conexión
verificable como HTTPS, así que los navegadores modernos directamente
frenan el envío con una advertencia en vez de dejarlo pasar. La
solución es mandar el formulario a un servicio que sí reciba un POST
HTTPS de verdad y te lo reenvíe por mail — usé
[FormSubmit](https://formsubmit.co) porque no pide cuenta ni backend
propio, es gratis y anda con un cambio de una línea en el `action`.
Quedó mandando a `iaconoian1@gmail.com`. **Ojo con esto:** la primera
vez que alguien mande el formulario en el sitio ya publicado,
FormSubmit te va a mandar un mail pidiendo que confirmes esa
dirección (es su forma de evitar que cualquiera mande correo en tu
nombre a direcciones ajenas) — tenés que entrar a ese mail y confirmar
una sola vez; después de eso los envíos siguientes te llegan
directo, sin que la persona que escribe note nada raro. Te recomiendo
probarlo vos mismo apenas esté publicado (mandate un mensaje de
prueba) para activarlo de una — desde donde yo trabajo no tengo forma
de mandarte ese mail de prueba ni de confirmarlo por vos.

**91. El formulario de Contact te mandaba a la pestaña de FormSubmit
al apretar Send — arreglado, ahora no se mueve de la página.** El
`action="https://formsubmit.co/..."` del punto 90 hacía justo eso: al
enviar, el navegador navega de verdad hasta formsubmit.co, que
procesa el mail y te redirige de vuelta. Funciona, pero se nota
mucho. Ahora el JS intercepta el envío y lo manda por atrás (con
`fetch()`) al endpoint especial `/ajax/` de FormSubmit, que en vez de
redirigir devuelve una respuesta simple diciendo si salió bien o mal
— así la persona nunca sale de la página. El botón dice "Sending…"
mientras se manda, y después aparece un mensajito abajo ("Message
sent. Thanks for reaching out.") o, si algo falla, uno pidiendo que
reintente o te escriba directo por mail. El `action` y el `_next`
viejos se quedan como respaldo por si el JS no llega a correr (por
ejemplo con JavaScript desactivado), pero en el uso normal ya no se
ven para nada.

**92. Las tapas de los proyectos se veían pixeladas en pantallas
grandes — arreglado, era un techo de resolución que no alcanzaba.**
Cada imagen se pedía en dos tamaños (480px y 960px de ancho), y el
navegador elige el que mejor le sirve según el tamaño real en el que
se muestra la tarjeta y la densidad de píxeles de tu pantalla. El
problema: en un monitor grande, o en cualquier pantalla Retina/de
alta densidad, ese cálculo puede pedir más de 960px reales — y como
no había ninguna opción más grande, el navegador terminaba estirando
la de 960px, que es lo que se ve borroso/pixelado. La solución fue
agregar como tercera opción la imagen a su tamaño completo (que ya
estaba guardada en el repo, no tuve que crear nada nuevo) — ahora el
navegador la usa sola cuando la necesita. Ojo: esto ayuda de verdad en
los proyectos donde la imagen original es grande (The Carbon Case,
Lumia, Red Bull Batallas, Rèport Travel Media), pero unos pocos ya
tenían una imagen fuente chica de entrada (La Llamada Fatal, Koupe,
Detras del Puesto) — ahí no hay más detalle para sacar sin que me
mandes una imagen más grande, así que van a seguir viéndose un poco
más suaves que el resto en pantallas muy grandes.

**93. Reescribí varios copys de proyecto.** Agrandé el de Red Bull
Batallas para que cuente qué es la competencia (la batalla de
freestyle más importante del mundo hispanohablante), no solo tu
trabajo en ella, calibrado a un largo parecido al de Lumia. Achiqué el
de Detrás del Puesto. Y le escribí texto nuevo de cero a tres
proyectos que todavía tenían contenido de relleno (Lorem ipsum o el
texto de Lumia reciclado sin que correspondiera): Rèport Travel Media
(ahí sumé también tu rol real que me contaste: grabación, setup de
mics y cámaras, y posproducción de sonido y video — cambié el campo de
rol de la página para reflejarlo), Polvora Podcast y Te Lo Aseguro |
Analipsis (investigué que es el podcast de Analipsis para AAPAS, y que
"Las cenizas no se apagan" es su segunda temporada). Ninguno de estos
textos nuevos tiene guiones "—", como pediste. El rol de Te Lo Aseguro
sigue diciendo solo "V" — no lo toqué porque no tengo de dónde sacar
cuál es tu rol real ahí, y prefiero dejarlo pendiente antes que
inventarlo.

**94. Cuando un proyecto tiene más de 2 reproductores adjuntados,
ahora se achican solos para que la página no se haga larguísima.**
Antes de esto, La Llamada Fatal (3 episodios de Spotify) medía más de
1000px solo en esa columna — bastante más que el texto de al lado. Le
medí la altura real al texto (574px) y le apliqué a Spotify su alto
"compact" oficial (152px en vez de 352px: sigue mostrando tapa,
título y barra de progreso, solo que en una fila en vez de la tarjeta
grande) — los 3 quedan en 504px, por debajo del texto. La regla es
general, no solo para Spotify: a partir de más de 2 reproductores
(sean YouTube, Spotify, lo que sea), la columna entera se angosta un
poco, lo que de paso achica también los de YouTube (dependen del
ancho por su relación de aspecto). Red Bull Batallas, que tiene
exactamente 2, se queda igual que estaba — la usé de referencia para
esto porque dijiste que esa altura está bien.

**95. En mobile, el reel ya no queda pegado al nombre/subtítulo —
ahora se centra en el espacio disponible.** El problema no era el
orden (nombre, subtítulo y los botones Showreel/Projects/Contact ya
iban antes que el video, como pediste) sino que en mobile el bloque
del reel ocupa toda la pantalla de alto, y el reel se anclaba arriba
del todo de ese bloque — dejaba muy poco aire respecto al header y, a
la vez, un espacio vacío enorme abajo antes del texto "See Projects".
Centrarlo verticalmente reparte ese aire arriba y abajo por igual, en
vez de amontonarlo todo abajo. Esto no toca desktop (ahí seguís
viendo el reel anclado arriba, como siempre).

**96. Te Lo Aseguro | Analipsis: le saqué la mención puntual a "Las
cenizas no se apagan" (ahora habla en general de qué es el podcast,
no de una temporada específica) y le cambié el video por una
playlist de YouTube — la que me pasaste, arrancando en el episodio
que elegiste pero dejando ver y saltar a todos los demás desde el
mismo reproductor.**

**97. Rèport Travel Media: cambié el video adjuntado por el que me
pasaste.**

**98. Juleriaque ya tiene contenido real, dejó de ser Lorem
ipsum.** Le adjunté el video que me pasaste (el episodio de Beauty
Ride para el Día del Padre) y escribí el texto en base a lo que
investigué: Juleriaque es una cadena de perfumerías con 40 años en
Argentina, Beauty Ride es su ciclo de contenido de belleza, y esta
pieza la conduce Juana Viale. También sumé los 8 Reels de Instagram
que me pasaste — quedaron en un carrusel con scroll horizontal debajo
del video, no apilados uno abajo del otro (son verticales y altos;
apilados hubieran hecho la página kilométrica). Actualicé el rol a
"Video editing" — decía "Sound design", que no correspondía con lo
que me contaste que hiciste ahí.

**99. Polvora Podcast: reescribí el texto porque el anterior era
redundante (decía que era formato mesa con micrófonos, algo que ya se
ve en la portada).** Investigué de qué trata realmente (bienestar,
hábitos, alimentación, decisiones cotidianas) y escribí en base a eso
— quedó un poco más largo que antes, como pediste.

**100. The Carbon Case: reemplacé el texto por el que me pasaste
(corrigiendo ortografía y puntuación), sumé que es un "upcoming
documentary" y agregué un link "Watch the trailer" debajo del rol,
apuntando al mismo video que ya estaba embebido.** En inglés, donde
me pediste que dijera "re-recording mixer" en vez de "mezcla",
terminé reescribiendo esa frase como una lista de roles (sound
designer, dialogue editor, re-recording mixer, mastering engineer) en
vez de mezclar roles con tareas sueltas — se lee más natural así.

**101. Red Bull Batallas: sumé "diálogos" a lo que limpié y "música"
a la lista de cosas que balanceo en la mezcla,** tal como me
pediste.

**102. La Llamada Fatal: arreglé que los embeds de Spotify quedaran
descentrados dentro de su columna.** Lo que pasaba: la ronda pasada
angosté esa columna (para que los 3 episodios entraran en menos
alto), pero se quedaba pegada al borde izquierdo de su espacio en vez
de centrarse, dejando un hueco vacío a la derecha — le agregué
centrado horizontal y ahora el hueco queda repartido igual a los dos
lados. También agregué un link "Listen on Spotify" al perfil
completo del programa, y sumé una oración a los textos con lo que
hiciste vos: edición de sonido y limpieza de diálogos (actualicé
también el campo de rol, que no lo mencionaba).

**103. Detrás del Puesto: reemplacé el texto por el que me pasaste
(con ortografía y puntuación corregidas), agregué el video que me
diste, un link a su Instagram y el programa completo de Spotify
embebido.** También sumé que editaste algunas de sus miniaturas.

**104. Te Lo Aseguro | Analipsis: el rol ya no dice solo "V" — ahora
dice "Video editing",** y sumé una oración al texto con eso mismo.

**105. Rèport Travel Media: sumé que también hacés operación de
video en vivo en el estudio,** tanto en el rol como en el texto.

**106. Polvora Podcast: agregué el video que me pasaste, arriba del
que ya estaba, saqué la oración que me pediste y sumé que lo conduce
Julieta Kemble.**

**107. Nuevo proyecto en Audiovisual: Playbook.** Investigué de qué
se trata (el podcast de Proteína Marketing conducido por Anita
Figueiredo y Sebastián Paschmann, para que otros marketers repiensen
su trabajo con estrategia) y escribí el texto en base a eso. Le
adjunté el video de YouTube que me pasaste arriba del embed del
programa completo de Spotify, y sumé que hiciste la edición de video
usando los elementos gráficos propios del programa. (La imagen de
tapa para la grilla de Audiovisual llegó después — ver la entrada
110 más abajo.)

**108. Saqué el proyecto Koupe por completo** (página, tarjeta de la
grilla de Sound y todo) — quedan 9 proyectos más Playbook, 10 en
total.

**109. Esa imagen fija de "Sound Design Demo Reel" que aparecía
apenas se abría la página, hasta que el video terminaba de cargar, ya
no existe más.** Antes, el video del reel tenía puesto un "poster"
(una imagen que se ve mientras el video no cargó) con ese texto y el
ícono — la saqué del todo y en su lugar puse un spinner de carga
chico, centrado, que desaparece solo apenas el video puede arrancar.
Además, el video ya no espera a que termine de cargar toda la página
para empezar a bajarse (antes esperaba a propósito, para no competirle
ancho de banda al texto y las imágenes) — ahora arranca a descargarse
apenas corre el script, así el spinner se ve durante bastante menos
tiempo. También agregué una pista de precarga (`<link rel="preload"
as="video">`) para que el navegador la priorice desde el principio.
Lo probé de punta a punta con el video real (no simulado): confirmé
que el spinner se ve mientras no hay datos, y que desaparece solo en
cuanto el video puede reproducirse — nunca más la imagen esa. Borré
también el archivo de esa imagen (`reel-poster.webp`), que ya no lo
usa nadie.

**110. Playbook ya aparece en la grilla de Audiovisual.** Me mandaste
la imagen de tapa (fondo negro, "Anita & Sebas" en la etiqueta
amarilla, "PLAYBOOK" en blanco, "Presentado por Proteína." abajo) y
la sumé al sitio en los tres tamaños de siempre (480 / 960 / tamaño
completo). Ya no hace falta entrar por "Next" desde Polvora
Podcast — está en su lugar en la grilla, como los demás proyectos.

**111. Polvora Podcast: el segundo video de YouTube ahora es su show
de Spotify.** Busqué su perfil real (lo conduce Julieta Kemble,
confirmado) y en vez de dejar un episodio suelto al azar, embebí el
show completo — así se puede ver y elegir entre todos los episodios
sin salir de tu página, igual que en Detrás del Puesto y Playbook.
También sumé el crédito que pediste, tanto en el rol de arriba como
en el texto: el setup de cámaras y micrófonos, y el encuadre de cada
toma.

**112. Detrás del Puesto y Playbook: confirmado, ninguno de los dos
apunta a un episodio al azar de Spotify.** Los dos ya usaban el
embed del show completo desde la vez pasada, no un episodio
puntual — no hacía falta tocar nada ahí, quedan como estaban.

**113. La Llamada Fatal: los embeds de Spotify vuelven a ocupar todo
el ancho y alto normal del contenedor.** La vez pasada los había
achicado (152px de alto, 70% del ancho) porque son 3 y la página se
hacía muy larga — ahora, a pedido tuyo, los agrandé de nuevo al
tamaño normal (352px, ancho completo), aunque eso haga la página más
larga otra vez. El resto de los proyectos con más de 2 videos/embeds
se sigue achicando automático como antes (esa regla general sigue
funcionando); le agregué al código una excepción puntual para este
proyecto nada más.

**114. El botón "Back" en la página de un proyecto ahora te lleva al
proyecto anterior, no a la grilla.** Antes, sin importar en qué
proyecto estuvieras, "Back" te mandaba siempre a la sección de todos
los proyectos. Ahora hace lo mismo que "Next" pero al revés: te
lleva al proyecto anterior de la lista (y el primero de todos vuelve
al último, dando toda la vuelta). Si en algún momento preferís que
vuelva a ir directo a la grilla, decime y lo cambio de nuevo.

**115. Sobre las thumbnails de YouTube "pixeladas de vuelta": encontré
una y la mejoré, la otra ya está al máximo posible.** Investigué las
dos tarjetas de la grilla que parecen sacadas de un video real (no un
logo diseñado): "Te Lo Aseguro" y "Polvora Podcast".
- **Te Lo Aseguro** sí tenía margen de mejora: la imagen que estaba
  usando era una versión recortada y de menor resolución (983×593)
  de la miniatura real del episodio. La reemplacé por la miniatura
  oficial de YouTube en su resolución máxima (1280×720, la misma
  imagen pero completa y más nítida) — ya se ve mejor, sobre todo en
  pantallas grandes o de alta densidad de píxeles.
- **Polvora Podcast** ya estaba usando exactamente esa misma
  miniatura oficial, también al máximo que ofrece YouTube para ese
  video (1280×720) — no existe una versión de mayor resolución para
  sacar de ahí, así que no hay margen para mejorarla desde el código.
  Si en algún momento conseguís una foto de mayor calidad (por
  ejemplo la que hayan usado internamente antes de subirla a
  YouTube), mandámela y la reemplazo.

**116. Pantalla de carga antes de ver la página, en vez del spinner
chico de antes.** Apenas entrás al sitio, la página entera arranca
desenfocada, con un mensaje ("Turn your volume up. This is a sound
portfolio.") y tres puntitos animados encima, hasta que el reel y el
video de cada tarjeta de proyecto (Sound y Audiovisual, aunque no se
estén viendo en ese momento) están listos para reproducirse. El
desenfoque se va destapando de a poco, no todo junto, a medida que
cada video queda listo. Cuando todo terminó de cargar, se saca el
blur y la pantalla de carga juntos, y el reel arranca siempre desde
0:00, nunca desde donde sea que haya quedado mientras estaba tapado.
Si algo tarda demasiado (conexión lenta, un video roto), hay un tope
de 8 segundos: la página se muestra igual, nunca se queda trabada
esperando. Para quien tiene activada la preferencia de "menos
movimiento" del sistema, o si el JavaScript está desactivado, la
página se muestra directamente sin blur ni pantalla de carga.

**117. Video propio al pasar el mouse por The Carbon Case, Lumia, Red
Bull Batallas y Detrás del Puesto.** Me pasaste los 4 archivos, los
comprimí (sin audio, ya que se reproducen en silencio; el peso final
quedó entre 100KB y 1.3MB cada uno) y los conecté a la tarjeta de
cada proyecto en la grilla. El resto de los proyectos sigue mostrando
el reel general de placeholder hasta que tengan el suyo propio.

**118. Detrás del Puesto: cambié el video adjuntado por el nuevo que
me pasaste.**

**119. El mensaje de la pantalla de carga ahora dice "Turn the audio
on for a better experience."**

**120. El botón de sonido (a la izquierda de la barra de volumen)
titila en violeta y vibra un poco cada tanto mientras el sitio está
silenciado**, para llamar la atención sobre que hay que prenderlo.
Se detiene solo con prender el sonido, o mientras alguien lo está
enfocando o le pasa el mouse por arriba.

**121. Los videos de hover ahora suenan de verdad.** El problema no
era el sitio: el mecanismo que activa el sonido de la tarjeta que
estás mirando ya funcionaba bien, pero los 4 archivos que subí la
vez pasada los había comprimido sin pista de audio (pensando que,
como arrancan en silencio, no hacía falta) — sin audio en el archivo
no hay nada que activar. Los volví a comprimir con el audio adentro
(quedaron entre 400KB y 1.4MB) y agregué también el de Juleriaque,
que faltaba.

**122. Nueva tapa para Polvora Podcast** (el logo en dorado sobre
fondo bordó que me pasaste), reemplaza la captura del video que
había antes.

**123. Playbook: la tapa ya no corta el texto.** Como la foto es
cuadrada y la tarjeta es panorámica (16:9), mostrar la imagen
completa sin recortar significa agrandar mucho el ancho: le agregué
franjas negras a los costados en vez de recortarla, y como la foto
ya tenía fondo negro, no se notan — ahora entran "Anita & Sebas",
"Playbook" y "Presentado por Proteína" completos.

**124. The Carbon Case: arreglado el recorte que cortaba el "THE".**
Medí a píxel dónde arranca el texto en la imagen original — el
recorte de la tarjeta empezaba unos pocos píxeles más abajo del
principio de la palabra "THE" y se comía el borde de arriba. Ajusté
el punto de enfoque del recorte para que arranque un poco antes, y
ahora entra el título completo.

**125. Repasé el peso de las imágenes de cara a esta etapa final:**
achiqué un poco The Carbon Case y Te Lo Aseguro (eran las más
pesadas del sitio, sin que se note la diferencia a simple vista) y
borré del todo los archivos de imagen que ya habían quedado sin uso
(Koupe y una versión vieja de Detrás del Puesto que nadie
referenciaba).

**126. Nueva tapa para Red Bull Batallas** (el logo que me pasaste),
reemplaza la portada anterior.

**127. Video propio al pasar el mouse por Rèport Travel Media, Te Lo
Aseguro, Polvora Podcast y Playbook.** Ya con esto los nueve
proyectos con video (todos menos La Llamada Fatal, que es solo audio)
tienen su propio hover en vez del reel de relleno.

**128. The Carbon Case: agregué una etiqueta de "Upcoming release"
debajo del rol**, y un segundo video de YouTube debajo del que ya
estaba.

**129. El botón de sonido silenciado vibra más seguido y más
fuerte.** Antes titilaba cada 3 segundos con un temblor suave; ahora
el ciclo completo dura 1.4 segundos y la sacudida es más marcada
(más recorrido, más rebotes), para que llame más la atención.

**130. El subtítulo debajo de tu nombre (arriba y en el pie de
página) ahora dice "Sound Designer · Mix · Master // Multimedia Post
Production"** en vez de solo "Sound Designer // Multimedia Post
Production". Lo cambié en los dos lugares donde aparece, y lo probé
en varios anchos de pantalla (celular incluido) para confirmar que
sigue entrando bien.

**131. Nuevo video propio al pasar el mouse por The Carbon Case**,
reemplaza al que había.

**132. Nuevo demo reel principal, en 1080p.** Reemplaza al que
había (720p, 3.8MB) por el que exportaste siguiendo la configuración
que te pasé (H.264, VBR 2 pasadas, 1.8 Mbps de video + 320kbps de
audio) — quedó en 25.4MB para 1 minuto 36 segundos, ya viene con el
`moov` antes que los datos (arranca rápido, sin tener que esperar a
bajar el archivo entero) así que no hizo falta tocarlo más. Mismo
nombre de archivo que el anterior (`reel.mp4`), así que no hizo falta
cambiar nada del código: hero, fondo desenfocado y precarga siguen
apuntando al mismo lugar de siempre.

**133. El audio de los 9 videos de hover ahora es el original, sin
recomprimir.** Antes lo recomprimía a 96kbps (y despues probé pedirle
320kbps al codificador, pero el codificador de audio de este entorno
no llega a esa cifra por más que se la pida). Como los archivos
originales ya venían con el audio a ~317kbps, la solución real era
más simple: copiar esa pista de audio tal cual, sin tocarla, en vez
de recomprimirla — así queda exactamente igual de pesada y de buena
que el archivo que mandaste, sin ninguna pérdida de calidad.

**134. Lumia también tiene la etiqueta "Upcoming release"** debajo
del rol, igual que The Carbon Case.

**135. La pestaña del navegador ahora dice "Ian Iacono — Portfolio"**
en vez de "Sound Portfolio" — y en cualquier proyecto dice "Ian
Iacono — [nombre del proyecto]" (el nombre va siempre primero, así
se identifica el sitio de un vistazo si tenés varias pestañas
abiertas). De paso corregí una mención vieja a "Koupe" que había
quedado en la descripción para Google/redes, de cuando ese proyecto
todavía existía.

**136. El ícono de la pestaña (favicon) ya no es negro con las
barritas naranjas** — ahora es el gris oscuro violáceo del sitio
(el mismo fondo que usa toda la página) con las barritas en violeta,
el mismo color que usé en la imagen vieja del reel.

**137. Si el ícono seguía viéndose negro y naranja, no era que el
archivo estuviera mal** (ya lo había cambiado bien) **— era el
navegador, que cachea el ícono de la pestaña muchísimo más agresivo
que el resto de la página** y a veces ni con un refresh fuerte lo
vuelve a pedir. Le agregué un "?v=2" al final de los tres links del
ícono para que el navegador lo trate como un archivo distinto y lo
baje de nuevo — la próxima vez que se edite el ícono, ese número hay
que subirlo de nuevo. De paso corregí el color de la barra del
navegador en celular (`theme-color`), que había quedado con el negro
viejo en vez del gris oscuro actual.

**138. La Llamada Fatal ya no muestra ningún video al pasar el
mouse en la tarjeta** — se queda quieta en la portada. Antes cuando
un proyecto no tenía su propio video de hover, mostraba el reel
general de relleno, pero para este proyecto (que es solo audio) no
pegaba. Cuando me pases el audio armamos ese hover con la animación
de soundwave que hablamos.

**139. Los videos de YouTube dentro de un proyecto ahora se
"cierran" solos si te vas a otro proyecto mientras están sonando.**
Como no existe forma de pausar un video de YouTube embebido desde
afuera sin usar la API oficial de YouTube, lo que se hace es
recargar el iframe entero: al salir de la página queda en blanco
(mismo efecto que cerrarlo), y recién vuelve a pedir el video real
cuando volvés a entrar a esa página — así siempre lo encontrás de
nuevo en 0:00 y mudo, nunca sonando de fondo sin que lo veas. La
primera versión de este arreglo tenía un bug: como estos iframes se
cargan "lazy" (recién piden el video cuando están a la vista, para
no bajar los 11 videos de golpe al entrar al sitio), pedirles que
vuelvan a cargar mientras su página todavía estaba oculta hacía que
el navegador pospusiera esa carga para siempre, y ni siquiera se
terminaba pidiendo al volver. Ahora se guarda el link real aparte y
se lo restaura justo en el momento en que la página vuelve a
mostrarse, nunca antes, así el navegador lo pide de una como la
primera vez. Los de Spotify quedan afuera de esto, solo se pidió
para YouTube.

**140. En celular, además del botón de sonido del header (que no se
ve hasta que scrolleás), ahora hay una copia del mismo botón entre
los links de navegación y el reel** — mismo ícono violeta que titila
para llamar la atención, y los dos quedan sincronizados: tocar
cualquiera de los dos prende o apaga el sonido de todo el sitio. En
escritorio no se ve, ahí ya existe el del header.

**141. Los controles del reel (pausa y la línea de tiempo) ya no
están siempre visibles en celular.** Antes se mostraban fijos todo
el tiempo apenas se detectaba que era un dispositivo táctil. Ahora
arrancan ocultos y aparecen recién al tocar el video, se esconden
solos a los 3 segundos si el reel sigue reproduciéndose, y se quedan
a la vista mientras está en pausa (para no perder de dónde
retomarlo). Tocar el video de nuevo los esconde antes de tiempo, y
tocar la barra o el botón de pausa reinicia la cuenta de los 3
segundos en vez de escondértelos a mitad de uso.

**142. En celular ahora es más fácil agarrar la bolita de la línea
de tiempo del reel para arrastrarla.** No hacía falta tocar el
navegador para verlo: en pantallas táctiles no existe el ":hover"
que hace que la bolita crezca al pasar el mouse, así que se quedaba
siempre en su tamaño chico, y ese tamaño chico es justo lo que el
dedo puede tocar para agarrarla. Ahora en celular la bolita queda
siempre en su tamaño real (sin el achique) y además un poco más
grande que en escritorio, así hay margen de sobra alrededor sin
tener que acertarle justo al centro.

**143. Tu nombre y el subtítulo, en celular, estaban demasiado
pegados (incluso un poco cortados) contra el borde de arriba de la
pantalla.** Les di más aire arriba, sin tocar la posición del reel
(son dos cosas independientes en el código, así que una no arrastra
a la otra).

**144. El fondo borroso detrás del reel, el mismo video agrandado y
desenfocado que ya tenías en escritorio, había quedado apagado en
celular** (una decisión de una ronda anterior, pensando en el
rendimiento) **y por eso solo se veía el reel solo, sin nada
alrededor. Ya está prendido también en celular**, con el mismo
desenfoque en los bordes de arriba y abajo, y el mismo difuminado
hacia el color de fondo real de la página en el borde inferior, así
se sigue sintiendo continuo hacia la sección de proyectos en vez de
cortar en seco.
