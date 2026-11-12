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
// import { Crecimiento } from "./Crecimiento"; // slide retirada de PARADAS; el contenido pasó a Estrategia
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
      "Mercado en personas de 21 a 32 años: TAM 1.4 millones (unos $257 millones de gasto en salidas), SAM 424 mil (unos $76 millones) y SOM de 8.5 mil a 21 mil usuarios.\nRepite que TAM y SAM son gasto de la gente, no ingreso de Rumbo; el SOM es potencial a largo plazo; la proyección de 6 meses está en ROI. Fuente: Censo 2024 y ONU World Population Prospects 2024.",
    ],
    Componente: ClientesMercado,
  },
  {
    id: "competencia",
    titulo: "Competencia",
    pasos: 4,
    notas: [
      "Idea fuerza: hoy el plan está repartido entre muchos lugares y Rumbo gana porque lo junta. Deja que lean el título.",
      "Cuatro actores, todos a la vez. Boleterías: venden boletos de conciertos y eventos masivos; Rumbo suma los planes locales (mercaditos, ferias, talleres y eventos gratis) con filtros por zona y presupuesto, precio claro antes de pagar y boleto con QR por correo y WhatsApp. Agendas: medios y la agenda turística del gobierno publican en artículos semanales; Rumbo es un calendario vivo que el organizador actualiza, con fecha de última actualización. Redes sociales: ahí se promociona casi todo, repartido entre cuentas; Rumbo junta horario, precio, ubicación y enlace en una sola ficha. Organizadores (Sivar Emprende, Farmer's Market): no son competencia, son aliados; Rumbo les da visibilidad, un panel para publicar en menos de 3 minutos y métricas de clics y guardados.",
      "Lo que nos hace distintos: planes pequeños y locales en un solo calendario, información confirmada por el organizador, del plan a la reserva con un solo enlace y un solo QR, y herramientas para el organizador.",
      "Defensa: un calendario se copia fácil, así que la ventaja es la red de organizadores y alianzas y los datos de qué eventos funcionan. Primera prioridad: construir esa red. Da paso a la siguiente parada.",
    ],
    Componente: Competencia,
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
      "Pilares: aventura, conexión, emprendedurismo y bienestar, todos con contexto local. Ahora vemos cómo se ve esta marca en redes.",
    ],
    Componente: Branding,
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
      "Regla de oro: Instagram y TikTok son para descubrir; la compra pasa en un solo enlace y un solo QR. ¿Y cómo llegamos a la gente con esto? Con un embudo y un experimento por etapa.",
    ],
    Componente: Redes,
  },
  {
    id: "estrategia",
    titulo: "Estrategia y crecimiento",
    pasos: 3,
    notas: [
      "Idea fuerza: Rumbo llega y crece primero de forma orgánica, con un impulso pequeño al contenido, y lo hace con un experimento por etapa del embudo AARRR: adquisición, activación, retención, ingresos y referidos. La brújula recorre las cinco etapas.",
      "Un experimento por etapa, cada uno con hipótesis, cambio, métrica y guardrail; el resultado dice \"en medición\" hasta que haya datos reales.\nAdquisición: si publicamos cada semana \"3 rumbos para este finde\" en Instagram y TikTok, más gente entra a la web, con un impulso pequeño al contenido. Guardrail: que el crecimiento siga siendo orgánico.\nActivación: si se puede abrir y guardar un evento sin registrarse, más visitantes guardan su primer plan. Guardrail: que el tiempo en la página y los errores no empeoren.\nRetención: si recordamos por WhatsApp los planes guardados, más personas vuelven la semana siguiente. Guardrail: que no suban las bajas ni las quejas de mensajes.\nIngresos: si el evento destacado muestra clics y guardados, los organizadores pagan por destacar; se cobra a mano un primer evento de $30, con dinero real. Guardrail: que el organizador reporte que valió la pena y que los eventos no destacados no pierdan visibilidad.\nReferidos: si compartir por WhatsApp envía una ficha clara (horario, precio, ubicación), más gente llega por recomendación. Guardrail: nada de mensajes automáticos a contactos.\nRelación con cada cliente: asistentes en autoservicio en la web; organizadores con atención personal por WhatsApp al inicio y panel de autoservicio después; marcas y lugares con trato directo y acuerdos por campaña.\nCómo medimos: organizadores activos, eventos confirmados por semana, usuarios activos semanales, eventos guardados y compartidos, entradas vendidas e ingresos por organizador. Con poco tráfico no hacemos A/B formal: comparamos una semana contra otra, con el mismo tipo de evento y un solo cambio a la vez.",
      "Arranque: un tipo de evento, en San Salvador y La Libertad, con organizadores aliados como Farmer's Market y Sivar Emprende antes de abrir al público. Cierre: una hipótesis a la vez, y los números deciden. Y esto, ¿cuánto cuesta?",
    ],
    Componente: Estrategia,
  },
  {
    id: "presupuesto",
    titulo: "Presupuesto y plataformas",
    pasos: 3,
    notas: [
      "Idea fuerza: con $100 al mes de marketing en el piloto, cada dólar tiene un destino claro. Deja leer el título y el número.",
      "Cinco filas que dicen en qué se gasta, cada una con su plataforma y su etapa en la etiqueta. El 40% va a impulsar Reels y TikTok porque es donde más cuesta que alguien nos conozca; luego captación de organizadores (25%), banners QR en mercaditos (15%), herramientas de WhatsApp (10%) y experimentos y contingencias (10%). Las barras muestran el porcentaje del total.",
      "Por qué en cada una: ahí está el público, cada organizador trae su audiencia, el QR en el mercadito lleva a la web sin descargar nada, WhatsApp es donde se decide el plan y los experimentos permiten cambiar una cosa a la vez. Menciona la fuente al pie. Y así es como ganamos.",
    ],
    Componente: Presupuesto,
  },
  {
    id: "modelo-negocio",
    titulo: "Modelo de negocio",
    pasos: 3,
    notas: [
      "Idea fuerza: Rumbo gana de 7 formas y lo único que hay que entender es quién paga qué.\nOrganizador: 8% + $0.30 por entrada y publicar es gratis. Asistente: $0 de cargo de servicio de Rumbo. El organizador cobra 3 días hábiles después del evento.",
      "Ejemplo con una entrada de $12: el asistente paga $12 (más el costo de procesamiento del pago), Rumbo se queda $1.26 ($0.96 + $0.30) y el organizador recibe $10.74.",
      "Las 7 líneas de ingreso: organizadores (entradas, reservas y stands, eventos destacados de $30, plan profesional), marcas y negocios (promociones y combos patrocinados) y combos (comisión incluida en el precio). Hoy contamos 2 en la proyección: entradas y eventos destacados. Veamos qué devuelve.",
    ],
    Componente: ModeloNegocio,
  },
  {
    id: "roi",
    titulo: "Proyección y ROI",
    pasos: 4,
    notas: [
      "Idea fuerza: es una proyección conservadora a seis meses, no resultados. Deja correr los números de mes 1 a mes 6: usuarios activos de 600 a 5,500, organizadores de 8 a 60, entradas de 15 a 193 y destacados de 1 a 7. De 2.5 a 3.5 de cada 100 usuarios compran una entrada pagada; los demás ven planes gratis o guardan eventos. Los 5,500 usuarios del mes 6 son camino al SOM durante el primer año, no el SOM.",
      "Gasto contra ingreso mes a mes: el gasto en azul noche sube de $100 a $350 y el ingreso en turquesa de unos $49 a unos $453. En el mes 5 el ingreso alcanza al gasto; señala la chispa.",
      "ROAS es ingresos entre gasto de marketing. El semestre queda en 0.9x a propósito: es inversión de validación. Lo que importa es la tendencia: de 0.49x en el mes 1 a 1.29x en el mes 6, cuando cada dólar devuelve $1.29.",
      "Supuestos: comisión neta de $1.26 por entrada y evento destacado de $30; solo contamos 2 de las 7 líneas de ingreso. Los costos fijos son $25 al mes de servidor. Con costos fijos incluidos, el mes 6 ya deja margen positivo. Y con esto, cerramos.",
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
