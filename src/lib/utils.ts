import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Iniciais para o avatar do card (máx. 2 letras). */
export function getIniciaisNome(nome: string): string {
  const partes = (nome || "").trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

/** Cor determinística do avatar a partir do nome. */
const CORES_AVATAR = [
  "#011e41",
  "#4f758c",
  "#b1915d",
  "#967cd0",
  "#cc6114",
  "#059669",
  "#0369a1",
];
export function getCorIniciais(nome: string): string {
  let h = 0;
  for (let i = 0; i < nome.length; i++) h = (h * 31 + nome.charCodeAt(i)) >>> 0;
  return CORES_AVATAR[h % CORES_AVATAR.length];
}

/** Normaliza telefone para link wa.me.
 * Aceita formatos livres; assume Brasil (55) quando o número tem 10-11 dígitos
 * e não começa com código de país. */
export function formatarTelefoneWhatsApp(telefone: string): string {
  let d = (telefone || "").replace(/\D/g, "");
  if (!d) return "#";
  if ((d.length === 10 || d.length === 11) && !d.startsWith("55")) {
    d = "55" + d;
  }
  return `https://wa.me/${d}`;
}

/** Alerta de card parado (dias desde a última interação). */
export function getAlertaDias(dias: number): "normal" | "amber" | "red" {
  if (dias >= 7) return "red";
  if (dias >= 3) return "amber";
  return "normal";
}

/** Dias inteiros desde uma data ISO até hoje. */
export function diasDesde(iso?: string): number {
  if (!iso) return 0;
  const t = new Date(iso).getTime();
  if (isNaN(t)) return 0;
  return Math.floor((Date.now() - t) / 86400000);
}

export function idAleatorio(): string {
  return "l_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
