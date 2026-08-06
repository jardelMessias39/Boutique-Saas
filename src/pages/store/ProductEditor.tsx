import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { useAsync } from "@/hooks/useAsync";
import { listCategories } from "@/services/categories";
import { recordSale } from "@/services/sales";
import {
  createProduct,
  updateProduct,
  getProduct,
  listProductImages,
  addProductImage,
  deleteProductImage,
} from "@/services/products";
import { uploadFile, getFileUrl } from "@/lib/storage";
import { ID } from "@/lib/appwrite";
import type { ProductCondition, ProductStatus, ProductImage } from "@/types/domain";

export function ProductEditorPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const store = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const categoriesState = useAsync(() => listCategories(store.$id), [store.$id]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [color, setColor] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState<ProductCondition>("novo");
  const [quantity, setQuantity] = useState("1");
  const [status, setStatus] = useState<ProductStatus>("disponivel");
  const [originalStatus, setOriginalStatus] = useState<ProductStatus | null>(null);

  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [loaded, setLoaded] = useState(!isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const product = await getProduct(id);
      if (!product) {
        setError("Peça não encontrada.");
        setLoaded(true);
        return;
      }
      setName(product.name);
      setDescription(product.description ?? "");
      setPrice(String(product.price));
      setCategoryId(product.categoryId ?? "");
      setColor(product.color ?? "");
      setBrand(product.brand ?? "");
      setSize(product.size ?? "");
      setCondition(product.condition);
      setQuantity(String(product.quantity));
      setStatus(product.status);
      setOriginalStatus(product.status);
      setExistingImages(await listProductImages(id));
      setLoaded(true);
    })();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);

    const data = {
      storeId: store.$id,
      categoryId,
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      color: color.trim(),
      brand: brand.trim(),
      size: size.trim(),
      condition,
      quantity: Number(quantity),
      status,
    };

    try {
      const productId = isEditing ? id! : (await createProduct(data, user.$id)).$id;
      if (isEditing) await updateProduct(productId, data);

      // Se o status virou "vendido" agora (não era antes), registra a venda.
      const justSold = status === "vendido" && originalStatus !== "vendido";
      if (justSold) {
        const category =
          categoriesState.status === "success"
            ? categoriesState.data.find((c) => c.$id === categoryId) ?? null
            : null;
        await recordSale({ ...data, $id: productId }, category, user.$id);
      }

      // Upload das novas fotos selecionadas, na sequência após as já existentes.
      let position = existingImages.length;
      for (const file of newFiles) {
        const fileId = ID.unique();
        await uploadFile(file, fileId, user.$id);
        await addProductImage(productId, fileId, position, user.$id);
        position += 1;
      }

      navigate("/minha-loja/produtos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar. Tente novamente.");
      setSaving(false);
    }
  }

  async function handleRemoveExistingImage(imageId: string) {
    await deleteProductImage(imageId);
    setExistingImages((imgs) => imgs.filter((i) => i.$id !== imageId));
  }

  if (!loaded) return <p className="text-sm text-ink-soft">Carregando…</p>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link to="/minha-loja/produtos" className="text-sm text-ink-soft hover:text-rose-700">
          ← Produtos
        </Link>
      </div>

      <h1 className="text-2xl mb-8">{isEditing ? "Editar peça" : "Cadastrar peça nova"}</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        <Field label="Nome da peça" htmlFor="name">
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="input-field" placeholder="Vestido Tule Rosa" />
        </Field>

        <Field label="Descrição" htmlFor="description">
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="input-field resize-none" placeholder="Detalhes da peça, tecido, ocasião..." />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Preço (R$)" htmlFor="price">
            <input id="price" type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required className="input-field" placeholder="65.00" />
          </Field>

          <Field label="Categoria" htmlFor="category">
            <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="input-field">
              <option value="" disabled>Selecione…</option>
              {categoriesState.status === "success" &&
                categoriesState.data.map((c) => (
                  <option key={c.$id} value={c.$id}>{c.name}</option>
                ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Tamanho" htmlFor="size">
            <input id="size" value={size} onChange={(e) => setSize(e.target.value)} className="input-field" placeholder="4 anos" />
          </Field>
          <Field label="Cor" htmlFor="color">
            <input id="color" value={color} onChange={(e) => setColor(e.target.value)} className="input-field" placeholder="Rosa" />
          </Field>
          <Field label="Marca" htmlFor="brand">
            <input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="input-field" placeholder="—" />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Estado" htmlFor="condition">
            <select id="condition" value={condition} onChange={(e) => setCondition(e.target.value as ProductCondition)} className="input-field">
              <option value="novo">Novo</option>
              <option value="seminovo">Seminovo</option>
              <option value="usado">Usado</option>
            </select>
          </Field>
          <Field label="Quantidade" htmlFor="quantity">
            <input id="quantity" type="number" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} required className="input-field" />
          </Field>
          <Field label="Status" htmlFor="status">
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value as ProductStatus)} className="input-field">
              <option value="disponivel">Disponível</option>
              <option value="reservado">Reservado</option>
              <option value="vendido">Vendido</option>
            </select>
          </Field>
        </div>

        <Field label="Fotos" htmlFor="images">
          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {existingImages.map((img) => (
                <div key={img.$id} className="relative w-20 h-20 rounded-lg overflow-hidden border border-line">
                  <img src={getFileUrl(img.url)} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(img.$id)}
                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-danger text-white text-xs flex items-center justify-center"
                    aria-label="Remover foto"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setNewFiles(Array.from(e.target.files ?? []))}
            className="input-field"
          />
          {newFiles.length > 0 && (
            <p className="text-xs text-ink-soft mt-1">{newFiles.length} nova(s) foto(s) selecionada(s)</p>
          )}
        </Field>

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" disabled={saving} size="lg">
          {saving ? "Salvando…" : isEditing ? "Salvar alterações" : "Cadastrar peça"}
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
