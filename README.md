# AJ Games

Suite de juegos familiares para jugar en grupo, sin necesidad de instalación ni backend.

## Juegos incluidos

### Family Trivia
Juego de preguntas por equipos. Hasta 5 equipos compiten en 6 categorías eligiendo dificultad y puntuación. Incluye pistas, comodines, clasificación final con confeti y estadísticas de partida.

**Categorías:** Cultura general · Actualidad · Geografía · Bandas sonoras · Disney · Adivinanzas  
**Dificultades:** Fácil (150 pts) · Media (250–400 pts) · Difícil (500–800 pts)

### Cash Drop
Un jugador distribuye 20 fajos de 50.000€ (1.000.000€ en total) entre 4 opciones de respuesta. Solo conserva el dinero que haya apostado en la correcta. 6 preguntas de dificultad creciente.

### Ruletas
Dos ruletas giratorias para formar equipos al azar antes de empezar la trivia. Empareja automáticamente el último nombre restante de cada ruleta.

### Panel de preguntas *(uso interno)*
Herramienta de revisión y control de calidad del banco de preguntas. Permite marcar preguntas como vistas, por revisar o pendientes, y editar pistas. El estado se guarda en localStorage.

## Stack

- HTML5 + CSS3 + JavaScript (ES6, vanilla)
- Bootstrap 5.3.3 + Bootstrap Icons 1.11.3
- Chart.js 4.4.4 — estadísticas de partida
- LocalStorage — persistencia de puntuaciones y estados de preguntas
- 50 archivos de audio (bandas sonoras de películas y Disney)

## Estructura

```
FamilyProject/
├── index.html          # Family Trivia
├── cashdrop.html       # Cash Drop
├── ruletas.html        # Ruletas
├── preguntas.html      # Panel de revisión (interno)
├── css/
│   ├── styles.css      # Estilos compartidos
│   ├── cashdrop.css    # Estilos de Cash Drop
│   └── preguntas.css   # Estilos del panel
├── js/
│   ├── script.js       # Lógica de Family Trivia y Ruletas
│   ├── cashdrop.js     # Lógica de Cash Drop
│   ├── footer.js       # Efectos de borde animado
│   └── preguntas.js    # Lógica del panel de revisión
├── audios/
│   ├── bso/            # Bandas sonoras de películas
│   └── disney/         # Canciones Disney
└── img/                # Imágenes e iconos
```

## Uso

Abre directamente cualquier `.html` en el navegador o despliega la carpeta en cualquier hosting de estáticos (Netlify, Cloudflare Pages, etc.). No requiere servidor ni dependencias npm.

## Despliegue

El archivo `_headers` configura la caché de audio en Netlify/Cloudflare (86400s). Para otros hostings puede ignorarse o adaptarse según su sistema de cabeceras.
