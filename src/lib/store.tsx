/* Estado do CRM no cliente, persistido em localStorage.
 * Escopo desta fase (projeto local): frontend funcional, sem backend.
 * A migração para Supabase (padrão dos outros CRMs) fica para a fase 2. */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { EtapaId, Lead, Lista } from "./types";
import { MOCK_LEADS } from "./mock-data";
import { idAleatorio } from "./utils";

const STORAGE_KEY = "crm-sonne:leads:v1";

interface StoreCtx {
  leads: Lead[];
  carregado: boolean;
  moverLead: (id: string, etapa: EtapaId) => void;
  atualizarLead: (id: string, patch: Partial<Lead>) => void;
  removerLead: (id: string) => void;
  importarLeads: (novos: Lead[], lista: Lista) => number;
  resetar: () => void;
  leadsPorLista: (lista: Lista) => Lead[];
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [carregado, setCarregado] = useState(false);

  // Hidrata do localStorage (ou semeia com o mock na primeira vez).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setLeads(JSON.parse(raw));
      } else {
        setLeads(MOCK_LEADS);
      }
    } catch {
      setLeads(MOCK_LEADS);
    }
    setCarregado(true);
  }, []);

  // Persiste a cada mudança (após hidratado).
  useEffect(() => {
    if (!carregado) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    } catch {
      /* quota / modo privado — segue em memória */
    }
  }, [leads, carregado]);

  const moverLead = useCallback((id: string, etapa: EtapaId) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, etapa, atualizadoEm: new Date().toISOString() } : l
      )
    );
  }, []);

  const atualizarLead = useCallback((id: string, patch: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, ...patch, atualizadoEm: new Date().toISOString() } : l
      )
    );
  }, []);

  const removerLead = useCallback((id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }, []);

  /** Importa uma lista. Dedup por telefone (dígitos) dentro da mesma lista. */
  const importarLeads = useCallback((novos: Lead[], lista: Lista): number => {
    let inseridos = 0;
    setLeads((prev) => {
      const existentesTel = new Set(
        prev
          .filter((l) => l.lista === lista && l.telefone)
          .map((l) => l.telefone!.replace(/\D/g, ""))
      );
      const aAdicionar: Lead[] = [];
      for (const n of novos) {
        const tel = (n.telefone || "").replace(/\D/g, "");
        if (tel && existentesTel.has(tel)) continue;
        if (tel) existentesTel.add(tel);
        aAdicionar.push({
          ...n,
          id: n.id || idAleatorio(),
          lista,
          etapa: n.etapa || "aguardando_convite",
          tags: n.tags || [],
          criadoEm: n.criadoEm || new Date().toISOString(),
        });
        inseridos++;
      }
      return [...prev, ...aAdicionar];
    });
    return inseridos;
  }, []);

  const resetar = useCallback(() => setLeads(MOCK_LEADS), []);

  const leadsPorLista = useCallback(
    (lista: Lista) => leads.filter((l) => l.lista === lista),
    [leads]
  );

  const value = useMemo<StoreCtx>(
    () => ({
      leads,
      carregado,
      moverLead,
      atualizarLead,
      removerLead,
      importarLeads,
      resetar,
      leadsPorLista,
    }),
    [leads, carregado, moverLead, atualizarLead, removerLead, importarLeads, resetar, leadsPorLista]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): StoreCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore precisa estar dentro de <StoreProvider>");
  return ctx;
}
