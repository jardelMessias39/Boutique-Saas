import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Container } from "@/components/ui/Container";
import { buildWhatsAppLink, generalContactMessage } from "@/lib/whatsapp";
import { useStore } from "@/context/StoreContext";
import { useCart } from "@/context/CartContext";
import { useAsync } from "@/hooks/useAsync";
import { listCategories } from "@/services/categories";

const STATIC_LINKS_START = [{ label: "Início", to: "/" }];
const STATIC_LINKS_END = [
  { label: "Novidades", to: "/novidades" },
  { label: "Looks Prontos", to: "/looks" },
  { label: "Como comprar", to: "/como-comprar" },
  { label: "Contato", to: "/contato" },
];

interface HeaderProps {
  storeName: string;
  whatsapp?: string;
  logoUrl?: string;
}

export function Header({ storeName, whatsapp, logoUrl }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const store = useStore();
  const { items } = useCart();
  const categoriesState = useAsync(() => listCategories(store.$id), [store.$id]);

  const categoryLinks =
    categoriesState.status === "success"
      ? categoriesState.data.map((c) => ({ label: c.name, to: `/categoria/${c.slug}` }))
      : [];

  const navLinks = [...STATIC_LINKS_START, ...categoryLinks, ...STATIC_LINKS_END];

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/busca?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur border-b border-line">
      <Container className="flex items-center justify-between py-3 gap-4">
        <Link to="/" aria-label="Ir para a página inicial" className="shrink-0">
          <Logo storeName={storeName} logoUrl={logoUrl} />
        </Link>

        <nav className="hidden xl:flex items-center gap-5" aria-label="Navegação principal">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `relative pb-1 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-rose-700 after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-0.5 after:bg-rose-600 after:rounded-full"
                    : "text-ink-soft hover:text-rose-700"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:block relative">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onBlur={() => !query && setSearchOpen(false)}
                  placeholder="Buscar peças…"
                  className="w-44 rounded-full border border-line px-3 py-1.5 text-sm bg-cream focus:outline-none focus:border-rose-400"
                />
              </form>
            ) : (
              <button
                aria-label="Buscar"
                onClick={() => setSearchOpen(true)}
                className="p-2 text-rose-700 hover:text-rose-800"
              >
                <SearchIcon />
              </button>
            )}
          </div>

          <Link to="/carrinho" className="relative p-2 text-rose-700 hover:text-rose-800" aria-label="Carrinho">
            <CartIcon />
            {items.length > 0 && (
              <span className="absolute top-0 right-0 bg-rose-600 text-cream text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>

          {whatsapp && (
            <a
              href={buildWhatsAppLink(whatsapp, generalContactMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block"
            >
              <Button variant="whatsapp" size="sm" icon={<WhatsAppIcon />}>
                Reservar pelo WhatsApp
              </Button>
            </a>
          )}

          <button
            className="xl:hidden p-2 text-rose-700"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </Container>

      {menuOpen && (
        <nav className="xl:hidden border-t border-line bg-cream" aria-label="Navegação móvel">
          <Container className="flex flex-col py-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `py-2.5 text-sm font-medium ${isActive ? "text-rose-700" : "text-ink-soft hover:text-rose-700"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </Container>
        </nav>
      )}
    </header>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
      )}
    </svg>
  );
}
