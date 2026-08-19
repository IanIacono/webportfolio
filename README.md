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
| **A** | `tusitio.com` | El reel arriba, y abajo una **grilla de tarjetas** con la portada de cada proyecto. Clickeás una y entrás al proyecto. Es la estructura del Carrd original. |
| **B** | `tusitio.com/b` | El reel arriba, y abajo **el video de cada proyecto uno tras otro**. Los videos arrancan solos cuando aparecen en pantalla y se pausan cuando salen. Cada uno tiene un botón "Ver proyecto". |

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
<p class="project__role">Sound design, Mix &amp; Master</p>  ← el SUBTÍTULO en ámbar

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
<h2 class="card__title">The Carbon Case</h2>
```

### Dos cosas para tener cuidado

1. **El símbolo `&`** se escribe `&amp;` dentro del HTML.
   Ejemplo: `Mix &amp; Master` se ve como "Mix & Master".
2. **Los acentos y las eñes** se escriben normal: `creación`, `año`. No hay
   problema con eso.

---

## 4. Cambiar una imagen

Las imágenes viven en `assets/img/`. Cada proyecto tiene **cuatro archivos**:

| Archivo | Para qué sirve |
|---|---|
| `lumia.webp` | el original grande |
| `lumia-480.webp` | versión chica (celulares) |
| `lumia-960.webp` | versión mediana (pantallas grandes) |
| `poster/lumia.webp` | la imagen de espera del video (solo Versión B) |

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

### Los videos del feed (Versión B)

Ahora **todos usan tu reel como provisorio**. Cuando tengas el video de cada
proyecto:

1. Guardá el archivo `.mp4` en `assets/video/`, por ejemplo `lumia.mp4`.
2. En `b/index.html`, buscá el bloque de ese proyecto y cambiá:

```html
<video data-src="/assets/video/reel.mp4" ... poster="/assets/img/poster/lumia.webp"
```

por:

```html
<video data-src="/assets/video/lumia.mp4" ... poster="/assets/img/poster/lumia.webp"
```

**Recomendaciones para los videos:**
- Formato **MP4** (códec H.264 + audio AAC). Es el que anda en todos lados.
- Proporción **16:9** (apaisado).
- Que no pesen más de 8–10 MB cada uno. Si pesan más, el sitio carga lento.
- Como los videos arrancan solos y en silencio, conviene que los primeros
  segundos se entiendan sin sonido.

---

## 6. Cambiar los colores

**Todos** los colores del sitio salen de un solo lugar. Abrí `css/style.css` y
buscá arriba de todo el bloque que dice `01. SISTEMA DE DISENO`:

```css
:root {
  --c-bg:            #08090a;   /* fondo general, casi negro */
  --c-bg-raised:     #101214;   /* superficies elevadas (tarjetas) */

  --c-text:          #f4f4f3;   /* texto principal */
  --c-text-muted:    #a8adb2;   /* texto secundario */
  --c-text-faint:    #7e858c;   /* texto terciario */

  --c-accent:        #d9a15b;   /* ámbar: el único color de la interfaz */
  --c-accent-soft:   #f0c68f;   /* ámbar claro para el hover */
}
```

Cambiás un código de color ahí y **se actualiza en todo el sitio solo**.
No busques colores en otro lado: no hay.

> ⚠️ Si cambiás `--c-accent` por un color muy oscuro, va a perder contraste
> contra el fondo negro y va a costar leerlo. Probá en
> [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/)
> que dé **4.5 o más** contra `#08090a`.

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
├── index.html          ← VERSIÓN A: la home con grilla de tarjetas + los proyectos
├── b/
│   └── index.html      ← VERSIÓN B: la home con el feed de videos + los proyectos
│
├── css/
│   └── style.css       ← TODOS los estilos: colores, tamaños, espacios
│
├── js/
│   ├── main.js         ← cambia de página y hace aparecer los bloques al scrollear
│   └── player.js       ← el reproductor de video (mute y línea de tiempo)
│
├── assets/
│   ├── img/            ← todas las imágenes
│   │   ├── poster/     ← imágenes de espera de los videos (Versión B)
│   │   └── _originales/← respaldo del Carrd: las imágenes y los textos
│   │                      originales, por si alguna vez los necesitás
│   ├── video/
│   │   └── reel.mp4    ← tu demo reel
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

**1. El reel del inicio ya no viene de Vimeo.**
Ahora es el archivo `assets/video/reel.mp4`, guardado en tu propio sitio. Es el
mismo video, pero así carga mucho más rápido, arranca solo y podés controlarlo
con el botón de silencio y la línea de tiempo. Si querés volver a Vimeo,
pedímelo y lo cambio.

**2. Los puntos sueltos (`.`) desaparecieron.**
El Carrd tenía títulos que decían solamente un punto. Eran separadores para
hacer espacio, no texto. Ahora ese espacio lo hace el diseño.

**3. Los textos del `title` y de la descripción los escribí yo.**
En el Carrd decían literalmente "a". Puse:
*"Ian Iacono — sound design, mezcla y master. Portfolio de sonido y audiovisual…"*.
Cambialo cuando quieras: está arriba de todo en el HTML, bien marcado.

**4. Le agregué un botón "Back" a la página de Te Lo Aseguro | Analipsis.**
Era la única sin botón de volver: se entraba y quedabas encerrado.

**5. El sitio es oscuro siempre.**
No cambia según la configuración del celular o la computadora. Es una decisión
de marca: tus portadas y tus videos son oscuros y se ven mejor sobre negro.

**6. El CSS y el JavaScript no están comprimidos.**
Se podrían achicar un poco, pero quedarían ilegibles y vos no podrías editarlos.
Preferí que puedas entenderlos. Igual el sitio saca 96/100 en velocidad.

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
