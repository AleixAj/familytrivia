# FAMILY TRIVIA

![HTML5](https://img.shields.io/badge/HTML5-static-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-custom-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-ranking-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

<p>
  <a href="README.md"><img src="docs/readme/lang-es.svg" alt="Español" width="170"></a>
  <a href="README.en.md"><img src="docs/readme/lang-en.svg" alt="English" width="170"></a>
  <img src="docs/readme/lang-ca-active.svg" alt="Català" width="170">
</p>

Joc familiar de preguntes d'estil tauler, pensat per jugar tots junts a casa, amb un presentador que dirigeix la partida des d'una tauleta o una pantalla visible per a tothom. Es pot jugar sol, cadascú pel seu compte o per parelles formades amb les ruletes. Inclou preguntes per categories, respostes simultànies, control manual de punts i un rànquing final amb estadístiques.

## Captures de pantalla

Recorregut visual des de la pantalla d'inici fins al rànquing i les estadístiques finals.

### Pantalla d'inici

![Pantalla d'inici de Family Trivia](img/readme/01-inicio.png)

### Ruletes per formar equips

![Dues ruletes i equips formats](img/readme/02-ruletas.png)

### Tauler principal

![Tauler amb categories i valors de puntuació](img/readme/03-tablero.png)

### Pregunta tipus test

![Modal de pregunta amb les opcions A, B, C i D](img/readme/04-pregunta.png)

### Resposta correcta ressaltada, amb el panell de pista i explicació obert

![Pista i text explicatiu després de revelar la resposta](img/readme/06-pista-explicacion.png)

### Pregunta de banda sonora (àudio)

![Reproductor d'àudio en una pregunta musical](img/readme/07-banda-sonora.png)

### Resposta de banda sonora

![Pista, àudio i pel·lícula revelada](img/readme/08-banda-sonora-respuesta.png)

### Partida en curs

![Tauler amb caselles usades i marcadors dels equips](img/readme/09-tablero-partida.png)

### Final de partida

![Modal del guanyador amb rànquing i confeti](img/readme/10-fin-partida.png)

### Estadístiques finals

![Gràfic d'evolució i estadístiques per categoria](img/readme/11-estadisticas.png)

## Entrades del joc

- `index.html`: tauler principal de Family Trivia.
- `ruletas.html`: pantalla de ruletes per formar equips abans de començar.

## Objectiu

L'objectiu és aconseguir la puntuació més alta possible responent preguntes de categories diferents. A cada ronda, un equip té l'avantatge de triar la categoria i la puntuació, però tots els equips responen la pregunta alhora.

En acabar tot el tauler, es mostra un rànquing final amb l'equip guanyador, confeti i estadístiques de rendiment per equip i per categoria.

## Modes de joc

En obrir el joc es tria un dels tres modes:

- **Un jugador**: es demana el nom i es juga sol, amb una única targeta de puntuació.
- **Multijugador individual**: s'indica quantes persones juguen (de 2 a 15) i el nom de cadascuna. Cada persona té la seva pròpia targeta.
- **Multijugador per parelles**: porta a `ruletas.html`, on es formen les parelles. Cada parella es converteix en una targeta amb els dos noms, fins a 15 parelles (30 persones).

En tots els modes, les targetes del marcador es generen segons el nombre real de participants: fins a cinc per fila en ordinador, i les següents passen a la fila de sota.

## Regles

### Preparació

El joc està pensat per a grups familiars barrejats. Per exemple, si juguen 10 persones més el presentador:

- 5 joves s'escriuen a la `Ruleta 1`.
- 5 grans s'escriuen a la `Ruleta 2`.
- Les ruletes formen 5 parelles, cadascuna amb un jove i un gran.
- Cada parella es converteix en un equip.

Així cada equip combina coneixements diferents i es pot defensar millor en preguntes de cultura general, actualitat, música, Disney o endevinalles.

### Equips

- Poden jugar fins a 15 equips o jugadors, tres files de cinc targetes en ordinador.
- Els cinc primers mantenen els colors clàssics (vermell, blau, verd, groc i lila) i a partir del sisè s'utilitzen rosa, cian, taronja, llima, indi, turquesa, magenta, cel, corall i menta.
- Si no s'escriuen noms, les targetes es diuen `Jugador 1`, `Jugador 2`... en el mode individual, i `Equipo Rojo` (Equip Vermell), `Equipo Azul` (Equip Blau)... en el mode per parelles.
- Els noms es poden canviar en qualsevol moment des del marcador amb el botó d'editar.
- Si els equips es formen des de `ruletas.html`, els noms generats es traslladen automàticament al tauler principal.
- Hi ha d'haver un presentador que obre les preguntes, controla els temps, revela les respostes i reparteix els punts.
- Cada equip necessita paper, una pissarra o alguna cosa semblant per escriure les respostes.

### Tauler

El tauler té 6 categories:

- Cultura general
- Actualitat
- Geografia
- Bandes sonores
- Disney
- Endevinalles

Cada categoria té 6 nivells de puntuació:

- 150 punts
- 250 punts
- 400 punts
- 500 punts
- 700 punts
- 800 punts

La dificultat augmenta segons el valor de la casella:

- 150 i 250: dificultat fàcil.
- 400 i 500: dificultat mitjana.
- 700 i 800: dificultat difícil.

### Progrés del tauler

Al costat de la barra de torn hi ha un comptador de caselles jugades (per exemple `14/36`). En jugar l'última, el joc avisa que ja es pot finalitzar la partida.

### Torns

Damunt del tauler hi ha una barra que indica de quin equip és el torn i, a més, en ressalta la targeta al marcador. El torn passa sol a l'equip següent quan es tanca una pregunta ja resolta, i el presentador el pot corregir o saltar amb les fletxes. En el mode d'un jugador la barra no apareix.

### Dinàmica de la ronda

1. L'equip a qui toca tria una categoria i una puntuació disponible.
2. El presentador obre aquesta pregunta a la tauleta o a la pantalla principal.
3. Tots els equips pensen la resposta al mateix temps.
4. Cada equip escriu la seva resposta en un paper o una pissarra.
5. Quan el presentador ho indica, tots giren o mostren les respostes alhora.
6. El presentador prem `Resolver` (resoldre) per mostrar la resposta correcta o l'explicació.
7. El presentador suma o resta els punts corresponents a cada equip.
8. En tancar la pregunta s'obre la pantalla de repartiment amb la resposta correcta i els equips.
9. La casella queda marcada com a usada i ja no puntua, tot i que es pot tornar a obrir per repassar la resposta.

L'avantatge de l'equip que té el torn és triar la casella. La pregunta, en canvi, la responen tots els equips.

### Puntuació

Cada casella té un valor positiu i una penalització equivalent a la meitat dels seus punts:

- 150: encert `+150`, error `-75`.
- 250: encert `+250`, error `-125`.
- 400: encert `+400`, error `-200`.
- 500: encert `+500`, error `-250`.
- 700: encert `+700`, error `-350`.
- 800: encert `+800`, error `-400`.

Regla general:

- Cada equip que encerta suma el valor complet de la casella.
- Cada equip que falla resta la meitat del valor de la casella.
- A la categoria `Adivinanzas` (endevinalles), els errors no resten punts.

Hi ha dues maneres de repartir els punts:

- **Pantalla de repartiment** (s'obre en tancar la pregunta): mostra a dalt la resposta correcta, amb la lletra i el text, i a sota una fila per equip amb un botó gran d'encert i un altre d'error, pensats per prémer a la tauleta. En marcar-los s'aplica automàticament el valor de la casella, la meitat en negatiu si falla, i res si és una endevinalla. Tornar a prémer la mateixa marca la treu i retorna els punts, i canviar d'encert a error recalcula la diferència sense acumular. `Ver la pregunta` (veure la pregunta) torna a l'enunciat i `Listo` (fet) tanca la ronda i passa el torn.
- **Botons de cada targeta**: queden amagats darrere del botó `Ajustar puntos` (ajustar punts), que desplega un panell flotant sobre la targeta amb les sumes, les restes i el reinici. Serveix per a correccions puntuals; a les estadístiques per categoria, aquests punts s'atribueixen a l'última pregunta oberta. Només es pot tenir un panell obert alhora, i es tanca en prémer fora o amb `Escape`.

Si es canvia la pregunta d'una casella on ja s'havien repartit punts, aquests punts es retornen automàticament, perquè aquella pregunta deixa de jugar-se.

El botó **Deshacer turno** (desfer torn) (o `Ctrl+Z`) reverteix l'últim canvi de puntuació, tant si ve del repartiment assistit com dels botons manuals, i també desfà la marca d'encert o d'error corresponent.

### Preguntes amb opcions

A les categories de preguntes tipus test, els equips escriuen l'opció o la resposta que creuen correcta. En revelar-la, el presentador comprova quins equips l'han encertada i reparteix els punts.

### Comodins

Cada equip té 3 comodins que es poden marcar:

- 🟡 Comodí groc: s'utilitza abans de respondre. El presentador ensenya la pista només a aquell equip.
- 🔴 Comodí vermell: s'utilitza abans de respondre. Si aquell equip falla la pregunta, no resta punts.
- ⚪ Comodí blanc: s'utilitza abans d'escriure la resposta. Aquell equip pot llegir les respostes de la resta abans d'escriure la seva.

Regles importants:

- Cada comodí només es pot utilitzar una vegada per equip durant la partida.
- Si un equip utilitza el comodí blanc en una pregunta, cap altre equip no pot utilitzar el seu comodí blanc en aquella mateixa pregunta.
- Els comodins s'utilitzen abans de revelar la resposta correcta.
- Quan un equip utilitza un comodí, el presentador el marca al panell de puntuacions perquè tothom vegi quins li queden disponibles.

### Preguntes musicals

Les categories `Bandas sonoras` (bandes sonores) i `Disney` poden incloure àudios.

En aquestes preguntes:

- Es pot reproduir, pausar i moure la pista d'àudio.
- La barra de progrés del reproductor admet tant **clic** per saltar a un punt com **arrossegament** amb el ratolí o el dit (compatible amb dispositius tàctils gràcies a `pointer events` i `touch-action: none`).
- Els equips escriuen el nom de la pel·lícula, la sèrie o la cançó que creuen reconèixer.
- El botó de revelar mostra la solució quan el presentador ho decideix.

### Endevinalles

Les endevinalles no tenen opcions. Cada equip escriu la resposta que creu correcta.

Regla especial:

- Si un equip encerta, suma els punts de la casella.
- Si un equip falla, no resta punts.

## Ruletes

La partida comença normalment a `ruletas.html`, on es creen els equips de manera aleatòria i equilibrada.

Funcionament:

1. Escriu un grup de jugadors a la `Ruleta 1`, per exemple els joves.
2. Escriu un altre grup de jugadors a la `Ruleta 2`, per exemple els grans.
3. Prem `Girar las dos ruletas a la vez` (girar les dues ruletes alhora).
4. Es forma un equip amb una persona de cada ruleta.
5. Els noms guanyadors s'eliminen de les ruletes.
6. Si només queda una persona a cada ruleta, s'aparellen automàticament.
7. Quan tots els equips estiguin formats, prem `Empezar` (començar) per anar al tauler.

En prémer `Empezar`, es compten les parelles de la taula `Equipos Formados` (equips formats) i es crea una targeta per parella, amb els dos noms. Si no hi ha cap parella formada, s'entra amb els cinc equips per defecte.

Els equips formats es desen al navegador per passar-los al tauler principal i s'hi mantenen encara que es tanqui la pestanya. En recarregar la pàgina amb `F5`, el joc pregunta abans d'esborrar-los.

## Interfície

- El botó `Reglas` (regles) de la barra de navegació obre un modal amb les normes completes durant la partida.
- El logotip `Family Trivia` de la barra de navegació torna a la pàgina principal.
- L'enllaç `Aleix AJ` i el logotip del peu de pàgina porten al portafolis de l'autor. Es mostren amb el degradat blau cian del portafolis (`#a5f3fc -> #22d3ee -> #0891b2`), igual que el logotip de la barra de navegació, per reforçar la identitat de marca.
- La interfície està adaptada per a ordinador, tauleta i mòbil, amb el tauler i el panell de puntuacions adaptatius.
- Animacions acurades en els moments clau: obertura i tancament de la pregunta, opcions que entren de manera esglaonada, resposta visual a l'encert o a l'error, segell a les caselles usades, pols del marcador en sumar o restar punts i entrada animada del rànquing final amb un `count-up` del guanyador.
- Les ruletes també tenen resposta visual animada: cada nom nou entra amb una petita animació, el guanyador fa un pols en revelar-se i els equips formats s'afegeixen amb una transició clara.
- Tota la capa d'animacions respecta `prefers-reduced-motion`, de manera que es desactiven automàticament si el sistema operatiu ho demana.
- El tauler es pot fer servir amb el teclat: `Tab` recorre les caselles, `Enter` o `Espai` obren la pregunta i `Escape` tanca la pregunta o el rànquing. Cada casella anuncia la seva categoria i els seus punts als lectors de pantalla.

## Estat de la partida

Si el presentador entra a `Editar equipos` (editar equips) durant una partida en curs, el joc en conserva l'estat en tornar:

- Puntuacions.
- Caselles obertes.
- Preguntes assignades.
- Comodins utilitzats.
- Torn actual i encerts o errors ja marcats a cada casella.
- Estadístiques acumulades per al rànquing final.

Si es canvia el nombre de parelles o de jugadors, la partida comença de zero perquè el tauler anterior ja no encaixa amb les targetes noves.

La partida es desa al navegador del dispositiu que fa de presentador, no en un servidor, i sobreviu al tancament de la pestanya i fins i tot del navegador: en tornar a obrir el joc apareix un avís per continuar on ho vau deixar o començar de nou. El mateix passa en recarregar amb `F5`, i a `ruletas.html` amb les parelles ja formades.

Com que es desa per dispositiu i navegador, la partida només reapareix al mateix lloc on s'estava jugant. Esborrar les dades del navegador o jugar en mode d'incògnit sí que l'esborra.

## Final de partida

La partida s'acaba quan s'han obert totes les puntuacions del tauler. Aleshores el presentador prem el botó de finalitzar la partida per mostrar els resultats.

## Rànquing final

El rànquing final mostra:

- Equip guanyador.
- Puntuació final de cada equip.
- Gràfic d'evolució dels punts.
- Millor categoria per equip.
- Categoria més favorable i més difícil.
- Estadístiques per categoria.

Des de la pantalla final també es poden reiniciar el tauler i les puntuacions.

## Ús

No cal instal·lar dependències.

Obre directament:

- `index.html` per jugar.
- `ruletas.html` per formar equips.

També pots desplegar la carpeta com a projecte estàtic en qualsevol servidor web.

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
├── vendor/
│   ├── bootstrap/
│   ├── bootstrap-icons/
│   ├── chart/
│   └── fonts/
├── sw.js
├── img/
└── audios/
```

## Editar preguntes

Les preguntes estan definides a `js/questions.js`, dins de `questionPools`, perquè sigui més fàcil modificar-les sense tocar la lògica del joc.

Cada pregunta pot incloure:

- `pregunta`: text de la pregunta.
- `opciones`: respostes possibles, si és una pregunta tipus test.
- `correcta`: índex de l'opció correcta.
- `explicacion`: text que es mostra en resoldre.
- `pista`: ajuda opcional.
- `audio`: ruta de l'arxiu d'àudio, si és una pregunta musical.
- `trackName`: resposta o explicació d'una pregunta musical.

Per canviar les categories o els valors del tauler, edita:

- `categories`: noms de les categories.
- `values`: puntuacions disponibles.

L'arxiu `index.html` carrega primer `js/questions.js` i després `js/script.js`, així que l'ordre d'aquests scripts és important.

## Funciona sense connexió

Totes les biblioteques se serveixen des del mateix projecte, a `vendor/`: Bootstrap, Bootstrap Icons (amb les seves fonts), Chart.js i les tipografies Poppins i Russo One (subconjunts latin i latin-ext). La pàgina no fa cap petició a servidors externs.

A més, `sw.js` desa el joc al navegador la primera vegada que s'obre, de manera que després s'hi pot jugar encara que no hi hagi connexió: tauler, preguntes, marcador, ruletes i estadístiques. L'únic que necessita xarxa són els àudios de `Bandas sonoras` i `Disney`, que pesen massa per desar-los; si no carreguen, el joc avisa i es pot canviar de pregunta.

Les pàgines es demanen sempre primer a la xarxa i només se serveixen des de la còpia desada si no hi ha connexió, de manera que els canvis publicats arriben igualment.

En publicar canvis a `css/` o `js/` cal pujar el `?v=` que porten els `<link>` i `<script>` d'`index.html` i `ruletas.html`: aquesta part de l'adreça és el que obliga el navegador a baixar l'arxiu nou en lloc de reutilitzar el seu. Convé posar el mateix `?v=` a la llista `PRECACHE` de `sw.js` i pujar també el número de `CACHE`, perquè els dispositius descartin la còpia anterior.

## Notes

- El projecte és independent i manté els seus propis arxius `css/`, `js/`, `img/`, `audios/` i `vendor/`.
- Està pensat per a ús local, reunions familiars o un desplegament estàtic senzill.
- El peu de pàgina inclou un enllaç al portafolis d'Aleix Auque amb el logotip `AJ` i el degradat blau cian del portafolis.
- Les animacions es desactiven automàticament per als usuaris amb `prefers-reduced-motion: reduce`, cosa que millora l'accessibilitat sense perdre l'efecte visual per a la resta.
- Els scripts es carreguen amb `defer` mantenint-ne l'ordre, hi ha `preconnect` a Google Fonts i al CDN, i les imatges que no es veuen en entrar es carreguen només quan cal.
- El pols de neó del tauler s'anima per opacitat sobre un pseudoelement en lloc d'animar `box-shadow` a les 36 caselles, cosa que obligava a repintar el tauler a cada fotograma.
