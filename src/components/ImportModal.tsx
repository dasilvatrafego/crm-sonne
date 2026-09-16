import { useState } from "react";
import { X, UploadCloud, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import * as XLSX from "xlsx";
import type { Lead, Lista } from "@/lib/types";
import { useStore } from "@/lib/store";
import { idAleatorio, cn } from "@/lib/utils";

/** Sinônimos de cabeçalho aceitos por campo (case/acentos-insensível). */
const MAPA: Record<keyof Pick<Lead, "nome" | "empresa" | "cargo" | "telefone" | "email">, string[]> = {
  nome: ["nome", "name", "contato", "cliente", "lead", "nome completo"],
  empresa: ["empresa", "company", "organizacao", "organização", "negocio", "negócio"],
  cargo: ["cargo", "role", "funcao", "função", "posicao", "posição", "titulo", "título"],
  telefone: ["telefone", "phone", "whatsapp", "celular", "fone", "tel", "numero", "número"],
  email: ["email", "e-mail", "e mail"],
};

const norm = (s: string) =>
  s
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

function detectar(headers: string[]) {
  const idx: Partial<Record<keyof typeof MAPA, number>> = {};
  headers.forEach((h, i) => {
    const hn = norm(h);
    (Object.keys(MAPA) as (keyof typeof MAPA)[]).forEach((campo) => {
      if (idx[campo] === undefined && MAPA[campo].some((syn) => hn === norm(syn) || hn.includes(norm(syn)))) {
        idx[campo] = i;
      }
    });
  });
  return idx;
}

export function ImportModal({
  listaPadrao,
  onClose,
}: {
  listaPadrao: Lista;
  onClose: () => void;
}) {
  const { importarLeads } = useStore();
  const [lista, setLista] = useState<Lista>(listaPadrao);
  const [preview, setPreview] = useState<Lead[]>([]);
  const [nomeArquivo, setNomeArquivo] = useState("");
  const [erro, setErro] = useState("");
  const [inseridos, setInseridos] = useState<number | null>(null);

  async function handleFile(file: File) {
    setErro("");
    setInseridos(null);
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const linhas = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1, blankrows: false });
      if (linhas.length < 2) {
        setErro("A planilha precisa de um cabeçalho e ao menos uma linha.");
        return;
      }
      const headers = (linhas[0] as unknown[]).map((x) => String(x ?? ""));
      const idx = detectar(headers);
      if (idx.nome === undefined && idx.telefone === undefined) {
        setErro('Não encontrei coluna de "nome" nem de "telefone". Renomeie o cabeçalho.');
        return;
      }
      const leads: Lead[] = [];
      for (let i = 1; i < linhas.length; i++) {
        const row = linhas[i] as unknown[];
        const val = (c?: number) => (c === undefined ? "" : String(row[c] ?? "").trim());
        const nome = val(idx.nome) || val(idx.empresa) || "Sem nome";
        const telefone = val(idx.telefone);
        if (!nome && !telefone) continue;
        leads.push({
          id: idAleatorio(),
          nome,
          empresa: val(idx.empresa) || undefined,
          cargo: val(idx.cargo) || undefined,
          telefone: telefone || undefined,
          email: val(idx.email) || undefined,
          lista,
          etapa: "aguardando_convite",
          tags: [],
          criadoEm: new Date().toISOString(),
        });
      }
      setNomeArquivo(file.name);
      setPreview(leads);
    } catch {
      setErro("Não consegui ler o arquivo. Use .xlsx, .xls ou .csv.");
    }
  }

  function confirmar() {
    const n = importarLeads(preview, lista);
    setInseridos(n);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-navy text-white px-5 py-4 flex items-center justify-between">
          <h2 className="font-serif text-lg">Importar lista</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded" aria-label="Fechar">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {inseridos === null ? (
            <>
              {/* Escolha da lista de destino */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Importar para
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {(["clientes", "prospects"] as Lista[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLista(l)}
                      className={cn(
                        "py-2 rounded-lg text-sm font-medium border capitalize transition-colors",
                        lista === l
                          ? "bg-navy text-white border-navy"
                          : "bg-white text-navy border-gray-300 hover:border-navy"
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dropzone */}
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl py-8 cursor-pointer hover:border-gold hover:bg-muted transition-colors">
                <UploadCloud className="w-8 h-8 text-gold" />
                <span className="text-sm font-medium text-navy">
                  Clique para escolher a planilha
                </span>
                <span className="text-xs text-gray-400">.xlsx, .xls ou .csv</span>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
              </label>

              <p className="text-[11px] text-gray-400 leading-relaxed">
                Colunas reconhecidas automaticamente: <b>nome</b>, <b>empresa</b>,{" "}
                <b>cargo</b>, <b>telefone/whatsapp</b>, <b>email</b>. Duplicados por telefone
                (dentro da mesma lista) são ignorados. Tudo entra em{" "}
                <b>Aguardando Convite</b>.
              </p>

              {erro && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {erro}
                </p>
              )}

              {preview.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-muted px-3 py-2 flex items-center gap-2 text-sm">
                    <FileSpreadsheet className="w-4 h-4 text-gold" />
                    <span className="font-medium text-navy truncate">{nomeArquivo}</span>
                    <span className="ml-auto text-gray-500">{preview.length} contatos</span>
                  </div>
                  <div className="max-h-40 overflow-y-auto scroll-thin divide-y divide-gray-100">
                    {preview.slice(0, 30).map((l) => (
                      <div key={l.id} className="px-3 py-1.5 text-xs flex items-center gap-2">
                        <span className="font-medium text-navy truncate flex-1">{l.nome}</span>
                        <span className="text-gray-400 truncate max-w-[35%]">{l.empresa || ""}</span>
                        <span className="text-gray-400">{l.telefone || ""}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmar}
                  disabled={preview.length === 0}
                  className="px-4 py-2 rounded-lg bg-gold text-white text-sm font-medium disabled:opacity-40 hover:opacity-90 transition-opacity"
                >
                  Importar {preview.length > 0 ? `(${preview.length})` : ""}
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center text-center py-6 gap-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              <p className="text-navy font-medium">
                {inseridos} contato{inseridos === 1 ? "" : "s"} importado
                {inseridos === 1 ? "" : "s"} para <span className="capitalize">{lista}</span>.
              </p>
              {inseridos < preview.length && (
                <p className="text-xs text-gray-500">
                  {preview.length - inseridos} ignorado(s) por já existirem (telefone duplicado).
                </p>
              )}
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2 rounded-lg bg-navy text-white text-sm font-medium hover:bg-navy-600"
              >
                Ver no Kanban
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
