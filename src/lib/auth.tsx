/* Autenticação client-side desta fase (projeto local, sem backend).
 * Sessão persistida em localStorage. Na fase 2 (Supabase) isto vira auth real.
 * As credenciais abaixo são de demonstração e ficam no bundle do cliente —
 * trocar por senhas de verdade só quando houver backend. */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: string;
  empresa: string;
}

interface Credencial extends Usuario {
  senha: string;
}

const USUARIOS: Credencial[] = [
  {
    id: "max",
    nome: "Max Bavaresco",
    email: "maximiliano.bavaresco@sonne.global",
    senha: "Max2026@$",
    papel: "Anfitrião · SONNE",
    empresa: "SONNE Global",
  },
  {
    id: "joao",
    nome: "João Guilherme",
    email: "joao.guilherme@imperosolutions.com.br",
    senha: "Joao2026@$",
    papel: "Gestor · Impero",
    empresa: "Impero Solutions",
  },
];

/** Usuários expostos à tela de login para o preenchimento rápido (sem a senha). */
export const USUARIOS_DEMO: Usuario[] = USUARIOS.map(({ senha: _s, ...u }) => u);

const STORAGE_KEY = "crm-sonne:sessao:v1";

interface AuthCtx {
  usuario: Usuario | null;
  carregado: boolean;
  entrar: (email: string, senha: string) => { ok: boolean; erro?: string };
  sair: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUsuario(JSON.parse(raw));
    } catch {
      /* modo privado */
    }
    setCarregado(true);
  }, []);

  const entrar = useCallback((email: string, senha: string) => {
    const e = email.trim().toLowerCase();
    const cred = USUARIOS.find((u) => u.email.toLowerCase() === e);
    if (!cred || cred.senha !== senha) {
      return { ok: false, erro: "E-mail ou senha incorretos." };
    }
    const { senha: _s, ...pub } = cred;
    setUsuario(pub);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pub));
    } catch {
      /* ignore */
    }
    return { ok: true };
  }, []);

  const sair = useCallback(() => {
    setUsuario(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({ usuario, carregado, entrar, sair }),
    [usuario, carregado, entrar, sair]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}
