# Blue Fox Aquarismo - Contexto de Engenharia & IA

Este documento serve como guia de contexto para assistentes de IA. Ele descreve a arquitetura, as convenções e o domínio do projeto para garantir que as sugestões de código sejam precisas.

## 🌌 Visão Geral do Domínio
A **Blue Fox Aquarismo** é uma plataforma educacional técnica sobre aquarismo. 
- **Público-alvo:** Aquaristas iniciantes e avançados.
- **Diferencial:** Abordagem científica (física de fluidos, biologia, cálculos de engenharia para aquários).
- **Entidades principais:** Artigos (Post), Simuladores, Espécies, Parâmetros de Água.

## 🏗️ Arquitetura do Frontend (Angular 22)

### Estrutura de Pastas (Core-Feature-Shared)
O projeto segue o padrão modular para escalabilidade e SSR:
- `src/app/core`: Singletons e lógica global. Contém `SeoService` (essencial para SSR), `PostService`, `AuthService` e `ApiService`.
- `src/app/features`: Módulos de página e apps integrados.
  - `pages/main`: Página principal com conteúdo dinâmico.
  - `pages/articles`: Cada artigo técnico tem seu próprio componente para controle fino de SEO e interatividade.
  - `apps`: Aplicações integradas ao projeto.
- `src/app/shared`: Componentes reutilizáveis, modelos (Types/Interfaces) e mocks.

### Tech Stack & Padrões
- **Angular 22:** Priorizar o uso de **Signals** para reatividade e **Standalone Components**.
- **SSR (Server-Side Rendering):** Essencial para indexação de artigos técnicos. Evitar acesso direto ao `window` ou `document` sem checar o `isPlatformBrowser`.
- **I18n:** Uso de `@ngx-translate`. Todas as strings de UI devem estar em `assets/i18n/*.json`.
- **Estilização:** SCSS modular. Seguir o design system baseado no Angular Material.
- **Testes:** Priorizar Jest com Spectator.

## 🛠️ Regras de Desenvolvimento

1.  **SEO & Metadados:** Todo componente em `features/pages` deve injetar o `SeoService` e definir `title` e `meta tags` no `ngOnInit`.
2.  **Performance de Imagem:** Utilizar prioritariamente o formato `.webp` disponível em `assets/images`.
3.  **Traduções:** Nunca "hardcodar" texto no HTML. Usar o pipe `| translate`.
4.  **Tipagem:** Proibido o uso de `any`. Definir interfaces em `shared/model/types/`.
5.  **Domínio:** o site é `https://bluefoxaquarismo.space`. Use sempre esse domínio nas URLs de SEO (canonical, `og:url`, sitemap).
6.  **Publicar um artigo:** só artigos publicados têm rota em produção (cada rota é pré-renderizada no build e, sem texto, viraria uma página vazia com status 200 indexável). Hoje os 10 artigos do blog estão publicados em `publishedRoutes`. Para um **novo rascunho**: (1) crie o componente e escreva o texto no `<article class="content">`; (2) registre a rota em `draftRoutes` de `features/pages/articles/articles.routing.ts`, que só existe em `ng serve` (no build de produção responde 404 e não é pré-renderizada); (3) para publicar, mova a rota para `publishedRoutes`, adicione a URL em `public/sitemap.xml` e publique o post no backend (`PUT /api/v1/posts/:id` com `{"published": true}`, ou crie o post se ele ainda não existir). O build precisa de acesso à API de produção para pré-renderizar o cabeçalho do artigo; e na prévia local o cabeçalho só aparece se o seu backend local tiver o post publicado.

7.  **Change detection (Angular 22 = `OnPush` por padrão):** estado que muda depois de uma resposta HTTP ou de outro callback assíncrono deve ser um **signal** (`signal()` + `.set()`), e o template o lê com `()`. Atribuir um campo comum dentro de `subscribe` não redesenha o componente: no SSR o HTML sai vazio e no navegador só aparece depois de outro evento.
8.  **Pré-renderização e rate limit:** o build faz várias requisições à blog-api, que tem rate limit no nginx (10 req/s por IP). O Dockerfile usa `NG_BUILD_MAX_WORKERS=1` para não estourar o limite; sem isso, alguns artigos saem sem cabeçalho. Para buildar localmente com o mesmo comportamento: `NG_BUILD_MAX_WORKERS=1 npm run build:prod`.

## 🧠 Lógica de Negócio Técnica (Contexto para Sugestões)
Ao sugerir cálculos ou simuladores, considere:
- **Cálculo de Vidro:** Considere o "Belly Effect" (deflexão) e fatores de segurança para pressão hidrostática.
- **Proporção Áurea:** Usada para design de hardscape (aquascaping).
- **Ciclagem:** Entender o ciclo do nitrogênio (Amônia -> Nitrito -> Nitrato).

## 🚀 Comandos Úteis
- Build: `npm run build:prod`
- Testes: `npm run test`
- Lint: `npm run lint`
