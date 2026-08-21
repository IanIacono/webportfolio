# Sitio de Ian Iacono — Sound Portfolio

Este es tu sitio web, hecho con archivos propios. Ya no depende de Carrd.

**No hace falta saber programar para editarlo.** Todo lo que vas a querer
cambiar (textos, imágenes, colores) está explicado acá abajo, paso a paso.

---

## 📑 Índice

1. [Hay dos versiones: elegí una](#1-hay-dos-versiones-elegí-una)
2. [Ver el sitio en tu computadora](#2-ver-el-sitio-en-tu-computadora)
3. [Cambiar un texto](#3-cambiar-un-texto)
4. [Cambiar una imagen](#4-cambiar-una-imagen)
5. [Cambiar un video](#5-cambiar-un-video)
6. [Cambiar los colores](#6-cambiar-los-colores)
7. [Completar la sección Contact](#7-completar-la-sección-contact)
8. [Poner tu dominio](#8-poner-tu-dominio)
9. [Publicar los cambios](#9-publicar-los-cambios)
10. [Qué es cada archivo](#10-qué-es-cada-archivo)
11. [Cosas que decidí y podés cambiar](#11-cosas-que-decidí-y-podés-cambiar)

---

## 1. Hay dos versiones: elegí una

El sitio tiene **dos versiones distintas** para que compares y elijas:

| Versión | Dirección | Cómo se ve la home |
|---|---|---|
| **A** | `tusitio.com` | Arranca con el **reel** a pantalla completa (con su fondo sincronizado y borroso, como antes), que se desvanece hacia abajo con un degradé en vez de cortarse de golpe. Debajo, dos botones, **Sound Portfolio** y **Audiovisual Portfolio**, alternan qué grilla se ve sin cambiar de página. Todas las tarjetas tienen el mismo tamaño (16:9) y la imagen las llena por completo, sin bordes borrosos. Al pasar el mouse por una (o enfocarla con el teclado) arranca su video con sonido y un resplandor blanco suave se prende alrededor de esa tarjeta sola. Clickeando entrás al proyecto. |
| **B** | `tusitio.com/b` | Arriba, un **carrusel**: podés ir pasando de proyecto en proyecto con las flechas o los puntos de abajo. A los pocos segundos aparece un botón "Ver más" que te lleva a esa página. Abajo del carrusel, la grilla con **todos** los proyectos, con las mismas tarjetas parejas de 16:9 y el mismo resplandor blanco al hacer hover que en la A. Sound y Audiovisual siguen siendo dos páginas separadas, como en el Carrd original. |

**Todo lo demás (las páginas de cada proyecto) es idéntico en las dos.**

### Cuando decidas cuál te gusta

- **Si te quedás con la A:** borrá la carpeta `b/`.
- **Si te quedás con la B:** movéle el contenido de `b/index.html` a `index.html`
  (o pedime que lo haga). Después borrá la carpeta `b/`.

> ⚠️ **Mientras tengas las dos**, si cambiás el texto de un proyecto tenés que
> cambiarlo en **los dos archivos**: `index.html` y `b/index.html`. Por eso
> conviene elegir una pronto.

---

## 2. Ver el sitio en tu computadora

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

Después abrí el navegador en:

- **Versión A** → http://localhost:8080
- **Versión B** → http://localhost:8080/b/

Para apagarlo, apretá `Ctrl + C` en esa ventana.

---

## 3. Cambiar un texto

Abrí `index.html` (y `b/index.html` si todavía tenés las dos versiones) con
cualquier editor de texto. **Recomiendo [VS Code](https://code.visualstudio.com)**,
que es gratis, pero sirve el Bloc de notas también.

El archivo está dividido en secciones con carteles bien visibles, así:

```html
<!-- ==========================================================
     SECCION 3 de 12  —  PROYECTO: THE CARBON CASE   (direccion: #thecarboncase)
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

## 4. Cambiar una imagen

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

Los **originales del Carrd** quedaron guardados en `assets/img/_originales/`
por si alguna vez los necesitás. No hace falta que toques esa carpeta.

---

## 5. Cambiar un video

### Los videos de los proyectos (páginas internas)

Son de YouTube. Buscá esta línea en el HTML:

```html
<iframe src="https://www.youtube-nocookie.com/embed/2TYgE3qMO4k?rel=0&amp;loop=0&amp;controls=1&amp;cc_load_policy=0"
```

`2TYgE3qMO4k` es el **código del video de YouTube**. Lo sacás de la dirección
del video: en `youtube.com/watch?v=ABC123`, el código es `ABC123`.
Reemplazalo y listo.

### Los videos de las tarjetas (grilla, las dos versiones)

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

### El reel del inicio (Versión A)

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

### El video del carrusel (Versión B)

Es la misma idea, pero en `b/index.html`, dentro del bloque marcado
`CARRUSEL`. Cada proyecto tiene su propio `.carousel__slide`, con el mismo
patrón de dos videos (aura + el de la diapositiva).

Ahora mismo hay **dos proyectos con video real de prueba** (Lumia y Red Bull
Batallas) para que veas cómo se ve el carrusel cambiando de contenido — pero
**ninguno de esos dos videos es en realidad de esos proyectos**: son clips
que me pasaste para probar (uno es un visualizador genérico, el otro una
grabación de pantalla de un sitio ajeno). Reemplazalos por los videos reales
apenas los tengas, siguiendo el mismo paso de arriba.

### El fondo reactivo (la "aura")

Este efecto — una copia del mismo video, agrandada y muy borrosa detrás —
solo existe en **dos lugares**: el reel del inicio de la Versión A, y cada
diapositiva del carrusel de la Versión B. Ahí se prende sola (con el reel,
apenas entrás; con el carrusel, cuando esa diapositiva está activa) y no
hace falta configurar nada: usa automáticamente el mismo video.

Las **tarjetas de la grilla** (en las dos versiones) ya no la tienen — se
probó con un fondo borroso ahí también, pero con varias tarjetas juntas el
efecto se mezclaba entre vecinas, así que quedó solo el resplandor blanco al
hacer hover, contenido dentro de cada tarjeta.

### El control de sonido

No hay un botón de mute en cada video. Hay **un solo control, en el header,
arriba a la derecha**: un altavoz con una barra de volumen al lado, más larga
y con un brillo cyan que crece a medida que subís el volumen. Prende o apaga
el sonido de lo que se esté reproduciendo en cada momento — el carrusel de la
Versión B, o el proyecto que estés mirando con el mouse en la grilla.

Esto es así por como funcionan los navegadores: la primera vez que entrás al
sitio, todo arranca en silencio a la fuerza (ningún sitio puede sonar solo,
sin que vos lo pidas). Apenas tocás ese control una vez (el botón, o
arrastrando la barra), el sitio queda habilitado a sonar por el resto de la
visita.

El volumen se guarda en tu navegador: si volvés a entrar más tarde, va a
recordar el nivel que dejaste (aunque siempre arranca en silencio, por lo de
arriba).

Aparte, el carrusel de la Versión B tiene su **propio botón de play/pausa**
(no confundirlo con el volumen): frena o retoma el video, sin tocar el
sonido. Es el único video del sitio con ese botón — los de las tarjetas se
reproducen solo mientras les pasás el mouse por encima, así que no
necesitan uno.

No hay nada para configurar en el control de sonido: es un comportamiento
del sitio, no un texto para editar. Los videos de YouTube y los podcasts de
Spotify de las páginas de cada proyecto quedan afuera de este control — esos
tienen sus propios
botones, porque son de otra plataforma.

---

## 6. Cambiar los colores

**Todos** los colores del sitio salen de un solo lugar. Abrí `css/style.css` y
buscá arriba de todo el bloque que dice `01. SISTEMA DE DISENO`:

```css
:root {
  --c-bg:            #0a0910;   /* fondo general, casi negro con tinte violeta */
  --c-bg-raised:     #131019;   /* superficies elevadas (tarjetas)           */

  --c-text:          #f4f3f7;   /* texto principal */
  --c-text-muted:    #a9a6b4;   /* texto secundario */
  --c-text-faint:    #7d7a8a;   /* texto terciario */

  --c-accent:        #8b7cf6;   /* violeta: el acento principal */
  --c-accent-soft:   #b3a8fa;   /* violeta claro, para hover */
  --c-accent-2:      #35c9d6;   /* cyan: el control de volumen */
  --c-accent-2-soft: #7fe0e8;   /* cyan claro, para hover */
}
```

Cambiás un código de color ahí y **se actualiza en todo el sitio solo**.
No busques colores en otro lado: no hay.

> ⚠️ Si cambiás `--c-accent` o `--c-accent-2` por un color muy oscuro, va a
> perder contraste contra el fondo negro y va a costar leerlo. Probá en
> [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/)
> que dé **4.5 o más** contra `#0a0910`.

En ese mismo bloque también están los tamaños de letra (`--fs-...`), los
espacios (`--sp-...`), los redondeos (`--r-...`) y las sombras (`--sh-...`).

---

## 7. Completar la sección Contact

En el Carrd original esta sección **estaba vacía** y el menú "Contact" llevaba
a una página en blanco. Te la dejé lista para completar.

Buscá en el HTML el cartel `SECCION 12 de 12 — CONTACT` y vas a ver esto:

```html
<!-- COMENTARIO ABAJO
<div class="project__actions reveal">
  <a class="btn btn--primary" href="mailto:TUMAIL@ejemplo.com">Escribime</a>
  <a class="btn" href="https://instagram.com/TUUSUARIO" ...>Instagram</a>
  <a class="btn" href="https://wa.me/5491100000000" ...>WhatsApp</a>
</div>
COMENTARIO ARRIBA -->
```

Para activarlo:

1. **Borrá** la línea que dice `<!-- COMENTARIO ABAJO`
2. **Borrá** la línea que dice `COMENTARIO ARRIBA -->`
3. Reemplazá `TUMAIL@ejemplo.com`, `TUUSUARIO` y el número de WhatsApp
   (`5491100000000` = código de país 54 + 9 + característica sin el 0 + número
   sin el 15).
4. Borrá los botones que no quieras usar.

**Acordate de hacerlo en `index.html` y en `b/index.html`.**

---

## 8. Poner tu dominio

Mientras uses la dirección gratis de Vercel no hace falta tocar nada. Cuando
compres tu dominio, buscá en el HTML las líneas marcadas con `<!-- DOMINIO -->`
(hay 4 en cada archivo) y cambiá `https://ianiacono.vercel.app` por tu
dirección real.

Sirve para que Google y las redes sociales sepan cuál es la dirección
verdadera de tu sitio.

---

## 9. Publicar los cambios

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

## 10. Qué es cada archivo

```
webportfolio/
│
├── index.html          ← VERSIÓN A: reel + grilla de tarjetas + los proyectos
├── b/
│   └── index.html      ← VERSIÓN B: carrusel + grilla de tarjetas + los proyectos
│
├── css/
│   └── style.css       ← TODOS los estilos: colores, tamaños, espacios
│
├── js/
│   ├── main.js         ← cambia de página y hace aparecer los bloques al scrollear
│   ├── audio.js        ← el control global de sonido del header
│   └── player.js       ← reproduce los videos: el reel (A), el carrusel (B)
│                          y las tarjetas de la grilla (las dos versiones)
│
├── assets/
│   ├── img/            ← todas las imágenes
│   │   ├── reel-poster.webp ← portada del reel mientras carga el video
│   │   └── _originales/← respaldo del Carrd: las imágenes y los textos
│   │                      originales, por si alguna vez los necesitás
│   ├── video/
│   │   ├── reel.mp4    ← tu demo reel (el video del inicio en la A, y
│   │   │                  también el placeholder de las tarjetas)
│   │   └── test/        ← los 2 videos de prueba que mandaste — no son de
│   │                       ningún proyecto real, borralos cuando ya no los
│   │                       necesites (ver sección 11)
│   └── fonts/          ← la tipografía Alexandria, guardada acá adentro
│
├── favicon.ico         ← el iconito de la pestaña del navegador
├── apple-touch-icon.png← el icono cuando alguien guarda el sitio en el celular
├── vercel.json         ← le dice a Vercel cuánto tiempo guardar los archivos
└── README.md           ← este instructivo
```

---

## 11. Cosas que decidí y podés cambiar

Estas decisiones las tomé yo durante la migración. Todas se pueden revertir.

**1. El reel del inicio ya no viene de Vimeo — vive en `assets/video/`, en tu
propio sitio (carga mucho más rápido).**
Lo probamos sin reel en la Versión A (arrancando directo en la grilla), pero
terminamos volviendo a ponerlo: ahora la A arranca con el reel a pantalla
completa (con su fondo sincronizado y borroso) y se desvanece con un degradé
hacia la grilla de proyectos, en vez de cortarse de golpe. En mobile, abajo
del reel queda el cartel "SEE PROJECTS ↓" invitando a scrollear; en
escritorio no hace falta, así que no se muestra. En la Versión B el reel
sigue siendo el carrusel, como ya estaba.

**2. El botón "Back" de cada proyecto ya no vuelve al principio de la
página — vuelve directo a la grilla.**
Antes, si estabas en `#lumia` y apretabas Back, terminabas arriba de todo
(en la Versión A eso significa ver el reel de nuevo, y en la B el carrusel,
en los dos casos con que scrollear para volver a ver los proyectos). Ahora
te deja directo en la grilla de proyectos. Al lado de "Back" agregué un
botón **"Next"** que te lleva al siguiente proyecto en orden — y al llegar
al último, vuelve a empezar por el primero.

**3. En Audiovisual Portfolio (Versión A), pasé de páginas separadas a un
selector con dos botones.**
Antes "Audiovisual Portfolio" era otra página (otro `#`, otro scroll al
tope). Ahora Sound y Audiovisual conviven en la misma página: los botones de
arriba solo cambian qué grilla se ve, sin mover el scroll ni recargar nada.
La Versión B no la toqué: ahí siguen siendo dos páginas, como en el Carrd
original.

**4. Le puse dos videos de prueba al carrusel para que veas cómo cambia de
contenido.**
Son los que me mandaste — están en `assets/video/test/`. **Ninguno de los
dos es en realidad de esos proyectos** (uno es un visualizador genérico, el
otro una grabación de pantalla de otro sitio web): los use solo para probar
que el carrusel funciona con videos de duración y contenido distintos.
Reemplazalos en cuanto tengas los videos reales — la sección 5 explica cómo.

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
cyan para el control de volumen), y te generé otras dos opciones para
comparar — están en las capturas que te mandé. Si preferís otra, la
cambiamos en un momento: son 4 líneas en `css/style.css` (ver sección 6).

**10. El CSS y el JavaScript no están comprimidos.**
Se podrían achicar un poco, pero quedarían ilegibles y vos no podrías editarlos.
Preferí que puedas entenderlos.

**11. Solo un video suena a la vez, en las dos versiones.**
Si pasás el mouse de una tarjeta a otra, o cambiás de diapositiva en el
carrusel, el video anterior se silencia solo y empieza a sonar el nuevo. Es
a propósito: nunca vas a tener dos proyectos sonando al mismo tiempo.

**12. Todas las tarjetas de la grilla miden lo mismo (16:9), en las dos
versiones.**
Antes cada una tenía el tamaño de su imagen original, así que quedaban
bordes borrosos rellenando el espacio sobrante dentro de algunas. Ahora el
recuadro siempre es 16:9 y la imagen (o el video, al hacer hover) lo llena
por completo — recortando un poco los bordes si hace falta, nunca
estirando ni dejando espacio vacío.

**13. La portada del reel (el ecualizador con "IAN IACONO") la volví a
pintar en violeta.**
Era un placeholder que hice al principio, cuando el color de acento todavía
era ámbar. Al cambiar la paleta (punto 9) se quedó con el color viejo sin
que se notara porque el reel había desaparecido de la Versión A; al
volver a ponerlo, la recoloreé para que combine con el resto del sitio.

### Y estas siguen tal cual estaban, esperando decisión tuya

- Siete proyectos comparten el mismo texto (*"Cortometraje sobre la creación
  del cosmos…"*), copiado del de The Carbon Case.
- **Te Lo Aseguro | Analipsis** tiene Lorem ipsum y el subtítulo dice `V`.
- **Contact** está vacía (ver el punto 7 de arriba).
- **Polvora Podcast** existe en `#section12` pero **no hay ningún link que
  lleve ahí**. Se entra solo escribiendo la dirección.
- En **Audiovisual Portfolio**, Rèport y Detras del Puesto aparecen **dos veces
  cada uno**. Además, la segunda tarjeta de "Rèport Travel Media" muestra la
  imagen de *Juleriaque*.
- La primera tarjeta de Audiovisual Portfolio (*"Las cenizas no se apagan"*)
  **no tiene título** debajo.
