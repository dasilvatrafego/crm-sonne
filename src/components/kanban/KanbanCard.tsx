import { memo } from "react";
import { AlertTriangle, Building2, Tag } from "lucide-react";
import { IconWhatsApp } from "@/components/icons";
import type { Lead } from "@/lib/types";
import {
  cn,
  getIniciaisNome,
  getCorIniciais,
  formatarTelefoneWhatsApp,
  diasDesde,
  getAlertaDias,
} from "@/lib/utils";

interface Props {
  lead: Lead;
  onClick: (lead: Lead) => void;
  arrastando?: boolean;
}

export const KanbanCard = memo(function KanbanCard({ lead, onClick, arrastando }: Props) {
  const dias = diasDesde(lead.atualizadoEm || lead.criadoEm);
  const alerta = getAlertaDias(dias);
  const iniciais = getIniciaisNome(lead.nome);
  const cor = getCorIniciais(lead.nome);
  const tempo = dias === 0 ? "hoje" : `${dias}d`;

  return (
    <div
      onClick={() => onClick(lead)}
      role="button"
      tabIndex={0}
      aria-label={`Abrir ${lead.nome}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(lead);
        }
      }}
      className={cn(
        "bg-white rounded-lg p-3 shadow-sm border cursor-pointer select-none",
        "hover:shadow-md transition-all duration-150",
        arrastando && "shadow-lg ring-2 ring-gold/40 rotate-1",
        alerta === "red" && "border-red-300",
        alerta === "amber" && "border-amber-300",
        alerta === "normal" && "border-gray-200 hover:border-gray-300"
      )}
    >
      {/* Nome + avatar + WhatsApp */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
            style={{ backgroundColor: cor }}
          >
            {iniciais}
          </div>
          <span className="font-medium text-navy text-sm truncate">{lead.nome}</span>
        </div>
        {lead.telefone && (
          <a
            href={formatarTelefoneWhatsApp(lead.telefone)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Abrir conversa no WhatsApp Web"
            className="shrink-0"
          >
            <IconWhatsApp className="w-4 h-4 hover:opacity-80 transition-opacity" />
          </a>
        )}
      </div>

      {/* Empresa · cargo */}
      {(lead.empresa || lead.cargo) && (
        <p className="text-xs text-gray-600 truncate flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="truncate">
            {lead.empresa}
            {lead.empresa && lead.cargo ? " · " : ""}
            {lead.cargo && <span className="text-gray-400">{lead.cargo}</span>}
          </span>
        </p>
      )}

      {/* Tags + tempo parado */}
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1 min-w-0">
          {lead.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gold-soft text-gold flex items-center gap-1 max-w-[8rem] truncate"
              style={{ color: "#8a6f42" }}
            >
              <Tag className="w-2.5 h-2.5 shrink-0" />
              {t}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {alerta !== "normal" && (
            <AlertTriangle
              className={cn("w-3 h-3", alerta === "red" ? "text-red-500" : "text-amber-500")}
            />
          )}
          <span
            className={cn(
              "text-[11px] font-medium",
              alerta === "red" ? "text-red-600" : alerta === "amber" ? "text-amber-600" : "text-gray-400"
            )}
            title="Dias desde a última movimentação"
          >
            {tempo}
          </span>
        </div>
      </div>
    </div>
  );
});
