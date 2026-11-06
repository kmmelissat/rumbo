"use client";
import { useStore } from "@/lib/store";
import { COLOR_CAT, PILARES, ZONAS, formatFecha } from "@/lib/data";
import { Foto } from "@/components/Foto";
import { Encabezado, Switch } from "@/components/Botones";
import { Nota } from "@/components/Marca";

const META = 5;

export default function Perfil() {
  const { eventos, sellos, zona, setZona, intereses, toggleInteres, notificaciones, setNotificaciones, reiniciar } = useStore();
  const n = sellos.length;
  const enCamino = n % META;
  const faltan = META - enCamino;
  const recompensas = Math.floor(n / META);

  return (
    <div className="pb-6">
      <Encabezado titulo="Perfil" color="text-lima" />

      <section className="mx-4 rounded-[20px] border-2 border-marca bg-arena p-4" aria-label="Pasaporte">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg">Pasaporte</h2>
            <p className="text-sm text-gris">Un sello por cada evento al que vas.</p>
            <Nota className="-rotate-2 text-oceano">¡colecciónalos!</Nota>
          </div>
          <p className="font-display text-4xl font-bold tabular-nums text-oceano">{n}</p>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuemin={0} aria-valuemax={META} aria-valuenow={enCamino} aria-label="Progreso hacia la próxima recompensa">
          <div className="h-full rounded-full bg-marca transition-all duration-500" style={{ width: `${(enCamino / META) * 100}%` }} />
        </div>
        <p className="mt-2 text-sm text-gris">
          {n > 0 && enCamino === 0 ? "¡Recompensa desbloqueada! Empieza otra ronda." : `${enCamino} de ${META} · ${faltan === 1 ? "te falta 1 sello" : `te faltan ${faltan} sellos`} para tu próxima recompensa.`}
          {recompensas > 0 && ` Recompensas ganadas: ${recompensas}.`}
        </p>

        {n > 0 ? (
          <ul className="mt-4 grid grid-cols-3 gap-3">
            {sellos.map((s) => {
              const e = eventos.find((x) => x.id === s.eventoId);
              if (!e) return null;
              return (
                <li key={s.eventoId} className="text-center">
                  <Foto src={e.foto} sizes="90px" className={`mx-auto aspect-square w-full rounded-full ring-4 ring-offset-2 ${COLOR_CAT[e.categoria].anillo}`} />
                  <p className="mt-2 text-xs font-semibold leading-tight">{e.categoria}</p>
                  <p className="text-[11px] capitalize text-gris">{formatFecha(e.fecha)}</p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-4 rounded-2xl bg-white p-3 text-sm text-gris">Pasaporte en blanco. Compra tu primer boleto y estrena el primer sello.</p>
        )}
      </section>

      <section className="mx-4 mt-6" aria-label="Ajustes">
        <h2 className="pb-2 text-lg">Ajustes</h2>
        <div className="divide-y divide-linea rounded-[20px] border border-linea px-4">
          <label className="flex min-h-[52px] items-center justify-between gap-3">
            <span className="font-medium">Zona</span>
            <select value={zona} onChange={(e) => setZona(e.target.value)} className="min-h-[44px] bg-transparent text-right text-gris">
              {ZONAS.map((z) => <option key={z.nombre}>{z.nombre}</option>)}
            </select>
          </label>
          <Switch on={notificaciones} onChange={setNotificaciones} label="Recordatorios de eventos" detalle="Te avisamos antes de tus planes." />
          <div className="py-3">
            <p className="pb-2 font-medium">Intereses</p>
            <div className="flex flex-wrap gap-2">
              {PILARES.map((p) => {
                const on = intereses.includes(p.id);
                return (
                  <button key={p.id} aria-pressed={on} onClick={() => toggleInteres(p.id)}
                    className={`min-h-[44px] rounded-xl border-2 px-3 text-sm font-bold ${on ? p.estilo : "border-linea text-gris"}`}>{p.id}</button>
                );
              })}
            </div>
          </div>
        </div>
        <button onClick={() => { if (window.confirm("Se borrarán tus guardados, boletos y sellos de esta demo. ¿Continuar?")) reiniciar(); }}
          className="mt-4 min-h-[44px] w-full text-sm font-medium text-gris underline">Restablecer datos de la demo</button>
      </section>
    </div>
  );
}
