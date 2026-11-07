import type { Parada } from "../tipos";
import { Portada } from "./Portada";
import { Problema } from "./Problema";
import { AsiSeVe } from "./AsiSeVe";
import { Clientes } from "./Clientes";
import { Mercado } from "./Mercado";
import { Competencia } from "./Competencia";
import { ModeloNegocio } from "./ModeloNegocio";
import { Branding } from "./Branding";

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
    id: "clientes",
    titulo: "Clientes",
    pasos: 3,
    notas: [
      "Idea fuerza: Rumbo tiene dos lados, quien descubre y quien organiza, y los dos ganan. Deja que las mitades se encuentren en la brújula.",
      "Asistente (Andrea Salazar, 25): profesional joven del área metropolitana que gasta $15-$40 por salida. Recorre qué busca, qué le duele y qué gana. Aclara que es un perfil construido, no una entrevista.",
      "Organizadora (Camila Rivas, 29): productora de ferias y mercaditos que busca 400-1,500 visitantes por fin de semana. Cierra con la idea de que los dos lados se necesitan.",
    ],
    Componente: Clientes,
  },
  {
    id: "mercado",
    titulo: "Mercado",
    pasos: 6,
    notas: [
      "Idea fuerza: el tamaño de la oportunidad, de lo grande a lo que alcanzamos primero. Aclara desde ya que TAM y SAM son gasto de las personas en salidas, no ingreso de Rumbo.",
      "TAM: 1.4 millones de personas de 21 a 32 años en El Salvador (Censo 2024 y ONU World Population Prospects 2024). Con un gasto aproximado de $180 al año en salidas da cerca de $257 millones de gasto potencial.",
      "SAM: unas 424 mil personas en San Salvador y La Libertad con acceso a internet. Mismo gasto por persona: cerca de $76 millones. Es donde hoy se promocionan por redes los eventos locales, mercaditos y experiencias.",
      "SOM: entre 2% y 5% del SAM en el primer año, de 8.5 mil a 21 mil usuarios activos. Con una comisión aproximada de $3.6 por usuario al año, el ingreso de Rumbo es de $31 mil a $76 mil.",
      "Recorre las tres fórmulas. Repite la aclaración: el ingreso de Rumbo es solo la comisión, es decir, el SOM. Fuente: Censo 2024 de El Salvador y ONU World Population Prospects 2024.",
      "Cierre: la brújula apunta al SOM. Empezamos por ahí. Lanza la pregunta \"¿Y quién más está en este camino?\" y avanza a Competencia.",
    ],
    Componente: Mercado,
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
    pasos: 7,
    notas: [
      "Idea fuerza: Rumbo gana de 7 formas y lo más claro es quién paga cada una. Los montos de las tarjetas son ejemplos.",
      "Organizadores: Rumbo cobra comisión por entradas y por reservas y stands (se descuenta de su pago), el organizador paga $30 por destacar un evento, y el plan profesional cuesta de $15 a $25 al mes.",
      "Marcas y negocios: las promociones comerciales (una cafetería paga $60 por una semana) y los combos patrocinados (una bebida regalada por $150, con 90 canjes).",
      "Combos: Rumbo cobra comisión por combos y el precio ya la incluye. Las cifras de uso se miden en la validación.",
      "Quién paga qué: el organizador paga 8% + $0.30 por entrada, descontado de su pago; los eventos gratuitos no llevan comisión ni fees; cobra 3 días hábiles después del evento. El asistente paga solo el procesamiento, unos 3.8% en total, visible antes de pagar y sin cargo de servicio de Rumbo.",
      "Cómo está pensado el cobro: 500 entradas de $12 al mes dejan $630 brutos ($480 del 8% más $150 de los $0.30). Si Rumbo absorbiera 3.6% ($216) quedarían $414, todavía antes de reembolsos, IVA, disputas y operación.",
      "Cierre: \"Y todo esto ya se puede ver funcionando\"; volvemos a la demo.",
    ],
    Componente: ModeloNegocio,
  },
  {
    id: "branding",
    titulo: "Branding",
    pasos: 8,
    notas: [
      "Idea fuerza: Rumbo es la brújula del fin de semana; no buscas planes, los descubres. Lee el título y deja ver la frase.",
      "Logo: el cuadrado turquesa con la R y la chispa-brújula mostaza. Muestra las tres variantes: principal, invertida y mono.",
      "Personalidad: aventurera, juvenil, cercana, juguetona y confiable al pagar. Y lo que no es: corporativa, una ticketera fría ni un collage caótico.",
      "Paleta y tipografía: azul noche y turquesas con crema, mostaza, bosque, coral y lima; el naranja nunca es el principal. Fraunces para títulos, DM Sans para texto y Caveat solo en stickers y notas.",
      "Voz y pilares: tuteo, directo y con humor ligero; lo local viene del contenido. Aventura, conexión, emprendedurismo y bienestar, todos con contexto local. Cierra con la app y pasa a marketing.",
    ],
    Componente: Branding,
  },
];
