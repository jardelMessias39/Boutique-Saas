import { tablesDB, APPWRITE_DATABASE_ID, TABLES, Query, ID } from "@/lib/appwrite";
import { storeOwnedPermissions } from "@/lib/permissions";
import { listCategories } from "@/services/categories";
import type { Product, ProductImage } from "@/types/domain";

export interface ProductFilters {
  categoryId?: string;
  size?: string;
  status?: Product["status"];
  limit?: number;
}

export async function listProducts(
  storeId: string,
  filters: ProductFilters = {}
): Promise<Product[]> {
  const queries = [Query.equal("storeId", storeId), Query.orderDesc("$createdAt")];

  if (filters.categoryId) queries.push(Query.equal("categoryId", filters.categoryId));
  if (filters.size) queries.push(Query.equal("size", filters.size));
  if (filters.status) queries.push(Query.equal("status", filters.status));
  queries.push(Query.limit(filters.limit ?? 24));

  const result = await tablesDB.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.products,
    queries,
  });
  return result.rows as unknown as Product[];
}

/**
 * Busca por nome do produto OU nome da categoria, sempre em minúsculo e
 * aceitando parte da palavra (ex: "vestido" encontra "Vestido Bordado").
 * Feita no código (não via Query.search do Appwrite) pra não depender de
 * configurar um índice Fulltext no Console, e pra já sair funcionando
 * com maiúscula/minúscula e plural/singular sem configuração extra.
 */
export async function searchProducts(storeId: string, query: string): Promise<Product[]> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const [products, categories] = await Promise.all([
    listProducts(storeId, { limit: 500 }),
    listCategories(storeId),
  ]);

  const categoryNameById = new Map(categories.map((c) => [c.$id, c.name.toLowerCase()]));

  return products.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(normalized);
    const categoryMatch = (categoryNameById.get(p.categoryId) ?? "").includes(normalized);
    return nameMatch || categoryMatch;
  });
}

export async function getProduct(productId: string): Promise<Product | null> {
  try {
    const row = await tablesDB.getRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: TABLES.products,
      rowId: productId,
    });
    return row as unknown as Product;
  } catch {
    return null;
  }
}

export async function listRelatedProducts(
  storeId: string,
  categoryId: string,
  excludeProductId: string
): Promise<Product[]> {
  const result = await tablesDB.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.products,
    queries: [
      Query.equal("storeId", storeId),
      Query.equal("categoryId", categoryId),
      Query.notEqual("$id", excludeProductId),
      Query.limit(4),
    ],
  });
  return result.rows as unknown as Product[];
}

export async function listProductImages(productId: string): Promise<ProductImage[]> {
  const result = await tablesDB.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.productImages,
    queries: [Query.equal("productId", productId), Query.orderAsc("position")],
  });
  return result.rows as unknown as ProductImage[];
}

export async function createProduct(
  data: Omit<Product, "$id">,
  ownerId: string
): Promise<Product> {
  const row = await tablesDB.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.products,
    rowId: ID.unique(),
    data,
    permissions: storeOwnedPermissions(ownerId),
  });
  return row as unknown as Product;
}

export async function updateProduct(
  productId: string,
  data: Partial<Omit<Product, "$id" | "storeId">>
): Promise<Product> {
  const row = await tablesDB.updateRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.products,
    rowId: productId,
    data,
  });
  return row as unknown as Product;
}

export async function deleteProduct(productId: string): Promise<void> {
  await tablesDB.deleteRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.products,
    rowId: productId,
  });
}

export async function addProductImage(
  productId: string,
  url: string,
  position: number,
  ownerId: string
): Promise<ProductImage> {
  const row = await tablesDB.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.productImages,
    rowId: ID.unique(),
    data: { productId, url, position },
    permissions: storeOwnedPermissions(ownerId),
  });
  return row as unknown as ProductImage;
}

export async function deleteProductImage(imageId: string): Promise<void> {
  await tablesDB.deleteRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.productImages,
    rowId: imageId,
  });
}
