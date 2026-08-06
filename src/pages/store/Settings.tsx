import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useStore, useRefreshStore } from "@/context/StoreContext";
import { updateStore } from "@/services/stores";

export function SettingsPage() {
  const store = useStore();
  const refreshStore = useRefreshStore();

  const [name, setName] = useState(store.name);
  const [whatsapp, setWhatsapp] = useState(store.whatsapp ?? "");
  const [instagram, setInstagram] = useState(store.instagram ?? "");
  const [facebook, setFacebook] = useState(store.facebook ?? "");
  const [address, setAddress] = useState(store.address ?? "");
  const [city, setCity] = useState(store.city ?? "");
  const [businessHours, setBusinessHours] = useState(store.businessHours ?? "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updateStore(store.$id, { name, whatsapp, instagram, facebook, address, city, businessHours });
      await refreshStore();
      setSaved(true);
    } catch (err) {
      const isAuthError = err instanceof Error && /author/i.test(err.message);
      setError(
        isAuthError
          ? 'Sem permissão para salvar. Isso costuma acontecer quando a linha da loja no Appwrite ainda tem o "ownerId" de teste (temp-owner) em vez do seu ID de usuário real. Peça pra corrigirmos isso juntos no Console.'
          : err instanceof Error
            ? err.message
            : "Não foi possível salvar agora."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl mb-8">Configurações da loja</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Nome da loja" htmlFor="name">
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="input-field" />
        </Field>

        <Field label="WhatsApp (com DDI e DDD, só números)" htmlFor="whatsapp">
          <input id="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="input-field" placeholder="5579981301736" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Instagram (sem @)" htmlFor="instagram">
            <input id="instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="input-field" />
          </Field>
          <Field label="Facebook" htmlFor="facebook">
            <input id="facebook" value={facebook} onChange={(e) => setFacebook(e.target.value)} className="input-field" />
          </Field>
        </div>

        <Field label="Endereço" htmlFor="address">
          <input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="input-field" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Cidade" htmlFor="city">
            <input id="city" value={city} onChange={(e) => setCity(e.target.value)} className="input-field" />
          </Field>
          <Field label="Horário de funcionamento" htmlFor="hours">
            <input id="hours" value={businessHours} onChange={(e) => setBusinessHours(e.target.value)} className="input-field" />
          </Field>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}
        {saved && <p className="text-sm text-success">Configurações salvas!</p>}

        <Button type="submit" disabled={saving} size="lg">
          {saving ? "Salvando…" : "Salvar configurações"}
        </Button>
      </form>
    </div>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink block mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
