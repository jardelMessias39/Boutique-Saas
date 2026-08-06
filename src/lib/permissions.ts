import { Permission, Role } from "appwrite";

/**
 * Toda vez que um documento pertencente a uma loja é criado (produto,
 * categoria, look, etc.), ele deve receber estas permissões — assim só
 * a dona daquela loja (ownerId) consegue editar/apagar, mas qualquer
 * pessoa pode ler (o site público precisa listar produtos sem login).
 *
 * NUNCA crie um documento de loja sem passar por esta função — é o que
 * garante que uma loja jamais acesse/edite dados de outra.
 */
export function storeOwnedPermissions(ownerId: string) {
  return [
    Permission.read(Role.any()),
    Permission.update(Role.user(ownerId)),
    Permission.delete(Role.user(ownerId)),
  ];
}

/**
 * Permissões para avaliações: qualquer visitante pode criar (enviar uma
 * avaliação), mas só a dona da loja pode ler enquanto está pendente,
 * e só ela pode atualizar (aprovar/rejeitar) ou deletar.
 * Quando aprovada, o serviço de reviews deve ADICIONAR Role.any() ao
 * read (ver services/reviews.ts).
 */
export function reviewPendingPermissions(ownerId: string) {
  return [
    Permission.read(Role.user(ownerId)),
    Permission.update(Role.user(ownerId)),
    Permission.delete(Role.user(ownerId)),
  ];
}

export function reviewApprovedPermissions(ownerId: string) {
  return [
    Permission.read(Role.any()),
    Permission.update(Role.user(ownerId)),
    Permission.delete(Role.user(ownerId)),
  ];
}

/**
 * Permissões privadas: só a dona da loja consegue ler/editar/apagar —
 * NUNCA Role.any(). Usado em dados sensíveis do negócio, como vendas,
 * que não devem ficar públicos de jeito nenhum.
 */
export function privateOwnedPermissions(ownerId: string) {
  return [
    Permission.read(Role.user(ownerId)),
    Permission.update(Role.user(ownerId)),
    Permission.delete(Role.user(ownerId)),
  ];
}
