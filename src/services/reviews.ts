import { tablesDB, APPWRITE_DATABASE_ID, TABLES, Query, ID } from "@/lib/appwrite";
import { reviewApprovedPermissions, reviewPendingPermissions } from "@/lib/permissions";
import type { Review } from "@/types/domain";

/** Avaliações aprovadas — as únicas visíveis no site público. */
export async function listApprovedReviews(storeId: string): Promise<Review[]> {
  const result = await tablesDB.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.reviews,
    queries: [
      Query.equal("storeId", storeId),
      Query.equal("status", "aprovada"),
      Query.orderDesc("$createdAt"),
    ],
  });
  return result.rows as unknown as Review[];
}

/** Todas as avaliações da loja (para o painel "Minha Loja" moderar). */
export async function listAllReviews(storeId: string): Promise<Review[]> {
  const result = await tablesDB.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.reviews,
    queries: [Query.equal("storeId", storeId), Query.orderDesc("$createdAt")],
  });
  return result.rows as unknown as Review[];
}

/**
 * Qualquer visitante pode enviar — sempre entra como "pendente" e só a
 * dona da loja consegue ler até aprovar (ver reviewPendingPermissions).
 */
export async function submitReview(
  storeId: string,
  ownerId: string,
  customerName: string,
  rating: number,
  comment: string
): Promise<Review> {
  const row = await tablesDB.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.reviews,
    rowId: ID.unique(),
    data: { storeId, customerName, rating, comment, status: "pendente" as const },
    permissions: reviewPendingPermissions(ownerId),
  });
  return row as unknown as Review;
}

/** Aprovar: muda o status E abre a permissão de leitura pra Role.any(). */
export async function approveReview(reviewId: string, ownerId: string): Promise<Review> {
  const row = await tablesDB.updateRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.reviews,
    rowId: reviewId,
    data: { status: "aprovada" as const },
    permissions: reviewApprovedPermissions(ownerId),
  });
  return row as unknown as Review;
}

export async function rejectReview(reviewId: string): Promise<Review> {
  const row = await tablesDB.updateRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.reviews,
    rowId: reviewId,
    data: { status: "rejeitada" as const },
  });
  return row as unknown as Review;
}
