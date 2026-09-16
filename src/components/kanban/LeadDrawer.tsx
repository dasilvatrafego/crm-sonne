import { useEffect, useState } from "react";
import { X, Trash2, ExternalLink } from "lucide-react";
import { IconWhatsApp } from "@/components/icons";
import { ETAPAS } from "@/lib/etapas";
import type { EtapaId } from "@/lib/types";
import { useStore } from "@/lib/store";
import { formatarTelefoneWhatsApp } from "@/lib/utils";

export function LeadDrawer({ leadId, onClose }: { leadId: string; onClose: () => void }) {
  const { leads, atualizarLead, removerLead } = useStore();
  const lead = leads.find((l) => l.id === leadId);

  const [notas, setNotas] = useState(lead?.notas ?? "");
  const [tagsTexto, setTagsTexto] = useState((lead?.tags ?? []).join(", "));

  useEffect(() => {
    setNotas(lead?.notas ?? "");
    setTagsTexto((lead?.tags ?? []).join(", "));
  }, [leadId, lead?.notas, lead?.tags]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!lead) return null;

  const salvarNotas = () => atualizarLead(lead.id, { notas });
  const salvarTags = () =>
    atualizarLead(lead.id, {
      tags: tagsTexto.split(",").map((t) => t.trim()).filter(Boolean),
    });

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-navy/30 backdrop-blur-[2px]" onClick={onClose} />
      <aside className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col animate-in slide-in-from-right">
        {/* Cabeçalho */}
        <div className="bg-navy text-white px-5 py-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-serif text-xl truncate">{lead.nome}</h2>
            <p className="text-sm text-white/60 truncate">
              {[lead.empresa, lead.cargo].filter(Boolean).join(" · ") || "—"}
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded" aria-label="Fechar">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scroll-thin p-5 space-y-5">
          {/* Contato */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
              Contato
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-gray-500">Telefone</span>
                <span className="font-medium text-navy">{lead.telefone || "—"}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-gray-500">E-mail</span>
                <span className="font-medium text-navy truncate max-w-[60%]">
                  {lead.email || "—"}
                </span>
              </div>
              {lead.telefone && (
                <a
                  href={formatarTelefoneWhatsApp(lead.telefone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-wa text-white font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  <IconWhatsApp className="w-4 h-4 [&_path]:fill-white" />
                  Abrir no WhatsApp Web
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </section>

          {/* Etapa do funil */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
              Etapa do convite
            </h3>
            <select
              value={lead.etapa}
              onChange={(e) => atualizarLead(lead.id, { etapa: e.target.value as EtapaId })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/40"
            >
              {ETAPAS.map((et) => (
                <option key={et.id} value={et.id}>
                  {et.titulo}
                </option>
              ))}
            </select>
          </section>

          {/* Tags */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
              Tags
            </h3>
            <input
              value={tagsTexto}
              onChange={(e) => setTagsTexto(e.target.value)}
              onBlur={salvarTags}
              placeholder="âncora, quente, indicação…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
            <p className="text-[11px] text-gray-400 mt-1">Separe por vírgula.</p>
          </section>

          {/* Notas */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
              Anotações
            </h3>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              onBlur={salvarNotas}
              rows={5}
              placeholder="Histórico da conversa, objeções, próximos passos…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </section>
        </div>

        {/* Rodapé */}
        <div className="border-t border-gray-200 px-5 py-3 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm(`Remover ${lead.nome} do CRM?`)) {
                removerLead(lead.id);
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Remover
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-navy text-white text-sm font-medium hover:bg-navy-600"
          >
            Fechar
          </button>
        </div>
      </aside>
    </div>
  );
}
