import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Container } from "@/components/ui/Container";
import { RibbonDivider } from "@/components/ui/RibbonDivider";
import { ProductCard } from "@/components/ui/ProductCard";
import { useStore } from "@/context/StoreContext";
import { useAsync } from "@/hooks/useAsync";
import { listProducts } from "@/services/products";
import { buildWhatsAppLink, generalContactMessage } from "@/lib/whatsapp";
import { getFileUrl } from "@/lib/storage";

const TRUST_BADGES = [
  { label: "Peças selecionadas", icon: "heart" },
  { label: "Atendimento local", icon: "flower" },
  { label: "Pagamento na retirada", icon: "bag" },
  { label: "Reserve pelo WhatsApp", icon: "chat" },
] as const;

export function Home() {
  const store = useStore();

  return (
    <>
      <HeroSection storeName={store.name} whatsapp={store.whatsapp} bannerUrl={store.bannerUrl} bannerVersion={store.$updatedAt} />
      <TrustBadgesRow />
      <NoveltiesSection storeId={store.$id} />
    </>
  );
}

function HeroSection({
  storeName,
  whatsapp,
  bannerUrl,
  bannerVersion,
}: {
  storeName: string;
  whatsapp?: string;
  bannerUrl?: string;
  bannerVersion?: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <Container className="grid lg:grid-cols-2 gap-12 items-start py-10 lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="label-caps text-gold-700 mb-4">{storeName}</p>
          <h1 className="text-4xl md:text-5xl xl:text-6xl leading-[1.08] font-medium">
            Peças lindas para
            <br />
            acompanhar cada fase
            <br />
            <span className="text-rose-600">da infância</span>
          </h1>
          <p className="mt-6 text-ink-soft max-w-md text-[15px] leading-relaxed">
            Vestidos, calçados, bolsas e acessórios selecionados com carinho
            para tornar cada momento ainda mais especial.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/novidades">
              <Button size="lg">Ver novidades</Button>
            </Link>
            {whatsapp && (
              <a href={buildWhatsAppLink(whatsapp, generalContactMessage())} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" icon={<WhatsAppIcon />}>
                  Reservar pelo WhatsApp
                </Button>
              </a>
            )}
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-4 max-w-md">
            {TRUST_BADGES.map((badge) => (
              <li key={badge.label} className="flex items-center gap-2 text-sm text-ink-soft">
                <TrustIcon name={badge.icon} />
                {badge.label}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative"
        >
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-blush-100 via-blush-50 to-cream-deep border border-line shadow-[var(--shadow-lifted)]">
            {bannerUrl ? (
              <img src={getFileUrl(bannerUrl, bannerVersion)} alt={storeName} className="w-full h-full object-cover" />
            ) : (
              <>
                <RibbonPattern className="absolute inset-0 w-full h-full opacity-[0.14] text-rose-400" />
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <span className="text-sm text-ink-soft text-center">
                    (espaço reservado para a foto principal — envie em
                    <br />
                    Minha Loja → Banner)
                  </span>
                </div>
              </>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="hidden md:block absolute -bottom-6 -left-6 bg-cream border border-gold-300 rounded-xl px-6 py-5 shadow-[var(--shadow-soft)] max-w-[210px]"
          >
            <p className="font-script text-2xl text-rose-700 leading-none">
              Pequenas Histórias
            </p>
            <p className="font-script text-2xl text-rose-700 leading-none mt-1">
              Grandes Sonhos
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

function TrustBadgesRow() {
  return (
    <section className="border-y border-line bg-cream-deep/60">
      <Container className="py-4">
        <RibbonDivider className="mb-0" />
      </Container>
    </section>
  );
}

function NoveltiesSection({ storeId }: { storeId: string }) {
  const state = useAsync(() => listProducts(storeId, { limit: 10 }), [storeId]);

  return (
    <section className="py-20">
      <Container>
        <div className="text-center mb-12">
          <p className="label-caps text-gold-700 mb-3">Recém-chegadas</p>
          <h2 className="text-3xl md:text-4xl">Novidades da semana</h2>
        </div>

        {state.status === "loading" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-line bg-blush-50/60 aspect-[3/4] animate-pulse" />
            ))}
          </div>
        )}

        {state.status === "error" && (
          <p className="text-center text-sm text-danger">
            Não foi possível carregar as novidades agora. Tente novamente em instantes.
          </p>
        )}

        {state.status === "success" && state.data.length === 0 && (
          <div className="text-center py-12 border border-dashed border-line rounded-xl">
            <p className="text-ink-soft text-sm">
              Nenhuma peça cadastrada ainda. Assim que a primeira peça for
              cadastrada em <strong>Minha Loja → Produtos</strong>, ela aparece aqui.
            </p>
          </div>
        )}

        {state.status === "success" && state.data.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {state.data.map((product) => (
              <ProductCard key={product.$id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/novidades">
            <Button variant="outline">Ver todas as novidades</Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}

function RibbonPattern({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="ribbon-repeat" width="50" height="50" patternUnits="userSpaceOnUse">
          <path
            d="M25 25c-4-7-13-8-17-4s1 11 8 7c3-2 4-3 4-3M25 25c4-7 13-8 17-4s-1 11-8 7c-3-2-4-3-4-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#ribbon-repeat)" />
    </svg>
  );
}

function TrustIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    heart: "M12 21s-7-4.35-9.5-8.5C.9 9.2 2.4 6 5.6 6c1.8 0 3.1 1 3.9 2.2C10.3 7 11.6 6 13.4 6c3.2 0 4.7 3.2 3.1 6.5C19 16.65 12 21 12 21Z",
    flower:
      "M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0 0a3 3 0 1 0-6 0 3 3 0 0 0 6 0Zm0 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z",
    bag: "M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2",
    chat: "M4 4h16v12H8l-4 4V4Z",
  };
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 text-gold-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d={paths[name]} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
