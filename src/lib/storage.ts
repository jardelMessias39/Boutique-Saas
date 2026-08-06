import { storage, APPWRITE_BUCKET_ID, Permission, Role } from "@/lib/appwrite";

/**
 * Monta a URL pública de visualização de um arquivo do bucket único do
 * projeto. Como o plano gratuito do Appwrite só permite 1 bucket, a
 * organização por tipo é feita pelo prefixo do nome do arquivo (ver
 * convenção em UPLOAD_PREFIXES abaixo), não por bucket separado.
 */
export function getFileUrl(fileId: string) {
  return storage.getFileView({ bucketId: APPWRITE_BUCKET_ID, fileId });
}

export const UPLOAD_PREFIXES = {
  product: (productId: string, n: number) => `product-${productId}-${n}`,
  storeLogo: (storeId: string) => `store-${storeId}-logo`,
  storeBanner: (storeId: string) => `store-${storeId}-banner`,
} as const;

/**
 * Envia um arquivo já definindo as permissões certas: leitura pública,
 * e edição/exclusão só por quem enviou (ownerId = ID do usuário logado).
 * Sem isso, o arquivo fica sem permissão nenhuma e trocar a logo/banner
 * depois dá erro de autorização.
 */
export async function uploadFile(file: File, fileId: string, ownerId: string) {
  return storage.createFile({
    bucketId: APPWRITE_BUCKET_ID,
    fileId,
    file,
    permissions: [
      Permission.read(Role.any()),
      Permission.update(Role.user(ownerId)),
      Permission.delete(Role.user(ownerId)),
    ],
  });
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile({ bucketId: APPWRITE_BUCKET_ID, fileId });
  } catch {
    // Arquivo não existia ainda — tudo bem, é o caso do primeiro upload.
  }
}
