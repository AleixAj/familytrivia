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

  // Detectar pÃ¡gina de ruletas de forma mÃ¡s robusta
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
  'GeografÃ­a',
  'Bandas sonoras',
  'Disney',
  'Adivinanzas'
];
const values = [150,250,400,500,700,800];
const cols = 6;

const questionPools = {
  "Cultura general": { 
    facil: [
    { pregunta: "Â¿CuÃ¡l es el animal terrestre mÃ¡s rÃ¡pido del mundo?", opciones: ["LeÃ³n","Guepardo","Tigre","AntÃ­lope"], correcta: 1, explicacion: "El guepardo puede alcanzar velocidades de hasta 110 km/h en carreras cortas.", pista: "No es el mÃ¡s grande ni el mÃ¡s fuerte, pero en velocidad punta ningÃºn animal terrestre se le acerca." },
    { pregunta: "Â¿QuiÃ©n pintÃ³ la obra conocida como 'La Mona Lisa'?", opciones: ["Pablo Picasso", "Vincent van Gogh", "Leonardo da Vinci", "Miguel Ãngel"], correcta: 2, explicacion: "La Mona Lisa fue pintada por Leonardo da Vinci en el siglo XVI. Es una de las obras mÃ¡s famosas del mundo y se exhibe en el Museo del Louvre en ParÃ­s.", pista: "El autor tambiÃ©n era escultor, ingeniero e inventor, todo a la vez." },
    { pregunta: "Â¿CÃ³mo se llama el ratÃ³n famoso de Disney?", opciones: ["Donald","Goofy","Mickey","Pluto"], correcta: 2, explicacion: "Mickey Mouse es el ratÃ³n mÃ¡s icÃ³nico de Disney, creado en 1928 por Walt Disney y Ub Iwerks. Curiosamente, su primer nombre fue Mortimer, pero la esposa de Walt lo cambiÃ³ a Mickey. Actualmente es considerado uno de los personajes mÃ¡s reconocidos del mundo.", pista: "Es el personaje que prÃ¡cticamente representa a toda la compaÃ±Ã­a." },
    { pregunta: "Â¿CuÃ¡l de estos inventos apareciÃ³ primero?", opciones: ["TelÃ©fono","Internet","TelevisiÃ³n","Ordenador"], correcta: 0, explicacion: "El telÃ©fono fue inventado en el siglo XIX por Alexander Graham Bell. Los otros inventos llegaron mucho despuÃ©s, especialmente internet, que es del siglo XX.", pista: "Piensa en el invento que ya existÃ­a mucho antes de la era digital." },
    { pregunta: "Â¿QuÃ© planeta es conocido como el 'Planeta Rojo'?", opciones: ["Mercurio","Marte","JÃºpiter","Venus"], correcta: 1, explicacion: "Marte recibe este apodo por el Ã³xido de hierro presente en su superficie, que le da un tono rojizo.", pista: "El Ã³xido de hierro en su superficie le da un tono inconfundible." },
    { pregunta: "Â¿QuÃ© gas necesitan las plantas para hacer la fotosÃ­ntesis?", opciones: ["Helio","NitrÃ³geno","OxÃ­geno","DiÃ³xido de carbono"], correcta: 3, explicacion: "Las plantas absorben diÃ³xido de carbono y liberan oxÃ­geno durante la fotosÃ­ntesis.", pista: "Es el gas que nosotros expulsamos al respirar." },
    { pregunta: "Â¿QuÃ© animal es conocido como el 'rey de la selva'?", opciones: ["LeÃ³n", "Tigre", "Elefante", "Pantera"], correcta: 0,  explicacion: "La respuesta correcta es 'El leÃ³n'. Es un tÃ­tulo simbÃ³lico por su fuerza y presencia, aparte que los leones no viven en selvas sino en sabanas, pero es un apodo cultural.", pista: "Es el animal que suele aparecer en escudos y sÃ­mbolos de poder." },    
    { pregunta: "Â¿CuÃ¡l es el animal terrestre mÃ¡s grande del mundo?", opciones: ["Cachalote", "Ballena azul", "Rinoceronte blanco", "Elefante africano"], correcta: 3, explicacion: "La ballena azul es el animal mÃ¡s grande del planeta, pero no es terrestre. El animal terrestre mÃ¡s grande es el elefante africano.", pista: "Es un gigante que vive en tierra firme." },
  ], 
    media: [
    { pregunta: "Si tiras dos dados a la vez Â¿QuÃ© suma es la mÃ¡s probable?", opciones: ["7","8","9","12"], correcta: 0, explicacion: "La suma 7 es la mÃ¡s probable porque se puede obtener de 6 formas distintas (1+6, 2+5, 3+4, 4+3, 5+2, 6+1), mÃ¡s que cualquier otra suma posible al lanzar dos dados.", pista: "Es el punto medio exacto entre el mÃ­nimo y el mÃ¡ximo que pueden sumar dos dados." },
    { pregunta: "Â¿CuÃ¡l de los siguientes nÃºmeros romanos es el mayor?", opciones: ["XLIX", "LXV", "LXXX", "XC"], correcta: 3, explicacion: "XLIX = 49, LXV = 65, LXXX = 80 y XC = 90. Por lo tanto, XC es el nÃºmero mÃ¡s grande.", pista: "Busca la combinaciÃ³n que mÃ¡s se acerca a cien." },
    { pregunta: "Â¿CuÃ¡l de estos animales no pone huevos?", opciones: ["Ornitorrinco","Equidna","MurciÃ©lago","Tortuga"], correcta: 2, explicacion: "El murciÃ©lago es un mamÃ­fero y, como la mayorÃ­a de ellos, da a luz crÃ­as vivas. El ornitorrinco y la equidna son excepciones curiosas, ya que son mamÃ­feros que sÃ­ ponen huevos.", pista: "Es el Ãºnico de la lista que vuela." },
    { pregunta: "Â¿De quÃ© color es una caja negra de un aviÃ³n?", opciones: ["Naranja","Gris","Azul","Negra"], correcta: 0, explicacion: "Las cajas negras en realidad son de color naranja brillante para facilitar su localizaciÃ³n tras un accidente. El nombre viene de su funciÃ³n, no de su color.", pista: "Se llama de una forma pero se pinta de otra muy diferente, por razones prÃ¡cticas." },
    { pregunta: "Â¿QuÃ© cientÃ­fico desarrollÃ³ la teorÃ­a de la relatividad?", opciones: ["Albert Einstein","Isaac Newton","Nikola Tesla","Stephen Hawking"], correcta: 0, explicacion: "Albert Einstein formulÃ³ la teorÃ­a de la relatividad especial en 1905 y la general en 1915.", pista: "Su apellido es sinÃ³nimo de genio." },
    { pregunta: "Â¿QuÃ© civilizaciÃ³n construyÃ³ la ciudad de Machu Picchu?", opciones: ["Azteca","Maya","Inca","Olmeca"], correcta: 2, explicacion: "Machu Picchu fue construida por el Imperio Inca en el siglo XV y dada a conocer internacionalmente en 1911.", pista: "Es la misma civilizaciÃ³n que dominÃ³ los Andes." },
    { pregunta: "Â¿CuÃ¡ntos meses tienen exactamente 30 dÃ­as?", opciones: ["3", "4", "2", "5"], correcta: 1, explicacion: "Los meses que tienen 30 dÃ­as son abril, junio, septiembre y noviembre, en total 4.", pista: "Son los meses que no llegan a 31 ni bajan a 28." },
    { pregunta: "Â¿QuÃ© ciudad tiene el metro mÃ¡s antiguo del mundo?", opciones: ["ParÃ­s", "Nueva York", "Londres", "BerlÃ­n"], correcta: 2, explicacion: "El metro de Londres abriÃ³ en 1863, siendo el primero del mundo. ParÃ­s abriÃ³ en 1900, BerlÃ­n en 1902 y Nueva York en 1904.", pista: "Su metro se conoce como 'The Tube'."},
  ], dificil: [
    { pregunta: "Â¿CuÃ¡l es el planeta del sistema solar con mÃ¡s satÃ©lites naturales?", opciones: ["JÃºpiter","Saturno","Urano","Neptuno"], correcta: 1, explicacion: "Saturno es actualmente el planeta con mÃ¡s lunas conocidas. Algunas de ellas, como TitÃ¡n, son tan grandes que tienen atmÃ³sfera propia, algo muy poco comÃºn en satÃ©lites. \nSaturno: 274-285 \nJÃºpiter: 95-115 \nUrano: 28-29 \nNeptuno: 16", pista: "El planeta con anillos tambiÃ©n tiene compaÃ±Ã­a." },
    { pregunta: "Â¿CuÃ¡l es el metal mÃ¡s valioso del mundo por peso?", opciones: ["Oro", "Platino", "Rodio", "Paladio"], correcta: 2, explicacion: "El rodio es el metal mÃ¡s valioso por peso debido a su rareza y sus aplicaciones en la industria automotriz para reducir emisiones. Su precio puede superar los 10.000 dÃ³lares por onza. El ranking actual por â‚¬/g es este:\n1. Rodio: 300-500 â‚¬/g\n2. Paladio: 40-80 â‚¬/g\n3. Platino 30-40 â‚¬/g\n4. Oro: 60-70 â‚¬/g", pista: "El mÃ¡s caro no es el mÃ¡s famoso." },
    { pregunta: "Â¿CuÃ¡l de estos planetas del sistema solar es el mÃ¡s frÃ­o?", opciones: ["Neptuno","Urano","Saturno","Marte"], correcta: 1, explicacion: "Urano es el planeta mÃ¡s frÃ­o del sistema solar, con temperaturas que pueden bajar hasta unos -224 Â°C. Aunque Neptuno estÃ¡ mÃ¡s lejos del Sol, Urano emite muy poco calor interno, lo que lo hace mÃ¡s frÃ­o.", pista: "La distancia al Sol no es el Ãºnico factor que decide lo frÃ­o que puede ser un planeta." },
    { pregunta: "Â¿QuÃ© paÃ­s tiene mÃ¡s pirÃ¡mides en su territorio?", opciones: ["Egipto","MÃ©xico","SudÃ¡n","PerÃº"], correcta: 2, explicacion: "Aunque Egipto es el mÃ¡s famoso, SudÃ¡n tiene mÃ¡s pirÃ¡mides debido a la antigua civilizaciÃ³n de Nubia. AsÃ­ actualmente serÃ­a:\nSudan: +200\nEgipto: 118 - 135\nMÃ©xico: 20\nPerÃº: 26", pista: "No es el paÃ­s mÃ¡s famoso por ellas, pero sÃ­ el que mÃ¡s tiene." },
    { pregunta: "Â¿CuÃ¡l es el Ã³rgano mÃ¡s grande del cuerpo humano?", opciones: ["HÃ­gado","Piel","Pulmones","Intestino"], correcta: 1, explicacion: "La piel es el Ã³rgano mÃ¡s grande del cuerpo, con unos 2 metros cuadrados en un adulto promedio.", pista: "Es un Ã³rgano que solemos ignorar." },
    { pregunta: "Â¿CuÃ¡l es el metal mÃ¡s abundante en la corteza terrestre?", opciones: ["Hierro","Calcio","Cobre","Aluminio"], correcta: 3, explicacion: "El aluminio es el metal mÃ¡s abundante en la corteza terrestre, aunque no se encuentra puro de forma natural.", pista: "Es tan comÃºn bajo tierra que supera con creces a los metales que mÃ¡s ves en el dÃ­a a dÃ­a." },
    { pregunta: "Â¿QuÃ© paÃ­s tiene el mayor consumo promedio de chocolate por habitante?", opciones: ["BÃ©lgica", "Alemania", "Suiza", "Austria"], correcta: 2, explicacion: "Suiza suele liderar el consumo de chocolate per cÃ¡pita, con alrededor de 9-11 kg por persona al aÃ±o, aunque algunos aÃ±os BÃ©lgica o Alemania pueden acercarse dependiendo de la fuente y el mÃ©todo de cÃ¡lculo.", pista: "Es un paÃ­s famoso por relojes, montaÃ±asâ€¦ y chocolate." },  
    { pregunta: "Â¿QuÃ© animal puede vivir mÃ¡s tiempo?", opciones: ["Tortuga gigante de las GalÃ¡pagos", "TiburÃ³n de Groenlandia", "Cocodrilo del Nilo", "Ballena azul"], correcta: 1, explicacion: "El tiburÃ³n de Groenlandia es el vertebrado mÃ¡s longevo conocido: puede superar los 300 aÃ±os y algunos estudios estiman mÃ¡s de 400. Las tortugas gigantes de las GalÃ¡pagos rondan los 150-200 aÃ±os, los cocodrilos del Nilo unos 70-100 y la ballena azul unos 80-90.", pista: "Vive en aguas muy frÃ­as y envejece muy, muy despacio." },
  ] },
  "Actualidad":      { 
    facil: [
    { pregunta: "Â¿QuÃ© red social cambiÃ³ su logo azul por una 'X'?", opciones: ["Twitter", "Facebook", "Instagram", "TikTok"], correcta: 0, explicacion: "Twitter pasÃ³ a llamarse X tras el rebranding impulsado por Elon Musk.", pista: "Un conocido empresario tecnolÃ³gico la comprÃ³ y borrÃ³ su identidad de raÃ­z." },
    { pregunta: "Â¿QuÃ© pÃ¡gina web es la mÃ¡s visitada del mundo despuÃ©s de Google?", opciones: ["Facebook", "YouTube", "Amazon", "Wikipedia"], correcta: 1, explicacion: "YouTube es la pÃ¡gina web mÃ¡s visitada del mundo despuÃ©s de Google, con miles de millones de visitas diarias debido a su enorme cantidad de contenido de video.", pista: "Es la web donde el tiempo se te va mirando pantallas." },
    { pregunta: "Â¿QuÃ© red social es la mÃ¡s utilizada por personas mayores de 35 aÃ±os?", opciones: ["TikTok","Twitter/X","Instagram","Facebook"], correcta: 3, explicacion: "Facebook sigue siendo una de las redes sociales mÃ¡s utilizadas por personas mayores de 35 aÃ±os. Es muy popular porque permite mantener contacto fÃ¡cilmente con familia, amigos de toda la vida y antiguos compaÃ±eros. A diferencia de TikTok o Instagram, tiene un uso mÃ¡s sencillo y prÃ¡ctico.", pista: "Es la red donde mÃ¡s gente mantiene contacto con familiares y amigos de siempre." },
    { pregunta: "Â¿QuÃ© misiÃ³n espacial de la NASA busca volver a llevar humanos a la Luna?", opciones: ["Apollo","Voyager","Artemis","Orion"], correcta: 2, explicacion: "El programa Artemis es el sucesor de Apollo y tiene como objetivo volver a llevar astronautas a la Luna, incluyendo la primera mujer y la primera persona de color.", pista: "Su nombre hace referencia a la hermana de Apolo." },
    { pregunta: "Â¿QuÃ© empresa fabrica los iPhone?", opciones: ["Apple","Google","Samsung","Huawei"], correcta: 0, explicacion: "Apple es la empresa responsable de la lÃ­nea de telÃ©fonos iPhone desde 2007.", pista: "Es la misma empresa que fabrica los Mac y los iPad." },
    { pregunta: "Â¿QuÃ© compaÃ±Ã­a desarrolla el sistema operativo Windows?", opciones: ["Apple","Microsoft","IBM","Google"], correcta: 1, explicacion: "Microsoft es la empresa creadora de Windows, el sistema operativo mÃ¡s usado en ordenadores personales.", pista: "Es la misma empresa detrÃ¡s de Xbox." },
    { pregunta: "Â¿QuÃ© empresa es conocida por popularizar los coches elÃ©ctricos en todo el mundo?", opciones: ["Toyota", "Tesla", "BMW", "Renault"], correcta: 1, explicacion: "Tesla impulsÃ³ la popularizaciÃ³n global del coche elÃ©ctrico gracias a modelos como el Model S, 3 y Y, convirtiÃ©ndose en un referente del sector.", pista: "Su fundador es tan famoso como la propia marca." },
    { pregunta: "Â¿En quÃ© ciudad se celebraron los Juegos OlÃ­mpicos de 2024?", opciones: ["ParÃ­s", "Londres", "Tokio", "BerlÃ­n"], correcta: 0, explicacion: "Los Juegos OlÃ­mpicos de 2024 se celebraron en ParÃ­s, Francia.", pista: "Era la segunda vez en el siglo XXI que esta ciudad acogÃ­a los Juegos." },
    ], 
    media: [
    { pregunta: "Â¿QuÃ© estudia la fisiologÃ­a?", opciones: ["El comportamiento humano", "Los organismos vivos y sus funciones", "Los planetas y el universo", "Las rocas y minerales"], correcta: 1, explicacion: "La fisiologÃ­a es la rama de la biologÃ­a que estudia el funcionamiento de los organismos vivos y sus partes, incluyendo procesos como la respiraciÃ³n, circulaciÃ³n y digestiÃ³n.", pista: "No estudia quÃ© somos, sino cÃ³mo funcionamos." },
    { pregunta: "Â¿CuÃ¡l es la pelÃ­cula mÃ¡s taquillera de la historia a nivel mundial (sin ajustar por inflaciÃ³n)?", opciones: ["Los Vengadores(Avengers): Endgame", "Titanic", "Avatar", "Star Wars: The Force Awakens(VII)"], correcta: 2, explicacion: "Avatar es la pelÃ­cula mÃ¡s taquillera de la historia con mÃ¡s de 2.900 millones de dÃ³lares, gracias en parte a varios reestrenos. LlegÃ³ a ser superada brevemente por Avengers: Endgame en 2019, pero recuperÃ³ el primer puesto tras volver a los cines.", pista: "La pelÃ­cula que ganÃ³ gracias a volver a los cines." },
    { pregunta: "Â¿QuÃ© sistema operativo es desarrollado por Google para mÃ³viles?", opciones: ["HarmonyOS","Windows Phone","iOS","Android"], correcta: 3, explicacion: "Android es el sistema operativo mÃ³vil mÃ¡s usado del mundo y fue adquirido por Google en 2005 antes de su gran expansiÃ³n.", pista: "Es el sistema que usan la mayorÃ­a de mÃ³viles que no son de Apple." },
    { pregunta: "Â¿QuÃ© empresa es propietaria de WhatsApp?", opciones: ["Meta","Google","Apple","Telegram"], correcta: 0, explicacion: "WhatsApp fue comprada por Facebook (ahora Meta) en 2014 por unos 19.000 millones de dÃ³lares, una de las mayores adquisiciones tecnolÃ³gicas.", pista: "Es la misma empresa que controla Facebook e Instagram." },
    { pregunta: "Â¿QuÃ© empresa no pertenece al grupo de las llamadas â€œBig Fiveâ€ tecnolÃ³gicas?", opciones: ["Apple","Microsoft","Tesla","Amazon"], correcta: 2, explicacion: "Las llamadas 'Big Five' suelen referirse a Apple, Microsoft, Amazon, Google y Meta. Tesla es muy grande, pero no forma parte de ese grupo clÃ¡sico.", pista: "Es la Ãºnica cuyo negocio principal no es software ni servicios digitales." },
    { pregunta: "Â¿QuÃ© plataforma de streaming ha superado recientemente los 250 millones de suscriptores?", opciones: ["Disney+", "Netflix", "Prime Video", "HBO Max"], correcta: 1, explicacion: "Netflix sigue siendo la plataforma de streaming con mÃ¡s suscriptores del mundo, superando los 250 millones gracias a su catÃ¡logo global.", pista: "Es la plataforma que popularizÃ³ las maratones de series." },
    { pregunta: "Â¿QuÃ© marca de juguetes es considerada la mÃ¡s valiosa del mundo?", opciones: ["Hot Wheels", "Barbie", "Playmobil", "LEGO"], correcta: 3, explicacion: "LEGO es la marca de juguetes mÃ¡s valiosa gracias a sus sets, colaboraciones y pelÃ­culas, superando a Barbie y Playmobil.", pista: "Sus piezas encajan entre sÃ­ desde hace dÃ©cadas." },
    { pregunta: "Â¿QuÃ© saga/franquicia completa tiene la mayor cantidad de permios Ã“scar?", opciones: ["Star Wars","James Bond","Harry Potter","Indiana Jones"], correcta: 0, explicacion: "Star Wars es una de las franquicias con mÃ¡s premios Ã“scar en total, especialmente gracias a sus categorÃ­as tÃ©cnicas como efectos visuales, sonido y banda sonora. El ranking serÃ­a:\nStar Wars: 10-11\nJames Bond: 7-9\nIndiana Jones: 5\nHarry Potter: 0", pista: "Es la saga que empezÃ³ con una pelÃ­cula de 1977." },
    ],
    dificil: [
    { pregunta: "Â¿QuÃ© paÃ­s tiene la mayor producciÃ³n de cafÃ©?", opciones: ["Colombia","Brasil","Vietnam","MÃ©xico"], correcta: 1, explicacion: "Brasil es el mayor productor de cafÃ© del mundo desde hace mÃ¡s de 150 aÃ±os. Produce aproximadamente un tercio del cafÃ© global, destacando especialmente en las variedades arÃ¡bica y robusta.", pista: "Su extensiÃ³n continental y su clima tropical le dan una ventaja difÃ­cil de igualar." },
    { pregunta: "Â¿CuÃ¡ntos elementos quÃ­micos hay en la tabla periÃ³dica?", opciones: ["118", "120", "119", "117"], correcta: 0, explicacion: "Actualmente, la tabla periÃ³dica tiene 118 elementos quÃ­micos oficialmente reconocidos por la IUPAC.", pista: "Es un nÃºmero par que coincide exactamente con el nÃºmero atÃ³mico del Ãºltimo elemento reconocido." },
    { pregunta: "Â¿QuÃ© evento global provocÃ³ una crisis de suministro de chips en 2020-2022?", opciones: ["Guerra comercial","Pandemia de COVID-19","Brexit","Crisis del petrÃ³leo"], correcta: 1, explicacion: "La pandemia alterÃ³ las cadenas de producciÃ³n y aumentÃ³ la demanda de tecnologÃ­a, provocando una escasez global de semiconductores.", pista: "Fue un suceso que afectÃ³ a todo el planeta al mismo tiempo." },
    { pregunta: "Â¿QuÃ© paÃ­s lidera actualmente la producciÃ³n mundial de semiconductores avanzados?", opciones: ["TaiwÃ¡n","Corea del Sur","Estados Unidos","China"], correcta: 0, explicacion: "TaiwÃ¡n, a travÃ©s de empresas como TSMC, domina la fabricaciÃ³n de chips avanzados esenciales para la tecnologÃ­a moderna.", pista: "Es una isla de tamaÃ±o modesto cuyo peso geopolÃ­tico proviene casi por completo de esta industria." },
    { pregunta: "Â¿QuÃ© empresa domina actualmente el mercado de computaciÃ³n en la nube?", opciones: ["Google Cloud", "Microsoft Azure", "IBM Cloud", "Amazon Web Services"], correcta: 3, explicacion: "Amazon Web Services (AWS) mantiene el liderazgo global en servicios de computaciÃ³n en la nube, seguido por Microsoft Azure.", pista: "Es la misma empresa que empezÃ³ vendiendo libros online." },
    { pregunta: "Â¿QuÃ© canciÃ³n es actualmente el video mÃ¡s visto de YouTube?", opciones: ["Baby Shark Dance - Pinkfong", "Despacito - Luis Fonsi", "Gangnam Style - PSY", "See You Again - Wiz Khalifa ft. Charlie Puth"], correcta: 0, explicacion: "Baby Shark Dance es el video mÃ¡s visto de YouTube, muy por encima de Ã©xitos como Despacito, See You Again y Gangnam Style. El ranking seria:\n1. Baby Shark: +16 mil millones.\n2. Despacito: +9 mil millones.\n3. See You Again: +7 mil millones.\n4. Gangnam Style: +5 mil millones.", pista: "Es un tema infantil que se volviÃ³ viral en todo el mundo." },    
    { pregunta: "Â¿QuÃ© franquicia es la mÃ¡s rentable econÃ³micamente de la historia del entretenimiento?", opciones: ["Marvel", "Star Wars", "PokÃ©mon", "Harry Potter"], correcta: 2, explicacion: "PokÃ©mon es la franquicia multimedia mÃ¡s rentable de la historia, superando a Marvel y Star Wars gracias a sus videojuegos, cartas coleccionables, series, pelÃ­culas y merchandising global. Se estima que ha generado mÃ¡s de 100.000 millones de dÃ³lares en total.", pista: "NaciÃ³ en videojuegos y hoy estÃ¡ en todas partes."},
    { pregunta: "Â¿QuÃ© paÃ­s prohibiÃ³ TikTok en dispositivos gubernamentales?", opciones: ["Reino Unido", "CanadÃ¡", "Estados Unidos", "Australia"], correcta: 2, explicacion: "Estados Unidos fue uno de los primeros paÃ­ses en restringir TikTok en dispositivos oficiales por preocupaciones de seguridad de datos. El debate se intensificÃ³ porque la app pertenece a la empresa china ByteDance, lo que generÃ³ tensiones geopolÃ­ticas y tecnolÃ³gicas. Reino Unido, CanadÃ¡ y Australia aplicaron medidas similares, pero mÃ¡s tarde.", pista: "Es el paÃ­s de la lista que mÃ¡s ha presionado por temas de ciberseguridad."},
   ] },
  "GeografÃ­a":       { 
    facil: [
    { pregunta: "Â¿CuÃ¡l es la capital de Islandia?", opciones: ["Reikiavik", "Oslo", "Helsinki", "Copenhague"], correcta: 0, explicacion: "Reikiavik es la capital de Islandia, conocida por su belleza natural y su cultura vibrante.", pista: "Es la capital que suena tan frÃ­a como el paÃ­s al que pertenece." },
    { pregunta: "Â¿CuÃ¡l es la capital de Brasil?", opciones: ["RÃ­o de Janeiro", "SÃ£o Paulo", "Brasilia", "Salvador"], correcta: 2, explicacion: "Brasilia es la capital de Brasil desde 1960. Fue construida especÃ­ficamente para ser la capital y ayudar a desarrollar el interior del paÃ­s, reemplazando a RÃ­o de Janeiro.", pista: "La capital no es la ciudad mÃ¡s turÃ­stica, sino la mÃ¡s planificada." },
    { pregunta: "Â¿QuÃ© paÃ­s tiene forma de bota?", opciones: ["Grecia","Italia","Chile","Portugal"], correcta: 1, explicacion: "Italia es famosa por su forma geogrÃ¡fica en el mapa, que recuerda a una bota pateando la isla de Sicilia.", pista: "En el mapa parece que estÃ¡ dando una patada a una isla." },
    { pregunta: "Â¿QuÃ© continente es el mÃ¡s grande del mundo?", opciones: ["Asia","Ãfrica","Europa","AmÃ©rica"], correcta: 0, explicacion: "Asia es el continente mÃ¡s grande tanto en superficie como en poblaciÃ³n, y alberga paÃ­ses como China e India.", pista: "Es el continente donde viven las dos naciones mÃ¡s pobladas." },
    { pregunta: "Â¿En quÃ© paÃ­s se encuentra la Gran Muralla?", opciones: ["JapÃ³n", "China", "Corea del Sur", "India"], correcta: 1, explicacion: "La Gran Muralla China es una de las construcciones mÃ¡s famosas del mundo y se extiende por miles de kilÃ³metros.", pista: "Es una de las estructuras mÃ¡s largas jamÃ¡s construidas." },
    { pregunta: "Â¿QuÃ© ocÃ©ano estÃ¡ entre AmÃ©rica y Europa?", opciones: ["Ãndico", "PacÃ­fico", "AtlÃ¡ntico", "Ãrtico"], correcta: 2, explicacion: "El ocÃ©ano AtlÃ¡ntico separa AmÃ©rica de Europa y Ãfrica, siendo el segundo mÃ¡s grande del mundo.", pista: "Es el ocÃ©ano que cruzaban los barcos rumbo al 'nuevo mundo'." },
    { pregunta: "Â¿En quÃ© continente se encuentra Egipto?", opciones: ["Asia", "Europa", "Ãfrica", "OceanÃ­a"], correcta: 2, explicacion: "Egipto estÃ¡ ubicado en el noreste de Ãfrica, aunque la penÃ­nsula del SinaÃ­ conecta con Asia.", pista: "Es el mismo continente donde se encuentra el desierto del Sahara." },
    { pregunta: "Â¿CuÃ¡l es la capital de TurquÃ­a?", opciones: ["Estambul", "Ankara", "Esmirna", "Bursa"], correcta: 1, explicacion: "Aunque muchos piensan en Estambul, la capital oficial de TurquÃ­a es Ankara desde 1923.", pista: "No es la ciudad mÃ¡s famosa del paÃ­s, pero sÃ­ la capital." },
    ], 
    media: [
    { pregunta: "Â¿QuÃ© paÃ­s es conocido como 'la tierra del sol naciente'?", opciones: ["China", "JapÃ³n", "Corea del Sur", "Tailandia"], correcta: 1, explicacion: "JapÃ³n es conocido como 'la tierra del sol naciente' porque su nombre en japonÃ©s (Nihon o Nippon) significa literalmente 'origen del sol'. Esto se debe a su ubicaciÃ³n al este de China, desde donde se ve salir el sol.", pista: "El nombre del paÃ­s ya apunta hacia el amanecer." },
    { pregunta: "Â¿De quÃ© paÃ­s forma parte Groenlandia?", opciones: ["Dinamarca", "Noruega", "Suecia", "Finlandia"], correcta: 0, explicacion: "Groenlandia es una regiÃ³n autÃ³noma dentro del Reino de Dinamarca. Aunque tiene su propio gobierno, sigue siendo parte de Dinamarca en tÃ©rminos de relaciones internacionales y defensa.", pista: "Pertenece a un paÃ­s europeo mÃ¡s pequeÃ±o que la isla." },
    { pregunta: "Â¿QuÃ© paÃ­s tiene la mayor poblaciÃ³n del mundo actualmente?", opciones: ["China","Estados Unidos","India","Indonesia"], correcta: 2, explicacion: "India superÃ³ a China recientemente como el paÃ­s mÃ¡s poblado del mundo, con mÃ¡s de 1.400 millones de habitantes.", pista: "Es el paÃ­s donde viven mÃ¡s de mil millones de personas y sigue creciendo rÃ¡pido." },
    { pregunta: "Â¿CuÃ¡l es la capital de Australia?", opciones: ["SÃ­dney","Melbourne","Canberra","Perth"], correcta: 2, explicacion: "Mucha gente piensa que es SÃ­dney o Melbourne, pero la capital es Canberra. Se eligiÃ³ como punto intermedio entre ambas ciudades para evitar rivalidades.", pista: "No es la ciudad mÃ¡s famosa, sino la mÃ¡s neutral." },
    { pregunta: "Â¿CuÃ¡l es el paÃ­s mÃ¡s pequeÃ±o del mundo?", opciones: ["MÃ³naco","San Marino","Liechtenstein","Vaticano"], correcta: 3, explicacion: "El Vaticano es el paÃ­s mÃ¡s pequeÃ±o del mundo, tanto en superficie como en poblaciÃ³n, y estÃ¡ dentro de la ciudad de Roma.", pista: "Es tan pequeÃ±o que estÃ¡ dentro de otra ciudad." },
    { pregunta: "Â¿CuÃ¡l de estas NO forma parte de las 7 maravillas del mundo moderno?", opciones: ["Petra", "La Alhambra", "Cristo Redentor", "ChichÃ©n ItzÃ¡"], correcta: 1, explicacion: "Las 7 maravillas del mundo moderno son: Petra, ChichÃ©n ItzÃ¡, Cristo Redentor, Coliseo romano, Gran Muralla China, Machu Picchu y el Taj Mahal. La Alhambra, aunque muy famosa, no forma parte de esta lista.", pista: "Es un monumento europeo muy visitado que se quedÃ³ fuera de la votaciÃ³n final." },
    { pregunta: "Â¿En quÃ© paÃ­s se encuentra el monte Everest?", opciones: ["India", "ButÃ¡n", "China", "Nepal"], correcta: 3, explicacion: "El monte Everest se encuentra en la frontera entre Nepal y China, pero la mayorÃ­a de su ascenso se realiza desde el lado nepalÃ­.", pista: "Es el paÃ­s desde donde parten la mayorÃ­a de expediciones." },
    { pregunta: "Â¿CuÃ¡l es la capital de CanadÃ¡?", opciones: ["Toronto", "Vancouver", "Ottawa", "Montreal"], correcta: 2, explicacion: "Ottawa es la capital de CanadÃ¡, aunque Toronto sea la ciudad mÃ¡s grande.", pista: "No es la ciudad mÃ¡s famosa del paÃ­s, pero sÃ­ la capital." },
    ], 
    dificil: [
    { pregunta: "Â¿QuÃ© paÃ­s tiene la mayor altitud media?", opciones: ["Nepal", "TÃ­bet (China)", "ButÃ¡n", "PerÃº"], correcta: 1, explicacion: "El TÃ­bet, una regiÃ³n autÃ³noma de China, tiene la mayor altitud media del mundo, con aproximadamente 4.500 metros sobre el nivel del mar. Esto se debe a su ubicaciÃ³n en la meseta tibetana, rodeada por las montaÃ±as mÃ¡s altas del mundo.", pista: "La clave estÃ¡ en la meseta mÃ¡s alta del mundo." },
    { pregunta: "Â¿CuÃ¡l es la catarata mÃ¡s alta del mundo?", opciones: ["NiÃ¡gara", "IguazÃº", "Ãngel", "Victoria"], correcta: 2, explicacion: "El Salto Ãngel, ubicado en Venezuela, es la catarata mÃ¡s alta del mundo con 979 metros de altura total, incluyendo una caÃ­da continua de 807 metros.", pista: "El nombre ya sugiere una caÃ­da enorme." },
    { pregunta: "Â¿Con cuÃ¡ntos paÃ­ses hace frontera EspaÃ±a?", opciones: ["2","3","4","5"], correcta: 3, explicacion: "EspaÃ±a hace frontera con 5 paÃ­ses: Portugal, Francia, Andorra, Marruecos (en Ceuta y Melilla) y el Reino Unido (en Gibraltar). Es una de las fronteras mÃ¡s variadas de Europa por su mezcla de territorios continentales y enclaves.", pista: "Incluye un pequeÃ±o territorio britÃ¡nico y dos ciudades en Ãfrica." },
    { pregunta: "Â¿QuÃ© paÃ­s tiene la mayor cantidad de islas del mundo?", opciones: ["Suecia","Filipinas","Indonesia","CanadÃ¡"], correcta: 0, explicacion: "Suecia tiene mÃ¡s de 200.000 islas, muchas de ellas deshabitadas. Es un dato sorprendente porque solemos asociar este rÃ©cord a paÃ­ses tropicales como Indonesia.", pista: "No es tropical, pero tiene miles y miles de pequeÃ±as islas." },
    { pregunta: "Â¿CuÃ¡l es el desierto mÃ¡s grande del mundo?", opciones: ["AntÃ¡rtida","Gobi","Sahara","Kalahari"], correcta: 0, explicacion: "Aunque no lo parezca, la AntÃ¡rtida es un desierto por su baja precipitaciÃ³n, y es el mÃ¡s grande del planeta. Se considera desierto porque recibe menos de 50 mm de precicitaciÃ³n anual en su interior, la definiciÃ³n se basa en la aridez, no en el calor.", pista: "Es un desierto, pero no es cÃ¡lido." },
    { pregunta: "Â¿QuÃ© paÃ­s tiene dos capitales principales (constitucional y administrativa)?", opciones: ["SudÃ¡frica", "Bolivia", "PaÃ­ses Bajos", "BenÃ­n"], correcta: 1, explicacion: "Bolivia tiene dos capitales principales: Sucre (capital constitucional) y La Paz (sede del gobierno). Otros paÃ­ses, como SudÃ¡frica, tambiÃ©n cuentan con varias capitales con distintas funciones.", pista: "Una capital es histÃ³rica, la otra es donde se gobierna."},
    { pregunta: "Â¿CuÃ¡l de estos paÃ­ses NO tiene salida al mar?", opciones: ["Bolivia", "SudÃ¡n", "Camboya", "Uruguay"], correcta: 0, explicacion: "Bolivia es un paÃ­s sin salida al mar desde la Guerra del PacÃ­fico. SudÃ¡n tiene costa en el Mar Rojo, Camboya en el Golfo de Tailandia y Uruguay en el AtlÃ¡ntico.", pista: "PerdiÃ³ su salida al mar hace mÃ¡s de un siglo." },
    { pregunta: "Â¿CuÃ¡l es la capital mÃ¡s alta del mundo?", opciones: ["Quito (Ecuador)", "La Paz (Bolivia)", "BogotÃ¡ (Colombia)", "AdÃ­s Abeba (EtiopÃ­a)"], correcta: 1, explicacion: "La Paz, sede del gobierno de Bolivia, se encuentra a unos 3.640 metros sobre el nivel del mar, lo que la convierte en la capital mÃ¡s alta del mundo. Quito estÃ¡ a 2.850 m, BogotÃ¡ a 2.640 m y AdÃ­s Abeba a 2.355 m.", pista: "Su paÃ­s es conocido por tener el salar mÃ¡s grande del mundo." },
    ] },
  "Bandas sonoras":  { 
    facil: [
    { pregunta: "Â¿A quÃ© pelÃ­cula pertenece esta banda sonora?", audio: "audios/bso/StarWarsDuel.mp3", trackName: "Star Wars\n\n 'Duel of the Fates' fue compuesta por John Williams y destaca por su coro en sÃ¡nscrito, algo poco habitual en la saga. Se utiliza en uno de los duelos mÃ¡s intensos y simboliza el destino y el conflicto entre el bien y el mal.", pista: "Si te imaginas un duelo con capas y energÃ­a antigua, vas bien." },
    { pregunta: "Â¿A quÃ© pelÃ­cula pertenece esta banda sonora?", audio: "audios/bso/LOTRHobbits.mp3", trackName: "El SeÃ±or de los Anillos\n\n 'Concerning Hobbits' fue compuesta por Howard Shore y representa la vida tranquila de la Comarca. Su uso de instrumentos folk transmite calidez, sencillez y un ambiente acogedor muy caracterÃ­stico de los hobbits.", pista: "Si te suena a vida tranquila en un lugar verde, ya estÃ¡s cerca." },
    { pregunta: "Â¿A quÃ© pelÃ­cula pertenece esta banda sonora?", audio: "audios/bso/Gladiator.mp3", trackName: "Gladiator\n\n La banda sonora fue compuesta por Hans Zimmer junto a Lisa Gerrard. El tema principal mezcla orquesta con voces etÃ©reas en un idioma inventado, lo que le da su sonido tan Ã©pico y emocional. Se ha usado muchas veces en trailers por su gran impacto dramÃ¡tico.", pista: "La mÃºsica suena a honor, batalla y destino marcado." },
    { pregunta: "Â¿A quÃ© pelÃ­cula pertenece esta banda sonora?", audio: "audios/bso/Titanic.mp3", trackName: "Titanic\n\n La banda sonora fue compuesta por James Horner y el tema principal 'My Heart Will Go On' es interpretado por CÃ©line Dion. La melodÃ­a del silbido de flauta estÃ¡ inspirada en instrumentos tradicionales irlandeses, reflejando la historia de amor y el origen del barco.", pista: "La melodÃ­a suena tan trÃ¡gica como la historia que acompaÃ±a." },
    { pregunta: "Â¿A quÃ© pelÃ­cula pertenece esta banda sonora?", audio: "audios/bso/HarryPotter.mp3", trackName: "Harry Potter\n\n La mÃºsica fue compuesta por John Williams y este tema, conocido como Hedwig's Theme, es el principal de la saga. Se reconoce por su sonido mÃ¡gico de celesta y se reutiliza en todas las pelÃ­culas como sÃ­mbolo del mundo mÃ¡gico.", pista: "La melodÃ­a suena tan mÃ¡gica como el mundo que representa." },
    { pregunta: "Â¿A quÃ© pelÃ­cula pertenece esta banda sonora?", audio: "audios/bso/IndianaJones.mp3", trackName: "Indiana Jones\n\n La mÃºsica fue compuesta por John Williams. El famoso 'Raiders March' combina una parte heroica con otra triunfal, representando el espÃ­ritu aventurero y carismÃ¡tico del personaje.", pista: "Suena a aventura, peligro y un sombrero muy famoso." },
    { pregunta: "Â¿A quÃ© pelÃ­cula pertenece esta banda sonora?", audio: "audios/bso/ET.mp3", trackName: "E.T.\n\n La mÃºsica fue compuesta por John Williams. Su tema principal es uno de los mÃ¡s emotivos del cine, especialmente en la escena de la bicicleta volando, donde la mÃºsica se sincroniza perfectamente con la imagen.", pista: "La melodÃ­a suena a amistad y a algo que viene de muy lejos." },
    { pregunta: "Â¿A quÃ© pelÃ­cula pertenece esta banda sonora?", audio: "audios/bso/ElPadrino.mp3", trackName: "El Padrino\n\n La mÃºsica fue compuesta por Nino Rota. Su tema principal tiene un tono melancÃ³lico y reconocible que refleja el drama y la tragedia de la familia Corleone.", pista: "La melodÃ­a suena a familia, poder y tragedia." },
    ], 
    media: [
    { pregunta: "Â¿A quÃ© pelÃ­cula pertenece esta banda sonora?", audio: "audios/bso/RegresoAlFuturo.mp3", trackName: "Regreso al Futuro\n\n La mÃºsica fue compuesta por Alan Silvestri. Su tema principal combina aventura y ciencia ficciÃ³n, y se ha convertido en uno de los mÃ¡s reconocibles del cine por su energÃ­a y sensaciÃ³n de viaje en el tiempo.", pista: "La mÃºsica parece avanzar igual que la historia." },
    { pregunta: "Â¿A quÃ© pelÃ­cula pertenece esta banda sonora?", audio: "audios/bso/Interstellar.mp3", trackName: "Interstellar\n\n La mÃºsica fue compuesta por Hans Zimmer y destaca por el uso del Ã³rgano, creando un sonido Ãºnico y profundo. Este enfoque transmite la inmensidad del espacio y la carga emocional de la historia.", pista: "La mÃºsica parece tan grande como el espacio que describe." },
    { pregunta: "Â¿A quÃ© pelÃ­cula pertenece esta banda sonora?", audio: "audios/bso/Piratasdelcaribe.mp3", trackName: "Piratas del Caribe\n\n La saga de Piratas del Caribe tiene mÃºsica compuesta por Hans Zimmer y Klaus Badelt. Aunque 'One Day' no es el tema principal, se asocia a la banda sonora por su estilo Ã©pico y emocional. La mÃºsica mezcla orquesta con percusiÃ³n potente para transmitir aventura y mar abierto.", pista: "Suena a aventura en alta mar y a personajes muy peculiares." },
    { pregunta: "Â¿A quÃ© pelÃ­cula pertenece esta banda sonora?", audio: "audios/bso/Lotr.mp3", trackName: "El SeÃ±or De Los Anillos\n\n La mÃºsica de esta escena fue compuesta por Howard Shore. Es uno de los momentos mÃ¡s Ã©picos de la saga, con una orquestaciÃ³n intensa y percusiÃ³n constante. El tema mezcla tensiÃ³n y heroÃ­smo para reflejar la urgencia de la caza de los Uruk-Hai en Rohan.", pista: "Suena a una misiÃ³n urgente en un mundo lleno de criaturas fantÃ¡sticas." },
    { pregunta: "Â¿A quÃ© serie pertenece esta banda sonora?", audio: "audios/bso/JuegoDeTronos.mp3", trackName: "Juego de Tronos\n\n La mÃºsica fue compuesta por Ramin Djawadi. El tema inicial destaca por su ritmo constante y su construcciÃ³n progresiva, y el mapa del opening cambia segÃºn las localizaciones de cada episodio.", pista: "La melodÃ­a suena a reinos, traiciones y tronos disputados." },
    { pregunta: "Â¿A quÃ© pelÃ­cula pertenece esta banda sonora?", audio: "audios/bso/StarWars.mp3", trackName: "Star Wars\n\n La mÃºsica fue compuesta por John Williams. 'Across the Stars' es una melodÃ­a romÃ¡ntica y trÃ¡gica que representa la relaciÃ³n entre Anakin y PadmÃ© y anticipa su destino.", pista: "Narra una historia de amor de otro mundo, entre dos personas de bandos que no deberÃ­an estar juntas." },
    { pregunta: "Â¿A quÃ© pelÃ­cula pertenece esta banda sonora?", audio: "audios/bso/JurassicPark.mp3", trackName: "Jurassic Park\n\n La mÃºsica fue compuesta por John Williams. El tema principal transmite asombro y grandeza, acompaÃ±ando la primera vez que se ven los dinosaurios en pantalla.", pista: "La melodÃ­a suena a criaturas enormes que vuelven a la vida." },
    { pregunta: "Â¿A quÃ© pelÃ­cula pertenece esta banda sonora?", audio: "audios/bso/Avengers.mp3", trackName: "Avengers (Marvel)\n\n La mÃºsica fue compuesta por Alan Silvestri. El tema principal se ha convertido en el himno del equipo, destacando por su tono heroico y Ã©pico en las escenas de uniÃ³n de los Vengadores.", pista: "La mÃºsica reÃºne a hÃ©roes muy distintos cuando todo se vuelve Ã©pico." },
    ], 
    dificil: [
    { pregunta: "Â¿A quÃ© pelÃ­cula pertenece esta banda sonora?", audio: "audios/bso/TopGun.mp3", trackName: "Top Gun\n\n 'Top Gun Anthem', compuesta por Harold Faltermeyer, es uno de los temas mÃ¡s icÃ³nicos de los aÃ±os 80. Su sonido de guitarra elÃ©ctrica le da un estilo inconfundible asociado a la aviaciÃ³n y la acciÃ³n.", pista: "La guitarra te lleva directo al cieloâ€¦ literalmente." },
    { pregunta: "Â¿A quÃ© pelÃ­cula pertenece esta banda sonora?", audio: "audios/bso/Braveheart.mp3", trackName: "Braveheart\n\n 'For the Love of a Princess' fue compuesta por James Horner. Es una pieza emocional que mezcla melodÃ­as celtas con orquesta, reflejando el lado mÃ¡s Ã­ntimo y romÃ¡ntico de la historia.", pista: "La historia transcurre en el norte de las islas britÃ¡nicas y gira en torno a la libertad." },
    { pregunta: "Â¿A quÃ© pelÃ­cula pertenece esta banda sonora?", audio: "audios/bso/Dune.mp3", trackName: "Dune\n\n La banda sonora fue compuesta por Hans Zimmer. Para recrear el sonido del desierto, su equipo pasÃ³ semanas viviendo en desiertos como el de Jordania para capturar sonidos, inspirarse en los vientos y el silencio del paisaje real. El tema usa texturas graves y sonidos orgÃ¡nicos para transmitir la inmensidad y peligro del planeta Arrakis.", pista: "La mÃºsica suena tan Ã¡rida como el desierto que representa." },
    { pregunta: "Â¿A quÃ© pelÃ­cula pertenece esta banda sonora?", audio: "audios/bso/Troya.mp3", trackName: "Troya\n\n La mÃºsica de esta escena fue compuesta por James Horner. Destaca por el uso de voces femeninas agudas y coros suaves que aportan un tono trÃ¡gico y solemne al duelo entre HÃ©ctor y Aquiles. Horner usa la voz como un 'instrumento humano' para reforzar la sensaciÃ³n de destino y pÃ©rdida en uno de los momentos mÃ¡s emotivos de la pelÃ­cula.", pista: "La mÃºsica acompaÃ±a una guerra Ã©pica de la antigÃ¼edad que empezÃ³ por el rapto de una mujer." },
    { pregunta: "Â¿A quÃ© pelÃ­cula pertenece esta banda sonora?", audio: "audios/bso/ElHobbit.mp3", trackName: "El Hobbit\n\n 'Misty Mountains' es interpretada por los enanos en la pelÃ­cula y destaca por su tono grave y coral. Transmite nostalgia y el deseo de recuperar su hogar perdido.", pista: "Los que la cantan llevan siglos esperando recuperar el hogar que les arrebataron." },
    { pregunta: "Â¿A quÃ© pelÃ­cula pertenece esta banda sonora?", audio: "audios/bso/Avatar.mp3", trackName: "Avatar\n\n La mÃºsica fue compuesta por James Horner. Este tema acompaÃ±a el momento en que Jake se integra en los Na'vi, usando coros y sonidos tribales que refuerzan la conexiÃ³n con la naturaleza.", pista: "La mÃºsica mezcla naturaleza y un mundo completamente nuevo." },
    { pregunta: "Â¿A quÃ© pelÃ­cula pertenece esta banda sonora?", audio: "audios/bso/Origen.mp3", trackName: "Origen (Inception)\n\n La mÃºsica fue compuesta por Hans Zimmer. El tema 'Time' es famoso por su construcciÃ³n progresiva, empezando suave y creciendo hasta un final muy intenso y emocional.", pista: "La mÃºsica suena a capas de realidad que se mezclan en el mundo de los sueÃ±os." },
    { pregunta: "Â¿A quÃ© pelÃ­cula pertenece esta banda sonora?", audio: "audios/bso/UltimoMohicano.mp3", trackName: "El Ãºltimo mohicano\n\n 'Promontory' es uno de los temas mÃ¡s icÃ³nicos de la pelÃ­cula. Destaca por su ritmo constante y su mezcla de mÃºsica orquestal con influencias celtas, acompaÃ±ando una de las escenas finales mÃ¡s intensas.", pista: "La pelÃ­cula estÃ¡ ambientada en el siglo XVIII, en medio de conflictos entre colonos y pueblos nativos." },
    ] },
  "Disney":          { 
    facil: [
    { pregunta: "Â¿A quÃ© pelÃ­cula de Disney pertenece esta banda sonora?", audio: "audios/disney/Hercules.mp3", trackName: "HÃ©rcules\n\n 'De cero a hÃ©roe' es una canciÃ³n muy dinÃ¡mica que narra el ascenso de HÃ©rcules a la fama. Su estilo inspirado en el gÃ³spel la hace Ãºnica dentro de Disney.", pista: "El estilo musical viene del gÃ³spel americano, aunque la historia sea de la mitologÃ­a griega." },
    { pregunta: "Â¿A quÃ© pelÃ­cula de Disney pertenece esta banda sonora?", audio: "audios/disney/TarzanSaber.mp3", trackName: "TarzÃ¡n\n\n 'Lo extraÃ±o que soy', interpretada por Phil Collins, refleja el conflicto interno de TarzÃ¡n al no sentirse parte de ningÃºn mundo. Destaca por su tono emocional y reflexivo.", pista: "La canciÃ³n habla de no encajar del todo en ningÃºn sitio." },
    { pregunta: "Â¿A quÃ© pelÃ­cula de Disney pertenece esta banda sonora?", audio: "audios/disney/Librodelaselva.mp3", trackName: "El Libro de la Selva\n\n Esta canciÃ³n pertenece a la pelÃ­cula de Disney El Libro de la Selva (1967) y es interpretada por Baloo. Su estilo alegre mezcla jazz y swing, y transmite la idea de vivir con lo esencial. Curiosamente, se convirtiÃ³ en una de las canciones mÃ¡s icÃ³nicas de Disney por su mensaje simple y optimista sobre disfrutar la vida sin preocupaciones.", pista: "Es una canciÃ³n que invita a vivir sin complicaciones." },
    { pregunta: "Â¿A quÃ© pelÃ­cula de Disney pertenece esta banda sonora?", audio: "audios/disney/Aladdin.mp3", trackName: "Aladdin\n\n CanciÃ³n interpretada por Peabo Bryson y Regina Belle en la versiÃ³n original de Disney. GanÃ³ el Ã“scar a Mejor CanciÃ³n Original en 1993. Su melodÃ­a estÃ¡ inspirada en baladas pop romÃ¡nticas de los 90, y destaca por su crescendo que transmite la sensaciÃ³n de libertad y aventura al volar sobre Agrabah en la alfombra mÃ¡gica.", pista: "La historia sigue a un joven ladrÃ³n y una princesa." },
    { pregunta: "Â¿A quÃ© pelÃ­cula de Disney pertenece esta banda sonora?", audio: "audios/disney/TarzanDosMundos.mp3", trackName: "TarzÃ¡n\n\n 'Dos mundos' es una de las canciones principales de TarzÃ¡n (1999), interpretada por Phil Collins. Combina percusiÃ³n potente y estilo pop para reflejar el conflicto entre el mundo humano y la naturaleza.", pista: "El protagonista naciÃ³ en un mundo pero creciÃ³ en otro completamente diferente." },
    { pregunta: "Â¿A quÃ© pelÃ­cula de Disney pertenece esta banda sonora?", audio: "audios/disney/Labellaylabestia.mp3", trackName: "La Bella y la Bestia\n\n Esta versiÃ³n interpretada por Bely Basarte adapta el clÃ¡sico tema de la pelÃ­cula.\nLa canciÃ³n destaca por su tono romÃ¡ntico y su mensaje sobre ver mÃ¡s allÃ¡ de las apariencias.", pista: "Habla de descubrir la belleza donde no parece haberla." },
    { pregunta: "Â¿A quÃ© pelÃ­cula de Disney pertenece esta banda sonora?", audio: "audios/disney/ReyLeonHM.mp3", trackName: "El Rey LeÃ³n\n\n 'Hakuna Matata' es una de las canciones mÃ¡s icÃ³nicas de la pelÃ­cula. Su estilo alegre y desenfadado transmite una filosofÃ­a de vida sin preocupaciones, convirtiÃ©ndose en una de las frases mÃ¡s reconocidas de Disney.", pista: "Habla de vivir sin preocupaciones, literalmente." },
    { pregunta: "Â¿A quÃ© pelÃ­cula de Disney pertenece esta banda sonora?", audio: "audios/disney/PeterPanEstrella.mp3", trackName: "Peter Pan\n\n 'Aquella estrella de allÃ¡', interpretada por Gisela en la versiÃ³n en espaÃ±ol, es una canciÃ³n mÃ¡gica que habla de los sueÃ±os y la imaginaciÃ³n. Representa la ilusiÃ³n de volar hacia Nunca JamÃ¡s.", pista: "La estrella del tÃ­tulo no es de astronomÃ­a, sino del mundo de la fantasÃ­a." },
    ], 
    media: [
    { pregunta: "Â¿A quÃ© pelÃ­cula de Disney pertenece esta banda sonora?", audio: "audios/disney/BellayBestiaAlgoNuevo.mp3", trackName: "La Bella y la Bestia\n\n 'Algo nuevo' es una canciÃ³n alegre que representa el inicio del cambio en la relaciÃ³n entre Bella y Bestia. Su tono optimista marca un punto clave en la historia.", pista: "Dos personajes que parecen incompatibles descubren que tienen mÃ¡s en comÃºn de lo que creÃ­an." },
    { pregunta: "Â¿A quÃ© pelÃ­cula de Disney pertenece esta banda sonora?", audio: "audios/disney/LibroDeLaSelvaElefantes.mp3", trackName: "El Libro de la Selva\n\n La 'Marcha de los elefantes' es un tema con ritmo militar y repetitivo que refleja el orden y la disciplina del grupo. Su estilo es muy reconocible por su tono cÃ³mico.", pista: "Suena a desfile serioâ€¦ pero con animales." },
    { pregunta: "Â¿A quÃ© pelÃ­cula de Disney pertenece esta banda sonora?", audio: "audios/disney/Tarzan.mp3", trackName: "Tarzan\n\n La mÃºsica de TarzÃ¡n (1999) fue compuesta por Phil Collins. Este tema acompaÃ±a una escena llena de acciÃ³n y humor mientras TarzÃ¡n se enfrenta al campamento de cazadores. La banda sonora mezcla percusiÃ³n tribal con rock moderno, algo caracterÃ­stico de toda la pelÃ­cula, que ayudÃ³ a darle un estilo muy reconocible a la historia.", pista: "La percusiÃ³n marca el ritmo de alguien que acaba viviendo entre animales." },
    { pregunta: "Â¿A quÃ© pelÃ­cula de Disney pertenece esta banda sonora?", audio: "audios/disney/Mulan.mp3", trackName: "Mulan\n\n Interpretada por Christina Aguilera en la versiÃ³n internacional, es una balada que expresa el conflicto interno de Mulan entre su identidad y las expectativas sociales. La canciÃ³n destaca por su tono Ã­ntimo y emocional, y se convirtiÃ³ en uno de los temas mÃ¡s icÃ³nicos de Disney por su mensaje de autenticidad y autoaceptaciÃ³n.", pista: "La protagonista siente que lo que ve en el espejo no refleja quiÃ©n es de verdad." },
    { pregunta: "Â¿A quÃ© pelÃ­cula de Disney pertenece esta banda sonora?", audio: "audios/disney/LaSirenita.mp3", trackName: "La Sirenita\n\n 'Bajo el mar' es una de las canciones mÃ¡s icÃ³nicas de la pelÃ­cula. Su estilo caribeÃ±o y ritmo animado acompaÃ±an a SebastiÃ¡n mientras intenta convencer a Ariel de quedarse en el ocÃ©ano.", pista: "La mÃºsica te lleva directo al fondo del ocÃ©ano." },
    { pregunta: "Â¿A quÃ© pelÃ­cula de Disney pertenece esta banda sonora?", audio: "audios/disney/ToyStory.mp3", trackName: "Toy Story\n\n 'Hay un amigo en mÃ­', interpretada por Randy Newman, es el tema principal de la pelÃ­cula. Su estilo sencillo y cercano refuerza la amistad entre Woody y Buzz.", pista: "Habla de una amistad que dura pase lo que pase, por muy pequeÃ±o que sea, incluso aunque no sea una persona como tal." },
    { pregunta: "Â¿A quÃ© pelÃ­cula de Disney pertenece esta banda sonora?", audio: "audios/disney/LibroDeLaSelvaMono.mp3", trackName: "El Libro de la Selva\n\n 'Quiero ser como tÃº' es una canciÃ³n con fuerte influencia de jazz y swing. Interpretada por el Rey Louie, destaca por su ritmo pegadizo y su carÃ¡cter divertido.", pista: "La canta un animal que quiere ser mÃ¡s humano y envidia algo que los humanos tienen y Ã©l no puede conseguir." },
    { pregunta: "Â¿A quÃ© pelÃ­cula de Disney pertenece esta banda sonora?", audio: "audios/disney/Mulan2.mp3", trackName: "MulÃ¡n\n\n 'Voy a hacer un hombre de ti' es una canciÃ³n motivacional que acompaÃ±a el entrenamiento de Mulan. Su ritmo enÃ©rgico y progresivo la convierten en una de las mÃ¡s recordadas de la pelÃ­cula.", pista: "Es un himno de superaciÃ³n cantado por quien menos esperarÃ­a tener razÃ³n para cantarlo." },
    ], 
    dificil: [
    { pregunta: "Â¿A quÃ© pelÃ­cula de Disney pertenece esta banda sonora?", audio: "audios/disney/ReyLeonPreparaos.mp3", trackName: "El Rey LeÃ³n\n\n 'Preparaos' es la canciÃ³n de Scar y destaca por su tono oscuro y teatral. Representa su plan para tomar el poder y es una de las mÃ¡s intensas de la pelÃ­cula.", pista: "Es la canciÃ³n donde el villano planea su momento." },
    { pregunta: "Â¿A quÃ© pelÃ­cula de Disney pertenece esta banda sonora?", audio: "audios/disney/PlanetaDelTesoro.mp3", trackName: "El Planeta del Tesoro\n\n 'Sigo aquÃ­', interpretada por Alex Ubago en la versiÃ³n en espaÃ±ol, es una canciÃ³n que refleja la bÃºsqueda de identidad del protagonista. Su estilo pop la hace muy diferente a otros clÃ¡sicos de Disney.", pista: "Una canciÃ³n pop en una pelÃ­cula de aventura espacial." },
    { pregunta: "Â¿A quÃ© pelÃ­cula de Disney pertenece esta banda sonora?", audio: "audios/disney/Aristogatos.mp3", trackName: "Aristogatos\n\n Esta canciÃ³n pertenece a Los Aristogatos (1970) de Disney y mezcla jazz clÃ¡sico con un estilo muy parisino. Es muy conocida por su pegadizo 'Arriquitiquitiqui', que se ha convertido en una parte icÃ³nica y reconocible del tema. Fue una de las primeras veces que Disney usÃ³ el jazz como elemento central en una banda sonora.", pista: "El estilo suena tan felino como la historia que acompaÃ±a." },
    { pregunta: "Â¿A quÃ© pelÃ­cula de Disney pertenece esta banda sonora?", audio: "audios/disney/PeterPan.mp3", trackName: "Peter Pan\n\n CanciÃ³n de la pelÃ­cula de Disney Peter Pan (1953). Es un tema suave y melÃ³dico que transmite la idea de acompaÃ±ar a alguien siempre, sin importar a dÃ³nde vaya. Destaca por su estilo clÃ¡sico de Disney con arreglos orquestales simples y muy emotivos, propios de la Ã©poca dorada del estudio.", pista: "Es una promesa de no separarse de alguien, vayas donde vayas." },
    { pregunta: "Â¿A quÃ© pelÃ­cula de Disney pertenece esta banda sonora?", audio: "audios/disney/AladdinPrincipeAli.mp3", trackName: "AladdÃ­n\n\n 'El prÃ­ncipe Ali' es una canciÃ³n llena de energÃ­a que presenta a AladdÃ­n en su nueva identidad. Destaca por su estilo festivo y su gran puesta en escena.", pista: "El personaje que presentan esconde su verdadera identidad detrÃ¡s de un nombre inventado." },
    { pregunta: "Â¿A quÃ© pelÃ­cula/s pertenece esta banda sonora?", audio: "audios/disney/IceAgeMatilda.mp3", trackName: "Ice Age / Matilda\n\n 'Send Me On My Way' de Rusted Root se hizo muy popular por aparecer en Ice Age y tambiÃ©n en Matilda. Su ritmo alegre y su estilo folk la convirtieron en una canciÃ³n muy reconocible en el cine.", pista: "Suena en una comedia familiar de los 90 y en una aventura animada con animales prehistÃ³ricos." },
    { pregunta: "Â¿A quÃ© pelÃ­cula pertenece esta banda sonora?", audio: "audios/disney/Shrek.mp3", trackName: "Shrek\n\n 'All Star' de Smash Mouth se hizo mundialmente famosa por su uso en Shrek. Su estilo pop-rock y tono divertido encajan perfectamente con el humor de la pelÃ­cula.", pista: "Suena tan divertida como el ogro protagonista." },
    { pregunta: "Â¿A quÃ© pelÃ­cula de Disney pertenece esta banda sonora?", audio: "audios/disney/LiloyStitch.mp3", trackName: "Lilo & Stitch\n\n 'He Mele No Lilo' es la canciÃ³n de apertura de la pelÃ­cula, interpretada en hawaiano. Refleja la cultura local y el ambiente tropical que define la historia.", pista: "Combina tradiciÃ³n hawaiana con un experimento alienÃ­gena que se convierte en mascota." },
    ] },
  "Adivinanzas":     { 
    facil: [
    { pregunta: "Â¿QuÃ© tiene orejas pero no oye?", explicacion: "La respuesta correcta es 'La taza'. La parte por donde se agarra se llama oreja.", pista: "La 'oreja' aquÃ­ no escucha, solo ayuda a sujetar." },
    { pregunta: "Si una camisa tarda 1 hora en secarse al sol, Â¿cuÃ¡nto tardan 5 camisas en secarse en el mismo tendedero y con el mismo sol?", explicacion: "La respuesta correcta es '1 hora'. No se secan una detrÃ¡s de otra, se secan a la vez.", pista: "No importa cuÃ¡ntas haya si todas reciben el mismo sol."},
    { pregunta: "Â¿QuÃ© tiene hojas pero no es un Ã¡rbol?", explicacion: "La respuesta correcta es 'El Libro'. Los libros tienen hojas (pÃ¡ginas), pero no son plantas.", pista: "Tiene algo que normalmente asocias con la naturaleza, pero suele estar en una estanterÃ­a." },
    { pregunta: "Â¿QuÃ© sube y baja pero nunca se mueve del sitio?", explicacion: "La respuesta correcta es 'Las escaleras'. Suben y bajan las personas, pero la estructura permanece fija.", pista: "Facilita el movimiento de los demÃ¡s, pero ella misma nunca se desplaza." },
    { pregunta: "Â¿QuÃ© usas para ver pero no es un ojo?", explicacion: "La respuesta correcta es 'Las gafas'. Se usan para ver mejor, pero no son ojos.", pista: "Lo llevas en la cara, pero no forma parte de tu cuerpo." },
    { pregunta: "Â¿QuÃ© se moja mientras seca?", explicacion: "La respuesta correcta es 'La toalla'. Absorbe agua mientras seca a alguien.", pista: "Cuanto mÃ¡s ayuda, mÃ¡s hÃºmeda queda." },
    { pregunta: "Un mÃ©dico te da 3 pastillas y te dice que tomes una cada media hora. Â¿CuÃ¡nto tiempo tardas en tomÃ¡rtelas todas?", explicacion: "La respuesta correcta es '1 hora'. Tomas la primera al inicio, la segunda a los 30 minutos y la tercera a los 60 minutos.", pista: "La clave estÃ¡ en cuÃ¡ndo tomas la primera." },
    { pregunta: "En una carrera adelantas al que va segundo. Â¿En quÃ© posiciÃ³n te colocas?", explicacion: "La respuesta correcta es 'En segundo lugar'. Si adelantas al segundo, ocupas su posiciÃ³n; no pasas a ser primero.", pista: "Piensa bien en quÃ© posiciÃ³n estaba el que acabas de dejar atrÃ¡s." }

    ], 
    media: [
    { pregunta: "En una habitaciÃ³n hay una vela encendida, una lÃ¡mpara de gas y una chimenea preparada. Entras con una sola cerilla. Â¿QuÃ© enciendes primero?", explicacion: "La respuesta correcta es 'La cerilla'. Sin encender la cerilla no puedes encender nada mÃ¡s.", pista: "Antes de pensar en quÃ© encender, piensa quÃ© condiciÃ³n hace falta cumplir primero." },
    { pregunta: "Tiene ciudades pero no edificios, rÃ­os pero no agua, y montaÃ±as pero no piedras. Â¿QuÃ© es?", explicacion: "La respuesta correcta es 'Un mapa'. Representa ciudades, rÃ­os y montaÃ±as, pero nada es real.", pista: "Muestra lugares reales, pero ninguno existe ahÃ­." },
    { pregunta: "Una caja sin bisagras, llave ni tapa, pero dentro esconde un tesoro dorado. Â¿QuÃ© es?", explicacion: "La respuesta correcta es 'El huevo'. El tesoro dorado hace referencia a la yema del huevo.", pista: "Lo rompes para descubrir lo que guarda dentro." },
    { pregunta: "Â¿QuÃ© es lo mÃ¡s importante de 'Reus'?", explicacion: "La respuesta correcta es 'La letra U', ya que sin ella se queda en 'Res', es decir, nada en catalÃ¡n.", pista: "Lo importante estÃ¡ en su nombre, afirman los catalanes." },
    { pregunta: "En ABECEDARIO, Â¿cuÃ¡l es la tercera letra?", explicacion: "En 'ABECEDARIO' la tercera letra es la 'E'. La trampa estÃ¡ en fijarse en la palabra, no en el alfabeto.", pista: "La respuesta estÃ¡ delante de tus ojos." },
    { pregunta: "Un aviÃ³n se estrella justo en la frontera entre Francia y EspaÃ±a. Â¿DÃ³nde entierran a los supervivientes?", explicacion: "La respuesta correcta es 'En ningÃºn sitio, a los supervivientes no se les entierra'.", pista: "Hay una palabra que lo cambia todo." },
    { pregunta: "Me ves en el agua, pero nunca me mojo. Me sigues, pero nunca te alcanzo. Â¿QuÃ© soy?", explicacion: "La respuesta correcta es 'El reflejo'. Se ve en el agua o en un espejo, pero nunca se moja ni se puede alcanzar.", pista: "Aparezco en distintos momentos cuando te miras a ti mismo." },
    { pregunta: "Â¿QuÃ© es mÃ¡s ligero que una pluma pero ni el mÃ¡s fuerte puede sostenerlo mucho tiempo?", explicacion: "La respuesta correcta es 'La respiraciÃ³n'. No pesa nada, pero nadie puede mantenerla demasiado.", pista: "No pesa, pero sin ella no duras mucho." },
    { pregunta: "Primero lo chupas para ponerlo tieso y humedecerlo, y con todo eso hay que empujarlo para meterlo. Â¿QuÃ© Ã©s?", explicacion: "La respuesta es 'el hilo' cuando lo metes en el agujero de la aguja.", pista: "Tiene que pasar por el ojo de algo muy fino y puntiagudo." }
    ], 
    dificil: [
    { pregunta: "Un padre y su hijo tienen 36 aÃ±os entre los dos. El padre tiene 30 aÃ±os mÃ¡s que el hijo. Â¿CuÃ¡ntos aÃ±os tiene el hijo?", explicacion: "La respuesta correcta es '3 aÃ±os'. Si el hijo tiene 3, el padre tiene 33. 33 + 3 = 36 y la diferencia es de 30.", pista: "Uno de los dos es mucho mÃ¡s pequeÃ±o de lo que imaginas a primera vista."},
    { pregunta: "Si me tienes, quieres compartirlo. Si lo compartes, dejas de tenerlo. Â¿QuÃ© soy?", explicacion: "La respuesta correcta es 'Un secreto'. En cuanto lo compartes, deja de ser solo tuyo.", pista: "Solo existe mientras no lo compartes."},
    { pregunta: "Un tren elÃ©ctrico va de Madrid a Barcelona a 100 km/h. El viento sopla de Barcelona hacia Madrid a 50 km/h. Â¿Hacia dÃ³nde va el humo del tren?", explicacion: "La respuesta correcta es 'A ninguna parte, porque es elÃ©ctrico y no produce humo'. La trampa estÃ¡ en la palabra 'elÃ©ctrico'.", pista: "La clave estÃ¡ en fijarte en cÃ³mo se mueveâ€¦ o en cÃ³mo no." },  
    { pregunta: "Siempre estÃ¡ en medio del mar pero nunca se moja. Â¿QuÃ© es?", respuesta: "La letra A", explicacion: "La respuesta correcta es 'la letra A'. EstÃ¡ en la palabra 'mar', pero no se moja porque es solo una letra.", pista: "EstÃ¡ en la palabra, no en el agua." },
    { pregunta: "No tengo boca y hablo, no tengo oÃ­dos y escucho, no tengo cuerpo y viajo con el viento repitiÃ©ndome. Â¿QuÃ© soy?", explicacion: "La respuesta correcta es 'El eco'. Es un sonido que se repite sin tener cuerpo fÃ­sico.", pista: "Solo aparece cuando hay algo que lo devuelva." },  
    { pregunta: "Un hombre vive en el dÃ©cimo piso. Cada dÃ­a toma el ascensor hasta la planta baja para ir a trabajar. \nAl volver, si va solo, sube solo hasta la planta 7 y luego usa las escaleras hasta la 10. Pero si va con alguien, sube directamente hasta la 10. Â¿Por quÃ©?", explicacion: "La respuesta correcta es 'Porque es bajito y solo llega al botÃ³n del 7'. Cuando va acompaÃ±ado, alguien mÃ¡s pulsa el 10 por Ã©l.", pista: "La clave estÃ¡ en quÃ© puede alcanzarâ€¦ y quÃ© no." },
    { pregunta: "Â¿QuÃ© cosa es tuya pero otros usan mÃ¡s que tÃº?", explicacion: "La respuesta correcta es 'Tu nombre'. Los demÃ¡s lo dicen mucho mÃ¡s que tÃº mismo.", pista: "Los demÃ¡s lo dicen constantemente, tÃº casi nunca." },
    { pregunta: "Me tienes delante todos los dÃ­as, pero solo me ves si no te miro. Si te miro, no me ves. Â¿QuÃ© soy?", explicacion: "La respuesta correcta es 'El espejo'. Lo ves cuando miras hacia Ã©l, pero si 'Ã©l te mira' (es decir, tÃº miras tu reflejo), ya no piensas en el espejo en sÃ­.", pista: "Solo lo notas cuando no estÃ¡s mirando tu reflejo." }
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
  if (toggleBtn) { toggleBtn.style.display = 'none'; toggleBtn.innerHTML = 'ðŸ“Š Ver estadÃ­sticas'; }
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
        document.getElementById('toggleRevealText').textContent = 'Ocultar pelÃ­cula';

        revealedAudioCells.add(cellKey);
        lastQuestionResolved = true;

        if (currentButton) {
          currentButton.classList.add('disabled');
          currentButton.onclick = null;
          currentButton.setAttribute('aria-disabled', 'true');
        }
      } else {
        // OCULTAR + REACTIVAR el botÃ³n del tablero
        hiddenAnswerDiv.innerText = '';
        hiddenAnswerDiv.style.display = 'none';
        hiddenAnswerDiv.setAttribute('aria-hidden', 'true');
        document.getElementById('toggleRevealText').textContent = 'Revelar pelÃ­cula';

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

  // BotÃ³n "Cambiar pregunta"
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

// Guarda permanentemente la pregunta (canciÃ³n) asignada a cada casilla del tablero
const assignedQuestions = {};   // clave: "fila-columna" â†’ objeto pregunta
// Estado de revelaciÃ³n para preguntas de audio (Bandas sonoras y Disney)
const revealedAudioCells = new Set();   // keys: "row-col"
// Estado persistente para preguntas normales (explicaciÃ³n visible + opciÃ³n seleccionada)
let cellStates = {};   // clave: "row-col" â†’ { explanationVisible: bool, selectedOption: number|null }
let audioPositions = {};  // clave: "row-col" â†’ segundos guardados de la canciÃ³n
let lastPlayedCategory = null;
let lastQuestionResolved = false;
let categoryStats = {};   // { 'GeografÃ­a': { 0: 150, 1: -75, ... }, ... }
let scoreHistory = [[0, 0, 0, 0, 0]]; // snapshot de puntuaciones tras cada ajuste
let finalChart = null;
// Preguntas usadas por categorÃ­a + dificultad (evita duplicados dentro de facil/media/dificil)
let usedQuestionsByPool = {};   // clave: "Categoria-dificultad" â†’ Set de preguntas usadas

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
      showToast('No hay preguntas disponibles para esta categorÃ­a y dificultad.');
      return;
    }

    if (!usedQuestionsByPool[poolKey]) usedQuestionsByPool[poolKey] = new Set();
    const usedSet = usedQuestionsByPool[poolKey];

    let available = pool.filter(question => !usedSet.has(question));

    // === ConfirmaciÃ³n para resetear solo esta categorÃ­a/dificultad ===
    if (available.length === 0) {
      const reset = confirm(
        `Â¡Te has quedado sin preguntas!\n\n` +
        `CategorÃ­a: ${categoryName}\n` +
        `Dificultad: ${difficulty}\n\n` +
        `Â¿Quieres reiniciar SOLO las preguntas de esta categorÃ­a y dificultad\n` +
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
    hintText.innerHTML = q.pista || "Piensa en algo relacionado con la categorÃ­a...";

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
      document.getElementById('toggleRevealText').textContent = 'Revelar pelÃ­cula';
    }

    initVolumeControl();

    // Restaurar estado revelado si ya se habÃ­a abierto antes
    if (isAlreadyRevealed && hiddenAnswerDiv && toggleRevealBtn) {
      setTrackNameHtml(hiddenAnswerDiv, q.trackName);
      hiddenAnswerDiv.style.display = 'block';
      hiddenAnswerDiv.setAttribute('aria-hidden', 'false');
      document.getElementById('toggleRevealText').textContent = 'Ocultar pelÃ­cula';
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

      const letterCategories = ['Cultura general', 'Actualidad', 'GeografÃ­a'];
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

    // Restaurar estado si ya se habÃ­a visto antes
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

  // Toggle ON: mostrar explicaciÃ³n y marcar opciones
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
  
  // Si era pregunta de audio, quitamos tambiÃ©n el estado de "revelada"
  if ((categoryName === 'Bandas sonoras' || categoryName === 'Disney') && revealedAudioCells) {
    revealedAudioCells.delete(cellKey);
  }

  // 3. Reactivamos el botÃ³n del tablero (muy importante)
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
  winnerAnnouncementEl.innerText = `ðŸ† Â¡${winner.name.toUpperCase()} GANA LA PARTIDA! ðŸ†`;
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
    if (toggleBtn) toggleBtn.innerHTML = 'ðŸ“Š Ver estadÃ­sticas';

    const hasCatData = categories.some(cat => categoryStats[cat]);
    const hasHistory = scoreHistory.length > 1;
    if (toggleBtn) toggleBtn.style.display = (hasCatData || hasHistory) ? 'inline-block' : 'none';

    // --- GrÃ¡fico de evoluciÃ³n ---
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

      // 2-3. Totales por categorÃ­a
      const catTotals = {};
      categories.forEach(cat => {
        if (!categoryStats[cat]) return;
        catTotals[cat] = Object.values(categoryStats[cat]).reduce((a, b) => a + b, 0);
      });
      const catEntries = Object.entries(catTotals);
      const hardest = catEntries.length ? catEntries.reduce((a, b) => a[1] < b[1] ? a : b) : null;
      const hottest = catEntries.length ? catEntries.reduce((a, b) => a[1] > b[1] ? a : b) : null;

      // 4. Equipo mÃ¡s irregular
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
      grid.appendChild(mkCard('â­ Mejor categorÃ­a por equipo', starHtml));

      grid.appendChild(mkCard('ðŸ“ˆ MÃ¡s irregular',
        mostIrregulars.length
          ? mostIrregulars.map(t =>
              `<div class="stat-hl-team"><span class="stat-hl-dot" style="background:${t.color}"></span>
               <span><strong>${t.name}</strong>
               <div class="stat-hl-sub">${t.best.cat} (${t.best.pts > 0 ? '+' : ''}${t.best.pts}) vs ${t.worst.cat} (${t.worst.pts > 0 ? '+' : ''}${t.worst.pts})</div>
               </span></div>`
            ).join('')
          : '<span class="text-muted">Sin datos</span>'
      ));

      grid.appendChild(mkCard('ðŸ”¥ MÃ¡s competida',
        hottest
          ? `<strong>${hottest[0]}</strong><div class="stat-hl-sub">${hottest[1] > 0 ? '+' : ''}${hottest[1]} pts totales</div>`
          : '<span class="text-muted">Sin datos</span>'
      ));

      grid.appendChild(mkCard('ðŸ’€ MÃ¡s difÃ­cil',
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
      catTitle.textContent = 'ðŸ“‹ Por categorÃ­a';
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
GEOGRAFÃA
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
150 - E.T.                   250 - El Padrino         400 - Jurassic Park         500 - Avengers(Marvel)             700 - Origen (Time)    800 - El Ãºltimo Mohicano (Promentory)

DISNEY:
- TEST
150 - Hercules (de cero a heroe)  250 - Tarzan (Lo Extrano Que Soy)     400 - La Bella y la Bestia (Algo Nuevo)   500 - El Libro De La Selva (Marcha de los Elefantes) 700 - El Rey LeÃ³n (Preparaos)  800 - Planeta del Tesoro (Sigo aqui)
- JUEGO 1
150 - El Libro de la Selva   250 - Aladdin              400 - Tarzan               500 - Mulan (Reflejo)   700 - Aristogatos  800 - Peter Pan
- JUEGO 2
150 - Tarzan (Dos mundos)    250 - La Bella y la Bestia (de Bely Basarte)  400 - La Sirenita (bajo el mar)          500 - Toy Story (hay un amigo en mi)        700 - Aladdin (el principe Ali)    800 - Ice Age / Matilda (send me on my way) 
- JUEGO 3
150 - El Rey LeÃ³n (Hakuna matata)    250 - Peter Pan (aquella estrella de alla - gisela)   400 - El Libro de la Selva (quiero ser como tu)   500 - Mulan (voy a hacer un hombre de ti)   700 - Shrek (smash mouth - all star)    800 - Lilo & Stitch (He Mele No Lilo)

IDEAS NO USADAS:
{
  pregunta: "Â¿CuÃ¡l es la Ãºnica letra que no aparece en el nombre de ningÃºn estado de los Estados Unidos?", opciones: ["Q", "X", "Z", "J"], correcta: 0, explicacion: "La letra 'Q' es la Ãºnica que no aparece en el nombre de ningÃºn estado de los Estados Unidos. Las letras 'X', 'Z' y 'J' sÃ­ aparecen en algunos nombres de estados."
  pregunta: "En quÃ© paÃ­s se encuentra el famoso 'Bosque de los Suicidios'?", opciones: ["JapÃ³n", "Estados Unidos", "Brasil", "India"], correcta: 0, explicacion: "El 'Bosque de los Suicidios', tambiÃ©n conocido como Aokigahara, se encuentra en JapÃ³n. Es un lugar tristemente famoso por ser un sitio donde muchas personas han decidido acabar con sus vidas."
  pregunta: "Â¿CuÃ¡l es el nombre del fenÃ³meno natural que ocurre cuando la luna pasa por la sombra de la Tierra?", opciones: ["Eclipse solar", "Eclipse lunar", "Marea roja", "Aurora boreal"], correcta: 1, explicacion: "El fenÃ³meno natural que ocurre cuando la luna pasa por la sombra de la Tierra se llama 'Eclipse lunar'. Durante un eclipse lunar, la Tierra bloquea la luz del sol que normalmente ilumina la luna, lo que puede hacer que la luna se vea roja o oscura."
  pregunta: "En quÃ© paÃ­s se encuentra el famoso templo de Angkor Wat?", opciones: ["Camboya", "Tailandia", "Vietnam", "Laos"], correcta: 0, explicacion: "El templo de Angkor Wat se encuentra en Camboya. Es uno de los monumentos religiosos mÃ¡s grandes del mundo y un importante sÃ­mbolo nacional de Camboya."
  pregunta: "QuÃ© organo del cuerpo humano consume mÃ¡s energÃ­a?", opciones: ["CorazÃ³n", "Cerebro", "HÃ­gado", "Pulmones"], correcta: 1, explicacion: "El cerebro es el Ã³rgano que consume mÃ¡s energÃ­a en el cuerpo humano, utilizando aproximadamente el 20% de la energÃ­a total del cuerpo, a pesar de representar solo alrededor del 2% de su peso."
  pregunta: "Â¿CuÃ¡l es la capital de Burkina Faso?", opciones: ["Ouagadougou", "Bamako", "Niamey", "Abidjan"], correcta: 0, explicacion: "La capital de Burkina Faso es Ouagadougou. Es la ciudad mÃ¡s grande del paÃ­s y su centro polÃ­tico, cultural y econÃ³mico."
  pregunta: "Â¿En quÃ© paÃ­s se encuentra la isla de Pascua?", opciones: ["Chile", "PerÃº", "Ecuador", "Argentina"], correcta: 0, explicacion: "La isla de Pascua, conocida por sus misteriosas estatuas moai, se encuentra en Chile. Es una isla remota en el ocÃ©ano PacÃ­fico y forma parte de la regiÃ³n de ValparaÃ­so."
  pregunta: "Â¿En quÃ© ciudad se encuentra el Taj Mahal?", opciones: ["Delhi", "Agra", "Mumbai", "Jaipur"], correcta: 1, explicacion: "El Taj Mahal se encuentra en Agra, India. Es un mausoleo de mÃ¡rmol blanco construido por el emperador Shah Jahan en memoria de su esposa Mumtaz Mahal."
  pregunta: "Â¿En el Antiguo Egipto cuando se momificaba a una persona, quÃ© Ã³rgano se dejaba dentro del cuerpo?", opciones: ["CorazÃ³n", "Cerebro", "HÃ­gado", "Pulmones"], correcta: 0, explicacion: "En el proceso de momificaciÃ³n del Antiguo Egipto, el corazÃ³n era el Ãºnico Ã³rgano que se dejaba dentro del cuerpo. Se creÃ­a que el corazÃ³n era el centro de la inteligencia y la emociÃ³n, y era necesario para el juicio en el mÃ¡s allÃ¡."
  pregunta: "Â¿QuÃ© cantante o grupo musical es el que mÃ¡s discos ha vendido en la historia de la mÃºsica?", opciones: ["The Beatles", "Elvis Presley", "Michael Jackson", "Madonna"], correcta: 0, explicacion: "The Beatles es el grupo musical que mÃ¡s discos ha vendido en la historia, con estimaciones que superan los 600 millones de unidades vendidas en todo el mundo."
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
  if (btn) btn.innerHTML = showing ? 'ðŸ“Š Ver estadÃ­sticas' : 'ðŸ† Ver ranking';
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
