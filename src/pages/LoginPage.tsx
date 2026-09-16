import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, Eye, EyeOff, CalendarDays, MapPin } from "lucide-react";
import { useAuth, USUARIOS_DEMO } from "@/lib/auth";
import { EVENTO } from "@/lib/evento";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const navigate = useNavigate();
  const { usuario, carregado, entrar } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (carregado && usuario) navigate("/kanban", { replace: true });
  }, [carregado, usuario, navigate]);

  function submeter(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    const r = entrar(email, senha);
    if (r.ok) navigate("/kanban", { replace: true });
    else setErro(r.erro || "Falha no login.");
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Painel de marca (SONNE) */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-navy text-white overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-navy-400/20 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gold flex items-center justify-center font-serif font-bold text-navy text-2xl">
            S
          </div>
          <div>
            <p className="font-serif text-xl leading-none">SONNE</p>
            <p className="text-xs text-white/50">Convites do Curso</p>
          </div>
        </div>

        <div className="relative">
          <p className="text-gold text-xs font-semibold uppercase tracking-[0.2em]">
            Evento presencial
          </p>
          <h2 className="font-serif text-4xl leading-tight mt-3">{EVENTO.nome}</h2>
          <div className="mt-6 space-y-2 text-white/70 text-sm">
            <p className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-gold" />
              {EVENTO.datas}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold" />
              {EVENTO.local}
            </p>
          </div>
        </div>

        <p className="relative text-xs text-white/40">
          Organização e acompanhamento dos convites — Clientes e Prospects.
        </p>
      </div>

      {/* Formulário */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-muted">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center font-serif font-bold text-gold text-xl">
              S
            </div>
            <p className="font-serif text-lg text-navy">SONNE · Convites</p>
          </div>

          <h1 className="font-serif text-2xl text-navy">Entrar</h1>
          <p className="text-sm text-gray-500 mt-1">Acesse o CRM de convites.</p>

          <form onSubmit={submeter} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                E-mail
              </label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  placeholder="seu@email.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/40"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Senha
              </label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={mostrar ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-gray-300 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/40"
                />
                <button
                  type="button"
                  onClick={() => setMostrar((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy"
                  aria-label={mostrar ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {erro && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {erro}
              </p>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-navy text-white text-sm font-medium hover:bg-navy-600 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Entrar
            </button>
          </form>

          {/* Acesso rápido */}
          <div className="mt-8">
            <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-2">Acesso rápido</p>
            <div className="space-y-2">
              {USUARIOS_DEMO.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    setEmail(u.email);
                    setSenha("");
                    setErro("");
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg border border-gray-200 bg-white",
                    "hover:border-gold hover:shadow-sm transition-all flex items-center gap-3"
                  )}
                >
                  <span className="w-8 h-8 rounded-full bg-navy text-gold flex items-center justify-center text-xs font-bold shrink-0">
                    {u.nome
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-navy truncate">{u.nome}</span>
                    <span className="block text-xs text-gray-400 truncate">{u.papel}</span>
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 mt-2">
              Clica pra preencher o e-mail; digite a senha para entrar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
