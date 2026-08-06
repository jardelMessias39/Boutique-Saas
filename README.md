# Boutique SaaS — Encantos da Ana

SaaS multi-tenant para boutiques infantis. Reserva via WhatsApp, sem checkout online.
Desenvolvido por Jardel Messias.

## Como rodar localmente

```bash
npm install
npm run dev
```

## Como publicar (Appwrite Sites — grátis)

1. Rode `npm run build` — cria a pasta `dist`.
2. No Appwrite Console → Sites → Create site → arraste a pasta `dist` na opção manual.
3. Pronto — o site fica público numa URL `*.appwrite.network` (dá pra conectar domínio próprio depois, de graça).

## Ação necessária: criar a tabela `sales` (Fase 5)

Ver instruções completas no arquivo `docs/documentacao-projeto-entrevista.md`,
seção 6, ou no histórico de conversa — resumo: tabela `sales` com colunas
storeId, productId, productName, categoryId, categoryName (varchar), price
(float), soldAt (datetime). Permissões: só `Users: Create` (nunca `Any`).
Row Security ativado.

## Documentação completa do projeto

Veja `docs/documentacao-projeto-entrevista.md` — documento de estudo com
arquitetura, decisões técnicas, desafios reais enfrentados no desenvolvimento
e perguntas de entrevista prováveis com respostas baseadas neste projeto.

## Status do projeto

### Fases 1-5 ✅
Fundação, design system, dados reais, site público completo, painel "Minha
Loja" completo (produtos, categorias, looks, banner, avaliações,
configurações, faturamento).

### Fase 6 — Carrinho e polimento final ✅
- **Carrinho de reserva**: cliente adiciona várias peças e reserva tudo numa
  única mensagem de WhatsApp (guardado no navegador, sem precisar de tabela
  no banco — ver documentação, seção 9, para o raciocínio dessa decisão)
- Ícone de carrinho no cabeçalho com contador de itens
- Crédito do desenvolvedor no rodapé, com link direto pro WhatsApp

## Estrutura de pastas

```
src/
  components/    → ui/ (Button, ProductCard, LookCard, etc.) e layout/
  pages/          → public/ (site) e store/ (painel "Minha Loja")
  context/        → StoreContext, AuthContext, CartContext
  services/       → stores, categories, products, looks, reviews, sales, auth
  lib/            → appwrite.ts, permissions.ts, whatsapp.ts, storage.ts, format.ts
  hooks/          → useAsync
  types/          → tipos de domínio compartilhados
docs/
  documentacao-projeto-entrevista.md → estudo de caso completo do projeto
```
