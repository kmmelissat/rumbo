import type { Parada } from "../tipos";
import { Portada } from "./Portada";
import { Problema } from "./Problema";
import { AsiSeVe } from "./AsiSeVe";
import { ClientesMercado } from "./ClientesMercado";
import { Competencia } from "./Competencia";
import { ModeloNegocio } from "./ModeloNegocio";
import { Branding } from "./Branding";
import { Estrategia } from "./Estrategia";
import { Redes } from "./Redes";
import { Crecimiento } from "./Crecimiento";
import { Presupuesto } from "./Presupuesto";
import { Roi } from "./Roi";
import { Cierre } from "./Cierre";

/** Registro del viaje: una entrada por parada. Agrega aquí las nuevas slides. */
export const PARADAS: Parada[] = [
  {
    id: "portada",
    titulo: "Portada",
    notas: "Saluda y presenta al equipo: Karla Melissa Torres, Lucía Turcios y Masciel Fuentes. Plan de negocio para ESEN. Idea fuerza: Rumbo reúne en un solo lugar todo lo que pasa en El Salvador. Deja que la brújula termine de girar y señala hacia la siguiente parada.",
    Componente: Portada,
  },
  {
    id: "problema",
    titulo: "El problema",
    pasos: 7,
    notas: [
      "Idea fuerza: en El Salvador pasan cosas buenas todos los días. Deja que lean el título antes de avanzar.",
      "Son los lugares donde hoy te enteras: una story, un grupo, un flyer borroso, un \"me contó una amiga\". Pregunta a la sala cómo se enteró de su último plan.",
      "Dolor 1 del asistente: está regado. No hay un solo lugar donde mirar; hay que seguir muchas fuentes.",
      "Dolor 2: llegas tarde. Te enteras cuando ya pasó o ya se agotó. Si llenaste PROBLEMA_DATOS, di la cifra y la fuente.",
      "Dolor 3: no sabes si vale la pena. Sin fotos reales, precio claro ni opiniones, decidir es una apuesta.",
      "Cambio de ritmo: ahora el otro lado. Publicar cuesta, cobrar es incómodo y no saben quién viene: sin boletos ni QR no hay datos para volver a convocar.",
      "Cierre: las tarjetas se juntan en una pila. Lanza la pregunta \"¿Y si todo estuviera en un solo lugar?\" y avanza a La solución.",
    ],
    Componente: Problema,
  },
  {
    id: "asi-se-ve",
    titulo: "Así se ve Rumbo",
    notas: "Demo en vivo con la app real dentro del celular. Recorre Explorar, abre un evento, compra (es una simulación) y muestra el boleto con su QR. Las notas junto al celular cambian solas según la pantalla. Si das clic dentro del celular, la flecha derecha primero te devuelve a la presentación y la siguiente avanza.",
    Componente: AsiSeVe,
  },
  {
    id: "clientes-mercado",
    titulo: "Clientes y mercado",
    pasos: 3,
    notas: [
      "Idea fuerza: Rumbo tiene dos lados, quien descubre y quien organiza. Andrea Salazar (25) gasta $15-$40 por salida y Camila Rivas (29) cobra $25-$50 por stand.\nAclara que son perfiles construidos, no entrevistas.",
      "Los dos lados se necesitan: más asistentes atraen más organizadores, y más organizadores atraen más asistentes.\nDeja correr las partículas y avanza.",
      "Mercado en personas de 21 a 32 años: TAM 1.4 millones (unos $257 millones de gasto en salidas), SAM 424 mil (unos $76 millones) y SOM de 8.5 mil a 21 mil usuarios (unos $31 mil a $76 mil en comisiones).\nRepite que TAM y SAM son gasto de la gente; el ingreso de Rumbo es solo el SOM. Fuente: Censo 2024 y ONU World Population Prospects 2024.",
    ],
    Componente: ClientesMercado,
  },
  {
    id: "competencia",
    titulo: "Competencia",
    pasos: 7,
    notas: [
      "Idea fuerza: hoy el plan está repartido entre muchos lugares y Rumbo gana porque lo junta. Deja que lean el título.",
      "Boleterías: venden boletos de conciertos y eventos masivos. Rumbo suma los planes locales, con fees claros y boleto con QR por correo y WhatsApp.",
      "Agendas: medios y la agenda turística del gobierno publican en artículos semanales. Rumbo es un calendario vivo que el organizador actualiza, con fecha de última actualización.",
      "Redes sociales: ahí se promociona casi todo, pero repartido entre cuentas. Rumbo junta horario, precio, ubicación y enlace en una sola ficha.",
      "Organizadores (Sivar Emprende, Farmer's Market): no son competencia, son aliados. Rumbo les da visibilidad, un panel para publicar en menos de 3 minutos y métricas de clics y guardados.",
      "Los cuatro sellos: planes locales en un calendario, información confirmada, del plan a la reserva con un solo QR y herramientas para el organizador.",
      "Defensa: un calendario se copia fácil, así que la ventaja es la red de organizadores y alianzas y los datos de qué eventos funcionan. Primera prioridad: construir esa red. Da paso a la siguiente parada.",
    ],
    Componente: Competencia,
  },
  {
    id: "modelo-negocio",
    titulo: "Modelo de negocio",
    pasos: 3,
    notas: [
      "Idea fuerza: Rumbo gana de 7 formas y lo único que hay que entender es quién paga qué.\nDeja leer el título y avanza.",
      "Organizadores pagan cuatro líneas, marcas y negocios dos, y los combos llevan la comisión incluida en el precio.\nSon siete líneas en una sola plataforma.",
      "Organizador: 8% + $0.30 por entrada y publicar es gratis; asistente: sin cargo de servicio de Rumbo.\nEl organizador cobra 3 días hábiles después del evento. Al avanzar pasas a la siguiente slide.",
    ],
    Componente: ModeloNegocio,
  },
  {
    id: "branding",
    titulo: "Branding",
    pasos: 5,
    notas: [
      "Idea fuerza: Rumbo es la brújula del fin de semana; no buscas planes, los descubres. Lee el título y deja ver la frase.",
      "Logo y personalidad: el cuadrado turquesa con la R y la chispa-brújula mostaza, en sus tres variantes. Aventurera, juvenil, cercana, juguetona y confiable al pagar; no es corporativa, ni una ticketera fría, ni un collage caótico.",
      "Paleta y tipografía: azul noche y turquesas con crema, mostaza, bosque, coral y lima; Fraunces para títulos, DM Sans para texto y Caveat solo en stickers y notas.",
      "Voz: tuteo, directo y con humor ligero; lo local viene del contenido, no de jerga forzada.",
      "Pilares: aventura, conexión, emprendedurismo y bienestar, todos con contexto local. Pasa a marketing.",
    ],
    Componente: Branding,
  },
  {
    id: "estrategia",
    titulo: "Estrategia de marketing",
    pasos: 7,
    notas: [
      "Idea fuerza: Rumbo llega a la gente por contenido, por los organizadores y por alianzas, no por anuncios pagados.",
      "Por qué orgánico: el crecimiento viene de contenido, organizadores que comparten su evento y alianzas.",
      "Embudo: descubre, guarda, comparte, compra, vuelve. Sin números de conversión; lo que mueve cada etapa es contenido, la web móvil, WhatsApp, un solo QR y la guía semanal.",
      "Canales y relación con cada cliente: web móvil como canal principal, Instagram y TikTok, WhatsApp, la guía semanal y los propios organizadores. Asistentes en autoservicio, organizadores con atención personal al inicio, marcas con trato directo.",
      "Arranque: un tipo de evento, una zona (San Salvador y La Libertad) y organizadores aliados como Farmer's Market y Sivar Emprende antes de abrir al público.",
      "Medición: siete indicadores y qué permite entender cada uno. Cierra con \"¿Cómo se ve eso en redes? Mira\" y pasa a la siguiente slide.",
    ],
    Componente: Estrategia,
  },
  {
    id: "redes",
    titulo: "Contenido para redes",
    pasos: 9,
    notas: [
      "Idea fuerza: así se ve Rumbo donde la gente ya está. Todas las piezas están dibujadas en código, con la marca aplicada.",
      "Reel o TikTok \"3 rumbos para este finde\": el gancho \"Tu finde ya tiene plan\" en los primeros 3 segundos, tres planes y cierre con guardar. Después, stories con cuenta regresiva, encuesta y enlace: un sticker por story.",
      "Carrusel de la guía semanal (portada, dos planes y cierre \"Guarda tu plan en Rumbo\"), flyer del evento destacado de $30 con QR grande y sello de pasaporte, y el post de Camila que comparte su mercadito en Rumbo.",
      "Una pieza por pilar: aventura, conexión, emprendedurismo y bienestar, cada una con su color. Plantillas recurrentes y hashtags.",
      "Regla de oro: Instagram y TikTok son para descubrir; la compra pasa en un solo enlace y un solo QR. Cierra con \"¿Y cómo sabemos si funciona? Lo medimos\".",
    ],
    Componente: Redes,
  },
  {
    id: "crecimiento",
    titulo: "Crecimiento",
    pasos: 9,
    notas: [
      "Idea fuerza: Rumbo crece con experimentos pequeños, uno por etapa del embudo. Deja leer el título.",
      "Embudo AARRR: adquisición, activación, retención, ingresos y referidos. La brújula recorre las cinco etapas.",
      "Adquisición: la guía semanal \"3 rumbos para este finde\" en redes, sin anuncios. Cada experimento tiene hipótesis, cambio, métrica y guardrail; el resultado dice \"en medición\" hasta que haya datos reales.",
      "Activación: guardar un evento sin crear cuenta. El guardrail es que el tiempo en la página y los errores no empeoren.",
      "Retención: recordatorio por WhatsApp del plan guardado. Guardrail: que no suban las bajas ni las quejas.",
      "Ingresos: cobrar a mano un primer evento destacado de $30, con dinero real. Guardrail: que valga la pena para el organizador.",
      "Referidos: compartir por WhatsApp una ficha clara del evento, sin mensajes automáticos a contactos.",
      "Cómo medimos: siete métricas. Con poco tráfico comparamos una semana contra otra, con el mismo tipo de evento y un solo cambio a la vez; no hay A/B formal.",
      "Cierre: una hipótesis a la vez, y los números deciden.",
    ],
    Componente: Crecimiento,
  },
  {
    id: "presupuesto",
    titulo: "Presupuesto y plataformas",
    pasos: 3,
    notas: [
      "Idea fuerza: con $100 al mes de marketing en el piloto, cada dólar tiene un destino claro. Deja leer el título y el número.",
      "Cinco filas que dicen en qué se gasta, cada una con su plataforma y su etapa en la etiqueta. El 40% va a impulsar Reels y TikTok porque es donde más cuesta que alguien nos conozca; luego captación de organizadores (25%), banners QR en mercaditos (15%), herramientas de WhatsApp (10%) y experimentos y contingencias (10%). Las barras muestran el porcentaje del total.",
      "Por qué en cada una: ahí está el público, cada organizador trae su audiencia, el QR en el mercadito lleva a la web sin descargar nada, WhatsApp es donde se decide el plan y los experimentos permiten cambiar una cosa a la vez. Menciona la fuente al pie y pasa a la proyección.",
    ],
    Componente: Presupuesto,
  },
  {
    id: "roi",
    titulo: "Proyección y ROI",
    pasos: 4,
    notas: [
      "Idea fuerza: es una proyección conservadora a seis meses, no resultados. Deja correr los números de mes 1 a mes 6: usuarios activos de 600 a 5,500, organizadores de 8 a 60, entradas de 15 a 193 y destacados de 1 a 7. De 2.5 a 3.5 de cada 100 usuarios compran una entrada pagada; los demás ven planes gratis o guardan eventos.",
      "Gasto contra ingreso mes a mes: el gasto en azul noche sube de $100 a $350 y el ingreso en turquesa de unos $49 a unos $453. En el mes 5 el ingreso alcanza al gasto; señala la chispa.",
      "ROAS es ingresos entre gasto de marketing. El semestre queda en 0.9x a propósito: es inversión de validación. Lo que importa es la tendencia: de 0.49x en el mes 1 a 1.29x en el mes 6, cuando cada dólar devuelve $1.29.",
      "Supuestos: comisión neta de $1.26 por entrada y evento destacado de $30; solo contamos 2 de las 7 líneas de ingreso. Con costos fijos incluidos, el mes 6 ya deja margen positivo. Pasa al cierre.",
    ],
    Componente: Roi,
  },
  {
    id: "cierre",
    titulo: "Encuentra tu rumbo",
    pasos: 3,
    notas: [
      "Aparece \"Encuentra tu rumbo\": Rumbo conecta a los salvadoreños con lo que pasa en su país. Deja que lo lean.",
      "Entran los cuatro pilares: aventura, conexión, emprendedurismo y bienestar.",
      "Presenta al equipo y lee la línea de qué sigue. Cierra dando las gracias; la brújula llega a su destino.",
    ],
    Componente: Cierre,
  },
];
