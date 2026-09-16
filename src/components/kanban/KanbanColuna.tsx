import { Draggable, Droppable } from "@hello-pangea/dnd";
import type { EtapaDef } from "@/lib/etapas";
import type { Lead } from "@/lib/types";
import { KanbanCard } from "./KanbanCard";
import { cn } from "@/lib/utils";

interface Props {
  etapa: EtapaDef;
  leads: Lead[];
  onCardClick: (lead: Lead) => void;
}

export function KanbanColuna({ etapa, leads, onCardClick }: Props) {
  return (
    <div className="flex flex-col w-[280px] shrink-0 rounded-xl bg-muted/70 border border-gray-200/70 max-h-full">
      {/* Cabeçalho */}
      <div className="px-3 py-2.5 border-b border-gray-200/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: etapa.cor }} />
          <h3 className="text-sm font-semibold text-navy truncate" title={etapa.descricao}>
            {etapa.titulo}
          </h3>
        </div>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
          style={{ backgroundColor: etapa.corBg, color: etapa.cor }}
        >
          {leads.length}
        </span>
      </div>

      {/* Área de drop */}
      <Droppable droppableId={etapa.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 overflow-y-auto scroll-thin p-2 space-y-2 min-h-[120px] transition-colors",
              snapshot.isDraggingOver && "bg-gold-soft/40"
            )}
          >
            {leads.map((lead, index) => (
              <Draggable key={lead.id} draggableId={lead.id} index={index}>
                {(prov, snap) => (
                  <div
                    ref={prov.innerRef}
                    {...prov.draggableProps}
                    {...prov.dragHandleProps}
                  >
                    <KanbanCard lead={lead} onClick={onCardClick} arrastando={snap.isDragging} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {leads.length === 0 && !snapshot.isDraggingOver && (
              <p className="text-center text-xs text-gray-400 py-6">Vazio</p>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
