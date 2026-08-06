import { tablesDB, APPWRITE_DATABASE_ID, TABLES, Query, ID } from "@/lib/appwrite";
import { storeOwnedPermissions } from "@/lib/permissions";
import type { Look, LookItem, Product } from "@/types/domain";

export async function listLooks(storeId: string): Promise<Look[]> {
  const result = await tablesDB.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.looks,
    queries: [Query.equal("storeId", storeId), Query.orderDesc("$createdAt")],
  });
  return result.rows as unknown as Look[];
}

export async function getLook(lookId: string): Promise<Look | null> {
  try {
    const row = await tablesDB.getRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: TABLES.looks,
      rowId: lookId,
    });
    return row as unknown as Look;
  } catch {
    return null;
  }
}

export async function listLookItems(lookId: string): Promise<LookItem[]> {
  const result = await tablesDB.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.lookItems,
    queries: [Query.equal("lookId", lookId), Query.orderAsc("position")],
  });
  return result.rows as unknown as LookItem[];
}

/** Busca os produtos completos que compõem um look, na ordem certa. */
export async function listLookProducts(lookId: string): Promise<Product[]> {
  const items = await listLookItems(lookId);
  if (items.length === 0) return [];

  const result = await tablesDB.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.products,
    queries: [Query.equal("$id", items.map((i) => i.productId))],
  });
  const products = result.rows as unknown as Product[];

  // Reordena conforme a posição definida no look (a query acima não garante ordem).
  const order = items.map((i) => i.productId);
  return products.sort((a, b) => order.indexOf(a.$id) - order.indexOf(b.$id));
}

export async function createLook(data: Omit<Look, "$id">, ownerId: string): Promise<Look> {
  const row = await tablesDB.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.looks,
    rowId: ID.unique(),
    data,
    permissions: storeOwnedPermissions(ownerId),
  });
  return row as unknown as Look;
}

export async function addLookItem(
  lookId: string,
  productId: string,
  position: number,
  ownerId: string
): Promise<LookItem> {
  const row = await tablesDB.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.lookItems,
    rowId: ID.unique(),
    data: { lookId, productId, position },
    permissions: storeOwnedPermissions(ownerId),
  });
  return row as unknown as LookItem;
}
