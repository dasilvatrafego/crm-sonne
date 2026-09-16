import { useMemo } from "react";
import {
  Ticket,
  TrendingUp,
  DollarSign,
  Users,
  UserPlus,
  Handshake,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { ETAPAS } from "@/lib/etapas";
import type { EtapaId, Lista } from "@/lib/types";
import { EVENTO, brl } from "@/lib/evento";
import { cn } from "@/lib/utils";

function contarPorEtapa(leads: { etapa: EtapaId }[]) {
  const base: Record<EtapaId, number> = {
    aguardando_convite: 0,
    recebeu_convite: 0,
    respondeu_negativo: 0,
    respondeu_positivo: 0,
    nao_respondeu: 0,
    em_negociacao: 0,
    comprou: 0,
  };
  for (const l of leads) base[l.etapa]++;
  return base;
}

export default function DashboardPage() {
  const { leads, carregado } = useStore();

  const m = useMemo(() => {
    const total = leads.length;
    const porEtapa = contarPorEtapa(leads);
    const comprou = porEtapa.comprou;
    const negociacao = porEtapa.em_negociacao;
    const convidados = total - porEtapa.aguardando_convite;
    const responderam =
      porEtapa.respondeu_positivo + porEtapa.respondeu_negativo + porEtapa.em_negociacao + porEtapa.comprou;
    const taxaResposta = convidados > 0 ? Math.round((responderam / convidados) * 100) : 0;

    const receita = comprou * EVENTO.precoIngresso;
    const metaReceita = EVENTO.metaVagas * EVENTO.precoIngresso;
    const pipeline = negociacao * EVENTO.precoIngresso;

    const porLista = (l: Lista) => contarPorEtapa(leads.filter((x) => x.lista === l));

    return {
      total,
      porEtapa,
      comprou,
      negociacao,
      taxaResposta,
      receita,
      metaReceita,
      pipeline,
      clientes: porLista("clientes"),
      prospects: porLista("prospects"),
      totalClientes: leads.filter((x) => x.lista === "clientes").length,
      totalProspects: leads.filter((x) => x.lista === "prospects").length,
    };
  }, [leads]);

  if (!carregado) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center text-gray-400 text-sm">
        Carregando…
      </div>
    );
  }

  const vagasRestantes = Math.max(0, EVENTO.metaVagas - m.comprou);
  const pctMeta = Math.min(100, Math.round((m.comprou / EVENTO.metaVagas) * 100));

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto scroll-thin">
      <div className="max-w-6xl mx-auto p-5 space-y-6">
        {/* Cabeçalho do evento */}
        <div className="bg-navy text-white rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-gold text-xs font-semibold uppercase tracking-wider">
              Evento presencial
            </p>
            <h2 className="font-serif text-2xl mt-1">{EVENTO.nome}</h2>
            <p className="text-white/60 text-sm mt-1">
              {EVENTO.datas} · {EVENTO.local}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-serif">
              {m.comprou}
              <span className="text-white/40 text-xl"> / {EVENTO.metaVagas}</span>
            </p>
            <p className="text-white/60 text-xs">vagas vendidas (meta) · cap. {EVENTO.capacidade}</p>
          </div>
        </div>

        {/* KPIs principais */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            icon={Ticket}
            cor="#011e41"
            label="Ingressos vendidos"
            valor={String(m.comprou)}
            sub={`${vagasRestantes} para a meta`}
          />
          <KpiCard
            icon={DollarSign}
            cor="#059669"
            label="Receita realizada"
            valor={brl(m.receita)}
            sub={`meta ${brl(m.metaReceita)}`}
          />
          <KpiCard
            icon={Handshake}
            cor="#b1915d"
            label="Em negociação"
            valor={String(m.negociacao)}
            sub={`${brl(m.pipeline)} em jogo`}
          />
          <KpiCard
            icon={TrendingUp}
            cor="#4f758c"
            label="Taxa de resposta"
            valor={`${m.taxaResposta}%`}
            sub="dos que receberam convite"
          />
        </div>

        {/* Progresso da meta */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-serif text-lg text-navy">Progresso da meta</h3>
            <span className="text-sm text-gray-500">
              {m.comprou} de {EVENTO.metaVagas} vagas ({pctMeta}%)
            </span>
          </div>
          <div className="h-4 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold to-navy transition-all"
              style={{ width: `${pctMeta}%` }}
            />
          </div>
        </div>

        {/* Funil por etapa */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="font-serif text-lg text-navy mb-4">Funil de convites</h3>
          <div className="space-y-2.5">
            {ETAPAS.map((et) => {
              const n = m.porEtapa[et.id];
              const pct = m.total > 0 ? Math.round((n / m.total) * 100) : 0;
              return (
                <div key={et.id} className="flex items-center gap-3">
                  <span className="w-40 text-sm text-navy shrink-0 truncate">{et.titulo}</span>
                  <div className="flex-1 h-6 rounded-md bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-md flex items-center justify-end pr-2 text-[11px] font-medium text-white transition-all"
                      style={{
                        width: `${Math.max(pct, n > 0 ? 6 : 0)}%`,
                        backgroundColor: et.cor,
                      }}
                    >
                      {n > 0 && n}
                    </div>
                  </div>
                  <span className="w-10 text-right text-sm text-gray-500 shrink-0">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparativo Clientes x Prospects */}
        <div className="grid md:grid-cols-2 gap-4">
          <ListaCard
            titulo="Clientes"
            icon={Users}
            total={m.totalClientes}
            dados={m.clientes}
          />
          <ListaCard
            titulo="Prospects"
            icon={UserPlus}
            total={m.totalProspects}
            dados={m.prospects}
          />
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  cor,
  label,
  valor,
  sub,
}: {
  icon: typeof Ticket;
  cor: string;
  label: string;
  valor: string;
  sub: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${cor}15` }}
        >
          <Icon className="w-4 h-4" style={{ color: cor }} />
        </div>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p className="text-2xl font-serif text-navy">{valor}</p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
}

function ListaCard({
  titulo,
  icon: Icon,
  total,
  dados,
}: {
  titulo: string;
  icon: typeof Users;
  total: number;
  dados: Record<EtapaId, number>;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-lg text-navy flex items-center gap-2">
          <Icon className="w-5 h-5 text-gold" />
          {titulo}
        </h3>
        <span className="text-sm text-gray-500">{total} contatos</span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {ETAPAS.map((et) => (
          <div key={et.id} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-gray-600 truncate">
              <span
                className={cn("w-2 h-2 rounded-full shrink-0")}
                style={{ backgroundColor: et.cor }}
              />
              <span className="truncate">{et.titulo}</span>
            </span>
            <span className="font-medium text-navy shrink-0">{dados[et.id]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
