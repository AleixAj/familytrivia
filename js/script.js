// ==================== UI UTILS ====================
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[m]);
}

function showToast(message, type = 'warning') {
  let container = document.getElementById('ajToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'ajToastContainer';
    container.className = 'toast-container position-fixed top-0 start-50 translate-middle-x p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = `toast align-items-center text-bg-${type} border-0`;
  el.setAttribute('role', 'alert');
  el.innerHTML = `<div class="d-flex"><div class="toast-body fw-semibold">${escapeHtml(message)}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button></div>`;
  container.appendChild(el);
  const toast = new bootstrap.Toast(el, { delay: 3500 });
  toast.show();
  el.addEventListener('hidden.bs.toast', () => el.remove());
}

// ==================== NAVIGATION ====================
function goTo(page) {
  window.location.href = page;
}

function startTrivia() {
  document.getElementById('triviaIntro')?.classList.add('d-none');
  document.getElementById('gameContainer')?.classList.remove('d-none');
}

if (new URLSearchParams(window.location.search).get('start') === '1') {
  document.addEventListener('DOMContentLoaded', startTrivia);
}

function highlightActiveButton() {
  const pathname = window.location.pathname.toLowerCase().replace(/\/$/, ''); // remove trailing slash if present

  const testBtn = document.querySelector('.nav-btn.test');
  const ruletasBtn = document.querySelector('.nav-btn.ruletas');

  if (!testBtn || !ruletasBtn) return;

  testBtn.classList.remove('active');
  ruletasBtn.classList.remove('active');

  // Detectar página de ruletas de forma más robusta
  if (pathname.endsWith('ruletas') || pathname.endsWith('ruletas.html') || pathname.includes('/ruletas')) {
    ruletasBtn.classList.add('active');
  } else {
    testBtn.classList.add('active');
  }
}

// ==================== BOARD SETUP ====================
const categories = [
  'Cultura general',
  'Actualidad',
  'Geografía',
  'Bandas sonoras',
  'Disney',
  'Adivinanzas'
];
const values = [150,250,400,500,700,800];
const cols = 6;

const questionPools = {
  "Cultura general": { 
    facil: [
    { pregunta: "¿Cuál es el animal terrestre más rápido del mundo?", opciones: ["León","Guepardo","Tigre","Antílope"], correcta: 1, explicacion: "El guepardo puede alcanzar velocidades de hasta 110 km/h en carreras cortas.", pista: "No es el más grande ni el más fuerte, pero en velocidad punta ningún animal terrestre se le acerca." },
    { pregunta: "¿Quién pintó la obra conocida como 'La Mona Lisa'?", opciones: ["Pablo Picasso", "Vincent van Gogh", "Leonardo da Vinci", "Miguel Ángel"], correcta: 2, explicacion: "La Mona Lisa fue pintada por Leonardo da Vinci en el siglo XVI. Es una de las obras más famosas del mundo y se exhibe en el Museo del Louvre en París.", pista: "El autor también era escultor, ingeniero e inventor, todo a la vez." },
    { pregunta: "¿Cómo se llama el ratón famoso de Disney?", opciones: ["Donald","Goofy","Mickey","Pluto"], correcta: 2, explicacion: "Mickey Mouse es el ratón más icónico de Disney, creado en 1928 por Walt Disney y Ub Iwerks. Curiosamente, su primer nombre fue Mortimer, pero la esposa de Walt lo cambió a Mickey. Actualmente es considerado uno de los personajes más reconocidos del mundo.", pista: "Es el personaje que prácticamente representa a toda la compañía." },
    { pregunta: "¿Cuál de estos inventos apareció primero?", opciones: ["Teléfono","Internet","Televisión","Ordenador"], correcta: 0, explicacion: "El teléfono fue inventado en el siglo XIX por Alexander Graham Bell. Los otros inventos llegaron mucho después, especialmente internet, que es del siglo XX.", pista: "Piensa en el invento que ya existía mucho antes de la era digital." },
    { pregunta: "¿Qué planeta es conocido como el 'Planeta Rojo'?", opciones: ["Mercurio","Marte","Júpiter","Venus"], correcta: 1, explicacion: "Marte recibe este apodo por el óxido de hierro presente en su superficie, que le da un tono rojizo.", pista: "El óxido de hierro en su superficie le da un tono inconfundible." },
    { pregunta: "¿Qué gas necesitan las plantas para hacer la fotosíntesis?", opciones: ["Helio","Nitrógeno","Oxígeno","Dióxido de carbono"], correcta: 3, explicacion: "Las plantas absorben dióxido de carbono y liberan oxígeno durante la fotosíntesis.", pista: "Es el gas que nosotros expulsamos al respirar." },
    { pregunta: "¿Qué animal es conocido como el 'rey de la selva'?", opciones: ["León", "Tigre", "Elefante", "Pantera"], correcta: 0,  explicacion: "La respuesta correcta es 'El león'. Es un título simbólico por su fuerza y presencia, aparte que los leones no viven en selvas sino en sabanas, pero es un apodo cultural.", pista: "Es el animal que suele aparecer en escudos y símbolos de poder." },    
    { pregunta: "¿Cuál es el animal terrestre más grande del mundo?", opciones: ["Cachalote", "Ballena azul", "Rinoceronte blanco", "Elefante africano"], correcta: 3, explicacion: "La ballena azul es el animal más grande del planeta, pero no es terrestre. El animal terrestre más grande es el elefante africano.", pista: "Es un gigante que vive en tierra firme." },
  ], 
    media: [
    { pregunta: "Si tiras dos dados a la vez ¿Qué suma es la más probable?", opciones: ["7","8","9","12"], correcta: 0, explicacion: "La suma 7 es la más probable porque se puede obtener de 6 formas distintas (1+6, 2+5, 3+4, 4+3, 5+2, 6+1), más que cualquier otra suma posible al lanzar dos dados.", pista: "Es el punto medio exacto entre el mínimo y el máximo que pueden sumar dos dados." },
    { pregunta: "¿Cuál de los siguientes números romanos es el mayor?", opciones: ["XLIX", "LXV", "LXXX", "XC"], correcta: 3, explicacion: "XLIX = 49, LXV = 65, LXXX = 80 y XC = 90. Por lo tanto, XC es el número más grande.", pista: "Busca la combinación que más se acerca a cien." },
    { pregunta: "¿Cuál de estos animales no pone huevos?", opciones: ["Ornitorrinco","Equidna","Murciélago","Tortuga"], correcta: 2, explicacion: "El murciélago es un mamífero y, como la mayoría de ellos, da a luz crías vivas. El ornitorrinco y la equidna son excepciones curiosas, ya que son mamíferos que sí ponen huevos.", pista: "Es el único de la lista que vuela." },
    { pregunta: "¿De qué color es una caja negra de un avión?", opciones: ["Naranja","Gris","Azul","Negra"], correcta: 0, explicacion: "Las cajas negras en realidad son de color naranja brillante para facilitar su localización tras un accidente. El nombre viene de su función, no de su color.", pista: "Se llama de una forma pero se pinta de otra muy diferente, por razones prácticas." },
    { pregunta: "¿Qué científico desarrolló la teoría de la relatividad?", opciones: ["Albert Einstein","Isaac Newton","Nikola Tesla","Stephen Hawking"], correcta: 0, explicacion: "Albert Einstein formuló la teoría de la relatividad especial en 1905 y la general en 1915.", pista: "Su apellido es sinónimo de genio." },
    { pregunta: "¿Qué civilización construyó la ciudad de Machu Picchu?", opciones: ["Azteca","Maya","Inca","Olmeca"], correcta: 2, explicacion: "Machu Picchu fue construida por el Imperio Inca en el siglo XV y dada a conocer internacionalmente en 1911.", pista: "Es la misma civilización que dominó los Andes." },
    { pregunta: "¿Cuántos meses tienen exactamente 30 días?", opciones: ["3", "4", "2", "5"], correcta: 1, explicacion: "Los meses que tienen 30 días son abril, junio, septiembre y noviembre, en total 4.", pista: "Son los meses que no llegan a 31 ni bajan a 28." },
    { pregunta: "¿Qué ciudad tiene el metro más antiguo del mundo?", opciones: ["París", "Nueva York", "Londres", "Berlín"], correcta: 2, explicacion: "El metro de Londres abrió en 1863, siendo el primero del mundo. París abrió en 1900, Berlín en 1902 y Nueva York en 1904.", pista: "Su metro se conoce como 'The Tube'."},
  ], dificil: [
    { pregunta: "¿Cuál es el planeta del sistema solar con más satélites naturales?", opciones: ["Júpiter","Saturno","Urano","Neptuno"], correcta: 1, explicacion: "Saturno es actualmente el planeta con más lunas conocidas. Algunas de ellas, como Titán, son tan grandes que tienen atmósfera propia, algo muy poco común en satélites. \nSaturno: 274-285 \nJúpiter: 95-115 \nUrano: 28-29 \nNeptuno: 16", pista: "El planeta con anillos también tiene compañía." },
    { pregunta: "¿Cuál es el metal más valioso del mundo por peso?", opciones: ["Oro", "Platino", "Rodio", "Paladio"], correcta: 2, explicacion: "El rodio es el metal más valioso por peso debido a su rareza y sus aplicaciones en la industria automotriz para reducir emisiones. Su precio puede superar los 10.000 dólares por onza. El ranking actual por €/g es este:\n1. Rodio: 300-500 €/g\n2. Paladio: 40-80 €/g\n3. Platino 30-40 €/g\n4. Oro: 60-70 €/g", pista: "El más caro no es el más famoso." },
    { pregunta: "¿Cuál de estos planetas del sistema solar es el más frío?", opciones: ["Neptuno","Urano","Saturno","Marte"], correcta: 1, explicacion: "Urano es el planeta más frío del sistema solar, con temperaturas que pueden bajar hasta unos -224 °C. Aunque Neptuno está más lejos del Sol, Urano emite muy poco calor interno, lo que lo hace más frío.", pista: "La distancia al Sol no es el único factor que decide lo frío que puede ser un planeta." },
    { pregunta: "¿Qué país tiene más pirámides en su territorio?", opciones: ["Egipto","México","Sudán","Perú"], correcta: 2, explicacion: "Aunque Egipto es el más famoso, Sudán tiene más pirámides debido a la antigua civilización de Nubia. Así actualmente sería:\nSudan: +200\nEgipto: 118 - 135\nMéxico: 20\nPerú: 26", pista: "No es el país más famoso por ellas, pero sí el que más tiene." },
    { pregunta: "¿Cuál es el órgano más grande del cuerpo humano?", opciones: ["Hígado","Piel","Pulmones","Intestino"], correcta: 1, explicacion: "La piel es el órgano más grande del cuerpo, con unos 2 metros cuadrados en un adulto promedio.", pista: "Es un órgano que solemos ignorar." },
    { pregunta: "¿Cuál es el metal más abundante en la corteza terrestre?", opciones: ["Hierro","Calcio","Cobre","Aluminio"], correcta: 3, explicacion: "El aluminio es el metal más abundante en la corteza terrestre, aunque no se encuentra puro de forma natural.", pista: "Es tan común bajo tierra que supera con creces a los metales que más ves en el día a día." },
    { pregunta: "¿Qué país tiene el mayor consumo promedio de chocolate por habitante?", opciones: ["Bélgica", "Alemania", "Suiza", "Austria"], correcta: 2, explicacion: "Suiza suele liderar el consumo de chocolate per cápita, con alrededor de 9-11 kg por persona al año, aunque algunos años Bélgica o Alemania pueden acercarse dependiendo de la fuente y el método de cálculo.", pista: "Es un país famoso por relojes, montañas… y chocolate." },  
    { pregunta: "¿Qué animal puede vivir más tiempo?", opciones: ["Tortuga gigante de las Galápagos", "Tiburón de Groenlandia", "Cocodrilo del Nilo", "Ballena azul"], correcta: 1, explicacion: "El tiburón de Groenlandia es el vertebrado más longevo conocido: puede superar los 300 años y algunos estudios estiman más de 400. Las tortugas gigantes de las Galápagos rondan los 150-200 años, los cocodrilos del Nilo unos 70-100 y la ballena azul unos 80-90.", pista: "Vive en aguas muy frías y envejece muy, muy despacio." },
  ] },
  "Actualidad":      { 
    facil: [
    { pregunta: "¿Qué red social cambió su logo azul por una 'X'?", opciones: ["Twitter", "Facebook", "Instagram", "TikTok"], correcta: 0, explicacion: "Twitter pasó a llamarse X tras el rebranding impulsado por Elon Musk.", pista: "Un conocido empresario tecnológico la compró y borró su identidad de raíz." },
    { pregunta: "¿Qué página web es la más visitada del mundo después de Google?", opciones: ["Facebook", "YouTube", "Amazon", "Wikipedia"], correcta: 1, explicacion: "YouTube es la página web más visitada del mundo después de Google, con miles de millones de visitas diarias debido a su enorme cantidad de contenido de video.", pista: "Es la web donde el tiempo se te va mirando pantallas." },
    { pregunta: "¿Qué red social es la más utilizada por personas mayores de 35 años?", opciones: ["TikTok","Twitter/X","Instagram","Facebook"], correcta: 3, explicacion: "Facebook sigue siendo una de las redes sociales más utilizadas por personas mayores de 35 años. Es muy popular porque permite mantener contacto fácilmente con familia, amigos de toda la vida y antiguos compañeros. A diferencia de TikTok o Instagram, tiene un uso más sencillo y práctico.", pista: "Es la red donde más gente mantiene contacto con familiares y amigos de siempre." },
    { pregunta: "¿Qué misión espacial de la NASA busca volver a llevar humanos a la Luna?", opciones: ["Apollo","Voyager","Artemis","Orion"], correcta: 2, explicacion: "El programa Artemis es el sucesor de Apollo y tiene como objetivo volver a llevar astronautas a la Luna, incluyendo la primera mujer y la primera persona de color.", pista: "Su nombre hace referencia a la hermana de Apolo." },
    { pregunta: "¿Qué empresa fabrica los iPhone?", opciones: ["Apple","Google","Samsung","Huawei"], correcta: 0, explicacion: "Apple es la empresa responsable de la línea de teléfonos iPhone desde 2007.", pista: "Es la misma empresa que fabrica los Mac y los iPad." },
    { pregunta: "¿Qué compañía desarrolla el sistema operativo Windows?", opciones: ["Apple","Microsoft","IBM","Google"], correcta: 1, explicacion: "Microsoft es la empresa creadora de Windows, el sistema operativo más usado en ordenadores personales.", pista: "Es la misma empresa detrás de Xbox." },
    { pregunta: "¿Qué empresa es conocida por popularizar los coches eléctricos en todo el mundo?", opciones: ["Toyota", "Tesla", "BMW", "Renault"], correcta: 1, explicacion: "Tesla impulsó la popularización global del coche eléctrico gracias a modelos como el Model S, 3 y Y, convirtiéndose en un referente del sector.", pista: "Su fundador es tan famoso como la propia marca." },
    { pregunta: "¿En qué ciudad se celebraron los Juegos Olímpicos de 2024?", opciones: ["París", "Londres", "Tokio", "Berlín"], correcta: 0, explicacion: "Los Juegos Olímpicos de 2024 se celebraron en París, Francia.", pista: "Era la segunda vez en el siglo XXI que esta ciudad acogía los Juegos." },
    ], 
    media: [
    { pregunta: "¿Qué estudia la fisiología?", opciones: ["El comportamiento humano", "Los organismos vivos y sus funciones", "Los planetas y el universo", "Las rocas y minerales"], correcta: 1, explicacion: "La fisiología es la rama de la biología que estudia el funcionamiento de los organismos vivos y sus partes, incluyendo procesos como la respiración, circulación y digestión.", pista: "No estudia qué somos, sino cómo funcionamos." },
    { pregunta: "¿Cuál es la película más taquillera de la historia a nivel mundial (sin ajustar por inflación)?", opciones: ["Los Vengadores(Avengers): Endgame", "Titanic", "Avatar", "Star Wars: The Force Awakens(VII)"], correcta: 2, explicacion: "Avatar es la película más taquillera de la historia con más de 2.900 millones de dólares, gracias en parte a varios reestrenos. Llegó a ser superada brevemente por Avengers: Endgame en 2019, pero recuperó el primer puesto tras volver a los cines.", pista: "La película que ganó gracias a volver a los cines." },
    { pregunta: "¿Qué sistema operativo es desarrollado por Google para móviles?", opciones: ["HarmonyOS","Windows Phone","iOS","Android"], correcta: 3, explicacion: "Android es el sistema operativo móvil más usado del mundo y fue adquirido por Google en 2005 antes de su gran expansión.", pista: "Es el sistema que usan la mayoría de móviles que no son de Apple." },
    { pregunta: "¿Qué empresa es propietaria de WhatsApp?", opciones: ["Meta","Google","Apple","Telegram"], correcta: 0, explicacion: "WhatsApp fue comprada por Facebook (ahora Meta) en 2014 por unos 19.000 millones de dólares, una de las mayores adquisiciones tecnológicas.", pista: "Es la misma empresa que controla Facebook e Instagram." },
    { pregunta: "¿Qué empresa no pertenece al grupo de las llamadas “Big Five” tecnológicas?", opciones: ["Apple","Microsoft","Tesla","Amazon"], correcta: 2, explicacion: "Las llamadas 'Big Five' suelen referirse a Apple, Microsoft, Amazon, Google y Meta. Tesla es muy grande, pero no forma parte de ese grupo clásico.", pista: "Es la única cuyo negocio principal no es software ni servicios digitales." },
    { pregunta: "¿Qué plataforma de streaming ha superado recientemente los 250 millones de suscriptores?", opciones: ["Disney+", "Netflix", "Prime Video", "HBO Max"], correcta: 1, explicacion: "Netflix sigue siendo la plataforma de streaming con más suscriptores del mundo, superando los 250 millones gracias a su catálogo global.", pista: "Es la plataforma que popularizó las maratones de series." },
    { pregunta: "¿Qué marca de juguetes es considerada la más valiosa del mundo?", opciones: ["Hot Wheels", "Barbie", "Playmobil", "LEGO"], correcta: 3, explicacion: "LEGO es la marca de juguetes más valiosa gracias a sus sets, colaboraciones y películas, superando a Barbie y Playmobil.", pista: "Sus piezas encajan entre sí desde hace décadas." },
    { pregunta: "¿Qué saga/franquicia completa tiene la mayor cantidad de permios Óscar?", opciones: ["Star Wars","James Bond","Harry Potter","Indiana Jones"], correcta: 0, explicacion: "Star Wars es una de las franquicias con más premios Óscar en total, especialmente gracias a sus categorías técnicas como efectos visuales, sonido y banda sonora. El ranking sería:\nStar Wars: 10-11\nJames Bond: 7-9\nIndiana Jones: 5\nHarry Potter: 0", pista: "Es la saga que empezó con una película de 1977." },
    ],
    dificil: [
    { pregunta: "¿Qué país tiene la mayor producción de café?", opciones: ["Colombia","Brasil","Vietnam","México"], correcta: 1, explicacion: "Brasil es el mayor productor de café del mundo desde hace más de 150 años. Produce aproximadamente un tercio del café global, destacando especialmente en las variedades arábica y robusta.", pista: "Su extensión continental y su clima tropical le dan una ventaja difícil de igualar." },
    { pregunta: "¿Cuántos elementos químicos hay en la tabla periódica?", opciones: ["118", "120", "119", "117"], correcta: 0, explicacion: "Actualmente, la tabla periódica tiene 118 elementos químicos oficialmente reconocidos por la IUPAC.", pista: "Es un número par que coincide exactamente con el número atómico del último elemento reconocido." },
    { pregunta: "¿Qué evento global provocó una crisis de suministro de chips en 2020-2022?", opciones: ["Guerra comercial","Pandemia de COVID-19","Brexit","Crisis del petróleo"], correcta: 1, explicacion: "La pandemia alteró las cadenas de producción y aumentó la demanda de tecnología, provocando una escasez global de semiconductores.", pista: "Fue un suceso que afectó a todo el planeta al mismo tiempo." },
    { pregunta: "¿Qué país lidera actualmente la producción mundial de semiconductores avanzados?", opciones: ["Taiwán","Corea del Sur","Estados Unidos","China"], correcta: 0, explicacion: "Taiwán, a través de empresas como TSMC, domina la fabricación de chips avanzados esenciales para la tecnología moderna.", pista: "Es una isla de tamaño modesto cuyo peso geopolítico proviene casi por completo de esta industria." },
    { pregunta: "¿Qué empresa domina actualmente el mercado de computación en la nube?", opciones: ["Google Cloud", "Microsoft Azure", "IBM Cloud", "Amazon Web Services"], correcta: 3, explicacion: "Amazon Web Services (AWS) mantiene el liderazgo global en servicios de computación en la nube, seguido por Microsoft Azure.", pista: "Es la misma empresa que empezó vendiendo libros online." },
    { pregunta: "¿Qué canción es actualmente el video más visto de YouTube?", opciones: ["Baby Shark Dance - Pinkfong", "Despacito - Luis Fonsi", "Gangnam Style - PSY", "See You Again - Wiz Khalifa ft. Charlie Puth"], correcta: 0, explicacion: "Baby Shark Dance es el video más visto de YouTube, muy por encima de éxitos como Despacito, See You Again y Gangnam Style. El ranking seria:\n1. Baby Shark: +16 mil millones.\n2. Despacito: +9 mil millones.\n3. See You Again: +7 mil millones.\n4. Gangnam Style: +5 mil millones.", pista: "Es un tema infantil que se volvió viral en todo el mundo." },    
    { pregunta: "¿Qué franquicia es la más rentable económicamente de la historia del entretenimiento?", opciones: ["Marvel", "Star Wars", "Pokémon", "Harry Potter"], correcta: 2, explicacion: "Pokémon es la franquicia multimedia más rentable de la historia, superando a Marvel y Star Wars gracias a sus videojuegos, cartas coleccionables, series, películas y merchandising global. Se estima que ha generado más de 100.000 millones de dólares en total.", pista: "Nació en videojuegos y hoy está en todas partes."},
    { pregunta: "¿Qué país prohibió TikTok en dispositivos gubernamentales?", opciones: ["Reino Unido", "Canadá", "Estados Unidos", "Australia"], correcta: 2, explicacion: "Estados Unidos fue uno de los primeros países en restringir TikTok en dispositivos oficiales por preocupaciones de seguridad de datos. El debate se intensificó porque la app pertenece a la empresa china ByteDance, lo que generó tensiones geopolíticas y tecnológicas. Reino Unido, Canadá y Australia aplicaron medidas similares, pero más tarde.", pista: "Es el país de la lista que más ha presionado por temas de ciberseguridad."},
   ] },
  "Geografía":       { 
    facil: [
    { pregunta: "¿Cuál es la capital de Islandia?", opciones: ["Reikiavik", "Oslo", "Helsinki", "Copenhague"], correcta: 0, explicacion: "Reikiavik es la capital de Islandia, conocida por su belleza natural y su cultura vibrante.", pista: "Es la capital que suena tan fría como el país al que pertenece." },
    { pregunta: "¿Cuál es la capital de Brasil?", opciones: ["Río de Janeiro", "São Paulo", "Brasilia", "Salvador"], correcta: 2, explicacion: "Brasilia es la capital de Brasil desde 1960. Fue construida específicamente para ser la capital y ayudar a desarrollar el interior del país, reemplazando a Río de Janeiro.", pista: "La capital no es la ciudad más turística, sino la más planificada." },
    { pregunta: "¿Qué país tiene forma de bota?", opciones: ["Grecia","Italia","Chile","Portugal"], correcta: 1, explicacion: "Italia es famosa por su forma geográfica en el mapa, que recuerda a una bota pateando la isla de Sicilia.", pista: "En el mapa parece que está dando una patada a una isla." },
    { pregunta: "¿Qué continente es el más grande del mundo?", opciones: ["Asia","África","Europa","América"], correcta: 0, explicacion: "Asia es el continente más grande tanto en superficie como en población, y alberga países como China e India.", pista: "Es el continente donde viven las dos naciones más pobladas." },
    { pregunta: "¿En qué país se encuentra la Gran Muralla?", opciones: ["Japón", "China", "Corea del Sur", "India"], correcta: 1, explicacion: "La Gran Muralla China es una de las construcciones más famosas del mundo y se extiende por miles de kilómetros.", pista: "Es una de las estructuras más largas jamás construidas." },
    { pregunta: "¿Qué océano está entre América y Europa?", opciones: ["Índico", "Pacífico", "Atlántico", "Ártico"], correcta: 2, explicacion: "El océano Atlántico separa América de Europa y África, siendo el segundo más grande del mundo.", pista: "Es el océano que cruzaban los barcos rumbo al 'nuevo mundo'." },
    { pregunta: "¿En qué continente se encuentra Egipto?", opciones: ["Asia", "Europa", "África", "Oceanía"], correcta: 2, explicacion: "Egipto está ubicado en el noreste de África, aunque la península del Sinaí conecta con Asia.", pista: "Es el mismo continente donde se encuentra el desierto del Sahara." },
    { pregunta: "¿Cuál es la capital de Turquía?", opciones: ["Estambul", "Ankara", "Esmirna", "Bursa"], correcta: 1, explicacion: "Aunque muchos piensan en Estambul, la capital oficial de Turquía es Ankara desde 1923.", pista: "No es la ciudad más famosa del país, pero sí la capital." },
    ], 
    media: [
    { pregunta: "¿Qué país es conocido como 'la tierra del sol naciente'?", opciones: ["China", "Japón", "Corea del Sur", "Tailandia"], correcta: 1, explicacion: "Japón es conocido como 'la tierra del sol naciente' porque su nombre en japonés (Nihon o Nippon) significa literalmente 'origen del sol'. Esto se debe a su ubicación al este de China, desde donde se ve salir el sol.", pista: "El nombre del país ya apunta hacia el amanecer." },
    { pregunta: "¿De qué país forma parte Groenlandia?", opciones: ["Dinamarca", "Noruega", "Suecia", "Finlandia"], correcta: 0, explicacion: "Groenlandia es una región autónoma dentro del Reino de Dinamarca. Aunque tiene su propio gobierno, sigue siendo parte de Dinamarca en términos de relaciones internacionales y defensa.", pista: "Pertenece a un país europeo más pequeño que la isla." },
    { pregunta: "¿Qué país tiene la mayor población del mundo actualmente?", opciones: ["China","Estados Unidos","India","Indonesia"], correcta: 2, explicacion: "India superó a China recientemente como el país más poblado del mundo, con más de 1.400 millones de habitantes.", pista: "Es el país donde viven más de mil millones de personas y sigue creciendo rápido." },
    { pregunta: "¿Cuál es la capital de Australia?", opciones: ["Sídney","Melbourne","Canberra","Perth"], correcta: 2, explicacion: "Mucha gente piensa que es Sídney o Melbourne, pero la capital es Canberra. Se eligió como punto intermedio entre ambas ciudades para evitar rivalidades.", pista: "No es la ciudad más famosa, sino la más neutral." },
    { pregunta: "¿Cuál es el país más pequeño del mundo?", opciones: ["Mónaco","San Marino","Liechtenstein","Vaticano"], correcta: 3, explicacion: "El Vaticano es el país más pequeño del mundo, tanto en superficie como en población, y está dentro de la ciudad de Roma.", pista: "Es tan pequeño que está dentro de otra ciudad." },
    { pregunta: "¿Cuál de estas NO forma parte de las 7 maravillas del mundo moderno?", opciones: ["Petra", "La Alhambra", "Cristo Redentor", "Chichén Itzá"], correcta: 1, explicacion: "Las 7 maravillas del mundo moderno son: Petra, Chichén Itzá, Cristo Redentor, Coliseo romano, Gran Muralla China, Machu Picchu y el Taj Mahal. La Alhambra, aunque muy famosa, no forma parte de esta lista.", pista: "Es un monumento europeo muy visitado que se quedó fuera de la votación final." },
    { pregunta: "¿En qué país se encuentra el monte Everest?", opciones: ["India", "Bután", "China", "Nepal"], correcta: 3, explicacion: "El monte Everest se encuentra en la frontera entre Nepal y China, pero la mayoría de su ascenso se realiza desde el lado nepalí.", pista: "Es el país desde donde parten la mayoría de expediciones." },
    { pregunta: "¿Cuál es la capital de Canadá?", opciones: ["Toronto", "Vancouver", "Ottawa", "Montreal"], correcta: 2, explicacion: "Ottawa es la capital de Canadá, aunque Toronto sea la ciudad más grande.", pista: "No es la ciudad más famosa del país, pero sí la capital." },
    ], 
    dificil: [
    { pregunta: "¿Qué país tiene la mayor altitud media?", opciones: ["Nepal", "Tíbet (China)", "Bután", "Perú"], correcta: 1, explicacion: "El Tíbet, una región autónoma de China, tiene la mayor altitud media del mundo, con aproximadamente 4.500 metros sobre el nivel del mar. Esto se debe a su ubicación en la meseta tibetana, rodeada por las montañas más altas del mundo.", pista: "La clave está en la meseta más alta del mundo." },
    { pregunta: "¿Cuál es la catarata más alta del mundo?", opciones: ["Niágara", "Iguazú", "Ángel", "Victoria"], correcta: 2, explicacion: "El Salto Ángel, ubicado en Venezuela, es la catarata más alta del mundo con 979 metros de altura total, incluyendo una caída continua de 807 metros.", pista: "El nombre ya sugiere una caída enorme." },
    { pregunta: "¿Con cuántos países hace frontera España?", opciones: ["2","3","4","5"], correcta: 3, explicacion: "España hace frontera con 5 países: Portugal, Francia, Andorra, Marruecos (en Ceuta y Melilla) y el Reino Unido (en Gibraltar). Es una de las fronteras más variadas de Europa por su mezcla de territorios continentales y enclaves.", pista: "Incluye un pequeño territorio británico y dos ciudades en África." },
    { pregunta: "¿Qué país tiene la mayor cantidad de islas del mundo?", opciones: ["Suecia","Filipinas","Indonesia","Canadá"], correcta: 0, explicacion: "Suecia tiene más de 200.000 islas, muchas de ellas deshabitadas. Es un dato sorprendente porque solemos asociar este récord a países tropicales como Indonesia.", pista: "No es tropical, pero tiene miles y miles de pequeñas islas." },
    { pregunta: "¿Cuál es el desierto más grande del mundo?", opciones: ["Antártida","Gobi","Sahara","Kalahari"], correcta: 0, explicacion: "Aunque no lo parezca, la Antártida es un desierto por su baja precipitación, y es el más grande del planeta. Se considera desierto porque recibe menos de 50 mm de precicitación anual en su interior, la definición se basa en la aridez, no en el calor.", pista: "Es un desierto, pero no es cálido." },
    { pregunta: "¿Qué país tiene dos capitales principales (constitucional y administrativa)?", opciones: ["Sudáfrica", "Bolivia", "Países Bajos", "Benín"], correcta: 1, explicacion: "Bolivia tiene dos capitales principales: Sucre (capital constitucional) y La Paz (sede del gobierno). Otros países, como Sudáfrica, también cuentan con varias capitales con distintas funciones.", pista: "Una capital es histórica, la otra es donde se gobierna."},
    { pregunta: "¿Cuál de estos países NO tiene salida al mar?", opciones: ["Bolivia", "Sudán", "Camboya", "Uruguay"], correcta: 0, explicacion: "Bolivia es un país sin salida al mar desde la Guerra del Pacífico. Sudán tiene costa en el Mar Rojo, Camboya en el Golfo de Tailandia y Uruguay en el Atlántico.", pista: "Perdió su salida al mar hace más de un siglo." },
    { pregunta: "¿Cuál es la capital más alta del mundo?", opciones: ["Quito (Ecuador)", "La Paz (Bolivia)", "Bogotá (Colombia)", "Adís Abeba (Etiopía)"], correcta: 1, explicacion: "La Paz, sede del gobierno de Bolivia, se encuentra a unos 3.640 metros sobre el nivel del mar, lo que la convierte en la capital más alta del mundo. Quito está a 2.850 m, Bogotá a 2.640 m y Adís Abeba a 2.355 m.", pista: "Su país es conocido por tener el salar más grande del mundo." },
    ] },
  "Bandas sonoras":  { 
    facil: [
    { pregunta: "¿A qué película pertenece esta banda sonora?", audio: "audios/bso/StarWarsDuel.mp3", trackName: "Star Wars\n\n 'Duel of the Fates' fue compuesta por John Williams y destaca por su coro en sánscrito, algo poco habitual en la saga. Se utiliza en uno de los duelos más intensos y simboliza el destino y el conflicto entre el bien y el mal.", pista: "Si te imaginas un duelo con capas y energía antigua, vas bien." },
    { pregunta: "¿A qué película pertenece esta banda sonora?", audio: "audios/bso/LOTRHobbits.mp3", trackName: "El Señor de los Anillos\n\n 'Concerning Hobbits' fue compuesta por Howard Shore y representa la vida tranquila de la Comarca. Su uso de instrumentos folk transmite calidez, sencillez y un ambiente acogedor muy característico de los hobbits.", pista: "Si te suena a vida tranquila en un lugar verde, ya estás cerca." },
    { pregunta: "¿A qué película pertenece esta banda sonora?", audio: "audios/bso/Gladiator.mp3", trackName: "Gladiator\n\n La banda sonora fue compuesta por Hans Zimmer junto a Lisa Gerrard. El tema principal mezcla orquesta con voces etéreas en un idioma inventado, lo que le da su sonido tan épico y emocional. Se ha usado muchas veces en trailers por su gran impacto dramático.", pista: "La música suena a honor, batalla y destino marcado." },
    { pregunta: "¿A qué película pertenece esta banda sonora?", audio: "audios/bso/Titanic.mp3", trackName: "Titanic\n\n La banda sonora fue compuesta por James Horner y el tema principal 'My Heart Will Go On' es interpretado por Céline Dion. La melodía del silbido de flauta está inspirada en instrumentos tradicionales irlandeses, reflejando la historia de amor y el origen del barco.", pista: "La melodía suena tan trágica como la historia que acompaña." },
    { pregunta: "¿A qué película pertenece esta banda sonora?", audio: "audios/bso/HarryPotter.mp3", trackName: "Harry Potter\n\n La música fue compuesta por John Williams y este tema, conocido como Hedwig's Theme, es el principal de la saga. Se reconoce por su sonido mágico de celesta y se reutiliza en todas las películas como símbolo del mundo mágico.", pista: "La melodía suena tan mágica como el mundo que representa." },
    { pregunta: "¿A qué película pertenece esta banda sonora?", audio: "audios/bso/IndianaJones.mp3", trackName: "Indiana Jones\n\n La música fue compuesta por John Williams. El famoso 'Raiders March' combina una parte heroica con otra triunfal, representando el espíritu aventurero y carismático del personaje.", pista: "Suena a aventura, peligro y un sombrero muy famoso." },
    { pregunta: "¿A qué película pertenece esta banda sonora?", audio: "audios/bso/ET.mp3", trackName: "E.T.\n\n La música fue compuesta por John Williams. Su tema principal es uno de los más emotivos del cine, especialmente en la escena de la bicicleta volando, donde la música se sincroniza perfectamente con la imagen.", pista: "La melodía suena a amistad y a algo que viene de muy lejos." },
    { pregunta: "¿A qué película pertenece esta banda sonora?", audio: "audios/bso/ElPadrino.mp3", trackName: "El Padrino\n\n La música fue compuesta por Nino Rota. Su tema principal tiene un tono melancólico y reconocible que refleja el drama y la tragedia de la familia Corleone.", pista: "La melodía suena a familia, poder y tragedia." },
    ], 
    media: [
    { pregunta: "¿A qué película pertenece esta banda sonora?", audio: "audios/bso/RegresoAlFuturo.mp3", trackName: "Regreso al Futuro\n\n La música fue compuesta por Alan Silvestri. Su tema principal combina aventura y ciencia ficción, y se ha convertido en uno de los más reconocibles del cine por su energía y sensación de viaje en el tiempo.", pista: "La música parece avanzar igual que la historia." },
    { pregunta: "¿A qué película pertenece esta banda sonora?", audio: "audios/bso/Interstellar.mp3", trackName: "Interstellar\n\n La música fue compuesta por Hans Zimmer y destaca por el uso del órgano, creando un sonido único y profundo. Este enfoque transmite la inmensidad del espacio y la carga emocional de la historia.", pista: "La música parece tan grande como el espacio que describe." },
    { pregunta: "¿A qué película pertenece esta banda sonora?", audio: "audios/bso/Piratasdelcaribe.mp3", trackName: "Piratas del Caribe\n\n La saga de Piratas del Caribe tiene música compuesta por Hans Zimmer y Klaus Badelt. Aunque 'One Day' no es el tema principal, se asocia a la banda sonora por su estilo épico y emocional. La música mezcla orquesta con percusión potente para transmitir aventura y mar abierto.", pista: "Suena a aventura en alta mar y a personajes muy peculiares." },
    { pregunta: "¿A qué película pertenece esta banda sonora?", audio: "audios/bso/Lotr.mp3", trackName: "El Señor De Los Anillos\n\n La música de esta escena fue compuesta por Howard Shore. Es uno de los momentos más épicos de la saga, con una orquestación intensa y percusión constante. El tema mezcla tensión y heroísmo para reflejar la urgencia de la caza de los Uruk-Hai en Rohan.", pista: "Suena a una misión urgente en un mundo lleno de criaturas fantásticas." },
    { pregunta: "¿A qué serie pertenece esta banda sonora?", audio: "audios/bso/JuegoDeTronos.mp3", trackName: "Juego de Tronos\n\n La música fue compuesta por Ramin Djawadi. El tema inicial destaca por su ritmo constante y su construcción progresiva, y el mapa del opening cambia según las localizaciones de cada episodio.", pista: "La melodía suena a reinos, traiciones y tronos disputados." },
    { pregunta: "¿A qué película pertenece esta banda sonora?", audio: "audios/bso/StarWars.mp3", trackName: "Star Wars\n\n La música fue compuesta por John Williams. 'Across the Stars' es una melodía romántica y trágica que representa la relación entre Anakin y Padmé y anticipa su destino.", pista: "Narra una historia de amor de otro mundo, entre dos personas de bandos que no deberían estar juntas." },
    { pregunta: "¿A qué película pertenece esta banda sonora?", audio: "audios/bso/JurassicPark.mp3", trackName: "Jurassic Park\n\n La música fue compuesta por John Williams. El tema principal transmite asombro y grandeza, acompañando la primera vez que se ven los dinosaurios en pantalla.", pista: "La melodía suena a criaturas enormes que vuelven a la vida." },
    { pregunta: "¿A qué película pertenece esta banda sonora?", audio: "audios/bso/Avengers.mp3", trackName: "Avengers (Marvel)\n\n La música fue compuesta por Alan Silvestri. El tema principal se ha convertido en el himno del equipo, destacando por su tono heroico y épico en las escenas de unión de los Vengadores.", pista: "La música reúne a héroes muy distintos cuando todo se vuelve épico." },
    ], 
    dificil: [
    { pregunta: "¿A qué película pertenece esta banda sonora?", audio: "audios/bso/TopGun.mp3", trackName: "Top Gun\n\n 'Top Gun Anthem', compuesta por Harold Faltermeyer, es uno de los temas más icónicos de los años 80. Su sonido de guitarra eléctrica le da un estilo inconfundible asociado a la aviación y la acción.", pista: "La guitarra te lleva directo al cielo… literalmente." },
    { pregunta: "¿A qué película pertenece esta banda sonora?", audio: "audios/bso/Braveheart.mp3", trackName: "Braveheart\n\n 'For the Love of a Princess' fue compuesta por James Horner. Es una pieza emocional que mezcla melodías celtas con orquesta, reflejando el lado más íntimo y romántico de la historia.", pista: "La historia transcurre en el norte de las islas británicas y gira en torno a la libertad." },
    { pregunta: "¿A qué película pertenece esta banda sonora?", audio: "audios/bso/Dune.mp3", trackName: "Dune\n\n La banda sonora fue compuesta por Hans Zimmer. Para recrear el sonido del desierto, su equipo pasó semanas viviendo en desiertos como el de Jordania para capturar sonidos, inspirarse en los vientos y el silencio del paisaje real. El tema usa texturas graves y sonidos orgánicos para transmitir la inmensidad y peligro del planeta Arrakis.", pista: "La música suena tan árida como el desierto que representa." },
    { pregunta: "¿A qué película pertenece esta banda sonora?", audio: "audios/bso/Troya.mp3", trackName: "Troya\n\n La música de esta escena fue compuesta por James Horner. Destaca por el uso de voces femeninas agudas y coros suaves que aportan un tono trágico y solemne al duelo entre Héctor y Aquiles. Horner usa la voz como un 'instrumento humano' para reforzar la sensación de destino y pérdida en uno de los momentos más emotivos de la película.", pista: "La música acompaña una guerra épica de la antigüedad que empezó por el rapto de una mujer." },
    { pregunta: "¿A qué película pertenece esta banda sonora?", audio: "audios/bso/ElHobbit.mp3", trackName: "El Hobbit\n\n 'Misty Mountains' es interpretada por los enanos en la película y destaca por su tono grave y coral. Transmite nostalgia y el deseo de recuperar su hogar perdido.", pista: "Los que la cantan llevan siglos esperando recuperar el hogar que les arrebataron." },
    { pregunta: "¿A qué película pertenece esta banda sonora?", audio: "audios/bso/Avatar.mp3", trackName: "Avatar\n\n La música fue compuesta por James Horner. Este tema acompaña el momento en que Jake se integra en los Na'vi, usando coros y sonidos tribales que refuerzan la conexión con la naturaleza.", pista: "La música mezcla naturaleza y un mundo completamente nuevo." },
    { pregunta: "¿A qué película pertenece esta banda sonora?", audio: "audios/bso/Origen.mp3", trackName: "Origen (Inception)\n\n La música fue compuesta por Hans Zimmer. El tema 'Time' es famoso por su construcción progresiva, empezando suave y creciendo hasta un final muy intenso y emocional.", pista: "La música suena a capas de realidad que se mezclan en el mundo de los sueños." },
    { pregunta: "¿A qué película pertenece esta banda sonora?", audio: "audios/bso/UltimoMohicano.mp3", trackName: "El último mohicano\n\n 'Promontory' es uno de los temas más icónicos de la película. Destaca por su ritmo constante y su mezcla de música orquestal con influencias celtas, acompañando una de las escenas finales más intensas.", pista: "La película está ambientada en el siglo XVIII, en medio de conflictos entre colonos y pueblos nativos." },
    ] },
  "Disney":          { 
    facil: [
    { pregunta: "¿A qué película de Disney pertenece esta banda sonora?", audio: "audios/disney/Hercules.mp3", trackName: "Hércules\n\n 'De cero a héroe' es una canción muy dinámica que narra el ascenso de Hércules a la fama. Su estilo inspirado en el góspel la hace única dentro de Disney.", pista: "El estilo musical viene del góspel americano, aunque la historia sea de la mitología griega." },
    { pregunta: "¿A qué película de Disney pertenece esta banda sonora?", audio: "audios/disney/TarzanSaber.mp3", trackName: "Tarzán\n\n 'Lo extraño que soy', interpretada por Phil Collins, refleja el conflicto interno de Tarzán al no sentirse parte de ningún mundo. Destaca por su tono emocional y reflexivo.", pista: "La canción habla de no encajar del todo en ningún sitio." },
    { pregunta: "¿A qué película de Disney pertenece esta banda sonora?", audio: "audios/disney/Librodelaselva.mp3", trackName: "El Libro de la Selva\n\n Esta canción pertenece a la película de Disney El Libro de la Selva (1967) y es interpretada por Baloo. Su estilo alegre mezcla jazz y swing, y transmite la idea de vivir con lo esencial. Curiosamente, se convirtió en una de las canciones más icónicas de Disney por su mensaje simple y optimista sobre disfrutar la vida sin preocupaciones.", pista: "Es una canción que invita a vivir sin complicaciones." },
    { pregunta: "¿A qué película de Disney pertenece esta banda sonora?", audio: "audios/disney/Aladdin.mp3", trackName: "Aladdin\n\n Canción interpretada por Peabo Bryson y Regina Belle en la versión original de Disney. Ganó el Óscar a Mejor Canción Original en 1993. Su melodía está inspirada en baladas pop románticas de los 90, y destaca por su crescendo que transmite la sensación de libertad y aventura al volar sobre Agrabah en la alfombra mágica.", pista: "La historia sigue a un joven ladrón y una princesa." },
    { pregunta: "¿A qué película de Disney pertenece esta banda sonora?", audio: "audios/disney/TarzanDosMundos.mp3", trackName: "Tarzán\n\n 'Dos mundos' es una de las canciones principales de Tarzán (1999), interpretada por Phil Collins. Combina percusión potente y estilo pop para reflejar el conflicto entre el mundo humano y la naturaleza.", pista: "El protagonista nació en un mundo pero creció en otro completamente diferente." },
    { pregunta: "¿A qué película de Disney pertenece esta banda sonora?", audio: "audios/disney/Labellaylabestia.mp3", trackName: "La Bella y la Bestia\n\n Esta versión interpretada por Bely Basarte adapta el clásico tema de la película.\nLa canción destaca por su tono romántico y su mensaje sobre ver más allá de las apariencias.", pista: "Habla de descubrir la belleza donde no parece haberla." },
    { pregunta: "¿A qué película de Disney pertenece esta banda sonora?", audio: "audios/disney/ReyLeonHM.mp3", trackName: "El Rey León\n\n 'Hakuna Matata' es una de las canciones más icónicas de la película. Su estilo alegre y desenfadado transmite una filosofía de vida sin preocupaciones, convirtiéndose en una de las frases más reconocidas de Disney.", pista: "Habla de vivir sin preocupaciones, literalmente." },
    { pregunta: "¿A qué película de Disney pertenece esta banda sonora?", audio: "audios/disney/PeterPanEstrella.mp3", trackName: "Peter Pan\n\n 'Aquella estrella de allá', interpretada por Gisela en la versión en español, es una canción mágica que habla de los sueños y la imaginación. Representa la ilusión de volar hacia Nunca Jamás.", pista: "La estrella del título no es de astronomía, sino del mundo de la fantasía." },
    ], 
    media: [
    { pregunta: "¿A qué película de Disney pertenece esta banda sonora?", audio: "audios/disney/BellayBestiaAlgoNuevo.mp3", trackName: "La Bella y la Bestia\n\n 'Algo nuevo' es una canción alegre que representa el inicio del cambio en la relación entre Bella y Bestia. Su tono optimista marca un punto clave en la historia.", pista: "Dos personajes que parecen incompatibles descubren que tienen más en común de lo que creían." },
    { pregunta: "¿A qué película de Disney pertenece esta banda sonora?", audio: "audios/disney/LibroDeLaSelvaElefantes.mp3", trackName: "El Libro de la Selva\n\n La 'Marcha de los elefantes' es un tema con ritmo militar y repetitivo que refleja el orden y la disciplina del grupo. Su estilo es muy reconocible por su tono cómico.", pista: "Suena a desfile serio… pero con animales." },
    { pregunta: "¿A qué película de Disney pertenece esta banda sonora?", audio: "audios/disney/Tarzan.mp3", trackName: "Tarzan\n\n La música de Tarzán (1999) fue compuesta por Phil Collins. Este tema acompaña una escena llena de acción y humor mientras Tarzán se enfrenta al campamento de cazadores. La banda sonora mezcla percusión tribal con rock moderno, algo característico de toda la película, que ayudó a darle un estilo muy reconocible a la historia.", pista: "La percusión marca el ritmo de alguien que acaba viviendo entre animales." },
    { pregunta: "¿A qué película de Disney pertenece esta banda sonora?", audio: "audios/disney/Mulan.mp3", trackName: "Mulan\n\n Interpretada por Christina Aguilera en la versión internacional, es una balada que expresa el conflicto interno de Mulan entre su identidad y las expectativas sociales. La canción destaca por su tono íntimo y emocional, y se convirtió en uno de los temas más icónicos de Disney por su mensaje de autenticidad y autoaceptación.", pista: "La protagonista siente que lo que ve en el espejo no refleja quién es de verdad." },
    { pregunta: "¿A qué película de Disney pertenece esta banda sonora?", audio: "audios/disney/LaSirenita.mp3", trackName: "La Sirenita\n\n 'Bajo el mar' es una de las canciones más icónicas de la película. Su estilo caribeño y ritmo animado acompañan a Sebastián mientras intenta convencer a Ariel de quedarse en el océano.", pista: "La música te lleva directo al fondo del océano." },
    { pregunta: "¿A qué película de Disney pertenece esta banda sonora?", audio: "audios/disney/ToyStory.mp3", trackName: "Toy Story\n\n 'Hay un amigo en mí', interpretada por Randy Newman, es el tema principal de la película. Su estilo sencillo y cercano refuerza la amistad entre Woody y Buzz.", pista: "Habla de una amistad que dura pase lo que pase, por muy pequeño que sea, incluso aunque no sea una persona como tal." },
    { pregunta: "¿A qué película de Disney pertenece esta banda sonora?", audio: "audios/disney/LibroDeLaSelvaMono.mp3", trackName: "El Libro de la Selva\n\n 'Quiero ser como tú' es una canción con fuerte influencia de jazz y swing. Interpretada por el Rey Louie, destaca por su ritmo pegadizo y su carácter divertido.", pista: "La canta un animal que quiere ser más humano y envidia algo que los humanos tienen y él no puede conseguir." },
    { pregunta: "¿A qué película de Disney pertenece esta banda sonora?", audio: "audios/disney/Mulan2.mp3", trackName: "Mulán\n\n 'Voy a hacer un hombre de ti' es una canción motivacional que acompaña el entrenamiento de Mulan. Su ritmo enérgico y progresivo la convierten en una de las más recordadas de la película.", pista: "Es un himno de superación cantado por quien menos esperaría tener razón para cantarlo." },
    ], 
    dificil: [
    { pregunta: "¿A qué película de Disney pertenece esta banda sonora?", audio: "audios/disney/ReyLeonPreparaos.mp3", trackName: "El Rey León\n\n 'Preparaos' es la canción de Scar y destaca por su tono oscuro y teatral. Representa su plan para tomar el poder y es una de las más intensas de la película.", pista: "Es la canción donde el villano planea su momento." },
    { pregunta: "¿A qué película de Disney pertenece esta banda sonora?", audio: "audios/disney/PlanetaDelTesoro.mp3", trackName: "El Planeta del Tesoro\n\n 'Sigo aquí', interpretada por Alex Ubago en la versión en español, es una canción que refleja la búsqueda de identidad del protagonista. Su estilo pop la hace muy diferente a otros clásicos de Disney.", pista: "Una canción pop en una película de aventura espacial." },
    { pregunta: "¿A qué película de Disney pertenece esta banda sonora?", audio: "audios/disney/Aristogatos.mp3", trackName: "Aristogatos\n\n Esta canción pertenece a Los Aristogatos (1970) de Disney y mezcla jazz clásico con un estilo muy parisino. Es muy conocida por su pegadizo 'Arriquitiquitiqui', que se ha convertido en una parte icónica y reconocible del tema. Fue una de las primeras veces que Disney usó el jazz como elemento central en una banda sonora.", pista: "El estilo suena tan felino como la historia que acompaña." },
    { pregunta: "¿A qué película de Disney pertenece esta banda sonora?", audio: "audios/disney/PeterPan.mp3", trackName: "Peter Pan\n\n Canción de la película de Disney Peter Pan (1953). Es un tema suave y melódico que transmite la idea de acompañar a alguien siempre, sin importar a dónde vaya. Destaca por su estilo clásico de Disney con arreglos orquestales simples y muy emotivos, propios de la época dorada del estudio.", pista: "Es una promesa de no separarse de alguien, vayas donde vayas." },
    { pregunta: "¿A qué película de Disney pertenece esta banda sonora?", audio: "audios/disney/AladdinPrincipeAli.mp3", trackName: "Aladdín\n\n 'El príncipe Ali' es una canción llena de energía que presenta a Aladdín en su nueva identidad. Destaca por su estilo festivo y su gran puesta en escena.", pista: "El personaje que presentan esconde su verdadera identidad detrás de un nombre inventado." },
    { pregunta: "¿A qué película/s pertenece esta banda sonora?", audio: "audios/disney/IceAgeMatilda.mp3", trackName: "Ice Age / Matilda\n\n 'Send Me On My Way' de Rusted Root se hizo muy popular por aparecer en Ice Age y también en Matilda. Su ritmo alegre y su estilo folk la convirtieron en una canción muy reconocible en el cine.", pista: "Suena en una comedia familiar de los 90 y en una aventura animada con animales prehistóricos." },
    { pregunta: "¿A qué película pertenece esta banda sonora?", audio: "audios/disney/Shrek.mp3", trackName: "Shrek\n\n 'All Star' de Smash Mouth se hizo mundialmente famosa por su uso en Shrek. Su estilo pop-rock y tono divertido encajan perfectamente con el humor de la película.", pista: "Suena tan divertida como el ogro protagonista." },
    { pregunta: "¿A qué película de Disney pertenece esta banda sonora?", audio: "audios/disney/LiloyStitch.mp3", trackName: "Lilo & Stitch\n\n 'He Mele No Lilo' es la canción de apertura de la película, interpretada en hawaiano. Refleja la cultura local y el ambiente tropical que define la historia.", pista: "Combina tradición hawaiana con un experimento alienígena que se convierte en mascota." },
    ] },
  "Adivinanzas":     { 
    facil: [
    { pregunta: "¿Qué tiene orejas pero no oye?", explicacion: "La respuesta correcta es 'La taza'. La parte por donde se agarra se llama oreja.", pista: "La 'oreja' aquí no escucha, solo ayuda a sujetar." },
    { pregunta: "Si una camisa tarda 1 hora en secarse al sol, ¿cuánto tardan 5 camisas en secarse en el mismo tendedero y con el mismo sol?", explicacion: "La respuesta correcta es '1 hora'. No se secan una detrás de otra, se secan a la vez.", pista: "No importa cuántas haya si todas reciben el mismo sol."},
    { pregunta: "¿Qué tiene hojas pero no es un árbol?", explicacion: "La respuesta correcta es 'El Libro'. Los libros tienen hojas (páginas), pero no son plantas.", pista: "Tiene algo que normalmente asocias con la naturaleza, pero suele estar en una estantería." },
    { pregunta: "¿Qué sube y baja pero nunca se mueve del sitio?", explicacion: "La respuesta correcta es 'Las escaleras'. Suben y bajan las personas, pero la estructura permanece fija.", pista: "Facilita el movimiento de los demás, pero ella misma nunca se desplaza." },
    { pregunta: "¿Qué usas para ver pero no es un ojo?", explicacion: "La respuesta correcta es 'Las gafas'. Se usan para ver mejor, pero no son ojos.", pista: "Lo llevas en la cara, pero no forma parte de tu cuerpo." },
    { pregunta: "¿Qué se moja mientras seca?", explicacion: "La respuesta correcta es 'La toalla'. Absorbe agua mientras seca a alguien.", pista: "Cuanto más ayuda, más húmeda queda." },
    { pregunta: "Un médico te da 3 pastillas y te dice que tomes una cada media hora. ¿Cuánto tiempo tardas en tomártelas todas?", explicacion: "La respuesta correcta es '1 hora'. Tomas la primera al inicio, la segunda a los 30 minutos y la tercera a los 60 minutos.", pista: "La clave está en cuándo tomas la primera." },
    { pregunta: "En una carrera adelantas al que va segundo. ¿En qué posición te colocas?", explicacion: "La respuesta correcta es 'En segundo lugar'. Si adelantas al segundo, ocupas su posición; no pasas a ser primero.", pista: "Piensa bien en qué posición estaba el que acabas de dejar atrás." }

    ], 
    media: [
    { pregunta: "En una habitación hay una vela encendida, una lámpara de gas y una chimenea preparada. Entras con una sola cerilla. ¿Qué enciendes primero?", explicacion: "La respuesta correcta es 'La cerilla'. Sin encender la cerilla no puedes encender nada más.", pista: "Antes de pensar en qué encender, piensa qué condición hace falta cumplir primero." },
    { pregunta: "Tiene ciudades pero no edificios, ríos pero no agua, y montañas pero no piedras. ¿Qué es?", explicacion: "La respuesta correcta es 'Un mapa'. Representa ciudades, ríos y montañas, pero nada es real.", pista: "Muestra lugares reales, pero ninguno existe ahí." },
    { pregunta: "Una caja sin bisagras, llave ni tapa, pero dentro esconde un tesoro dorado. ¿Qué es?", explicacion: "La respuesta correcta es 'El huevo'. El tesoro dorado hace referencia a la yema del huevo.", pista: "Lo rompes para descubrir lo que guarda dentro." },
    { pregunta: "¿Qué es lo más importante de 'Reus'?", explicacion: "La respuesta correcta es 'La letra U', ya que sin ella se queda en 'Res', es decir, nada en catalán.", pista: "Lo importante está en su nombre, afirman los catalanes." },
    { pregunta: "En ABECEDARIO, ¿cuál es la tercera letra?", explicacion: "En 'ABECEDARIO' la tercera letra es la 'E'. La trampa está en fijarse en la palabra, no en el alfabeto.", pista: "La respuesta está delante de tus ojos." },
    { pregunta: "Un avión se estrella justo en la frontera entre Francia y España. ¿Dónde entierran a los supervivientes?", explicacion: "La respuesta correcta es 'En ningún sitio, a los supervivientes no se les entierra'.", pista: "Hay una palabra que lo cambia todo." },
    { pregunta: "Me ves en el agua, pero nunca me mojo. Me sigues, pero nunca te alcanzo. ¿Qué soy?", explicacion: "La respuesta correcta es 'El reflejo'. Se ve en el agua o en un espejo, pero nunca se moja ni se puede alcanzar.", pista: "Aparezco en distintos momentos cuando te miras a ti mismo." },
    { pregunta: "¿Qué es más ligero que una pluma pero ni el más fuerte puede sostenerlo mucho tiempo?", explicacion: "La respuesta correcta es 'La respiración'. No pesa nada, pero nadie puede mantenerla demasiado.", pista: "No pesa, pero sin ella no duras mucho." },
    { pregunta: "Primero lo chupas para ponerlo tieso y humedecerlo, y con todo eso hay que empujarlo para meterlo. ¿Qué és?", explicacion: "La respuesta es 'el hilo' cuando lo metes en el agujero de la aguja.", pista: "Tiene que pasar por el ojo de algo muy fino y puntiagudo." }
    ], 
    dificil: [
    { pregunta: "Un padre y su hijo tienen 36 años entre los dos. El padre tiene 30 años más que el hijo. ¿Cuántos años tiene el hijo?", explicacion: "La respuesta correcta es '3 años'. Si el hijo tiene 3, el padre tiene 33. 33 + 3 = 36 y la diferencia es de 30.", pista: "Uno de los dos es mucho más pequeño de lo que imaginas a primera vista."},
    { pregunta: "Si me tienes, quieres compartirlo. Si lo compartes, dejas de tenerlo. ¿Qué soy?", explicacion: "La respuesta correcta es 'Un secreto'. En cuanto lo compartes, deja de ser solo tuyo.", pista: "Solo existe mientras no lo compartes."},
    { pregunta: "Un tren eléctrico va de Madrid a Barcelona a 100 km/h. El viento sopla de Barcelona hacia Madrid a 50 km/h. ¿Hacia dónde va el humo del tren?", explicacion: "La respuesta correcta es 'A ninguna parte, porque es eléctrico y no produce humo'. La trampa está en la palabra 'eléctrico'.", pista: "La clave está en fijarte en cómo se mueve… o en cómo no." },  
    { pregunta: "Siempre está en medio del mar pero nunca se moja. ¿Qué es?", respuesta: "La letra A", explicacion: "La respuesta correcta es 'la letra A'. Está en la palabra 'mar', pero no se moja porque es solo una letra.", pista: "Está en la palabra, no en el agua." },
    { pregunta: "No tengo boca y hablo, no tengo oídos y escucho, no tengo cuerpo y viajo con el viento repitiéndome. ¿Qué soy?", explicacion: "La respuesta correcta es 'El eco'. Es un sonido que se repite sin tener cuerpo físico.", pista: "Solo aparece cuando hay algo que lo devuelva." },  
    { pregunta: "Un hombre vive en el décimo piso. Cada día toma el ascensor hasta la planta baja para ir a trabajar. \nAl volver, si va solo, sube solo hasta la planta 7 y luego usa las escaleras hasta la 10. Pero si va con alguien, sube directamente hasta la 10. ¿Por qué?", explicacion: "La respuesta correcta es 'Porque es bajito y solo llega al botón del 7'. Cuando va acompañado, alguien más pulsa el 10 por él.", pista: "La clave está en qué puede alcanzar… y qué no." },
    { pregunta: "¿Qué cosa es tuya pero otros usan más que tú?", explicacion: "La respuesta correcta es 'Tu nombre'. Los demás lo dicen mucho más que tú mismo.", pista: "Los demás lo dicen constantemente, tú casi nunca." },
    { pregunta: "Me tienes delante todos los días, pero solo me ves si no te miro. Si te miro, no me ves. ¿Qué soy?", explicacion: "La respuesta correcta es 'El espejo'. Lo ves cuando miras hacia él, pero si 'él te mira' (es decir, tú miras tu reflejo), ya no piensas en el espejo en sí.", pista: "Solo lo notas cuando no estás mirando tu reflejo." }
    ] }
};

function buildBoard() {
  const board = document.getElementById('board');
  if (!board) return;
  board.innerHTML = '';

  categories.forEach((title) => {
    const heading = document.createElement('div');
    heading.className = 'category';
    heading.textContent = title;
    board.appendChild(heading);
  });

  for (let r = 0; r < values.length; r++) {
    for (let c = 0; c < cols; c++) {
      const btn = document.createElement('div');
      btn.className = 'value';
      btn.id = `btn-${r}-${c}`;
      btn.textContent = values[r];
      btn.addEventListener('click', () => openQuestion(r, c, btn));
      board.appendChild(btn);
    }
  }
}

function getDifficulty(points) {
  if (points <= 250) return 'facil';
  if (points <= 500) return 'media';
  return 'dificil';
}

// ==================== DOM ELEMENT REFERENCES ====================
const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const progressHandle = document.getElementById('progressHandle');
const currentTimeLabel = document.getElementById('currentTime');
const totalTimeLabel = document.getElementById('totalTime');
const audioControlsWrap = document.getElementById('audioControls');
const progressWrap = document.getElementById('progressWrap');
const resolveBtn = document.getElementById('resolveBtn');
const optionsDiv = document.getElementById('options');
const questionInfoDiv = document.getElementById('questionInfo');
const questionText = document.getElementById('questionText');
const toggleRevealBtn = document.getElementById('toggleRevealBtn');
const hiddenAnswerDiv = document.getElementById('hiddenAnswer');

// Hint elements
const hintBtn = document.getElementById('hintBtn');
const hintContainer = document.getElementById('hintContainer');
const hintText = document.getElementById('hintText');

// Final overlay and confetti elements
const finalOverlay = document.getElementById('finalOverlay');
const confettiCanvas = document.getElementById('confettiCanvas');
const winnerColorEl = document.getElementById('winnerColor');
const winnerAnnouncementEl = document.getElementById('winnerAnnouncement');
const winnerScoreEl = document.getElementById('winnerScore');
const rankingListEl = document.getElementById('rankingList');
const finalCard = document.getElementById('finalCard');

// ==================== TEAM DATA ====================
const teamScores = [0,0,0,0,0];
const teamColors = ["#ef4444","#3b82f6","#10b981","#f59e0b","#7c3aed"];
const teamNames = ["Equipo Rojo","Equipo Azul","Equipo Verde","Equipo Amarillo","Equipo Morado"];

// ==================== VOLUME CONTROL ====================
let volumeSlider = null;
let volumeIcon = null;
let currentAudioVolume = 0.85;

function updateVolumeIcon() {
  if (!volumeIcon || !audio) return;
  
  if (audio.volume === 0) {
    volumeIcon.textContent = 'ðŸ”‡';
  } else if (audio.volume < 0.3) {
    volumeIcon.textContent = 'ðŸ”ˆ';
  } else if (audio.volume < 0.65) {
    volumeIcon.textContent = 'ðŸ”‰';
  } else {
    volumeIcon.textContent = 'ðŸ”Š';
  }
}

function initVolumeControl() {
  // Buscar los elementos cada vez que se abre una pregunta de audio
  volumeSlider = document.getElementById('volumeSlider');
  volumeIcon = document.getElementById('volumeIcon');

  if (!volumeSlider || !audio) {
    console.warn("Volume elements not found");
    return;
  }

  audio.volume = currentAudioVolume;
  volumeSlider.value = currentAudioVolume;
  updateVolumeIcon();

  // Listener del slider
  const inputHandler = () => {
    currentAudioVolume = parseFloat(volumeSlider.value);
    audio.volume = currentAudioVolume;
    updateVolumeIcon();
  };

  if (volumeSlider._inputHandler) volumeSlider.removeEventListener('input', volumeSlider._inputHandler);
  volumeSlider._inputHandler = inputHandler;
  volumeSlider.addEventListener('input', inputHandler);

  // Icono mute/unmute
  if (volumeIcon) {
    const clickHandler = () => {
      if (audio.volume > 0) {
        audio.dataset.lastVolume = audio.volume;
        audio.volume = 0;
        volumeSlider.value = 0;
      } else {
        const lastVol = parseFloat(audio.dataset.lastVolume) || 0.85;
        audio.volume = lastVol;
        volumeSlider.value = lastVol;
        currentAudioVolume = lastVol;
      }
      updateVolumeIcon();
    };

    if (volumeIcon._clickHandler) volumeIcon.removeEventListener('click', volumeIcon._clickHandler);
    volumeIcon._clickHandler = clickHandler;
    volumeIcon.addEventListener('click', clickHandler);
  }
}

// ==================== SCORE MANAGEMENT ====================
function renderScore(teamIndex) {
  const text = `${teamScores[teamIndex]} Pts`;
  const el = document.getElementById(`score-${teamIndex}`);
  if (el) el.innerText = text;
  const top = document.getElementById(`score-top-${teamIndex}`);
  if (top) top.innerText = text;
}

function applyTeamNeonBorders() {
  for (let i = 0; i < teamScores.length; i++) {
    const teamEl = document.getElementById(`team-${i}`);
    const headerEl = document.getElementById(`score-top-${i}`);
    if (!teamEl) continue;
    const color = teamColors[i] || '#fff';
    teamEl.style.borderColor = color;
    teamEl.style.boxShadow = `0 8px 30px rgba(0,0,0,0.45), 0 0 18px ${hexToRgba(color,0.12)}`;
    if (headerEl) {
      headerEl.style.borderColor = color;
      headerEl.style.boxShadow = `0 0 18px ${hexToRgba(color,0.12)}`;
    }
  }
}

// Renders trackName with the movie title in bold. Format: "Title\n\nExplanation"
function setTrackNameHtml(el, trackName) {
  const idx = trackName.indexOf('\n\n');
  if (idx === -1) {
    el.innerHTML = `<strong>${escapeHtml(trackName)}</strong>`;
  } else {
    const title = trackName.slice(0, idx);
    const body  = escapeHtml(trackName.slice(idx + 2)).replace(/\n/g, '<br>');
    el.innerHTML = `<strong>${escapeHtml(title)}</strong><br><br>${body}`;
  }
}

function hexToRgba(hex, alpha = 1) {
  const h = hex.replace('#','');
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function adjustScore(teamIndex, delta) {
  if (typeof teamIndex !== 'number' || teamIndex < 0 || teamIndex > 4) return;
  teamScores[teamIndex] += delta;
  renderScore(teamIndex);
  if (lastPlayedCategory && lastQuestionResolved) {
    if (!categoryStats[lastPlayedCategory]) categoryStats[lastPlayedCategory] = {};
    categoryStats[lastPlayedCategory][teamIndex] = (categoryStats[lastPlayedCategory][teamIndex] || 0) + delta;
  }
}

const scoreRowMap = {
  150: [150, -75],
  250: [250, -125],
  400: [400, -200],
  500: [500, -250],
  700: [700, -350],
  800: [800, -400],
};

function normalizeScoreButtons() {
  document.querySelectorAll('.row-buttons').forEach((row) => {
    const greenBtn = row.querySelector('button.btn-small.green');
    const redBtn = row.querySelector('button.btn-small.red');
    if (!greenBtn || !redBtn) return;

    const greenValue = Number(greenBtn.textContent.replace(/[^0-9-]/g, ''));
    const mapped = scoreRowMap[greenValue];
    if (!mapped) return;

    greenBtn.textContent = mapped[0] > 0 ? `+${mapped[0]}` : String(mapped[0]);
    redBtn.textContent = mapped[1] > 0 ? `+${mapped[1]}` : String(mapped[1]);

    const greenOnclick = greenBtn.getAttribute('onclick');
    const redOnclick = redBtn.getAttribute('onclick');
    if (greenOnclick) {
      greenBtn.setAttribute('onclick', greenOnclick.replace(/adjustScore\((\d+),[+-]?\d+\)/, `adjustScore($1,${mapped[0]})`));
    }
    if (redOnclick) {
      redBtn.setAttribute('onclick', redOnclick.replace(/adjustScore\((\d+),[+-]?\d+\)/, `adjustScore($1,${mapped[1]})`));
    }
  });
}

function resetTeam(teamIndex) {
  if (typeof teamIndex !== 'number' || teamIndex < 0 || teamIndex > 4) return;
  teamScores[teamIndex] = 0;
  renderScore(teamIndex);
}

function resetAllScores() {
  for (let i = 0; i < teamScores.length; i++) {
    teamScores[i] = 0;
    renderScore(i);
  }
  categoryStats = {};
  if (finalChart) { finalChart.destroy(); finalChart = null; }
  const statsPanel = document.getElementById('statsPanel');
  if (statsPanel) { statsPanel.innerHTML = ''; statsPanel.style.display = 'none'; }
  const toggleBtn = document.getElementById('toggleStatsBtn');
  if (toggleBtn) { toggleBtn.style.display = 'none'; toggleBtn.innerHTML = 'ðŸ“Š Ver estadísticas'; }
}

// ==================== AUDIO CONTROLS ====================
function formatTime(sec) {
  if (!isFinite(sec) || sec <= 0) return '0:00';
  const s = Math.floor(sec % 60);
  const m = Math.floor(sec / 60);
  return `${m}:${s.toString().padStart(2,'0')}`;
}

function updateProgressUI() {
  if (!audio || !progressBar || !progressFill || !progressHandle || !currentTimeLabel || !totalTimeLabel) return;
  const dur = audio.duration || 0;
  const cur = audio.currentTime || 0;
  const pct = dur ? (cur / dur) * 100 : 0;
  progressFill.style.width = pct + '%';
  progressHandle.style.left = pct + '%';
  currentTimeLabel.innerText = formatTime(cur);
  totalTimeLabel.innerText = formatTime(dur);
}

function resetAudioControls() {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  if (playBtn) {
    playBtn.style.display = 'none';
    playBtn.disabled = false;
  }
  if (pauseBtn) {
    pauseBtn.style.display = 'none';
    pauseBtn.disabled = true;
  }
  updateProgressUI();
}

// ==================== INDEX PAGE INIT ====================
function initIndexPage() {
  if (!document.getElementById('overlay')) return;

  const _idxNavType = (performance.getEntriesByType?.('navigation')?.[0]?.type)
    ?? (performance.navigation?.type === 1 ? 'reload' : 'navigate');
  if (_idxNavType === 'reload') {
    localStorage.removeItem('ruletaTeamNames');
    sessionStorage.removeItem('ruletaTeams');
  }

  const savedTeams = JSON.parse(localStorage.getItem('ruletaTeamNames') || '{}');
  for (let i = 0; i < 5; i++) {
    if (savedTeams[i]) {
      teamNames[i] = savedTeams[i];
      const el = document.getElementById(`team-name-${i}`);
      if (el) el.textContent = savedTeams[i];
    }
  }

  for (let i = 0; i < teamScores.length; i++) renderScore(i);
  applyTeamNeonBorders();

  if (playBtn && pauseBtn && audio) {
    const attachListeners = () => {
      playBtn.onclick = () => {
        audio.play().catch((e) => console.log('Play failed:', e));
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'block';
        playBtn.disabled = true;
        pauseBtn.disabled = false;
      };
      pauseBtn.onclick = () => {
        audio.pause();
        playBtn.style.display = 'block';
        pauseBtn.style.display = 'none';
        playBtn.disabled = false;
        pauseBtn.disabled = true;
      };
    };
    attachListeners();
    audio.addEventListener('timeupdate', updateProgressUI);
    audio.addEventListener('loadedmetadata', updateProgressUI);
    audio.addEventListener('ended', () => {
      playBtn.style.display = 'block';
      pauseBtn.style.display = 'none';
      playBtn.disabled = false;
      pauseBtn.disabled = true;
      updateProgressUI();
    });
    // Re-attach playBtn/pauseBtn onclick handlers on overlay click in case they were lost
    document.addEventListener('click', (e) => {
      if (e.target.closest('#overlay') && playBtn.style.display === 'none') {
        attachListeners();
      }
    });
  }

  resetAudioControls();

  if (toggleRevealBtn) {
    toggleRevealBtn.addEventListener('click', () => {
      if (!currentQuestion || !currentQuestion.trackName || currentRow === null || currentCol === null) return;

      const cellKey = `${currentRow}-${currentCol}`;
      const isShown = hiddenAnswerDiv && hiddenAnswerDiv.style.display === 'block';

      if (!isShown) {
        // REVELAR
        setTrackNameHtml(hiddenAnswerDiv, currentQuestion.trackName);
        hiddenAnswerDiv.style.display = 'block';
        hiddenAnswerDiv.setAttribute('aria-hidden', 'false');
        document.getElementById('toggleRevealText').textContent = 'Ocultar película';

        revealedAudioCells.add(cellKey);
        lastQuestionResolved = true;

        if (currentButton) {
          currentButton.classList.add('disabled');
          currentButton.onclick = null;
          currentButton.setAttribute('aria-disabled', 'true');
        }
      } else {
        // OCULTAR + REACTIVAR el botón del tablero
        hiddenAnswerDiv.innerText = '';
        hiddenAnswerDiv.style.display = 'none';
        hiddenAnswerDiv.setAttribute('aria-hidden', 'true');
        document.getElementById('toggleRevealText').textContent = 'Revelar película';

        revealedAudioCells.delete(cellKey);

        if (currentButton) {
          currentButton.classList.remove('disabled');
          currentButton.setAttribute('aria-disabled', 'false');
          currentButton.onclick = () => openQuestion(currentRow, currentCol, currentButton);
        }
      }
    });
  }

  // Seek by clicking the progress bar
  if (progressBar) {
    progressBar.addEventListener('click', function(e) {
      if (!audio || !audio.duration || isNaN(audio.duration) || !isFinite(audio.duration)) return;

      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));

      audio.currentTime = percentage * audio.duration;
      updateProgressUI();
    });
  }

  if (document.getElementById('overlay')) {
    document.getElementById('overlay').addEventListener('click', (e) => {
      if (e.target.id === 'overlay') closeOverlay();
    });
  }

  if (finalOverlay) {
    finalOverlay.addEventListener('click', (e) => {
      if (e.target === finalOverlay) closeFinalOverlay();
    });
  }

  // Botón "Cambiar pregunta"
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.onclick = changeCurrentQuestion;
  }
}

// ==================== QUESTION STATE ====================
let selectedOption = null;
let currentCorrect = null;
let currentButton = null;
let currentRow = null;
let currentCol = null;
let currentQuestion = null;

// Guarda permanentemente la pregunta (canción) asignada a cada casilla del tablero
const assignedQuestions = {};   // clave: "fila-columna" → objeto pregunta
// Estado de revelación para preguntas de audio (Bandas sonoras y Disney)
const revealedAudioCells = new Set();   // keys: "row-col"
// Estado persistente para preguntas normales (explicación visible + opción seleccionada)
let cellStates = {};   // clave: "row-col" → { explanationVisible: bool, selectedOption: number|null }
let audioPositions = {};  // clave: "row-col" → segundos guardados de la canción
let lastPlayedCategory = null;
let lastQuestionResolved = false;
let categoryStats = {};   // { 'Geografía': { 0: 150, 1: -75, ... }, ... }
let scoreHistory = [[0, 0, 0, 0, 0]]; // snapshot de puntuaciones tras cada ajuste
let finalChart = null;
// Preguntas usadas por categoría + dificultad (evita duplicados dentro de facil/media/dificil)
let usedQuestionsByPool = {};   // clave: "Categoria-dificultad" → Set de preguntas usadas

// ==================== QUESTION LOGIC ====================
function openQuestion(row, col, btnElement) {
  if (!questionText || !optionsDiv || !resolveBtn || !audioControlsWrap || !progressWrap) return;

  const categoryName = categories[col];
  const points = values[row];
  const difficulty = getDifficulty(points);
  const poolKey = `${categoryName}-${difficulty}`;
  const cellKey = `${row}-${col}`;

  let q;

  if (assignedQuestions[cellKey]) {
    q = assignedQuestions[cellKey];
  } else {
    let pool = questionPools[categoryName] && questionPools[categoryName][difficulty];
    if (!pool || pool.length === 0) {
      showToast('No hay preguntas disponibles para esta categoría y dificultad.');
      return;
    }

    if (!usedQuestionsByPool[poolKey]) usedQuestionsByPool[poolKey] = new Set();
    const usedSet = usedQuestionsByPool[poolKey];

    let available = pool.filter(question => !usedSet.has(question));

    // === Confirmación para resetear solo esta categoría/dificultad ===
    if (available.length === 0) {
      const reset = confirm(
        `¡Te has quedado sin preguntas!\n\n` +
        `Categoría: ${categoryName}\n` +
        `Dificultad: ${difficulty}\n\n` +
        `¿Quieres reiniciar SOLO las preguntas de esta categoría y dificultad\n` +
        `para seguir jugando?`
      );

      if (reset) {
        usedSet.clear();           // Resetea solo este pool
        available = [...pool];
      } else {
        closeOverlay();            // Cierra la ventana si no quiere resetear
        return;
      }
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    q = available[randomIndex];

    usedSet.add(q);
    assignedQuestions[cellKey] = q;
  }

  currentQuestion = q;

  const isAlreadyRevealed = revealedAudioCells.has(cellKey);
  const savedState = cellStates[cellKey];

  questionText.innerText = q ? q.pregunta || '' : '';
  optionsDiv.innerHTML = '';

  selectedOption = null;
  currentCorrect = q.correcta ?? null;
  if (lastPlayedCategory !== null) scoreHistory.push([...teamScores]);
  currentButton = btnElement;
  currentRow = row;
  currentCol = col;
  lastPlayedCategory = categories[col];
  lastQuestionResolved = false;

  if (questionInfoDiv) {
    questionInfoDiv.innerText = `${categoryName} - ${points} Puntos`;
  }

  // PISTA
  if (hintBtn && hintContainer && hintText) {
    hintContainer.classList.remove('show');
    hintBtn.classList.remove('active');
    hintText.innerHTML = q.pista || "Piensa en algo relacionado con la categoría...";

    hintBtn.onclick = () => {
      const showing = hintContainer.classList.toggle('show');
      hintBtn.classList.toggle('active', showing);
      hintText.innerHTML = q.pista || '';
    };
  }

  // Audio question mode (Bandas sonoras / Disney)
  const isAudioQuestion = (categoryName === 'Bandas sonoras' || categoryName === 'Disney') && q && q.audio;

  if (isAudioQuestion) {
    if (resolveBtn) resolveBtn.style.display = 'none';
    if (toggleRevealBtn) toggleRevealBtn.style.display = 'inline-block';
    audioControlsWrap.style.display = 'block';
    audioControlsWrap.classList.remove('explanation-only');
    progressWrap.style.display = 'flex';
    audioControlsWrap.classList.add('audio-question');

    if (audio) {
      audio.src = q.audio;
      audio.load();
      audio.pause();
      audio.currentTime = audioPositions[cellKey] || 0;
    }

    if (playBtn) playBtn.style.display = 'block';
    if (pauseBtn) pauseBtn.style.display = 'none';
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    updateProgressUI();

    if (hiddenAnswerDiv) {
      hiddenAnswerDiv.style.display = 'none';
      hiddenAnswerDiv.innerText = '';
      hiddenAnswerDiv.setAttribute('aria-hidden', 'true');
    }

    const explanationEl = document.getElementById('explanation');
    if (explanationEl) {
      explanationEl.classList.remove('explanation-visible');
      explanationEl.style.display = 'none';
    }
    if (toggleRevealBtn) {
      document.getElementById('toggleRevealText').textContent = 'Revelar película';
    }

    initVolumeControl();

    // Restaurar estado revelado si ya se había abierto antes
    if (isAlreadyRevealed && hiddenAnswerDiv && toggleRevealBtn) {
      setTrackNameHtml(hiddenAnswerDiv, q.trackName);
      hiddenAnswerDiv.style.display = 'block';
      hiddenAnswerDiv.setAttribute('aria-hidden', 'false');
      document.getElementById('toggleRevealText').textContent = 'Ocultar película';
    }

  } else {
    // Pregunta normal (incluye Adivinanzas limpias)
    audioControlsWrap.style.display = 'block';
    audioControlsWrap.classList.add('explanation-only');
    progressWrap.style.display = 'none';
    if (resolveBtn) resolveBtn.style.display = 'inline-block';
    if (toggleRevealBtn) toggleRevealBtn.style.display = 'none';

    if (audio) {
      audio.pause();
      audio.src = '';
    }

    // Opciones solo para preguntas con opciones (no Adivinanzas)
    if (categoryName !== 'Adivinanzas' && q && Array.isArray(q.opciones)) {

      const letterCategories = ['Cultura general', 'Actualidad', 'Geografía'];
      const isLetterCategory = letterCategories.includes(categoryName);

      q.opciones.forEach((op, index) => {
        const div = document.createElement('div');
        div.className = 'option';
        div.dataset.index = index;

        if (isLetterCategory && index < 4) {
          const letters = ['A', 'B', 'C', 'D'];
          div.innerHTML = `
            <div class="option-letter ${letters[index]}">${letters[index]}</div>
            <span class="option-text">${op}</span>
          `;
        } else {
          div.innerText = op;
        }

        div.onclick = () => {
          if (cellStates[cellKey]?.explanationVisible) return;
          document.querySelectorAll('.option').forEach(o => {
            o.classList.remove('selected', 'incorrect', 'correct');
          });
          div.classList.add('selected');
          selectedOption = index;
        };

        optionsDiv.appendChild(div);
      });
    } else {
      optionsDiv.innerHTML = ''; // Limpio para Adivinanzas
    }

    // Restaurar estado si ya se había visto antes
    if (savedState && savedState.explanationVisible) {
      const explanationEl = document.getElementById('explanation');
      if (explanationEl && currentQuestion && currentQuestion.explicacion) {
        explanationEl.innerText = currentQuestion.explicacion;
        explanationEl.classList.add('explanation-visible');
        explanationEl.style.display = 'block';
        explanationEl.style.opacity = '1';
        explanationEl.style.visibility = 'visible';
        explanationEl.setAttribute('aria-hidden', 'false');
      }

      const options = document.querySelectorAll('.option');
      if (options.length > 0) {
        if (currentCorrect !== null && options[currentCorrect]) options[currentCorrect].classList.add('correct');
        if (savedState.selectedOption !== null && savedState.selectedOption !== currentCorrect && options[savedState.selectedOption]) {
          options[savedState.selectedOption].classList.add('incorrect');
        }
      }
    }
  }

  document.getElementById('overlay').style.display = 'flex';
}

function resolveQuestion() {
  const explanationEl = document.getElementById('explanation');
  if (!explanationEl) return;

  const cellKey = `${currentRow}-${currentCol}`;

  if (explanationEl.classList.contains('explanation-visible')) {
    // hide explanation
    explanationEl.classList.remove('explanation-visible');
    explanationEl.style.display = 'none';
    explanationEl.innerText = '';
    explanationEl.setAttribute('aria-hidden', 'true');

    document.querySelectorAll('.option').forEach(opt => {
      opt.classList.remove('correct', 'incorrect');
    });

    if (cellStates[cellKey]) {
      cellStates[cellKey].explanationVisible = false;
    }

    if (currentButton) {
      currentButton.classList.remove('disabled');
      currentButton.setAttribute('aria-disabled', 'false');
      currentButton.onclick = () => openQuestion(currentRow, currentCol, currentButton);
    }

    const resolveBtnText = document.getElementById('resolveBtnText');
    if (resolveBtnText) resolveBtnText.textContent = 'Resolver';
    const resolveIcon = resolveBtn.querySelector('i');
    if (resolveIcon) { resolveIcon.classList.replace('bi-lock-fill', 'bi-unlock-fill'); }
    return;
  }

  // Toggle ON: mostrar explicación y marcar opciones
  if (currentButton) {
    currentButton.classList.add('disabled');
    currentButton.onclick = null;
    currentButton.setAttribute('aria-disabled', 'true');
  }

  if (currentQuestion && currentQuestion.explicacion) {
    explanationEl.innerText = currentQuestion.explicacion;
    explanationEl.classList.add('explanation-visible');
    explanationEl.style.display = 'block';
    explanationEl.style.opacity = '1';
    explanationEl.style.visibility = 'visible';
    explanationEl.setAttribute('aria-hidden', 'false');
  }

  const resolveBtnText = document.getElementById('resolveBtnText');
  if (resolveBtnText) resolveBtnText.textContent = 'Ocultar respuesta';
  const resolveIcon = resolveBtn.querySelector('i');
  if (resolveIcon) { resolveIcon.classList.replace('bi-unlock-fill', 'bi-lock-fill'); }

  // Marcar opciones correctamente
  const options = document.querySelectorAll('.option');
  if (options.length > 0) {
    if (currentCorrect !== null && options[currentCorrect]) {
      options[currentCorrect].classList.add('correct');
    }
    if (selectedOption !== null && selectedOption !== currentCorrect && options[selectedOption]) {
      options[selectedOption].classList.add('incorrect');
    }
  }

  // Guardar estado para que se recuerde al reabrir
  if (!cellStates[cellKey]) cellStates[cellKey] = {};
  cellStates[cellKey].explanationVisible = true;
  cellStates[cellKey].selectedOption = selectedOption;
  lastQuestionResolved = true;
}

// ==================== CAMBIAR PREGUNTA ====================
function changeCurrentQuestion() {
  if (currentRow === null || currentCol === null) return;

  const categoryName = categories[currentCol];
  const cellKey = `${currentRow}-${currentCol}`;

  // 1. Borramos la pregunta para forzar una nueva
  delete assignedQuestions[cellKey];

  // 2. LIMPIAMOS TOTALMENTE el estado guardado
  delete cellStates[cellKey];
  delete audioPositions[cellKey];
  
  // Si era pregunta de audio, quitamos también el estado de "revelada"
  if ((categoryName === 'Bandas sonoras' || categoryName === 'Disney') && revealedAudioCells) {
    revealedAudioCells.delete(cellKey);
  }

  // 3. Reactivamos el botón del tablero (muy importante)
  if (currentButton) {
    currentButton.classList.remove('disabled');
    currentButton.removeAttribute('aria-disabled');
    currentButton.onclick = () => openQuestion(currentRow, currentCol, currentButton);
  }

  // 4. Limpiamos la interfaz actual completamente
  selectedOption = null;

  const optionsDivEl = document.getElementById('options');
  if (optionsDivEl) optionsDivEl.innerHTML = '';

  const explanationEl = document.getElementById('explanation');
  if (explanationEl) {
    explanationEl.classList.remove('explanation-visible');
    explanationEl.style.display = 'none';
    explanationEl.innerText = '';
    explanationEl.setAttribute('aria-hidden', 'true');
  }

  // 5. Forzamos que se cargue una pregunta NUEVA y limpia
  openQuestion(currentRow, currentCol, currentButton);
}

function closeOverlay() {
  if (audio && currentRow !== null && currentCol !== null && audio.currentTime > 0 && !isNaN(audio.currentTime)) {
    audioPositions[`${currentRow}-${currentCol}`] = audio.currentTime;
  }
  currentQuestion = null;
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.src = '';
  }
  resetAudioControls();
  if (audioControlsWrap) {
    audioControlsWrap.style.display = 'none';
    audioControlsWrap.classList.remove('explanation-only');
  }
  if (progressWrap) progressWrap.style.display = 'none';
  if (resolveBtn) resolveBtn.style.display = 'inline-block';
  if (toggleRevealBtn) toggleRevealBtn.style.display = 'none';
  const resolveBtnText = document.getElementById('resolveBtnText');
  if (resolveBtnText) resolveBtnText.textContent = 'Resolver';
  if (resolveBtn) { const i = resolveBtn.querySelector('i'); if (i) i.classList.replace('bi-lock-fill', 'bi-unlock-fill'); }
  
  // Hide and clear ALL overlay content elements
  const explanationEl = document.getElementById('explanation');
  if (explanationEl) {
    explanationEl.classList.remove('explanation-visible');
    explanationEl.style.display = 'none';
    explanationEl.innerText = '';
    explanationEl.style.minHeight = '0px';
    explanationEl.style.opacity = '0';
    explanationEl.setAttribute('aria-hidden', 'true');
  }
  
  if (hiddenAnswerDiv) {
    hiddenAnswerDiv.style.display = 'none';
    hiddenAnswerDiv.innerText = '';
    hiddenAnswerDiv.setAttribute('aria-hidden', 'true');
  }

  const overlay = document.getElementById('overlay');
  if (overlay) overlay.style.display = 'none';

  if (hintContainer) hintContainer.classList.remove('show');
  if (hintBtn) hintBtn.classList.remove('active');
  if (hintText) hintText.innerHTML = '';

  audioControlsWrap.classList.remove('audio-question');
}

function showFinalRanking() {
  if (!winnerColorEl || !winnerAnnouncementEl || !winnerScoreEl || !rankingListEl || !finalCard || !finalOverlay) return;

  const teams = teamScores.map((s, i) => ({
    index: i,
    name: teamNames[i],
    score: s,
    color: teamColors[i]
  }));

  teams.sort((a, b) => b.score - a.score);
  const winner = teams[0];

  winnerColorEl.style.background = winner.color;
  winnerColorEl.style.boxShadow = `0 0 40px ${hexToRgba(winner.color, 0.7)}, 0 0 80px ${hexToRgba(winner.color, 0.4)}, 0 10px 40px rgba(0,0,0,0.6)`;
  winnerAnnouncementEl.innerText = `ðŸ† ¡${winner.name.toUpperCase()} GANA LA PARTIDA! ðŸ†`;
  winnerScoreEl.innerText = `${winner.score} Pts`;
  finalCard.style.borderColor = winner.color;
  finalCard.style.boxShadow = `0 28px 100px rgba(0,0,0,0.85), 0 0 40px ${hexToRgba(winner.color, 0.18)}`;

  // Tint action buttons with winner color
  const finalActionBtns = document.querySelectorAll('#finalOverlay .final-actions button, #finalOverlay .final-actions .btn');
  finalActionBtns.forEach(btn => {
    btn.style.backgroundColor = winner.color;
    btn.style.color = '#fff';           // Aseguramos texto blanco
  });

  rankingListEl.innerHTML = '';
  teams.forEach((t, idx) => {
    const div = document.createElement('div');
    div.className = 'rank-item';
    div.innerHTML = `<div class="rank-item-content"><div class="rank-item-icon" style="background:${t.color}"></div><div class="rank-name">${idx+1}. ${escapeHtml(t.name)}</div></div><div class="rank-score">${t.score} Pts</div>`;
    rankingListEl.appendChild(div);
  });

  scoreHistory.push([...teamScores]);

  // ==================== STATISTICS ====================
  const statsPanel = document.getElementById('statsPanel');
  const toggleBtn = document.getElementById('toggleStatsBtn');
  if (statsPanel) {
    statsPanel.innerHTML = '';
    statsPanel.style.display = 'none';
    if (rankingListEl) rankingListEl.style.display = 'block';
    if (toggleBtn) toggleBtn.innerHTML = 'ðŸ“Š Ver estadísticas';

    const hasCatData = categories.some(cat => categoryStats[cat]);
    const hasHistory = scoreHistory.length > 1;
    if (toggleBtn) toggleBtn.style.display = (hasCatData || hasHistory) ? 'inline-block' : 'none';

    // --- Gráfico de evolución ---
    if (finalChart) { finalChart.destroy(); finalChart = null; }
    if (hasHistory && typeof Chart !== 'undefined') {
      const chartWrap = document.createElement('div');
      chartWrap.className = 'stat-chart-wrap';
      const canvas = document.createElement('canvas');
      chartWrap.appendChild(canvas);
      statsPanel.appendChild(chartWrap);

      finalChart = new Chart(canvas, {
        type: 'line',
        data: {
          labels: scoreHistory.map((_, i) => i === 0 ? 'Inicio' : i === scoreHistory.length - 1 ? 'Final' : `P${i}`),
          datasets: teamNames.map((name, idx) => ({
            label: name.replace('Equipo ', ''),
            data: scoreHistory.map(s => s[idx]),
            borderColor: teamColors[idx],
            backgroundColor: hexToRgba(teamColors[idx], 0.08),
            borderWidth: 2.5,
            tension: 0.3,
            pointRadius: 3,
            pointHoverRadius: 5,
            fill: false,
          }))
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#fff', font: { family: 'Poppins', size: 12 }, boxWidth: 16 } }
          },
          scales: {
            x: { ticks: { color: '#a8b5c8', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.06)' } },
            y: { ticks: { color: '#a8b5c8', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.06)' } }
          }
        }
      });

      const chartDivider = document.createElement('hr');
      chartDivider.className = 'stats-divider';
      statsPanel.appendChild(chartDivider);
    }

    if (hasCatData) {
      const mkCard = (label, bodyHtml) => {
        const card = document.createElement('div');
        card.className = 'stat-hl-card';
        card.innerHTML = `<div class="stat-hl-label">${label}</div><div class="stat-hl-body">${bodyHtml}</div>`;
        return card;
      };

      // 1. Estrella por equipo
      const starByTeam = teamNames.map((name, idx) => {
        const played = categories.filter(cat => categoryStats[cat] && categoryStats[cat][idx] !== undefined);
        if (!played.length) return null;
        const best = played.reduce((a, b) => (categoryStats[a][idx] || 0) >= (categoryStats[b][idx] || 0) ? a : b);
        return { short: name.replace('Equipo ', ''), color: teamColors[idx], cat: best, pts: categoryStats[best][idx] };
      }).filter(Boolean);

      // 2-3. Totales por categoría
      const catTotals = {};
      categories.forEach(cat => {
        if (!categoryStats[cat]) return;
        catTotals[cat] = Object.values(categoryStats[cat]).reduce((a, b) => a + b, 0);
      });
      const catEntries = Object.entries(catTotals);
      const hardest = catEntries.length ? catEntries.reduce((a, b) => a[1] < b[1] ? a : b) : null;
      const hottest = catEntries.length ? catEntries.reduce((a, b) => a[1] > b[1] ? a : b) : null;

      // 4. Equipo más irregular
      const irregulars = teamNames.map((name, idx) => {
        const played = categories.filter(cat => categoryStats[cat] && categoryStats[cat][idx] !== undefined);
        if (played.length < 2) return null;
        const entries = played.map(cat => ({ cat, pts: categoryStats[cat][idx] }));
        const best  = entries.reduce((a, b) => a.pts >= b.pts ? a : b);
        const worst = entries.reduce((a, b) => a.pts <= b.pts ? a : b);
        return { name, short: name.replace('Equipo ', ''), color: teamColors[idx], range: best.pts - worst.pts, best, worst };
      }).filter(Boolean).sort((a, b) => b.range - a.range);
      const topRange = irregulars[0]?.range ?? null;
      const mostIrregulars = topRange !== null ? irregulars.filter(t => t.range === topRange) : [];

      // Grid de 4 tarjetas
      const grid = document.createElement('div');
      grid.className = 'stats-highlights';

      const starHtml = starByTeam.map(t =>
        `<div class="stat-hl-team"><span class="stat-hl-dot" style="background:${t.color}"></span><span>${t.short}: <strong>${t.cat}</strong> (${t.pts > 0 ? '+' : ''}${t.pts})</span></div>`
      ).join('') || '<span class="text-muted">Sin datos</span>';
      grid.appendChild(mkCard('⭐ Mejor categoría por equipo', starHtml));

      grid.appendChild(mkCard('ðŸ“ˆ Más irregular',
        mostIrregulars.length
          ? mostIrregulars.map(t =>
              `<div class="stat-hl-team"><span class="stat-hl-dot" style="background:${t.color}"></span>
               <span><strong>${t.name}</strong>
               <div class="stat-hl-sub">${t.best.cat} (${t.best.pts > 0 ? '+' : ''}${t.best.pts}) vs ${t.worst.cat} (${t.worst.pts > 0 ? '+' : ''}${t.worst.pts})</div>
               </span></div>`
            ).join('')
          : '<span class="text-muted">Sin datos</span>'
      ));

      grid.appendChild(mkCard('ðŸ”¥ Más competida',
        hottest
          ? `<strong>${hottest[0]}</strong><div class="stat-hl-sub">${hottest[1] > 0 ? '+' : ''}${hottest[1]} pts totales</div>`
          : '<span class="text-muted">Sin datos</span>'
      ));

      grid.appendChild(mkCard('ðŸ’€ Más difícil',
        hardest
          ? `<strong>${hardest[0]}</strong><div class="stat-hl-sub">${hardest[1] > 0 ? '+' : ''}${hardest[1]} pts totales</div>`
          : '<span class="text-muted">Sin datos</span>'
      ));

      statsPanel.appendChild(grid);

      const hr = document.createElement('hr');
      hr.className = 'stats-divider';
      statsPanel.appendChild(hr);

      const catTitle = document.createElement('div');
      catTitle.className = 'stats-title';
      catTitle.textContent = 'ðŸ“‹ Por categoría';
      statsPanel.appendChild(catTitle);

      categories.filter(cat => categoryStats[cat]).forEach(cat => {
        const catData = categoryStats[cat];
        const entries = Object.entries(catData).map(([idx, pts]) => ({ idx: parseInt(idx), pts })).sort((a, b) => b.pts - a.pts);
        const maxPts = entries[0]?.pts;

        const catDiv = document.createElement('div');
        catDiv.className = 'stat-cat';
        const catName = document.createElement('div');
        catName.className = 'stat-cat-name';
        catName.textContent = cat;
        catDiv.appendChild(catName);

        const teamsRow = document.createElement('div');
        teamsRow.className = 'stat-teams-row';
        entries.forEach(({ idx, pts }) => {
          const chip = document.createElement('span');
          const isBest = pts === maxPts && pts > 0;
          chip.className = 'stat-team-chip' + (isBest ? ' stat-best' : '');
          chip.style.borderColor = teamColors[idx];
          chip.style.background = isBest ? teamColors[idx] : hexToRgba(teamColors[idx], 0.2);
          chip.style.color = isBest ? '#0f172a' : '#fff';
          chip.textContent = `${teamNames[idx].replace('Equipo ', '')}: ${pts > 0 ? '+' : ''}${pts}`;
          teamsRow.appendChild(chip);
        });

        catDiv.appendChild(teamsRow);
        statsPanel.appendChild(catDiv);
      });
    }
  }

  finalOverlay.style.display = 'flex';
  finalOverlay.setAttribute('aria-hidden', 'false');
  setTimeout(() => { startConfetti(); }, 200);
}

function closeFinalOverlay() {
  if (!finalOverlay) return;
  finalOverlay.style.display = 'none';
  finalOverlay.setAttribute('aria-hidden','true');
  stopConfetti();
}

function resetBoardAndScores() {
  // Reactivar todas las casillas del tablero
  const buttons = Array.from(document.querySelectorAll('.value'));
  buttons.forEach(b => {
    b.classList.remove('disabled');
    b.removeAttribute('aria-disabled');
    const parts = b.id.split('-');
    if (parts.length === 3) {
      const r = parseInt(parts[1], 10);
      const c = parseInt(parts[2], 10);
      b.onclick = () => openQuestion(r, c, b);
    }
  });

  resetAllScores();
  applyTeamNeonBorders();
  closeFinalOverlay();

  document.querySelectorAll('.comodin').forEach(c => c.classList.remove('used'));
  revealedAudioCells.clear();
  Object.keys(assignedQuestions).forEach(key => delete assignedQuestions[key]);
  
  cellStates = {};
  audioPositions = {};
  usedQuestionsByPool = {};
  categoryStats = {};
  lastPlayedCategory = null;
  lastQuestionResolved = false;
  scoreHistory = [[0, 0, 0, 0, 0]];
  if (finalChart) { finalChart.destroy(); finalChart = null; }

}

let confettiCtx = null;
let confettiParticles = [];
let confettiRAF = null;

function startConfetti() {
  if (!confettiCanvas) return;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  confettiCtx = confettiCanvas.getContext('2d');
  confettiParticles = [];
  const colors = ["#ff3b3b", "#00eaff", "#00ff88", "#ffd93b", "#ff00ff", "#ffffff"];
  for (let i = 0; i < 140; i++) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * -confettiCanvas.height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: 1.5 + Math.random() * 1.5,
      size: 10 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10
    });
  }
  function frame() {
    if (!confettiCtx) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotSpeed;
      p.x += Math.sin(p.y * 0.02) * 0.5;
      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate(p.rot * Math.PI / 180);
      confettiCtx.shadowColor = p.color;
      confettiCtx.shadowBlur = 10;
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 0.6);
      confettiCtx.restore();
    });
    confettiParticles.forEach(p => {
      if (p.y > confettiCanvas.height + 20) {
        p.x = Math.random() * confettiCanvas.width;
        p.y = -20;
      }
    });
    confettiRAF = requestAnimationFrame(frame);
  }
  if (!confettiRAF) frame();
  window.addEventListener('resize', onConfettiResize);
}

function stopConfetti() {
  if (confettiRAF) cancelAnimationFrame(confettiRAF);
  confettiRAF = null;
  if (confettiCtx && confettiCanvas) {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
  window.removeEventListener('resize', onConfettiResize);
}

function onConfettiResize() {
  if (confettiCanvas) {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
}

/* GAME 1 QUESTIONS
CULTURA GENERAL
ACTUALIDAD
GEOGRAFÍA
BANDAS SONORAS
ADIVINANZAS

BSO:
- TEST
150 - Star Wars (Duel of the Fate)   250 - LOTR (Concerning Hobbits)    400 - Regreso al Futuro       500 - Interstellar     700 - Top Gun (Anthem)         800 - Braveheart (For the love of a princess)

- JUEGO 1
150 - Gladiator              250 - Titanic            400 - Piratas del Caribe    500 - LOTR                         700 - Dune             800 - Troya
- JUEGO 2
150 - Harry Potter (prologo) 250 - Indiana Jones      400 - Juego de Tronos       500 - Star Wars (across the Stars) 700 - El Hobbit        800 - Avatar (Becoming one of the people)
- JUEGO 3
150 - E.T.                   250 - El Padrino         400 - Jurassic Park         500 - Avengers(Marvel)             700 - Origen (Time)    800 - El último Mohicano (Promentory)

DISNEY:
- TEST
150 - Hercules (de cero a heroe)  250 - Tarzan (Lo Extrano Que Soy)     400 - La Bella y la Bestia (Algo Nuevo)   500 - El Libro De La Selva (Marcha de los Elefantes) 700 - El Rey León (Preparaos)  800 - Planeta del Tesoro (Sigo aqui)
- JUEGO 1
150 - El Libro de la Selva   250 - Aladdin              400 - Tarzan               500 - Mulan (Reflejo)   700 - Aristogatos  800 - Peter Pan
- JUEGO 2
150 - Tarzan (Dos mundos)    250 - La Bella y la Bestia (de Bely Basarte)  400 - La Sirenita (bajo el mar)          500 - Toy Story (hay un amigo en mi)        700 - Aladdin (el principe Ali)    800 - Ice Age / Matilda (send me on my way) 
- JUEGO 3
150 - El Rey León (Hakuna matata)    250 - Peter Pan (aquella estrella de alla - gisela)   400 - El Libro de la Selva (quiero ser como tu)   500 - Mulan (voy a hacer un hombre de ti)   700 - Shrek (smash mouth - all star)    800 - Lilo & Stitch (He Mele No Lilo)

IDEAS NO USADAS:
{
  pregunta: "¿Cuál es la única letra que no aparece en el nombre de ningún estado de los Estados Unidos?", opciones: ["Q", "X", "Z", "J"], correcta: 0, explicacion: "La letra 'Q' es la única que no aparece en el nombre de ningún estado de los Estados Unidos. Las letras 'X', 'Z' y 'J' sí aparecen en algunos nombres de estados."
  pregunta: "En qué país se encuentra el famoso 'Bosque de los Suicidios'?", opciones: ["Japón", "Estados Unidos", "Brasil", "India"], correcta: 0, explicacion: "El 'Bosque de los Suicidios', también conocido como Aokigahara, se encuentra en Japón. Es un lugar tristemente famoso por ser un sitio donde muchas personas han decidido acabar con sus vidas."
  pregunta: "¿Cuál es el nombre del fenómeno natural que ocurre cuando la luna pasa por la sombra de la Tierra?", opciones: ["Eclipse solar", "Eclipse lunar", "Marea roja", "Aurora boreal"], correcta: 1, explicacion: "El fenómeno natural que ocurre cuando la luna pasa por la sombra de la Tierra se llama 'Eclipse lunar'. Durante un eclipse lunar, la Tierra bloquea la luz del sol que normalmente ilumina la luna, lo que puede hacer que la luna se vea roja o oscura."
  pregunta: "En qué país se encuentra el famoso templo de Angkor Wat?", opciones: ["Camboya", "Tailandia", "Vietnam", "Laos"], correcta: 0, explicacion: "El templo de Angkor Wat se encuentra en Camboya. Es uno de los monumentos religiosos más grandes del mundo y un importante símbolo nacional de Camboya."
  pregunta: "Qué organo del cuerpo humano consume más energía?", opciones: ["Corazón", "Cerebro", "Hígado", "Pulmones"], correcta: 1, explicacion: "El cerebro es el órgano que consume más energía en el cuerpo humano, utilizando aproximadamente el 20% de la energía total del cuerpo, a pesar de representar solo alrededor del 2% de su peso."
  pregunta: "¿Cuál es la capital de Burkina Faso?", opciones: ["Ouagadougou", "Bamako", "Niamey", "Abidjan"], correcta: 0, explicacion: "La capital de Burkina Faso es Ouagadougou. Es la ciudad más grande del país y su centro político, cultural y económico."
  pregunta: "¿En qué país se encuentra la isla de Pascua?", opciones: ["Chile", "Perú", "Ecuador", "Argentina"], correcta: 0, explicacion: "La isla de Pascua, conocida por sus misteriosas estatuas moai, se encuentra en Chile. Es una isla remota en el océano Pacífico y forma parte de la región de Valparaíso."
  pregunta: "¿En qué ciudad se encuentra el Taj Mahal?", opciones: ["Delhi", "Agra", "Mumbai", "Jaipur"], correcta: 1, explicacion: "El Taj Mahal se encuentra en Agra, India. Es un mausoleo de mármol blanco construido por el emperador Shah Jahan en memoria de su esposa Mumtaz Mahal."
  pregunta: "¿En el Antiguo Egipto cuando se momificaba a una persona, qué órgano se dejaba dentro del cuerpo?", opciones: ["Corazón", "Cerebro", "Hígado", "Pulmones"], correcta: 0, explicacion: "En el proceso de momificación del Antiguo Egipto, el corazón era el único órgano que se dejaba dentro del cuerpo. Se creía que el corazón era el centro de la inteligencia y la emoción, y era necesario para el juicio en el más allá."
  pregunta: "¿Qué cantante o grupo musical es el que más discos ha vendido en la historia de la música?", opciones: ["The Beatles", "Elvis Presley", "Michael Jackson", "Madonna"], correcta: 0, explicacion: "The Beatles es el grupo musical que más discos ha vendido en la historia, con estimaciones que superan los 600 millones de unidades vendidas en todo el mundo."
  },
*/

// Ruletas lives in js/ruletas.js. script.js keeps shared helpers and Family Trivia only.

document.addEventListener('DOMContentLoaded', () => {
  normalizeScoreButtons();
  highlightActiveButton();
  buildBoard();
  initIndexPage();
});


function toggleFinalStats() {
  const statsPanel = document.getElementById('statsPanel');
  const rankingList = document.getElementById('rankingList');
  const btn = document.getElementById('toggleStatsBtn');
  const showing = statsPanel && statsPanel.style.display === 'block';
  if (statsPanel) statsPanel.style.display = showing ? 'none' : 'block';
  if (rankingList) rankingList.style.display = showing ? 'block' : 'none';
  if (btn) btn.innerHTML = showing ? 'ðŸ“Š Ver estadísticas' : 'ðŸ† Ver ranking';
  if (!showing && finalChart) setTimeout(() => finalChart.resize(), 50);
}

function toggleEditMode() {
  const scoreboard = document.getElementById('scoreboard');
  const btn = document.getElementById('editTeamsBtn');
  const active = scoreboard.classList.toggle('edit-mode');
  btn.classList.toggle('active', active);
}

function startRename(teamIndex) {
  const nameEl = document.getElementById(`team-name-${teamIndex}`);
  if (!nameEl) return;
  const original = nameEl.textContent;

  const input = document.createElement('input');
  input.type = 'text';
  input.value = original;
  input.className = 'rename-input';
  nameEl.replaceWith(input);
  input.focus();
  input.select();

  const finish = () => {
    const newName = input.value.trim() || original;
    const newEl = document.createElement('div');
    newEl.className = 'team-name';
    newEl.id = `team-name-${teamIndex}`;
    newEl.textContent = newName;
    input.replaceWith(newEl);
    teamNames[teamIndex] = newName;
  };

  input.addEventListener('blur', finish);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') input.blur();
    if (e.key === 'Escape') { input.value = original; input.blur(); }
  });
}

window.openQuestion = openQuestion;
window.resolveQuestion = resolveQuestion;
window.closeOverlay = closeOverlay;
window.adjustScore = adjustScore;
window.resetTeam = resetTeam;
window.resetAllScores = resetAllScores;
window.resetBoardAndScores = resetBoardAndScores;
window.showFinalRanking = showFinalRanking;
window.closeFinalOverlay = closeFinalOverlay;
window.toggleFinalStats = toggleFinalStats;
window.startRename = startRename;
window.toggleEditMode = toggleEditMode;
