/* Dados fixos do evento — fonte: vault SONNE, "Cronograma do Evento Presencial
 * Atualizado (Call 03-09)". Usados no dashboard e no cabeçalho. */

export const EVENTO = {
  nome: "Curso Estratégia dos 3 Pilares",
  organizador: "Max Bavaresco",
  datas: "12 e 13 de novembro de 2026",
  local: "Câmara Sueca (escritório do Max) — São Paulo",
  precoIngresso: 7000,
  capacidade: 24,
  metaVagas: 20,
} as const;

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
