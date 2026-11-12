"use client";

import {useRef, useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Caveat } from "next/font/google";
import { motion, useReducedMotion } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { Sticker } from "./RedesStickers";

const REDES_DATOS = {
  titulo: "Rumbo en tus redes",
  subtitulo: "(lo que ves en el feed, en stories y en el flyer)",
  pilares: {
    Aventura: { color: "#0A7C7C", texto: "#FAF6EF" },
    Conexión: { color: "#F28F6B", texto: "#12303A" },
    Emprendedurismo: { color: "#F5B82E", texto: "#12303A" },
    Bienestar: { color: "#1E5E45", texto: "#FAF6EF" },
  } as Record<string, { color: string; texto: string }>,
  reel: {
    formato: "TikTok",
    pilar: "Conexión",
    titulo: "3 rumbos para salir de la rutina",
    gancho: "¿Otra vez sin plan?",
    planes: [
      {
        n: "Una noche para bailar",
        d: "Cambia la rutina por la pista.",
        foto: "/images/noche-de-baile.jpg",
      },
      {
        n: "Un encuentro para conectar",
        d: "Las buenas ideas también empiezan conversando.",
        foto: "/images/encuentro-creativo.jpg",
      },
      {
        n: "Un taller para probar algo nuevo",
        d: "Dale espacio a tu lado creativo.",
        foto: "/images/taller-de-maquillaje.jpg",
      },
    ],
  },
  stories: {
    formato: "Stories",
    pilar: "Conexión",
    items: [
      {
        foto: "/images/noche-de-baile.jpg",
        titular: "Tu próximo rumbo: la pista",
        sticker: "Hay plan",
        color: "#F5B82E",
        etapa: "Despertar interés",
        estrategia:
          "Una imagen con ambiente y una frase corta hacen que quieras descubrir el plan.",
        senal: "Titular corto",
      },
      {
        foto: "/images/encuentro-creativo.jpg",
        titular: "¿Qué plan va contigo?",
        sticker: "¿Bailar o conectar?",
        color: "#F28F6B",
        etapa: "Abrir conversación",
        estrategia:
          "La pregunta invita a participar y nos ayuda a conocer qué experiencias prefiere la comunidad.",
        senal: "Pregunta a la comunidad",
      },
      {
        foto: "/images/experiencia-al-aire-libre.jpg",
        titular: "Sal de la rutina",
        sticker: "Descubre tu próximo rumbo",
        color: "#FAF6EF",
        etapa: "Llevar a Rumbo",
        estrategia:
          "Después de despertar interés, el cierre invita a consultar los detalles en Rumbo mediante un solo enlace.",
        senal: "Llamada a la acción",
      },
    ],
  },
  carrusel: {
    formato: "Carrusel",
    pilar: "Emprendedurismo",
    laminas: [
      {
        foto: "/images/tienda.jpg",
        titular: "Guía semanal de planes",
        pie: "Desliza y encuentra tu rumbo",
      },
      {
        foto: "/images/mercado.jpg",
        titular: "Mercadito del Volcán",
        pie: "Descubre lo local",
      },
      {
        foto: "/images/ceramica.jpg",
        titular: "Taller de cerámica",
        pie: "Prueba algo nuevo",
      },
      {
        foto: "/images/comida.jpg",
        titular: "Guarda tu próximo plan",
        pie: "Encuentra los detalles en Rumbo",
      },
    ],
  },
  flyer: {
    formato: "Flyer · evento destacado",
    pilar: "Emprendedurismo",
    destacado: "Evento destacado",
    titulo: "Mercadito del Volcán",
    fecha: "Sábado · 9:00 a. m.",
    lugar: "Parque Cafetalón, Santa Tecla",
    qr: "https://rumbo.sv/e/mercadito-del-volcan",
    foto: "/images/mercado.jpg",
  },
  post: {
    formato: "Post del organizador",
    pilar: "Emprendedurismo",
    organizadora: "Camila",
    detalle: "Sábado · Parque Cafetalón",
    boton: "Ver evento",
    foto: "/images/mercado.jpg",
  },
  porPilar: [
    {
      pilar: "Aventura",
      titular: "Rumbo a la caminata",
      foto: "/images/caminata.jpg",
      sticker: "mochila",
    },
    {
      pilar: "Conexión",
      titular: "Vamos a rumbear",
      foto: "/images/luces.jpg",
      sticker: "nota",
    },
    {
      pilar: "Emprendedurismo",
      titular: "Lo local, a un toque",
      foto: "/images/mercado.jpg",
      sticker: "estrella",
    },
    {
      pilar: "Bienestar",
      titular: "Hay plan para desconectar",
      foto: "/images/yoga.jpg",
      sticker: "sol",
    },
  ],
  plantillas: [
    "3 rumbos para este finde",
    "Cuenta regresiva",
    "Así estuvo",
    "Presupuesto de $10",
  ],
  hashtags: [
    "#Rumbo",
    "#RumboSV",
    "#ElSalvador",
    "#FindeEnSV",
    "#MercaditosSV",
    "#EventosSV",
    "#Rumbear",
  ],
  regla:
    "Instagram y TikTok son para descubrir; la compra pasa en un solo enlace y un solo QR.",
  salida: "¿Y cómo sabemos si funciona? Lo medimos",
};

const caveat = Caveat({ subsets: ["latin"], weight: "600" });

const C = {
  crema: "#FAF6EF",
  noche: "#12303A",
  turquesa: "#0A7C7C",
  mostaza: "#F5B82E",
  coral: "#F28F6B",
  bosque: "#1E5E45",
};

const D = REDES_DATOS;

function Item({
  visible,
  i = 0,
  base = 0.15,
  className,
  style,
  children,
}: {
  visible: boolean;
  i?: number;
  base?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const rm = useReducedMotion();

  return (
    <motion.div
      initial={false}
      className={className}
      style={style}
      animate={
        visible
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: rm ? 0 : 30, scale: rm ? 1 : 0.92 }
      }
      transition={
        rm || !visible
          ? { duration: 0.2 }
          : {
              type: "spring",
              stiffness: 130,
              damping: 10,
              delay: base + i * 0.15,
            }
      }
    >
      {children}
    </motion.div>
  );
}

function Chip({ pilar }: { pilar: string }) {
  const c = D.pilares[pilar];

  return (
    <span
      className="inline-block rounded-full px-4 py-1 text-[16px] font-bold uppercase tracking-[0.1em]"
      style={{ background: c.color, color: c.texto }}
    >
      {pilar}
    </span>
  );
}

function Foto({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      draggable={false}
      className={`block object-cover ${className ?? ""}`}
    />
  );
}

function Marco({
  visible,
  formato,
  pilar,
  nota,
  children,
}: {
  visible: boolean;
  formato: string;
  pilar: string;
  nota: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-center gap-14">
      {children}
      <Item
        visible={visible}
        i={5}
        className="flex w-[300px] shrink-0 flex-col items-start gap-4"
      >
        <Chip pilar={pilar} />
        <h3 className="font-display text-[38px] font-bold leading-tight">
          {formato}
        </h3>
        <p className="text-[22px] leading-snug opacity-80">{nota}</p>
      </Item>
    </div>
  );
}

/* Componentes compartidos */

type IconName =
  | "heart"
  | "comment"
  | "send"
  | "save"
  | "left"
  | "right"
  | "more";

function Icon({
  name,
  filled = false,
  size = 26,
}: {
  name: IconName;
  filled?: boolean;
  size?: number;
}) {
  const paths: Record<IconName, ReactNode> = {
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
    ),
    comment: (
      <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6A8.4 8.4 0 0 1 12.5 3h.5a8.5 8.5 0 0 1 8 8v.5Z" />
    ),
    send: <path d="m22 2-7 20-4-9-9-4 20-7ZM22 2 11 13" />,
    save: <path d="M6 3h12v18l-6-4-6 4V3Z" />,
    left: <path d="m15 5-7 7 7 7" />,
    right: <path d="m9 5 7 7-7 7" />,
    more: (
      <>
        <circle cx="5" cy="12" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function Avatar({
  name = "Rumbo",
  small = false,
}: {
  name?: string;
  small?: boolean;
}) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-display font-bold"
      style={{
        width: small ? 32 : 40,
        height: small ? 32 : 40,
        fontSize: small ? 21 : 27,
        background: name === "Rumbo" ? C.turquesa : C.coral,
        color: name === "Rumbo" ? C.crema : C.noche,
        border: `2px solid ${C.crema}`,
      }}
    >
      {name[0]}
    </span>
  );
}

function Account({
  name = "Rumbo",
  detail = "Planes en El Salvador",
}: {
  name?: string;
  detail?: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Avatar name={name} />
      <div className="min-w-0 flex-1">
        <p className="text-[17px] font-bold leading-tight">{name}</p>
        <p className="text-[12px] opacity-70">{detail}</p>
      </div>
      <Icon name="more" size={23} />
    </div>
  );
}

function PostFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="w-[390px] shrink-0 overflow-hidden rounded-[24px]"
      style={{
        background: C.crema,
        color: C.noche,
        border: `1px solid ${C.noche}26`,
        boxShadow: `0 20px 50px ${C.noche}26`,
      }}
    >
      {children}
    </div>
  );
}

/* Me gusta y guardar funcionan localmente.
   Comentar y compartir son elementos visuales. */
function Actions() {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={liked ? "Quitar me gusta" : "Me gusta"}
          aria-pressed={liked}
          onClick={() => setLiked(!liked)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ color: liked ? C.turquesa : C.noche }}
        >
          <Icon name="heart" filled={liked} />
        </button>
        <span className="flex h-10 w-8 items-center justify-center">
          <Icon name="comment" />
        </span>
        <span className="flex h-10 w-8 items-center justify-center">
          <Icon name="send" />
        </span>
      </div>
      <button
        type="button"
        aria-label={saved ? "Quitar de guardados" : "Guardar publicación"}
        aria-pressed={saved}
        onClick={() => setSaved(!saved)}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ color: saved ? C.turquesa : C.noche }}
      >
        <Icon name="save" filled={saved} />
      </button>
    </div>
  );
}

function Caption({
  name = "Rumbo",
  children,
}: {
  name?: string;
  children: ReactNode;
}) {
  return (
    <div className="px-4 pb-4">
      <p className="text-[15px] leading-snug">
        <span className="font-bold">{name}</span> {children}
      </p>
      <p
        className="mt-2 text-[12px] font-semibold"
        style={{ color: C.turquesa }}
      >
        {D.hashtags.slice(0, 3).join(" ")}
      </p>
    </div>
  );
}

function NavArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={direction === "left" ? "Anterior" : "Siguiente"}
      onClick={onClick}
      className={`absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 ${
        direction === "left" ? "left-3" : "right-3"
      }`}
      style={{
        background: C.crema,
        color: C.noche,
        boxShadow: `0 3px 12px ${C.noche}33`,
      }}
    >
      <Icon name={direction} size={21} />
    </button>
  );
}

function Dots({
  count,
  active,
  onChange,
}: {
  count: number;
  active: number;
  onChange: (index: number) => void;
}) {
  return (
    <div className="flex justify-center gap-1">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Mostrar lámina ${i + 1}`}
          aria-current={i === active ? "true" : undefined}
          onClick={() => onChange(i)}
          className="flex h-6 w-7 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2"
        >
          <span
            className="h-1.5 rounded-full"
            style={{
              width: i === active ? 18 : 6,
              background: i === active ? C.turquesa : `${C.noche}33`,
            }}
          />
        </button>
      ))}
    </div>
  );
}

const photoShade = {
  background: `linear-gradient(to top, ${C.noche} 0%, ${C.noche}99 42%, transparent 85%)`,
};

/* Anotación que conecta la pieza con su estrategia. */
function Estrategia({
  visible,
  pilar,
  formato,
  etapa,
  texto,
  senal,
}: {
  visible: boolean;
  pilar: string;
  formato: string;
  etapa: string;
  texto: string;
  senal: string;
}) {
  return (
    <Item
      visible={visible}
      i={2}
      className="flex w-[310px] shrink-0 flex-col items-start gap-4"
    >
      <Chip pilar={pilar} />
      <h3 className="font-display text-[38px] font-bold">{formato}</h3>

      <div
        className="relative w-full rounded-[22px] border p-5"
        style={{
          background: C.crema,
          borderColor: `${C.turquesa}44`,
        }}
        aria-live="polite"
      >
        <svg
          aria-hidden
          className="absolute -left-[53px] top-8"
          width="54"
          height="30"
          viewBox="0 0 54 30"
          fill="none"
          stroke={C.turquesa}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M52 23C35 23 27 7 3 10m9-7L3 10l9 8" />
        </svg>
        <p
          className="text-[11px] font-bold uppercase tracking-[0.15em]"
          style={{ color: C.turquesa }}
        >
          {senal}
        </p>
        <h4 className="mt-2 font-display text-[29px] font-bold leading-tight">
          {etapa}
        </h4>
        <p className="mt-3 text-[18px] leading-snug">{texto}</p>
      </div>
    </Item>
  );
}

/* a. TikTok: gancho → tres planes → guardar */

function PiezaReel({ visible }: { visible: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState(0);
  const [videoLiked, setVideoLiked] = useState(false);
  const [videoSaved, setVideoSaved] = useState(false);
  const [errorVideo, setErrorVideo] = useState(false);

  useEffect(() => {
    if (!visible) videoRef.current?.pause();
  }, [visible]);

  const etapas = [
    {
      nombre: "Gancho",
      senal: "Captar atención",
      texto: "El inicio despierta curiosidad y presenta una razón para seguir viendo: encontrar tu próximo plan.",
    },
    {
      nombre: "Primer plan",
      senal: "Mostrar la experiencia",
      texto: "Una primera opción visual ayuda a imaginar cómo sería vivir ese plan.",
    },
    {
      nombre: "Segundo plan",
      senal: "Dar variedad",
      texto: "Otra experiencia amplía el descubrimiento y conecta con distintos intereses.",
    },
    {
      nombre: "Tercer plan",
      senal: "Completar la selección",
      texto: "La tercera alternativa completa una guía breve y fácil de recordar.",
    },
    {
      nombre: "Cierre: guardar",
      senal: "Una acción clara",
      texto: "Invitamos a guardar la guía para volver a ella. Los detalles y la compra se consultan después en Rumbo.",
    },
  ];

  const irAEtapa = (index: number) => {
    const player = videoRef.current;
    if (!player || !Number.isFinite(player.duration) || player.duration <= 0) {
      return;
    }
    player.currentTime = player.duration * index / etapas.length;
    setStep(index);
  };

  return (
    <div className="flex items-center justify-center gap-[70px]">
      <Item visible={visible}>
        <div
          className="relative w-[338px] overflow-hidden rounded-[28px]"
          style={{
            background: C.noche,
            color: C.crema,
            border: "5px solid " + C.noche,
            boxShadow: "0 20px 50px " + C.noche + "33",
          }}
        >
          <div className="relative aspect-[9/16]">
            <video
              ref={videoRef}
              src="/videos/rumbo-planes.mp4"
              poster="/images/noche-de-baile.jpg"
              controls
              playsInline
              preload="metadata"
              aria-label="Video de Rumbo para TikTok y Reels"
              className="absolute inset-0 h-full w-full object-contain"
              onTimeUpdate={(event) => {
                const player = event.currentTarget;
                if (Number.isFinite(player.duration) && player.duration > 0) {
                  setStep(Math.min(
                    etapas.length - 1,
                    Math.floor(player.currentTime / player.duration * etapas.length)
                  ));
                }
              }}
              onError={() => setErrorVideo(true)}
            >
              Tu navegador no puede reproducir este video.
            </video>

            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 flex justify-center gap-5 pb-7 pt-4 text-[14px] font-bold"
              style={{
                background: "linear-gradient(to bottom, " + C.noche + "bb, transparent)",
              }}
            >
              <span className="opacity-70">Siguiendo</span>
              <span className="border-b-2 pb-1">Para ti</span>
            </div>

            
            {/* Columna lateral de TikTok */}
            <div
              className="absolute right-2 top-[32%] z-10 flex flex-col items-center gap-3"
              style={{
                color: C.crema,
                filter: "drop-shadow(0 2px 4px " + C.noche + ")",
              }}
            >
              <Avatar small />

              <button
                type="button"
                aria-label={videoLiked ? "Quitar me gusta" : "Me gusta"}
                aria-pressed={videoLiked}
                onClick={() => setVideoLiked(!videoLiked)}
                className="flex w-12 cursor-pointer flex-col items-center gap-1 rounded-xl py-1 focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ color: videoLiked ? C.coral : C.crema }}
              >
                <Icon name="heart" filled={videoLiked} size={32} />
                <span className="text-[9px] font-bold">
                  {videoLiked ? "Te gusta" : "Me gusta"}
                </span>
              </button>

              <div
                aria-label="Comentarios: elemento visual"
                className="flex w-12 flex-col items-center gap-1 py-1"
              >
                <Icon name="comment" size={30} />
                <span className="text-[9px] font-bold">Comentar</span>
              </div>

              <button
                type="button"
                aria-label={videoSaved ? "Quitar de guardados" : "Guardar video"}
                aria-pressed={videoSaved}
                onClick={() => setVideoSaved(!videoSaved)}
                className="flex w-12 cursor-pointer flex-col items-center gap-1 rounded-xl py-1 focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ color: videoSaved ? C.mostaza : C.crema }}
              >
                <Icon name="save" filled={videoSaved} size={30} />
                <span className="text-[9px] font-bold">
                  {videoSaved ? "Guardado" : "Guardar"}
                </span>
              </button>

              <div
                aria-label="Compartir: elemento visual"
                className="flex w-12 flex-col items-center gap-1 py-1"
              >
                <Icon name="send" size={30} />
                <span className="text-[9px] font-bold">Compartir</span>
              </div>
            </div>

            {errorVideo && (
              <p
                role="alert"
                className="absolute inset-x-4 top-20 rounded-xl p-4 text-[14px]"
                style={{ background: C.crema, color: C.noche }}
              >
                No se pudo cargar el video.
              </p>
            )}
          </div>
        </div>
      </Item>

      <div className="flex w-[340px] flex-col gap-5">
        <Estrategia
          visible={visible}
          pilar={D.reel.pilar}
          formato="TikTok / Reels"
          etapa={etapas[step].nombre}
          texto={etapas[step].texto}
          senal={etapas[step].senal}
        />

        <div className="flex flex-wrap gap-2">
          {["Gancho", "Plan 1", "Plan 2", "Plan 3", "Guardar"].map(
            (label, i) => (
              <button
                key={label}
                type="button"
                aria-current={step === i ? "step" : undefined}
                onClick={() => irAEtapa(i)}
                className="cursor-pointer rounded-full border px-3 py-2 text-[12px] font-bold focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  background: step === i ? C.mostaza : C.crema,
                  borderColor: step === i ? C.mostaza : C.noche + "33",
                }}
              >
                {label}
              </button>
            )
          )}
        </div>

        <p className="text-[14px] leading-snug opacity-70">
          Pulsa reproducir en el video. Puedes saltar a cada etapa con los botones.
        </p>
      </div>
    </div>
  );
}

/* Stories */
function PiezaStories({ visible }: { visible: boolean }) {
  const s = D.stories;
  const [active, setActive] = useState(0);
  const rm = useReducedMotion();
  const actual = s.items[active];

  return (
    <div className="flex items-center justify-center gap-[70px]">
      <div className="flex items-center gap-4">
        {s.items.map((story, i) => {
          const selected = active === i;

          return (
            <Item key={story.titular} visible={visible} i={i}>
              <div className="flex flex-col items-center gap-3">
                <motion.div
                  initial={false}
                  animate={{
                    scale: selected ? 1 : 0.94,
                    opacity: selected ? 1 : 0.7,
                  }}
                  transition={{ duration: rm ? 0 : 0.25 }}
                  className="relative h-[440px] w-[220px] overflow-hidden rounded-[26px]"
                  style={{
                    background: C.noche,
                    color: C.crema,
                    border: `4px solid ${
                      selected ? C.turquesa : `${C.noche}44`
                    }`,
                    boxShadow: selected
                      ? `0 18px 35px ${C.noche}33`
                      : undefined,
                  }}
                >
                  <motion.div
                    initial={false}
                    animate={{ filter: selected ? "blur(0px)" : "blur(3px)" }}
                    transition={{ duration: rm ? 0 : 0.25 }}
                    className="absolute inset-0"
                  >
                    <Foto
                      src={story.foto}
                      className="absolute inset-0 h-full w-full"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to bottom, ${C.noche}aa, transparent 35%, ${C.noche} 100%)`,
                      }}
                    />

                    <div className="absolute inset-x-3 top-3">
                      <div className="mb-3 flex gap-1">
                        {s.items.map((item, j) => (
                          <span
                            key={item.titular}
                            className="h-1 flex-1 rounded-full"
                            style={{
                              background:
                                j <= i ? C.crema : `${C.crema}44`,
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar small />
                        <p className="text-[13px] font-bold">Rumbo</p>
                      </div>
                    </div>

                    <div className="absolute inset-x-4 bottom-9 flex flex-col items-start gap-4">
                      <h4 className="font-display text-[29px] font-bold leading-[1.05]">
                        {story.titular}
                      </h4>
                      <div className="origin-left scale-[0.75]">
                        <Sticker
                          frase={story.sticker}
                          color={story.color}
                          rot={[-5, 4, -3][i]}
                          visible={visible}
                        />
                      </div>
                    </div>
                  </motion.div>

                  <button
                    type="button"
                    aria-label={`Seleccionar story ${i + 1}: ${story.titular}`}
                    aria-pressed={selected}
                    onClick={() => setActive(i)}
                    className="absolute inset-0 z-10 cursor-pointer rounded-[22px] focus-visible:outline-4 focus-visible:outline-offset-[-6px]"
                    style={{ outlineColor: C.mostaza }}
                  >
                    {!selected && (
                      <span
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-4 py-2 text-[12px] font-bold"
                        style={{ background: C.crema, color: C.noche }}
                      >
                        Ver historia
                      </span>
                    )}
                  </button>
                </motion.div>

                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActive(i)}
                  className="cursor-pointer rounded-full px-3 py-1.5 text-[12px] font-bold focus-visible:outline-2"
                  style={{
                    background: selected ? C.turquesa : `${C.noche}0d`,
                    color: selected ? C.crema : C.noche,
                  }}
                >
                  {i + 1}. {story.etapa}
                </button>
              </div>
            </Item>
          );
        })}
      </div>

      <Estrategia
        visible={visible}
        pilar={s.pilar}
        formato={s.formato}
        etapa={actual.etapa}
        texto={actual.estrategia}
        senal={actual.senal}
      />
    </div>
  );
}

/* c. Carrusel */
function PiezaCarrusel({ visible }: { visible: boolean }) {
  const c = D.carrusel;
  const [active, setActive] = useState(0);
  const lamina = c.laminas[active];

  const change = (delta: number) => {
    setActive((index) => (index + delta + c.laminas.length) % c.laminas.length);
  };

  return (
    <Marco
      visible={visible}
      formato={c.formato}
      pilar={c.pilar}
      nota="Una guía para descubrir opciones y guardar favoritas. Recorre las láminas con las flechas o las miniaturas."
    >
      <div className="flex items-center gap-5">
        <Item visible={visible}>
          <PostFrame>
            <Account />
            <div className="relative h-[350px] overflow-hidden">
              <Foto
                src={lamina.foto}
                className="absolute inset-0 h-full w-full"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={photoShade}
              />
              <span
                className="absolute right-3 top-3 rounded-full px-3 py-1 text-[13px] font-bold"
                style={{ background: C.crema }}
              >
                {active + 1}/{c.laminas.length}
              </span>
              <NavArrow direction="left" onClick={() => change(-1)} />
              <NavArrow direction="right" onClick={() => change(1)} />

              <div
                className="absolute inset-x-0 bottom-0 p-5"
                style={{ color: C.crema }}
                aria-live="polite"
              >
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em]">
                  Tu próximo rumbo
                </p>
                <h4 className="font-display text-[39px] font-bold leading-[1.04]">
                  {lamina.titular}
                </h4>
                <span
                  className="mt-3 inline-block rounded-full px-4 py-1.5 text-[13px] font-bold"
                  style={{ background: C.mostaza, color: C.noche }}
                >
                  {lamina.pie}
                </span>
              </div>
            </div>
            <Actions />
            <Dots
              count={c.laminas.length}
              active={active}
              onChange={setActive}
            />
            <Caption>
              Descubre planes locales, prueba algo nuevo y guarda esta guía
              para después.
            </Caption>
          </PostFrame>
        </Item>

        <Item visible={visible} i={1}>
          <div className="flex w-[190px] flex-col gap-3">
            {c.laminas.map((l, i) => (
              <button
                key={l.titular}
                type="button"
                aria-label={`Ver lámina ${i + 1}: ${l.titular}`}
                aria-pressed={i === active}
                onClick={() => setActive(i)}
                className="flex cursor-pointer items-center gap-3 rounded-2xl p-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  background: C.crema,
                  border: `2px solid ${
                    i === active ? C.turquesa : `${C.noche}22`
                  }`,
                }}
              >
                <Foto
                  src={l.foto}
                  className="h-[68px] w-[54px] shrink-0 rounded-lg"
                />
                <div>
                  <p
                    className="text-[11px] font-bold"
                    style={{ color: C.turquesa }}
                  >
                    {i + 1}/{c.laminas.length}
                  </p>
                  <p className="mt-1 text-[13px] font-semibold leading-tight">
                    {l.titular}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </Item>
      </div>
    </Marco>
  );
}

/* d. Flyer */
function PiezaFlyer({ visible }: { visible: boolean }) {
  const f = D.flyer;

  return (
    <Marco
      visible={visible}
      formato={f.formato}
      pilar={f.pilar}
      nota="Una pieza para compartir: título, fecha y lugar. El enlace y el QR llevan al mismo evento."
    >
      <Item visible={visible}>
        <div
          className="relative flex h-[610px] w-[430px] flex-col overflow-hidden rounded-[22px]"
          style={{
            background: C.crema,
            color: C.noche,
            boxShadow: `0 20px 50px ${C.noche}26`,
          }}
        >
          <div className="relative h-[300px] shrink-0">
            <Foto
              src={f.foto}
              className="absolute inset-0 h-full w-full"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, ${C.noche}, ${C.noche}44 65%, ${C.noche}22)`,
              }}
            />
            <div className="absolute inset-x-5 top-5 flex items-center justify-between">
              <span
                className="font-display text-[27px] font-bold"
                style={{ color: C.crema }}
              >
                Rumbo
              </span>
              <span
                className="rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest"
                style={{ background: C.mostaza, color: C.noche }}
              >
                {f.destacado}
              </span>
            </div>
            <div
              className="absolute inset-x-6 bottom-6"
              style={{ color: C.crema }}
            >
              <p
                className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em]"
                style={{ color: C.mostaza }}
              >
                Tu próximo plan local
              </p>
              <h4 className="font-display text-[46px] font-bold leading-[1.02]">
                {f.titulo}
              </h4>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col px-6 py-5">
            <p
              className="text-[20px] font-bold"
              style={{ color: C.turquesa }}
            >
              {f.fecha}
            </p>
            <p className="mt-1 text-[17px] leading-snug">{f.lugar}</p>
            <div
              className="mt-auto flex items-center gap-5 border-t pt-4"
              style={{ borderColor: `${C.noche}22` }}
            >
              <div
                className="shrink-0 rounded-xl border p-2"
                style={{
                  background: C.crema,
                  borderColor: `${C.noche}22`,
                }}
              >
                <QRCodeSVG
                  value={f.qr}
                  size={112}
                  fgColor={C.noche}
                  bgColor={C.crema}
                  level="M"
                  title="QR del evento"
                />
              </div>
              <div>
                <p className="font-display text-[25px] font-bold leading-tight">
                  Hay plan.
                  <br />
                  Solo faltas tú.
                </p>
                <a
                  href={f.qr}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block rounded-full px-4 py-2 text-[13px] font-bold focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ background: C.turquesa, color: C.crema }}
                >
                  Ver evento
                </a>
                <p className="mt-2 text-[11px] opacity-70">
                  O escanea el QR
                </p>
              </div>
            </div>
          </div>
        </div>
      </Item>
    </Marco>
  );
}

/* e. Post del organizador */
function PiezaPost({ visible }: { visible: boolean }) {
  const p = D.post;

  return (
    <Marco
      visible={visible}
      formato={p.formato}
      pilar={p.pilar}
      nota="La organizadora acerca el evento a su comunidad y dirige a Rumbo para consultar los detalles."
    >
      <Item visible={visible}>
        <PostFrame>
          <Account
            name={p.organizadora}
            detail="Organizadora · Mercadito del Volcán"
          />
          <div className="relative h-[350px]">
            <Foto
              src={p.foto}
              className="absolute inset-0 h-full w-full"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={photoShade}
            />
            <span
              className="absolute left-4 top-4 rounded-full px-3 py-1 text-[12px] font-bold"
              style={{ background: C.coral, color: C.noche }}
            >
              Nos vemos en el mercadito
            </span>
            <div
              className="absolute inset-x-0 bottom-0 p-5"
              style={{ color: C.crema }}
            >
              <h4 className="font-display text-[39px] font-bold leading-[1.03]">
                {D.flyer.titulo}
              </h4>
              <p className="mt-3 text-[15px] font-semibold">{p.detalle}</p>
            </div>
          </div>
          <Actions />
          <Caption name={p.organizadora}>
            Te espero en el Mercadito del Volcán. Encuentra los detalles en
            Rumbo.{" "}
            <a
              href={D.flyer.qr}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline underline-offset-2"
              style={{ color: C.turquesa }}
            >
              {p.boton}
            </a>
          </Caption>
        </PostFrame>
      </Item>
    </Marco>
  );
}

/* Una pieza por pilar */
function PasoPilares({ visible }: { visible: boolean }) {
  return (
    <div className="grid grid-cols-4 gap-6">
      {D.porPilar.map((x, i) => (
        <Item
          key={x.pilar}
          visible={visible}
          i={i}
          className="flex flex-col items-center gap-4"
        >
          <div
            className="w-full overflow-hidden rounded-[22px]"
            style={{
              background: C.crema,
              border: `1px solid ${C.noche}26`,
              boxShadow: `0 12px 30px ${C.noche}1a`,
            }}
          >
            <Account detail={x.pilar} />
            <div className="relative h-[310px] overflow-hidden">
              <Foto
                src={x.foto}
                className="absolute inset-0 h-full w-full"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={photoShade}
              />
              <div className="absolute right-3 top-3">
                <Sticker
                  dibujo={x.sticker}
                  size={44}
                  rot={i % 2 ? 6 : -6}
                  visible={visible}
                  delay={i * 0.12}
                />
              </div>
              <p
                className="absolute inset-x-0 bottom-0 p-4 font-display text-[32px] font-bold leading-tight"
                style={{ color: C.crema }}
              >
                {x.titular}
              </p>
            </div>
            <Actions />
          </div>
          <Chip pilar={x.pilar} />
        </Item>
      ))}
    </div>
  );
}

/* Sistema de contenido */
function PasoSistema({ visible }: { visible: boolean }) {
  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-4 gap-5">
        {D.plantillas.map((p, i) => (
          <Item
            key={p}
            visible={visible}
            i={i}
            className="flex min-h-[170px] items-center justify-center rounded-[26px] px-6 py-6 text-center"
            style={{
              background: [C.turquesa, C.mostaza, C.coral, C.bosque][i],
              color: i === 1 || i === 2 ? C.noche : C.crema,
              boxShadow: `0 8px 20px ${C.noche}1a`,
            }}
          >
            <p className="font-display text-[34px] font-bold leading-tight">
              {p}
            </p>
          </Item>
        ))}
      </div>
      <Item visible={visible} i={5} className="flex flex-wrap gap-3">
        {D.hashtags.map((h) => (
          <span
            key={h}
            className="rounded-full border-2 px-5 py-2 text-[26px] font-bold"
            style={{ borderColor: C.turquesa, color: C.turquesa }}
          >
            {h}
          </span>
        ))}
      </Item>
    </div>
  );
}

/* Cierre */
function PasoCierre({ visible }: { visible: boolean }) {
  return (
    <div className="flex min-h-[560px] flex-col items-center justify-center gap-10 text-center">
      <Item visible={visible}>
        <p className="max-w-[1200px] font-display text-[64px] font-bold leading-[1.1]">
          {D.regla}
        </p>
      </Item>
      <Item visible={visible} i={3}>
        <p
          className={`${caveat.className} text-[48px] leading-none`}
          style={{ color: C.coral }}
        >
          {D.salida}
        </p>
      </Item>
    </div>
  );
}

/* Evita que los clics internos avancen la presentación. */
function ControlesRedes({ children }: { children: ReactNode }) {
  return (
    <div
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
      onKeyUp={(event) => event.stopPropagation()}
    >
      {children}
    </div>
  );
}

export function Redes({
  activa,
  paso,
}: {
  activa: boolean;
  paso: number;
}) {
  const rm = useReducedMotion();
  const p = activa ? paso : -1;

  const titulo =
    p === 0
      ? { opacity: 1, x: 0, y: 330, scale: 1 }
      : p > 0
        ? { opacity: 1, x: -565, y: 70, scale: 0.5 }
        : { opacity: 0, x: 0, y: 340, scale: 0.5 };

  const capa = (on: boolean) => ({
    animate: { opacity: on ? 1 : 0 },
    transition: {
      duration: rm ? 0.15 : 0.35,
      delay: on ? 0.15 : 0,
    },
    style: {
      gridArea: "1 / 1",
      pointerEvents: on ? ("auto" as const) : ("none" as const),
    },
  });

  const pasos = [
    PiezaReel,
    PiezaStories,
    PiezaCarrusel,
    PiezaFlyer,
    PiezaPost,
    PasoPilares,
    PasoSistema,
    PasoCierre,
  ];

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: C.crema, color: C.noche }}
    >
      <div
        aria-hidden
        className="absolute -right-32 -top-40 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{ background: C.coral + "33" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-48 -left-32 h-[480px] w-[480px] rounded-full blur-3xl"
        style={{ background: C.mostaza + "33" }}
      />

      <motion.div
        initial={false}
        animate={titulo}
        transition={
          rm
            ? { duration: 0.2 }
            : { type: "spring", stiffness: 70, damping: 16 }
        }
        className="absolute left-[100px] top-0 w-[1400px] origin-top text-center"
        style={{ zIndex: 20 }}
      >
        <h1 className="font-display text-[84px] font-bold leading-[1.02]">
          {D.titulo}
        </h1>
        <p
          className={`${caveat.className} mt-4 text-[40px]`}
          style={{ color: C.coral }}
        >
          {D.subtitulo}
        </p>
      </motion.div>

      <div className="absolute left-[60px] top-[190px] grid w-[1480px]">
        {pasos.map((Paso, i) => (
          <motion.div
            key={i}
            aria-hidden={p !== i + 1}
            inert={p !== i + 1}
            initial={false}
            {...capa(p === i + 1)}
          >
            <ControlesRedes>
              <Paso visible={p === i + 1} />
            </ControlesRedes>
          </motion.div>
        ))}
      </div>
    </div>
  );
}