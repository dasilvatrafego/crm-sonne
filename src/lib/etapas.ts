import type { EtapaId } from "./types";

export interface EtapaDef {
  id: EtapaId;
  titulo: string;
  /** Cor de destaque da coluna (topo + badges). */
  cor: string;
  corBg: string;
  descricao: string;
}

/** Ordem EXATA definida pelo João:
 * Aguardando Convite → Recebeu Convite → Respondeu negativamente →
 * Respondeu positivamente → Não respondeu → Em negociação → Comprou
 */
export const ETAPAS: EtapaDef[] = [
  {
    id: "aguardando_convite",
    titulo: "Aguardando Convite",
    cor: "#64748b",
    corBg: "#f1f5f9",
    descricao: "Lead na base, convite ainda não enviado.",
  },
  {
    id: "recebeu_convite",
    titulo: "Recebeu Convite",
    cor: "#4f758c",
    corBg: "#eef4f8",
    descricao: "Convite enviado, aguardando resposta.",
  },
  {
    id: "respondeu_negativo",
    titulo: "Respondeu — Não",
    cor: "#e11d48",
    corBg: "#fff1f3",
    descricao: "Recusou o convite.",
  },
  {
    id: "respondeu_positivo",
    titulo: "Respondeu — Sim",
    cor: "#059669",
    corBg: "#ecfdf5",
    descricao: "Demonstrou interesse em participar.",
  },
  {
    id: "nao_respondeu",
    titulo: "Não Respondeu",
    cor: "#d97706",
    corBg: "#fffbeb",
    descricao: "Sem resposta — precisa de follow-up.",
  },
  {
    id: "em_negociacao",
    titulo: "Em Negociação",
    cor: "#b1915d",
    corBg: "#faf6ef",
    descricao: "Conversa avançada sobre a compra do ingresso.",
  },
  {
    id: "comprou",
    titulo: "Comprou",
    cor: "#011e41",
    corBg: "#e9edf3",
    descricao: "Ingresso confirmado / pago.",
  },
];

export const ETAPA_POR_ID: Record<EtapaId, EtapaDef> = ETAPAS.reduce(
  (acc, e) => {
    acc[e.id] = e;
    return acc;
  },
  {} as Record<EtapaId, EtapaDef>
);
