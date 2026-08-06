import { tablesDB, APPWRITE_DATABASE_ID, TABLES, Query, ID } from "@/lib/appwrite";
import { privateOwnedPermissions } from "@/lib/permissions";
import type { Sale, Product, Category } from "@/types/domain";

/**
 * Registra uma venda permanentemente. Chamado no momento em que a dona
 * da loja marca um produto como "vendido" — guarda uma cópia (snapshot)
 * do nome/categoria/preço, então o histórico continua correto mesmo que
 * o produto seja editado ou apagado depois.
 */
export async function recordSale(
  product: Product,
  category: Category | null,
  ownerId: string
): Promise<Sale> {
  const row = await tablesDB.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.sales,
    rowId: ID.unique(),
    data: {
      storeId: product.storeId,
      productId: product.$id,
      productName: product.name,
      categoryId: category?.$id ?? "",
      categoryName: category?.name ?? "",
      price: product.price,
      soldAt: new Date().toISOString(),
    },
    permissions: privateOwnedPermissions(ownerId),
  });
  return row as unknown as Sale;
}

export async function listSales(storeId: string): Promise<Sale[]> {
  const result = await tablesDB.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: TABLES.sales,
    queries: [Query.equal("storeId", storeId), Query.orderDesc("soldAt"), Query.limit(1000)],
  });
  return result.rows as unknown as Sale[];
}

export interface SalesStats {
  totalRevenue: number;
  totalSales: number;
  monthRevenue: number;
  monthSalesCount: number;
  monthProjection: number;
  bestSellingProduct: { name: string; count: number } | null;
  bestSellingCategory: { name: string; count: number } | null;
}

export function computeSalesStats(sales: Sale[]): SalesStats {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dayOfMonth = now.getDate();

  const totalRevenue = sales.reduce((sum, s) => sum + s.price, 0);

  const monthSales = sales.filter((s) => new Date(s.soldAt) >= monthStart);
  const monthRevenue = monthSales.reduce((sum, s) => sum + s.price, 0);

  // Projeção simples: média diária do mês até agora, extrapolada pro mês inteiro.
  const monthProjection = dayOfMonth > 0 ? (monthRevenue / dayOfMonth) * daysInMonth : 0;

  const countBy = (key: (s: Sale) => string) => {
    const counts = new Map<string, number>();
    for (const s of sales) {
      const k = key(s);
      if (!k) continue;
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    let best: { name: string; count: number } | null = null;
    for (const [name, count] of counts) {
      if (!best || count > best.count) best = { name, count };
    }
    return best;
  };

  return {
    totalRevenue,
    totalSales: sales.length,
    monthRevenue,
    monthSalesCount: monthSales.length,
    monthProjection,
    bestSellingProduct: countBy((s) => s.productName),
    bestSellingCategory: countBy((s) => s.categoryName ?? ""),
  };
}
