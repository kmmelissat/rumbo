@AGENTS.md

# Rumbo — contexto del proyecto (léelo en vez de re-explorar)

Prototipo local-first para descubrir y comprar eventos locales en El Salvador. Español neutro con tuteo, sin emojis.

## Stack
Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind 4 (`@theme` en `app/globals.css`), `motion` (`import ... from "motion/react"`), `qrcode.react`. Alias `@/*` apunta a la raíz del repo.

## Mapa
- `/` presentación interactiva: `src/presentacion/` (motor en `motor/`, slides en `slides/`, registro en `slides/index.ts`). Lienzo 1600x900.
- `/prototipo/*` app cliente: `app/prototipo/`. Shell, tabs y modo embed (`?embed=1`) en `components/Shell.tsx`.
- Estado: `lib/store.tsx` (localStorage `rumbo:v2`, sincroniza con el evento `storage`). Datos: `lib/data.ts`.
- Logo: `src/components/Logo.tsx`.

## Diseño
- Paleta fija: marca #0FA3A3, tinta #111827, coral #FF8A6B, oceano #0E5A8A, lima #C5E063, arena #FFF4DF. Usar tokens semánticos (`bg-sup`, `text-ink`, `text-acento`) para que funcione el modo oscuro.
- Fuentes: Fraunces (títulos), DM Sans (texto), Bricolage Grotesque (`font-mano`, acentos; máx. 3 por pantalla).
- Respetar `prefers-reduced-motion`; táctiles de 44 px.

## Reglas de trabajo
- NO ejecutar `rm -rf .next` ni `next build` si `npm run dev` está corriendo (comparten `.next`). Comprobar con `pgrep -fl next` primero. Verificar con `npx tsc --noEmit`.
- Matar solo procesos propios (por PID), nunca `pkill -f "next dev"`.
- Cambios mínimos y dirigidos; no reescribir archivos completos si basta un Edit.
- Respuestas breves: sin recapitular lo ya hecho.
- Nunca añadir líneas de coautoría ni atribución de IA en commits ni PRs.
