import type { Parada } from "../tipos";
import { Portada } from "./Portada";
import { Problema } from "./Problema";
import { AsiSeVe } from "./AsiSeVe";
import { Clientes } from "./Clientes";
import { Mercado } from "./Mercado";

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
      "TAM: 2.0 millones de personas de 18 a 34 años en El Salvador (Censo 2024). Con un gasto aproximado de $180 al año en salidas da cerca de $359 millones de gasto potencial.",
      "SAM: unas 590 mil personas en San Salvador y La Libertad con acceso a internet. Mismo gasto por persona: cerca de $106 millones. Es donde hoy se promocionan por redes los eventos locales, mercaditos y experiencias.",
      "SOM: entre 2% y 5% del SAM en el primer año, de 12 mil a 30 mil usuarios activos. Con una comisión aproximada de $3.5 por usuario al año, el ingreso de Rumbo es de $43 mil a $106 mil.",
      "Recorre las tres fórmulas. Repite la aclaración: el ingreso de Rumbo es solo la comisión, es decir, el SOM. Fuente: Censo 2024 y datos de mercado consultados el 20 de octubre de 2026.",
      "Cierre: la brújula apunta al SOM. Empezamos por ahí. Lanza la pregunta \"¿Y quién más está en este camino?\" y avanza a Competencia.",
    ],
    Componente: Mercado,
  },
];
