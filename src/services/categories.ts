import { tablesDB, APPWRITE_DATABASE_ID, TABLES, Query, ID } from "@/lib/appwrite";
import { storeOwnedPermissions } from "@/lib/permissions";
import type { Category } from "@/types/domain";

export async function listCategories(storeId: string): Promise<Category[]> {
  const result = await tablesDB.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.categories,
    queries: [Query.equal("storeId", storeId), Query.orderAsc("position")],
  });
  return result.rows as unknown as Category[];
}

export async function getCategoryBySlug(
  storeId: string,
  slug: string
): Promise<Category | null> {
  const result = await tablesDB.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.categories,
    queries: [Query.equal("storeId", storeId), Query.equal("slug", slug), Query.limit(1)],
  });
  return (result.rows[0] as unknown as Category) ?? null;
}

export async function createCategory(
  data: Omit<Category, "$id">,
  ownerId: string
): Promise<Category> {
  const row = await tablesDB.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.categories,
    rowId: ID.unique(),
    data,
    permissions: storeOwnedPermissions(ownerId),
  });
  return row as unknown as Category;
}

export async function deleteCategory(categoryId: string): Promise<void> {
  await tablesDB.deleteRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.categories,
    rowId: categoryId,
  });
}
