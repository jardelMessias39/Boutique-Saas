import { Client, Account, TablesDB, Storage, ID, Query, Permission, Role } from "appwrite";

/**
 * Configuração central do Appwrite.
 * Endpoint e Project ID são seguros para expor no client — é assim que o
 * Appwrite funciona por design. NUNCA coloque API Keys secretas aqui.
 */
export const APPWRITE_ENDPOINT =
  import.meta.env.VITE_APPWRITE_ENDPOINT ?? "https://nyc.cloud.appwrite.io/v1";
export const APPWRITE_PROJECT_ID =
  import.meta.env.VITE_APPWRITE_PROJECT_ID ?? "6a71577d000fc4fd0d9b";
export const APPWRITE_DATABASE_ID =
  import.meta.env.VITE_APPWRITE_DATABASE_ID ?? "6a7158f200258e4c8055";
export const APPWRITE_BUCKET_ID =
  import.meta.env.VITE_APPWRITE_BUCKET_ID ?? "6a717081000d19f6a397";

export const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
export const storage = new Storage(client);

// IDs das tabelas — nomes centralizados para não haver strings soltas
// espalhadas pelo código (evita erro de digitação em cada chamada).
export const TABLES = {
  stores: "stores",
  categories: "categories",
  products: "products",
  productImages: "product_images",
  looks: "looks",
  lookItems: "look_items",
  reviews: "reviews",
  sales: "sales",
} as const;

export { ID, Query, Permission, Role };
