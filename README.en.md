# FAMILY TRIVIA

![HTML5](https://img.shields.io/badge/HTML5-static-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-custom-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-ranking-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

<p>
  <a href="README.md"><img src="docs/readme/lang-es.svg" alt="Español" width="170"></a>
  <img src="docs/readme/lang-en-active.svg" alt="English" width="170">
  <a href="README.ca.md"><img src="docs/readme/lang-ca.svg" alt="Català" width="170"></a>
</p>

A board-style family quiz game, designed for everyone to play together at home, with a host running the game from a tablet or a screen everyone can see. It can be played solo, with everyone playing individually, or in pairs formed with the spinning wheels. It includes questions by category, simultaneous answers, manual score control and a final ranking with statistics.

## Screenshots

A visual walkthrough from the start screen to the ranking and final statistics.

### Start screen

![Family Trivia start screen](img/readme/01-inicio.png)

### Wheels for forming teams

![Two wheels and the teams formed](img/readme/02-ruletas.png)

### Main board

![Board with categories and point values](img/readme/03-tablero.png)

### Multiple-choice question

![Question modal with options A, B, C and D](img/readme/04-pregunta.png)

### Correct answer highlighted, with the hint and explanation panel open

![Hint and explanation text after revealing the answer](img/readme/06-pista-explicacion.png)

### Soundtrack question (audio)

![Audio player in a music question](img/readme/07-banda-sonora.png)

### Soundtrack answer

![Hint, audio and revealed movie](img/readme/08-banda-sonora-respuesta.png)

### Game in progress

![Board with used squares and team scoreboards](img/readme/09-tablero-partida.png)

### End of game

![Winner modal with ranking and confetti](img/readme/10-fin-partida.png)

### Final statistics

![Score evolution chart and statistics by category](img/readme/11-estadisticas.png)

## Game entry points

- `index.html`: main Family Trivia board.
- `ruletas.html`: wheel screen for forming teams before starting.

## Objective

The goal is to score as many points as possible by answering questions from different categories. Each round, one team has the advantage of choosing the category and the point value, but all teams answer the question at the same time.

When the whole board has been played, a final ranking is shown with the winning team, confetti and performance statistics by team and category.

## Game modes

When the game opens, you choose one of three modes:

- **Single player**: you enter your name and play alone, with a single scorecard.
- **Individual multiplayer**: you enter how many people are playing (from 2 to 15) and each person's name. Each person gets their own card.
- **Multiplayer in pairs**: takes you to `ruletas.html`, where the pairs are formed. Each pair becomes a card with both names, up to 15 pairs (30 people).

In every mode, the scoreboard cards are generated according to the actual number of participants: up to five per row on desktop, with the rest moving to the row below.

## Rules

### Setup

The game is designed for mixed family groups. For example, if 10 people are playing plus the host:

- 5 younger players are entered in `Ruleta 1` (wheel 1).
- 5 older players are entered in `Ruleta 2` (wheel 2).
- The wheels form 5 pairs, matching one younger player with one older player.
- Each pair becomes a team.

This way each team combines different knowledge and is better equipped for general knowledge, current affairs, music, Disney or riddle questions.

### Teams

- Up to 15 teams or players can play, three rows of five cards on desktop.
- The first five keep the classic colors (Red, Blue, Green, Yellow and Purple), and from the sixth onward pink, cyan, orange, lime, indigo, turquoise, magenta, sky, coral and mint are used.
- If no names are entered, the cards are called `Jugador 1` (Player 1), `Jugador 2`... in individual mode, and `Equipo Rojo` (Red Team), `Equipo Azul` (Blue Team)... in pairs mode.
- Names can be changed at any time from the scoreboard using the edit button.
- If teams are formed from `ruletas.html`, the generated names are carried over automatically to the main board.
- There must be a host who opens questions, keeps time, reveals answers and awards points.
- Each team needs paper, a whiteboard or something similar to write down their answers.

### Board

The board has 6 categories:

- General knowledge
- Current affairs
- Geography
- Soundtracks
- Disney
- Riddles

Each category has 6 point levels:

- 150 points
- 250 points
- 400 points
- 500 points
- 700 points
- 800 points

Difficulty increases with the square's value:

- 150 and 250: easy.
- 400 and 500: medium.
- 700 and 800: hard.

### Board progress

Next to the turn bar there is a counter of squares played (for example `14/36`). When the last one is played, the game lets you know that the match can now be ended.

### Turns

Above the board there is a bar showing whose turn it is, which also highlights that team's card on the scoreboard. The turn passes automatically to the next team when an already resolved question is closed, and the host can correct or skip it with the arrows. In single-player mode the bar is not shown.

### Round flow

1. The team whose turn it is chooses a category and an available point value.
2. The host opens that question on the tablet or main screen.
3. All teams think of the answer at the same time.
4. Each team writes its answer on paper or a whiteboard.
5. When the host says so, everyone turns over or shows their answers at the same time.
6. The host presses `Resolver` (resolve) to show the correct answer or the explanation.
7. The host adds or subtracts the corresponding points for each team.
8. When the question is closed, the scoring screen opens with the correct answer and the teams.
9. The square is marked as used and no longer scores, although it can be reopened to review the answer.

The advantage of the team whose turn it is lies in choosing the square. The question, however, is answered by all teams.

### Scoring

Each square has a positive value and a penalty equal to half its points:

- 150: correct `+150`, wrong `-75`.
- 250: correct `+250`, wrong `-125`.
- 400: correct `+400`, wrong `-200`.
- 500: correct `+500`, wrong `-250`.
- 700: correct `+700`, wrong `-350`.
- 800: correct `+800`, wrong `-400`.

General rule:

- Each team that answers correctly earns the full value of the square.
- Each team that answers incorrectly loses half the value of the square.
- In `Adivinanzas` (riddles), wrong answers do not lose points.

There are two ways to award points:

- **Scoring screen** (opens when the question is closed): shows the correct answer at the top, with its letter and text, and below it one row per team with a large correct button and a large wrong button, designed for tapping on a tablet. Marking them automatically applies the square's value, half of it as a negative if wrong, and nothing if it is a riddle. Tapping the same mark again removes it and returns the points, and switching from correct to wrong recalculates the difference without stacking. `Ver la pregunta` (view the question) goes back to the question text and `Listo` (done) closes the round and passes the turn.
- **Buttons on each card**: hidden behind the `Ajustar puntos` (adjust points) button, which opens a floating panel over the card with the add, subtract and reset buttons. It is meant for one-off corrections; in the per-category statistics those points are attributed to the last question opened. Only one panel can be open at a time, and it closes when you tap outside it or press `Escape`.

If the question on a square where points have already been awarded is changed, those points are returned automatically, because that question is no longer being played.

The **Deshacer turno** (undo turn) button (or `Ctrl+Z`) reverts the last score change, whether it came from assisted scoring or from the manual buttons, and also undoes the corresponding correct or wrong mark.

### Multiple-choice questions

In the multiple-choice categories, teams write down the option or answer they think is correct. On reveal, the host checks which teams got it right and awards points.

### Jokers

Each team has 3 jokers that can be marked:

- 🟡 Yellow joker: used before answering. The host shows the hint to that team only.
- 🔴 Red joker: used before answering. If that team gets the question wrong, it does not lose points.
- ⚪ White joker: used before writing the answer. That team can read the other teams' answers before writing its own.

Important rules:

- Each joker can only be used once per team during the game.
- If a team uses the white joker on a question, no other team can use its white joker on that same question.
- Jokers are used before the correct answer is revealed.
- When a team uses a joker, the host marks it on the score panel so everyone can see which ones it has left.

### Music questions

The `Bandas sonoras` (soundtracks) and `Disney` categories can include audio.

In these questions:

- The audio track can be played, paused and scrubbed.
- The player's progress bar supports both **clicking** to jump to a point and **dragging** with a mouse or finger (compatible with touch devices thanks to `pointer events` and `touch-action: none`).
- Teams write down the name of the movie, series or song they think they recognize.
- The reveal button shows the solution whenever the host decides.

### Riddles

Riddles have no options. Each team writes down the answer it thinks is correct.

Special rule:

- If a team answers correctly, it earns the square's points.
- If a team answers incorrectly, it does not lose points.

## Wheels

The game normally starts in `ruletas.html`, where teams are created randomly and in a balanced way.

How it works:

1. Enter one group of players in `Ruleta 1`, for example the younger ones.
2. Enter another group of players in `Ruleta 2`, for example the older ones.
3. Press `Girar las dos ruletas a la vez` (spin both wheels at once).
4. A team is formed with one person from each wheel.
5. The winning names are removed from the wheels.
6. If only one person is left on each wheel, they are paired automatically.
7. When all the teams are formed, press `¡Empezar!` (start) to go to the board.

When you press `¡Empezar!`, the pairs in the `Equipos Formados` (formed teams) table are counted and one card is created per pair, with both names. If no pair has been formed, the game starts with the five default teams.

The formed teams are saved in the browser to carry them over to the main board, and they stay there even if the tab is closed. When reloading the page with `F5`, the game asks before deleting them.

## Interface

- The `Reglas` (rules) button in the navbar opens a modal with the full rules during the game.
- The `Family Trivia` logo in the navbar goes back to the home page.
- The `Aleix AJ` link and the footer logo lead to the author's portfolio. They are displayed with the portfolio's cyan-blue gradient (`#a5f3fc -> #22d3ee -> #0891b2`), just like the navbar logo, to reinforce the brand identity.
- The interface is adapted for desktop, tablet and mobile, including a responsive board and score panel.
- Polished animations at key moments: opening and closing a question, options that enter in a staggered sequence, answer feedback (correct / wrong), a stamp on used squares, a scoreboard pulse when adding or subtracting points, and an animated entrance for the final ranking with a `count-up` for the winner.
- The wheels also have animated feedback: each new name enters with a small animation, the winner pulses when revealed, and formed teams are added with a clear transition.
- The whole animation layer respects `prefers-reduced-motion`, so animations are disabled automatically if the operating system requests it.
- The board can be operated with the keyboard: `Tab` moves through the squares, `Enter` or `Space` opens the question and `Escape` closes the question or the ranking. Each square announces its category and points to screen readers.

## Game state

If the host goes into `Editar equipos` (edit teams) during a game in progress, the game keeps its state when returning:

- Scores.
- Opened squares.
- Assigned questions.
- Used jokers.
- Current turn and the correct or wrong answers already marked on each square.
- Accumulated statistics for the final ranking.

If the number of pairs or players changes, the game starts from scratch because the previous board no longer fits the new cards.

The game is saved in the browser of the device acting as host, not on a server, and it survives closing the tab and even closing the browser: when the game is opened again, a prompt appears to continue where you left off or start over. The same happens when reloading with `F5`, and in `ruletas.html` with pairs already formed.

Since it is saved per device and browser, the game only reappears in the same place where it was being played. Clearing the browser data or playing in incognito mode does delete it.

## End of game

The game ends when all the point values on the board have been opened. The host then presses the finish game button to show the results.

## Final ranking

The final ranking shows:

- Winning team.
- Final score for each team.
- Score evolution chart.
- Best category per team.
- Most favorable and most difficult category.
- Statistics by category.

From the final screen you can also reset the board and the scores.

## Usage

No dependencies need to be installed.

Open directly:

- `index.html` to play.
- `ruletas.html` to form teams.

You can also deploy the folder as a static project on any web server.

## Structure

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

## Editing questions

The questions are defined in `js/questions.js`, inside `questionPools`, so they are easier to modify without touching the game logic.

Each question can include:

- `pregunta`: question text.
- `opciones`: possible answers, if it is a multiple-choice question.
- `correcta`: index of the correct option.
- `explicacion`: text shown when resolving.
- `pista`: optional hint.
- `audio`: path to the audio file, if it is a music question.
- `trackName`: answer or explanation for a music question.

To change the board's categories or values, edit:

- `categories`: category names.
- `values`: available point values.

The `index.html` file loads `js/questions.js` first and then `js/script.js`, so the order of those scripts matters.

## Works offline

All libraries are served from the project itself, in `vendor/`: Bootstrap, Bootstrap Icons (with its fonts), Chart.js and the Poppins and Russo One typefaces (Latin and latin-ext subsets). The page makes no requests to external servers.

In addition, `sw.js` stores the game in the browser the first time it is opened, so afterwards it can be played without a connection: board, questions, scoreboard, wheels and statistics. The only thing that needs the network is the audio for `Bandas sonoras` and `Disney`, which is too heavy to store; if it fails to load, the game shows a notice and the question can be swapped.

Pages are always requested from the network first and are only served from the stored copy when there is no connection, so published changes still get through.

When publishing changes to `css/` or `js/`, you need to bump the `?v=` on the `<link>` and `<script>` tags in `index.html` and `ruletas.html`: that part of the URL is what forces the browser to download the new file instead of reusing its own. It is a good idea to use the same `?v=` in the `PRECACHE` list in `sw.js` and also bump the `CACHE` number, so devices discard the previous copy.

## Notes

- The project is self-contained and keeps its own `css/`, `js/`, `img/`, `audios/` and `vendor/` files.
- It is designed for local use, family gatherings or simple static deployment.
- The footer includes a link to Aleix Auque's portfolio using the `AJ` logo with the portfolio's cyan-blue gradient.
- Animations are disabled automatically for users with `prefers-reduced-motion: reduce`, improving accessibility without losing the visual effect for everyone else.
- Scripts are loaded with `defer` while keeping their order, all libraries and fonts are served from `vendor/` (no `preconnect` or requests to Google Fonts or a CDN), and images that are not visible on load are only loaded when needed.
- The board's neon pulse is animated via opacity on a pseudo-element instead of animating `box-shadow` on all 36 squares, which forced the board to repaint on every frame.
