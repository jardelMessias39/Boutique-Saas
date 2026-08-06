import { NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";

const NAV_ITEMS = [
  { label: "Início", to: "/minha-loja", icon: "dashboard", end: true },
  { label: "Produtos", to: "/minha-loja/produtos", icon: "products" },
  { label: "Categorias", to: "/minha-loja/categorias", icon: "categories" },
  { label: "Looks", to: "/minha-loja/looks", icon: "looks" },
  { label: "Faturamento", to: "/minha-loja/faturamento", icon: "revenue" },
  { label: "Banner", to: "/minha-loja/banner", icon: "banner" },
  { label: "Avaliações", to: "/minha-loja/avaliacoes", icon: "reviews" },
  { label: "Configurações", to: "/minha-loja/configuracoes", icon: "settings" },
] as const;

export function StoreAdminLayout() {
  const { user, logout } = useAuth();
  const store = useStore();

  return (
    <div className="min-h-screen flex bg-cream-deep">
      <aside className="w-64 shrink-0 bg-cream border-r border-line flex flex-col">
        <div className="p-6 border-b border-line">
          <p className="text-sm text-ink-soft">Bem-vinda,</p>
          <p className="font-script text-2xl text-rose-700 leading-tight">
            {user?.name || "Dona da loja"} 👋
          </p>
          <p className="label-caps text-gold-700 mt-1">Minha Loja</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5" aria-label="Navegação do painel">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={"end" in item ? item.end : false}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-rose-600 text-cream"
                    : "text-ink-soft hover:bg-blush-50 hover:text-rose-700"
                }`
              }
            >
              <AdminIcon name={item.icon} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-line space-y-2">
          <Link to="/" className="block px-3 py-2 text-sm text-ink-soft hover:text-rose-700">
            ← Ver site público
          </Link>
          <button
            onClick={() => logout()}
            className="w-full text-left px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-lg"
          >
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <Outlet context={{ store }} />
        </div>
      </main>
    </div>
  );
}

function AdminIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    dashboard: "M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z",
    products: "M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2",
    categories: "M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z",
    looks: "M4 20V10a8 8 0 0 1 16 0v10M4 20h16",
    banner: "M4 5h16v10H4V5Zm2 14h12",
    reviews: "M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1L4.6 17.8l1.3-6L1.3 7.7l6.1-.6L10 1.5Z",
    revenue: "M3 17l5-5 4 4 8-8M20 8h-4v4",
    settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-3a8 8 0 0 0-.2-1.7l2-1.6-2-3.4-2.4 1a8 8 0 0 0-3-1.7L14 2h-4l-.4 2.6a8 8 0 0 0-3 1.7l-2.4-1-2 3.4 2 1.6A8 8 0 0 0 4 12c0 .6.1 1.1.2 1.7l-2 1.6 2 3.4 2.4-1a8 8 0 0 0 3 1.7L10 22h4l.4-2.6a8 8 0 0 0 3-1.7l2.4 1 2-3.4-2-1.6A8 8 0 0 0 20 12Z",
  };
  return (
    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d={paths[name]} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
