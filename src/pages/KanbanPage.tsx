import { useState } from "react";
import { Search, Upload, Users, UserPlus } from "lucide-react";
import type { Lista } from "@/lib/types";
import { useStore } from "@/lib/store";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { ImportModal } from "@/components/ImportModal";
import { cn } from "@/lib/utils";

const LISTAS: { id: Lista; label: string; icon: typeof Users }[] = [
  { id: "clientes", label: "Clientes", icon: Users },
  { id: "prospects", label: "Prospects", icon: UserPlus },
];

export default function KanbanPage() {
  const { leads, carregado } = useStore();
  const [lista, setLista] = useState<Lista>("clientes");
  const [busca, setBusca] = useState("");
  const [importOpen, setImportOpen] = useState(false);

  const contar = (l: Lista) => leads.filter((x) => x.lista === l).length;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Barra de controle */}
      <div className="px-4 py-3 flex flex-wrap items-center gap-3 border-b border-gray-200 bg-white">
        {/* Alternador de listas — separa o trabalho e o resultado */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {LISTAS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setLista(id)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors",
                lista === id
                  ? "bg-navy text-white shadow-sm"
                  : "text-gray-600 hover:text-navy"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
              <span
                className={cn(
                  "text-xs px-1.5 rounded-full",
                  lista === id ? "bg-white/20" : "bg-white text-gray-500"
                )}
              >
                {contar(id)}
              </span>
            </button>
          ))}
        </div>

        {/* Busca */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, empresa, telefone…"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>

        <button
          onClick={() => setImportOpen(true)}
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Upload className="w-4 h-4" />
          Importar lista
        </button>
      </div>

      {/* Board */}
      <div className="flex-1 min-h-0 py-3">
        {carregado ? (
          <KanbanBoard lista={lista} busca={busca} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            Carregando…
          </div>
        )}
      </div>

      {importOpen && (
        <ImportModal listaPadrao={lista} onClose={() => setImportOpen(false)} />
      )}
    </div>
  );
}
