# FAMILY TRIVIA

![HTML5](https://img.shields.io/badge/HTML5-static-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-custom-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-ranking-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

Juego familiar de preguntas estilo tablero, pensado para jugar todos juntos en una casa, con un presentador dirigiendo la partida desde una tablet o pantalla visible para todos. Se puede jugar solo, cada uno por su cuenta o por parejas formadas con las ruletas. Incluye preguntas por categorias, respuestas simultaneas, control manual de puntos y ranking final con estadisticas.

## Capturas de pantalla

Recorrido visual desde la pantalla de inicio hasta el ranking y las estadisticas finales.

### Pantalla de inicio

![Pantalla de inicio de Family Trivia](img/readme/01-inicio.png)

### Ruletas para formar equipos

![Dos ruletas y equipos formados](img/readme/02-ruletas.png)

### Tablero principal

![Tablero con categorias y valores de puntuacion](img/readme/03-tablero.png)

### Pregunta tipo test

![Modal de pregunta con opciones A, B, C y D](img/readme/04-pregunta.png)

### Respuesta correcta resaltada, además tiene el panel abierto de pista y explicacion

![Pista y texto explicativo tras revelar la respuesta](img/readme/06-pista-explicacion.png)

### Pregunta de banda sonora (audio)

![Reproductor de audio en una pregunta musical](img/readme/07-banda-sonora.png)

### Respuesta de banda sonora

![Pista, audio y pelicula revelada](img/readme/08-banda-sonora-respuesta.png)

### Partida en curso

![Tablero con casillas usadas y marcadores de equipos](img/readme/09-tablero-partida.png)

### Fin de partida

![Modal de ganador con ranking y confeti](img/readme/10-fin-partida.png)

### Estadisticas finales

![Grafico de evolucion y estadisticas por categoria](img/readme/11-estadisticas.png)

## Entradas del juego

- `index.html`: tablero principal de Family Trivia.
- `ruletas.html`: pantalla de ruletas para formar equipos antes de empezar.

## Objetivo

El objetivo es conseguir la mayor puntuacion posible respondiendo preguntas de distintas categorias. En cada ronda, un equipo tiene la ventaja de escoger la categoria y la puntuacion, pero todos los equipos responden la pregunta a la vez.

Al terminar todo el tablero, se muestra un ranking final con el equipo ganador, confeti y estadisticas de rendimiento por equipo y categoria.

## Modos de juego

Al abrir el juego se elige uno de los tres modos:

- **Un jugador**: se pide el nombre y se juega solo, con una unica tarjeta de puntuacion.
- **Multijugador individual**: se indica cuantas personas juegan (de 2 a 12) y el nombre de cada una. Cada persona tiene su propia tarjeta.
- **Multijugador por parejas**: lleva a `ruletas.html`, donde se forman las parejas. Cada pareja se convierte en una tarjeta con los dos nombres.

En todos los modos las tarjetas del marcador se generan segun el numero real de participantes: hasta cinco por fila en escritorio, y las siguientes pasan a la fila de abajo.

## Reglas

### Preparacion

El juego esta pensado para grupos familiares mezclados. Por ejemplo, si juegan 10 personas mas el presentador:

- 5 jovenes se escriben en la `Ruleta 1`.
- 5 mayores se escriben en la `Ruleta 2`.
- Las ruletas forman 5 parejas, mezclando un joven con un mayor.
- Cada pareja se convierte en un equipo.

Asi cada equipo combina conocimientos distintos y puede apoyarse mejor en preguntas de cultura general, actualidad, musica, Disney o adivinanzas.

### Equipos

- Pueden jugar hasta 12 equipos o jugadores.
- Los cinco primeros mantienen los colores clasicos (Rojo, Azul, Verde, Amarillo y Morado) y a partir del sexto se usan rosa, cian, naranja, lima, indigo, turquesa y magenta.
- Sin nombres propios, las tarjetas se llaman `Jugador 1`, `Jugador 2`... en modo individual, y `Equipo Rojo`, `Equipo Azul`... en modo por parejas.
- Los nombres se pueden cambiar en cualquier momento desde el marcador usando el boton de editar.
- Si los equipos se forman desde `ruletas.html`, los nombres generados se trasladan automaticamente al tablero principal.
- Debe haber un presentador que abre preguntas, controla tiempos, revela respuestas y reparte puntos.
- Cada equipo necesita papel, pizarra o algo similar para escribir sus respuestas.

### Tablero

El tablero tiene 6 categorias:

- Cultura general
- Actualidad
- Geografia
- Bandas sonoras
- Disney
- Adivinanzas

Cada categoria tiene 6 niveles de puntuacion:

- 150 puntos
- 250 puntos
- 400 puntos
- 500 puntos
- 700 puntos
- 800 puntos

La dificultad aumenta segun el valor de la casilla:

- 150 y 250: dificultad facil.
- 400 y 500: dificultad media.
- 700 y 800: dificultad dificil.

### Dinamica de ronda

1. El equipo al que le toca escoge una categoria y una puntuacion disponible.
2. El presentador abre esa pregunta en la tablet o pantalla principal.
3. Todos los equipos piensan la respuesta al mismo tiempo.
4. Cada equipo escribe su respuesta en papel o pizarra.
5. Cuando el presentador lo indique, todos giran o muestran sus respuestas a la vez.
6. El presentador pulsa `Resolver` para mostrar la respuesta correcta o la explicacion.
7. El presentador suma o resta los puntos correspondientes a cada equipo.
8. La casilla queda marcada como usada y ya no puntua, aunque se puede volver a abrir para repasar la respuesta.

La ventaja del equipo que tiene el turno es elegir la casilla. La pregunta, sin embargo, la responden todos los equipos.

### Puntuacion

Cada casilla tiene un valor positivo y una penalizacion equivalente a la mitad de sus puntos:

- 150: acierto `+150`, fallo `-75`.
- 250: acierto `+250`, fallo `-125`.
- 400: acierto `+400`, fallo `-200`.
- 500: acierto `+500`, fallo `-250`.
- 700: acierto `+700`, fallo `-350`.
- 800: acierto `+800`, fallo `-400`.

Regla general:

- Cada equipo que acierta suma el valor completo de la casilla.
- Cada equipo que falla resta la mitad del valor de la casilla.
- En `Adivinanzas`, los fallos no restan puntos.

La puntuacion se controla manualmente desde los botones de cada equipo para que el presentador pueda aplicar estas reglas con flexibilidad.

### Preguntas con opciones

En las categorias de preguntas tipo test, los equipos escriben la opcion o respuesta que creen correcta. Al revelar, el presentador comprueba que equipos han acertado y reparte puntos.

### Comodines

Cada equipo tiene 3 comodines marcables:

- 🟢 Comodin verde: se usa antes de responder. El presentador ensena la pista solo a ese equipo.
- 🔴 Comodin rojo: se usa antes de responder. Si ese equipo falla la pregunta, no resta puntos.
- 🟣 Comodin morado: se usa antes de escribir la respuesta. Ese equipo puede leer las respuestas del resto antes de escribir la suya.

Reglas importantes:

- Cada comodin solo se puede usar una vez por equipo durante la partida.
- Si un equipo usa el comodin morado en una pregunta, ningun otro equipo puede usar su comodin morado en esa misma pregunta.
- Los comodines se usan antes de revelar la respuesta correcta.
- Cuando un equipo usa un comodin, el presentador lo marca en el panel de puntuaciones para que todos vean cuales le quedan disponibles.

### Preguntas musicales

Las categorias `Bandas sonoras` y `Disney` pueden incluir audios.

En estas preguntas:

- Se puede reproducir, pausar y mover la pista de audio.
- La barra de progreso del reproductor admite tanto **clic** para saltar a un punto como **arrastre** con raton o dedo (compatible con dispositivos tactiles gracias a `pointer events` y `touch-action: none`).
- Los equipos escriben el nombre de la pelicula, serie o cancion que creen reconocer.
- El boton de revelar muestra la solucion cuando el presentador lo decida.

### Adivinanzas

Las adivinanzas no tienen opciones. Cada equipo escribe la respuesta que cree correcta.

Regla especial:

- Si un equipo acierta, suma los puntos de la casilla.
- Si un equipo falla, no resta puntos.

## Ruletas

La partida empieza normalmente en `ruletas.html`, donde se crean los equipos de forma aleatoria y equilibrada.

Funcionamiento:

1. Escribe un grupo de jugadores en la `Ruleta 1`, por ejemplo jovenes.
2. Escribe otro grupo de jugadores en la `Ruleta 2`, por ejemplo mayores.
3. Pulsa `Girar las dos ruletas a la vez`.
4. Se forma un equipo con una persona de cada ruleta.
5. Los nombres ganadores se eliminan de las ruletas.
6. Si solo queda una persona en cada ruleta, se emparejan automaticamente.
7. Cuando esten todos los equipos formados, pulsa `Empezar` para ir al tablero.

Al pulsar `Empezar` se cuentan las parejas de la tabla `Equipos Formados` y se crea una tarjeta por pareja, con los dos nombres. Si no hay ninguna pareja formada, se entra con los cinco equipos por defecto.

Los equipos formados se guardan temporalmente para pasar al tablero principal. Al recargar la pagina se limpian los equipos guardados.

## Interfaz

- El boton `Reglas` de la navbar abre un modal con las normas completas durante la partida.
- El logo `Family Trivia` de la navbar vuelve a la pagina principal.
- El enlace `Aleix AJ` y el logo del footer llevan al portfolio del autor. Se muestran con el gradiente azul cian del portfolio (`#a5f3fc -> #22d3ee -> #0891b2`), igual que el logo de la navbar, para reforzar la identidad de marca.
- La interfaz esta adaptada para escritorio, tablet y movil, incluyendo tablero y panel de puntuaciones responsive.
- Animaciones cuidadas en momentos clave: apertura y cierre de pregunta, opciones que entran escalonadas, feedback de respuesta (acierto / fallo), sello en casillas usadas, pulso del marcador al sumar o restar puntos y entrada animada del ranking final con `count-up` del ganador.
- Las ruletas tambien tienen feedback animado: cada nombre nuevo entra con una pequena animacion, el ganador hace un pulso al revelarse y los equipos formados se anaden con una transicion clara.
- Toda la capa de animaciones respeta `prefers-reduced-motion`, asi que se desactivan automaticamente si el sistema operativo lo pide.
- El tablero se puede manejar con teclado: `Tab` recorre las casillas, `Enter` o `Espacio` abren la pregunta y `Escape` cierra la pregunta o el ranking. Cada casilla anuncia su categoria y sus puntos para lectores de pantalla.

## Estado de partida

Si el presentador entra en `Editar equipos` desde una partida en curso, el juego conserva el estado al volver:

- Puntuaciones.
- Casillas abiertas.
- Preguntas asignadas.
- Comodines usados.
- Estadisticas acumuladas para el ranking final.

Si se cambia el numero de parejas o de jugadores, la partida empieza de cero porque el tablero anterior ya no encaja con las nuevas tarjetas.

Si se recarga la pagina con `F5`, se reinician la partida y los equipos guardados.

## Fin de partida

La partida termina cuando se han abierto todas las puntuaciones del tablero. Entonces el presentador pulsa el boton de finalizar partida para mostrar los resultados.

## Ranking final

El ranking final muestra:

- Equipo ganador.
- Puntuacion final de cada equipo.
- Grafico de evolucion de puntos.
- Mejor categoria por equipo.
- Categoria mas favorable y mas dificil.
- Estadisticas por categoria.

Desde la pantalla final tambien se puede reiniciar el tablero y las puntuaciones.

## Uso

No hace falta instalar dependencias.

Abre directamente:

- `index.html` para jugar.
- `ruletas.html` para formar equipos.

Tambien puedes desplegar la carpeta como proyecto estatico en cualquier servidor web.

## Estructura

```text
FamilyProject/
├── index.html
├── ruletas.html
├── css/
│   └── styles.css
├── js/
│   ├── questions.js
│   ├── script.js
│   ├── ruletas.js
│   └── footer.js
├── img/
└── audios/
```

## Editar preguntas

Las preguntas estan definidas en `js/questions.js`, dentro de `questionPools`, para que sea mas facil modificarlas sin tocar la logica del juego.

Cada pregunta puede incluir:

- `pregunta`: texto de la pregunta.
- `opciones`: respuestas posibles, si es una pregunta tipo test.
- `correcta`: indice de la opcion correcta.
- `explicacion`: texto que se muestra al resolver.
- `pista`: ayuda opcional.
- `audio`: ruta del archivo de audio, si es una pregunta musical.
- `trackName`: respuesta o explicacion de una pregunta musical.

Para cambiar categorias o valores del tablero, edita:

- `categories`: nombres de las categorias.
- `values`: puntuaciones disponibles.

El archivo `index.html` carga primero `js/questions.js` y despues `js/script.js`, asi que el orden de esos scripts es importante.

## Notas

- El proyecto es independiente y mantiene sus propios archivos `css/`, `js/`, `img/` y `audios/`.
- Usa Bootstrap, Bootstrap Icons, Google Fonts y Chart.js desde CDN.
- Esta pensado para uso local, reuniones familiares o despliegue estatico sencillo.
- El footer incluye un enlace al portfolio de Aleix Auque usando el logo `AJ` con el gradiente azul cian del portfolio.
- Las animaciones se desactivan automaticamente para usuarios con `prefers-reduced-motion: reduce`, mejorando la accesibilidad sin perder el efecto visual para el resto.
- Los scripts se cargan con `defer` manteniendo su orden, hay `preconnect` a Google Fonts y al CDN, y las imagenes que no se ven al entrar se cargan solo cuando hacen falta.
- El pulso de neon del tablero se anima por opacidad sobre un pseudo-elemento en lugar de animar `box-shadow` en las 36 casillas, que obligaba a repintar el tablero en cada fotograma.
