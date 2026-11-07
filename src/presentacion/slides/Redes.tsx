"use client";
import { type CSSProperties, type ReactNode } from "react";
import { Caveat } from "next/font/google";
import { motion, useReducedMotion } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { Sticker } from "./RedesStickers";

/** Textos, titulares, fechas, hashtags y pilar de cada pieza. Sin métricas de alcance ni seguidores. */
const REDES_DATOS = {
  titulo: "Rumbo en tus redes",
  subtitulo: "(lo que ves en el feed, en stories y en el flyer)",
  pilares: {
    Aventura: { color: "#0A7C7C", texto: "#FFFFFF" },
    Conexión: { color: "#F28F6B", texto: "#12303A" },
    Emprendedurismo: { color: "#F5B82E", texto: "#12303A" },
    Bienestar: { color: "#1E5E45", texto: "#FFFFFF" },
  } as Record<string, { color: string; texto: string }>,
  reel: {
    formato: "Reel / TikTok", pilar: "Aventura", titulo: "3 rumbos para este finde", gancho: "Tu finde ya tiene plan",
    planes: [
      { n: "Mercadito del Volcán", d: "Sáb · 9:00 a. m.", foto: "/images/mercado.jpg" },
      { n: "Atardecer con ritmos de la costa", d: "Dom · 4:30 p. m.", foto: "/images/concierto.jpg" },
      { n: "Caminata al aire libre", d: "Sáb · temprano", foto: "/images/caminata.jpg" },
    ],
    escenas: ["Gancho", "Los planes", "Guárdalo"],
  },
  stories: {
    formato: "Stories", pilar: "Conexión",
    items: [
      { foto: "/images/concierto.jpg", titular: "Atardecer con ritmos de la costa", sticker: "Quedan 2 días", color: "#F5B82E" },
      { foto: "/images/luces.jpg", titular: "Este finde, ¿qué toca?", sticker: "¿Mercadito o concierto?", color: "#FFFFFF" },
      { foto: "/images/mercado.jpg", titular: "Mercadito del Volcán", sticker: "Ver el evento", color: "#C5E063" },
    ],
  },
  carrusel: {
    formato: "Carrusel", pilar: "Emprendedurismo",
    laminas: [
      { foto: "/images/tienda.jpg", titular: "Guía semanal de planes", pie: "Desliza" },
      { foto: "/images/mercado.jpg", titular: "Mercadito del Volcán", pie: "Sábado" },
      { foto: "/images/ceramica.jpg", titular: "Taller de cerámica", pie: "Domingo" },
      { foto: "/images/comida.jpg", titular: "Guarda tu plan en Rumbo", pie: "Un enlace, un QR" },
    ],
  },
  flyer: {
    formato: "Flyer · evento destacado", pilar: "Emprendedurismo", destacado: "Evento destacado ($30)",
    titulo: "Mercadito del Volcán", fecha: "Sábado · 9:00 a. m.", lugar: "Parque Cafetalón, Santa Tecla", qr: "https://rumbo.sv/e/mercadito-del-volcan",
  },
  post: {
    formato: "Post del organizador", pilar: "Emprendedurismo", organizadora: "Camila",
    titular: "Camila publica su mercadito en Rumbo", detalle: "Sábado · Parque Cafetalón", boton: "Ver evento", foto: "/images/mercado.jpg",
  },
  porPilar: [
    { pilar: "Aventura", titular: "Rumbo a la caminata", foto: "/images/caminata.jpg", sticker: "mochila" },
    { pilar: "Conexión", titular: "Vamos a rumbear", foto: "/images/luces.jpg", sticker: "nota" },
    { pilar: "Emprendedurismo", titular: "Lo local, a un toque", foto: "/images/mercado.jpg", sticker: "estrella" },
    { pilar: "Bienestar", titular: "Hay plan para desconectar", foto: "/images/yoga.jpg", sticker: "sol" },
  ],
  plantillas: ["3 rumbos para este finde", "Cuenta regresiva", "Así estuvo", "Presupuesto de $10"],
  hashtags: ["#Rumbo", "#RumboSV", "#ElSalvador", "#FindeEnSV", "#MercaditosSV", "#EventosSV", "#Rumbear"],
  regla: "Instagram y TikTok son para descubrir; la compra pasa en un solo enlace y un solo QR.",
  salida: "¿Y cómo sabemos si funciona? Lo medimos",
};

const caveat = Caveat({ subsets: ["latin"], weight: "600" });
const C = { crema: "#FAF6EF", noche: "#12303A", turquesa: "#0A7C7C", mostaza: "#F5B82E", coral: "#F28F6B", terracota: "#E2683F" };
const D = REDES_DATOS;

function Item({ visible, i = 0, base = 0.15, className, style, children }: { visible: boolean; i?: number; base?: number; className?: string; style?: CSSProperties; children: ReactNode }) {
  const rm = useReducedMotion();
  return (
    <motion.div initial={false} className={className} style={style}
      animate={visible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: rm ? 0 : 30, scale: rm ? 1 : 0.92 }}
      transition={rm || !visible ? { duration: 0.2 } : { type: "spring", stiffness: 130, damping: 10, delay: base + i * 0.15 }}>{children}</motion.div>
  );
}

function Chip({ pilar }: { pilar: string }) {
  const c = D.pilares[pilar];
  return <span className="inline-block rounded-full px-4 py-1 text-[16px] font-bold uppercase tracking-[0.1em]" style={{ background: c.color, color: c.texto }}>{pilar}</span>;
}

const Foto = ({ src, className }: { src: string; className?: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={src} alt="" className={`block object-cover ${className ?? ""}`} />
);

/** Marco de celular vertical. */
function Celular({ w, h, children }: { w: number; h: number; children: ReactNode }) {
  return <div className="relative flex shrink-0 flex-col overflow-hidden rounded-[34px] border-[8px] bg-white shadow-2xl shadow-black/25" style={{ width: w, height: h, borderColor: C.noche }}>{children}</div>;
}

/** Fila: pieza a la izquierda y pie de pieza a la derecha. */
function Marco({ visible, formato, pilar, nota, children }: { visible: boolean; formato: string; pilar: string; nota: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-14">
      {children}
      <Item visible={visible} i={5} className="flex w-[300px] flex-col items-start gap-4">
        <Chip pilar={pilar} />
        <h3 className="font-display text-[38px] font-bold leading-tight">{formato}</h3>
        <p className="text-[22px] leading-snug opacity-80">{nota}</p>
      </Item>
    </div>
  );
}

/* a. Reel */
function PiezaReel({ visible }: { visible: boolean }) {
  const r = D.reel;
  return (
    <Marco visible={visible} formato={r.formato} pilar={r.pilar} nota="Los primeros 3 segundos llevan el gancho; luego, tres planes y el cierre con guardar.">
      <Item visible={visible}>
        <Celular w={340} h={620}>
          <div className="flex min-h-0 flex-1 flex-col gap-2 px-4 pb-2 pt-4" style={{ background: C.crema }}>
            <p className="rounded-full px-3 py-1 text-center text-[16px] font-bold" style={{ background: C.noche, color: C.crema }}>{r.gancho}</p>
            <h4 className="font-display text-[34px] font-bold leading-[1.02]">{r.titulo}</h4>
            {r.planes.map((p, i) => (
              <div key={p.n} className="flex items-center gap-3 rounded-2xl bg-white p-2 shadow-md shadow-black/10">
                <Foto src={p.foto} className="h-[76px] w-[76px] shrink-0 rounded-xl" />
                <div><p className="text-[13px] font-bold" style={{ color: C.turquesa }}>{i + 1}</p><p className="text-[17px] font-bold leading-tight">{p.n}</p><p className="text-[14px] opacity-70">{p.d}</p></div>
              </div>
            ))}
            <div className="mt-auto flex items-center gap-1.5">
              {r.escenas.map((e, i) => <div key={e} className="flex-1"><div className="h-1.5 rounded-full" style={{ background: i === 0 ? C.turquesa : C.noche + "33" }} /><p className="mt-1 text-[11px] font-semibold">{e}</p></div>)}
            </div>
            <div className="flex items-center gap-2"><svg aria-hidden width="14" height="14" viewBox="0 0 14 14"><path d="M2 1l11 6-11 6z" fill={C.noche} /></svg><div className="h-1 flex-1 rounded-full" style={{ background: C.noche + "33" }}><div className="h-1 w-1/4 rounded-full" style={{ background: C.coral }} /></div><span className="text-[11px]">0:03</span></div>
          </div>
        </Celular>
      </Item>
    </Marco>
  );
}

/* b. Stories */
function PiezaStories({ visible }: { visible: boolean }) {
  const s = D.stories;
  return (
    <Marco visible={visible} formato={s.formato} pilar={s.pilar} nota="Un sticker por story: cuenta regresiva, encuesta y enlace al evento.">
      <div className="flex gap-5">
        {s.items.map((it, i) => (
          <Item key={it.titular} visible={visible} i={i}>
            <Celular w={210} h={430}>
              <Foto src={it.foto} className="absolute inset-0 h-full w-full" />
              <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(to top, #12303Acc, transparent 55%)" }} />
              <div className="relative mt-auto flex flex-col items-start gap-3 p-4">
                <p className="font-display text-[24px] font-bold leading-tight text-white">{it.titular}</p>
                <Sticker frase={it.sticker} color={it.color} rot={[-5, 4, -3][i]} visible={visible} delay={i * 0.15} />
              </div>
            </Celular>
          </Item>
        ))}
      </div>
    </Marco>
  );
}

/* c. Carrusel */
function PiezaCarrusel({ visible }: { visible: boolean }) {
  const c = D.carrusel;
  return (
    <Marco visible={visible} formato={c.formato} pilar={c.pilar} nota="Feed limpio: una foto y un titular corto por lámina.">
      <div className="flex gap-4">
        {c.laminas.map((l, i) => (
          <Item key={l.titular} visible={visible} i={i}>
            <div className="relative flex h-[420px] w-[200px] flex-col justify-end overflow-hidden rounded-[22px] shadow-xl shadow-black/20">
              <Foto src={l.foto} className="absolute inset-0 h-full w-full" />
              <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(to top, #12303Ae6, transparent 60%)" }} />
              <div className="relative p-4 text-white">
                <p className="font-display text-[26px] font-bold leading-tight">{l.titular}</p>
                <p className="mt-1 text-[16px] font-semibold opacity-90">{l.pie}</p>
              </div>
              <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-0.5 text-[14px] font-bold">{i + 1}/{c.laminas.length}</span>
            </div>
          </Item>
        ))}
      </div>
    </Marco>
  );
}

/* d. Flyer */
function PiezaFlyer({ visible }: { visible: boolean }) {
  const f = D.flyer;
  return (
    <Marco visible={visible} formato={f.formato} pilar={f.pilar} nota="Título claro, un QR grande y un sello de pasaporte de Rumbo.">
      <Item visible={visible}>
        <div className="flex h-[620px] w-[440px] flex-col gap-3 overflow-hidden rounded-[22px] px-8 py-7 shadow-2xl shadow-black/25" style={{ background: C.turquesa, color: "#fff" }}>
          <div className="flex items-center justify-between">
            <span className="rounded-full px-4 py-1 text-[15px] font-bold uppercase tracking-[0.1em]" style={{ background: C.mostaza, color: C.noche }}>{f.destacado}</span>
            <Sticker dibujo="sello" size={50} rot={-8} visible={visible} />
          </div>
          <h4 className="font-display text-[50px] font-bold leading-[1.02]">{f.titulo}</h4>
          <p className="text-[21px] font-semibold leading-snug">{f.fecha}<br />{f.lugar}</p>
          <div className="mt-auto flex items-end gap-4">
            <div className="rounded-2xl bg-white p-3"><QRCodeSVG value={f.qr} size={170} fgColor={C.noche} bgColor="#FFFFFF" level="M" title="QR del evento" /></div>
            <div className="flex flex-col items-start gap-2">
              <Sticker dibujo="volcan" size={52} rot={6} visible={visible} delay={0.1} />
              <Sticker frase="Hay plan" color={C.mostaza} rot={-5} visible={visible} delay={0.2} />
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
    <Marco visible={visible} formato={p.formato} pilar={p.pilar} nota="El organizador comparte su evento con su propia audiencia y lleva a Rumbo.">
      <Item visible={visible}>
        <div className="flex h-[600px] w-[480px] flex-col overflow-hidden rounded-[22px] bg-white shadow-2xl shadow-black/25">
          <div className="flex items-center gap-3 px-5 py-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full font-display text-[22px] font-bold text-white" style={{ background: C.coral }}>{p.organizadora[0]}</span>
            <p className="text-[19px] font-bold">{p.organizadora}</p>
          </div>
          <div className="relative min-h-0 flex-1">
            <Foto src={p.foto} className="absolute inset-0 h-full w-full" />
            <div className="absolute bottom-3 left-3"><Sticker dibujo="estrella" size={46} rot={-7} visible={visible} /></div>
          </div>
          <div className="flex flex-col gap-3 px-5 py-4">
            <p className="font-display text-[28px] font-bold leading-tight">{p.titular}</p>
            <p className="text-[18px] opacity-70">{p.detalle}</p>
            <span className="self-start rounded-full px-7 py-2.5 text-[20px] font-bold text-white" style={{ background: C.turquesa }}>{p.boton}</span>
          </div>
        </div>
      </Item>
    </Marco>
  );
}

/* Una pieza por pilar */
function PasoPilares({ visible }: { visible: boolean }) {
  return (
    <div className="grid grid-cols-4 gap-6">
      {D.porPilar.map((x, i) => (
        <Item key={x.pilar} visible={visible} i={i} className="flex flex-col items-center gap-4">
          <div className="relative flex h-[500px] w-full flex-col justify-between overflow-hidden rounded-[26px] p-4 shadow-xl shadow-black/20">
            <Foto src={x.foto} className="absolute inset-0 h-full w-full" />
            <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(to top, #12303Ae6, transparent 55%)" }} />
            <div className="relative flex justify-between"><Chip pilar={x.pilar} /><Sticker dibujo={x.sticker} size={44} rot={i % 2 ? 6 : -6} visible={visible} delay={i * 0.12} /></div>
            <p className="relative font-display text-[34px] font-bold leading-tight text-white">{x.titular}</p>
          </div>
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
          <Item key={p} visible={visible} i={i} className="flex min-h-[170px] items-center justify-center rounded-[26px] px-6 py-6 text-center shadow-lg shadow-black/10"
            style={{ background: [C.turquesa, C.mostaza, C.coral, "#1E5E45"][i], color: i === 1 || i === 2 ? C.noche : "#fff" }}>
            <p className="font-display text-[34px] font-bold leading-tight">{p}</p>
          </Item>
        ))}
      </div>
      <Item visible={visible} i={5} className="flex flex-wrap gap-3">
        {D.hashtags.map((h) => <span key={h} className="rounded-full border-2 px-5 py-2 text-[26px] font-bold" style={{ borderColor: C.turquesa, color: C.turquesa }}>{h}</span>)}
      </Item>
    </div>
  );
}

/* Cierre */
function PasoCierre({ visible }: { visible: boolean }) {
  return (
    <div className="flex min-h-[560px] flex-col items-center justify-center gap-10 text-center">
      <Item visible={visible}><p className="max-w-[1200px] font-display text-[64px] font-bold leading-[1.1]">{D.regla}</p></Item>
      <Item visible={visible} i={3}><p className={`${caveat.className} text-[48px] leading-none`} style={{ color: C.terracota }}>{D.salida}</p></Item>
    </div>
  );
}

export function Redes({ activa, paso }: { activa: boolean; paso: number }) {
  const rm = useReducedMotion();
  const p = activa ? paso : -1;
  const titulo = p === 0 ? { opacity: 1, x: 0, y: 330, scale: 1 } : p > 0 ? { opacity: 1, x: -565, y: 70, scale: 0.5 } : { opacity: 0, x: 0, y: 340, scale: 0.5 };
  const capa = (on: boolean) => ({ animate: { opacity: on ? 1 : 0 }, transition: { duration: rm ? 0.15 : 0.35, delay: on ? 0.15 : 0 }, style: { gridArea: "1 / 1", pointerEvents: on ? "auto" as const : "none" as const } });
  const pasos = [PiezaReel, PiezaStories, PiezaCarrusel, PiezaFlyer, PiezaPost, PasoPilares, PasoSistema, PasoCierre];

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: C.crema, color: C.noche }}>
      <div aria-hidden className="absolute -right-32 -top-40 h-[520px] w-[520px] rounded-full blur-3xl" style={{ background: C.coral + "33" }} />
      <div aria-hidden className="absolute -bottom-48 -left-32 h-[480px] w-[480px] rounded-full blur-3xl" style={{ background: C.mostaza + "33" }} />
      <motion.div initial={false} animate={titulo} transition={rm ? { duration: 0.2 } : { type: "spring", stiffness: 70, damping: 16 }}
        className="absolute left-[100px] top-0 w-[1400px] origin-top text-center" style={{ zIndex: 20 }}>
        <h1 className="font-display text-[84px] font-bold leading-[1.02]">{D.titulo}</h1>
        <p className={`${caveat.className} mt-4 text-[40px]`} style={{ color: C.terracota }}>{D.subtitulo}</p>
      </motion.div>
      {/* Escenario: capas en una sola celda; termina antes de y = 850 */}
      <div className="absolute left-[60px] top-[190px] grid w-[1480px]">
        {pasos.map((Paso, i) => (
          <motion.div key={i} aria-hidden={p !== i + 1} initial={false} {...capa(p === i + 1)}><Paso visible={p === i + 1} /></motion.div>
        ))}
      </div>
    </div>
  );
}
