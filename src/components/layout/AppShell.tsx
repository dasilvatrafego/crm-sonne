import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, KanbanSquare, LogOut } from "lucide-react";
import { cn, getIniciaisNome } from "@/lib/utils";
import { EVENTO } from "@/lib/evento";
import { useAuth } from "@/lib/auth";

const NAV = [
  { href: "/kanban", label: "Kanban", icon: KanbanSquare },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

/** Layout protegido: exige sessão e envolve as rotas internas com o chrome do app. */
export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, carregado, sair } = useAuth();
  const pathname = location.pathname;

  if (!carregado) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        Carregando…
      </div>
    );
  }
  if (!usuario) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-navy text-white shadow-md">
        <div className="px-5 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-gold/90 flex items-center justify-center font-serif font-bold text-navy text-lg shrink-0">
              S
            </div>
            <div className="min-w-0">
              <h1 className="font-serif text-lg leading-none truncate">SONNE · Convites</h1>
              <p className="text-[11px] text-white/60 truncate">
                {EVENTO.nome} — {EVENTO.datas}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <nav className="flex items-center gap-1">
              {NAV.map(({ href, label, icon: Icon }) => {
                const ativo = pathname === href || (href === "/kanban" && pathname === "/");
                return (
                  <Link
                    key={href}
                    to={href}
                    className={cn(
                      "flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                      ativo
                        ? "bg-white/15 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-white/15">
              <div className="w-8 h-8 rounded-full bg-gold text-navy flex items-center justify-center text-xs font-bold shrink-0">
                {getIniciaisNome(usuario.nome)}
              </div>
              <div className="hidden md:block leading-tight">
                <p className="text-sm font-medium truncate max-w-[140px]">{usuario.nome}</p>
                <p className="text-[11px] text-white/50 truncate max-w-[140px]">{usuario.papel}</p>
              </div>
              <button
                onClick={() => {
                  sair();
                  navigate("/login", { replace: true });
                }}
                title="Sair"
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0">
        <Outlet />
      </main>
    </div>
  );
}
