/* Modelos de dados do CRM SONNE — evento presencial (curso 12-13/11/2026). */

/** As duas listas importadas hoje: base de clientes atendidos vs. prospects frios. */
export type Lista = "clientes" | "prospects";

/** Etapas do funil de convite — ordem exata definida pelo João.
 * O comercial aqui é diferente do CRM comum: o eixo é o CONVITE, não o lead genérico. */
export type EtapaId =
  | "aguardando_convite"
  | "recebeu_convite"
  | "respondeu_negativo"
  | "respondeu_positivo"
  | "nao_respondeu"
  | "em_negociacao"
  | "comprou";

export interface Lead {
  id: string;
  nome: string;
  empresa?: string;
  cargo?: string;
  telefone?: string;
  email?: string;
  lista: Lista;
  etapa: EtapaId;
  /** Anotações do Max sobre a conversa/relacionamento. */
  notas?: string;
  /** Tags livres — ex.: "âncora", "quente", "indicação". */
  tags: string[];
  /** ISO date da última movimentação/interação — dirige o alerta de card parado. */
  atualizadoEm?: string;
  criadoEm?: string;
}
