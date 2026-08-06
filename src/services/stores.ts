import { tablesDB, APPWRITE_DATABASE_ID, TABLES, Query } from "@/lib/appwrite";
import type { Store } from "@/types/domain";

/**
 * Busca uma loja pelo slug (usado na URL pública, ex: /loja/encantos-da-ana
 * ou no futuro num subdomínio próprio). É o ponto de entrada de todo o
 * isolamento multi-tenant: toda a Home carrega a partir do storeId
 * resolvido aqui.
 */
export async function getStoreBySlug(slug: string): Promise<Store | null> {
  const result = await tablesDB.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.stores,
    queries: [Query.equal("slug", slug), Query.limit(1)],
  });

  if (result.rows.length === 0) return null;
  return result.rows[0] as unknown as Store;
}

export async function getStoreById(storeId: string): Promise<Store | null> {
  try {
    const row = await tablesDB.getRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: TABLES.stores,
      rowId: storeId,
    });
    return row as unknown as Store;
  } catch {
    return null;
  }
}

export async function updateStore(
  storeId: string,
  data: Partial<Omit<Store, "$id" | "ownerId" | "slug">>
): Promise<Store> {
  const row = await tablesDB.updateRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.stores,
    rowId: storeId,
    data,
  });
  return row as unknown as Store;
}
