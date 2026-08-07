import { Link } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Store } from "@/types/domain";

const DEVELOPER_WHATSAPP = "5579998061093";
const DEVELOPER_MESSAGE = "Olá Jardel! Vi o site que você desenvolveu e queria conversar sobre um projeto.";

export function Footer({ store }: { store: Pick<Store, "name" | "whatsapp" | "instagram" | "address" | "city" | "businessHours" | "logoUrl" | "$updatedAt"> }) {
  return (
    <footer className="bg-cream-deep border-t border-line mt-24">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1 space-y-3">
          <Logo storeName={store.name} logoUrl={store.logoUrl} version={store.$updatedAt} />
          <p className="text-sm text-ink-soft max-w-xs">
            Peças selecionadas com amor para vestir sua princesa em todos os momentos especiais.
          </p>
        </div>

        <FooterColumn
          title="Institucional"
          links={[
            { label: "Início", to: "/" },
            { label: "Como comprar", to: "/como-comprar" },
            { label: "Sobre nós", to: "/sobre" },
            { label: "Contato", to: "/contato" },
          ]}
        />

        <FooterColumn
          title="Categorias"
          links={[
            { label: "Vestidos", to: "/categoria/vestidos" },
            { label: "Calçados", to: "/categoria/calcados" },
            { label: "Bolsas", to: "/categoria/bolsas" },
            { label: "Tiaras", to: "/categoria/tiaras" },
          ]}
        />

        <div className="space-y-2">
          <h4 className="label-caps text-rose-700 mb-3">Fale conosco</h4>
          {store.whatsapp && <p className="text-sm text-ink-soft">{store.whatsapp}</p>}
          {store.instagram && <p className="text-sm text-ink-soft">@{store.instagram}</p>}
          {store.address && <p className="text-sm text-ink-soft">{store.address}</p>}
          {store.city && <p className="text-sm text-ink-soft">{store.city}</p>}
          {store.businessHours && <p className="text-sm text-ink-soft">{store.businessHours}</p>}
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink-soft text-center">
          <span>© {new Date().getFullYear()} {store.name}. Todos os direitos reservados.</span>
          <span>
            Desenvolvido por{" "}
            <a
              href={buildWhatsAppLink(DEVELOPER_WHATSAPP, DEVELOPER_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-rose-700 hover:underline"
            >
              Jardel Messias
            </a>{" "}
            · (79) 99806-1093
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; to: string }[];
}) {
  return (
    <div>
      <h4 className="label-caps text-rose-700 mb-3">{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="text-sm text-ink-soft hover:text-rose-700 transition-colors">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
