import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useStore, useRefreshStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { uploadFile, deleteFile, getFileUrl, UPLOAD_PREFIXES } from "@/lib/storage";
import { updateStore } from "@/services/stores";

export function BannerPage() {
  const store = useStore();
  const { user } = useAuth();
  const refreshStore = useRefreshStore();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState(store.logoUrl);
  const [bannerUrl, setBannerUrl] = useState(store.bannerUrl);
  const [saving, setSaving] = useState<"logo" | "banner" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(() => Date.now());

  async function handleUpload(kind: "logo" | "banner") {
    if (!user) return;
    const file = kind === "logo" ? logoFile : bannerFile;
    if (!file) return;

    setSaving(kind);
    setError(null);
    try {
      const fileId =
        kind === "logo" ? UPLOAD_PREFIXES.storeLogo(store.$id) : UPLOAD_PREFIXES.storeBanner(store.$id);
      await deleteFile(fileId);
      await uploadFile(file, fileId, user.$id);
      await updateStore(store.$id, kind === "logo" ? { logoUrl: fileId } : { bannerUrl: fileId });
      if (kind === "logo") setLogoUrl(fileId);
      else setBannerUrl(fileId);
      setVersion(Date.now());
      await refreshStore();
    } catch (err) {
      setError(
        err instanceof Error
          ? `${err.message} — se for erro de permissão, veja a nota sobre "ownerId" no rodapé desta página.`
          : "Não foi possível salvar."
      );
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl mb-8">Banner e Logo</h1>

      <section className="mb-10">
        <h2 className="font-medium mb-2">Logo da loja</h2>
        <p className="text-sm text-ink-soft mb-3">Aparece no cabeçalho e no rodapé do site.</p>
        {logoUrl && (
          <img src={getFileUrl(logoUrl, version)} alt="Logo atual" className="w-20 h-20 object-cover rounded-lg border border-line mb-3" />
        )}
        <div className="flex gap-2">
          <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)} className="input-field" />
          <Button onClick={() => handleUpload("logo")} disabled={!logoFile || saving === "logo"}>
            {saving === "logo" ? "Enviando…" : "Salvar"}
          </Button>
        </div>
      </section>

      <section>
        <h2 className="font-medium mb-2">Banner (foto principal da Home)</h2>
        <p className="text-sm text-ink-soft mb-3">Ideal em formato retrato, mostrando uma peça ou modelo vestindo.</p>
        {bannerUrl && (
          <img src={getFileUrl(bannerUrl, version)} alt="Banner atual" className="w-full max-w-xs aspect-[4/5] object-cover rounded-lg border border-line mb-3" />
        )}
        <div className="flex gap-2">
          <input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)} className="input-field" />
          <Button onClick={() => handleUpload("banner")} disabled={!bannerFile || saving === "banner"}>
            {saving === "banner" ? "Enviando…" : "Salvar"}
          </Button>
        </div>
      </section>

      {error && <p className="text-sm text-danger mt-4">{error}</p>}
    </div>
  );
}
