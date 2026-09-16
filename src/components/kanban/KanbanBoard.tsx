import { useMemo, useState } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { ETAPAS } from "@/lib/etapas";
import type { EtapaId, Lead, Lista } from "@/lib/types";
import { useStore } from "@/lib/store";
import { KanbanColuna } from "./KanbanColuna";
import { LeadDrawer } from "./LeadDrawer";

export function KanbanBoard({ lista, busca }: { lista: Lista; busca: string }) {
  const { leads, moverLead } = useStore();
  const [selecionado, setSelecionado] = useState<Lead | null>(null);

  const termo = busca.trim().toLowerCase();

  const porEtapa = useMemo(() => {
    const map: Record<EtapaId, Lead[]> = {
      aguardando_convite: [],
      recebeu_convite: [],
      respondeu_negativo: [],
      respondeu_positivo: [],
      nao_respondeu: [],
      em_negociacao: [],
      comprou: [],
    };
    for (const l of leads) {
      if (l.lista !== lista) continue;
      if (
        termo &&
        !`${l.nome} ${l.empresa ?? ""} ${l.cargo ?? ""} ${l.telefone ?? ""}`
          .toLowerCase()
          .includes(termo)
      )
        continue;
      map[l.etapa].push(l);
    }
    return map;
  }, [leads, lista, termo]);

  function onDragEnd(r: DropResult) {
    if (!r.destination) return;
    if (r.destination.droppableId === r.source.droppableId) return;
    moverLead(r.draggableId, r.destination.droppableId as EtapaId);
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="h-full overflow-x-auto scroll-thin px-4 pb-4">
          <div className="flex gap-3 h-full min-h-0">
            {ETAPAS.map((etapa) => (
              <KanbanColuna
                key={etapa.id}
                etapa={etapa}
                leads={porEtapa[etapa.id]}
                onCardClick={setSelecionado}
              />
            ))}
          </div>
        </div>
      </DragDropContext>

      {selecionado && (
        <LeadDrawer
          leadId={selecionado.id}
          onClose={() => setSelecionado(null)}
        />
      )}
    </>
  );
}
