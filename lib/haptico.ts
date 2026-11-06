/** Haptics simulados: vibra en dispositivos que lo permiten; la animación visual la pone cada componente. */
export function haptico(ms = 8) {
  try { navigator.vibrate?.(ms); } catch {}
}
