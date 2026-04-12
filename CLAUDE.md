# Blue Fox Aquarismo - Contexto de Engenharia & IA

Este documento serve como guia de contexto para assistentes de IA. Ele descreve a arquitetura, as convenções e o domínio do projeto para garantir que as sugestões de código sejam precisas.

## 🌌 Visão Geral do Domínio
A **Blue Fox Aquarismo** é uma plataforma educacional técnica sobre aquarismo. 
- **Público-alvo:** Aquaristas iniciantes e avançados.
- **Diferencial:** Abordagem científica (física de fluidos, biologia, cálculos de engenharia para aquários).
- **Entidades principais:** Artigos (Post), Simuladores, Espécies, Parâmetros de Água.

## 🏗️ Arquitetura do Frontend (Angular 20)

### Estrutura de Pastas (Core-Feature-Shared)
O projeto segue o padrão modular para escalabilidade e SSR:
- `src/app/core`: Singletons e lógica global. Contém `SeoService` (essencial para SSR), `PostService`, `AuthService` e `ApiService`.
- `src/app/features`: Módulos de página e apps integrados.
  - `pages/main`: Página principal com conteúdo dinâmico.
  - `pages/articles`: Cada artigo técnico tem seu próprio componente para controle fino de SEO e interatividade.
  - `apps`: Aplicações integradas ao projeto.
- `src/app/shared`: Componentes reutilizáveis, modelos (Types/Interfaces) e mocks.

### Tech Stack & Padrões
- **Angular 20:** Priorizar o uso de **Signals** para reatividade e **Standalone Components**.
- **SSR (Server-Side Rendering):** Essencial para indexação de artigos técnicos. Evitar acesso direto ao `window` ou `document` sem checar o `isPlatformBrowser`.
- **I18n:** Uso de `@ngx-translate`. Todas as strings de UI devem estar em `assets/i18n/*.json`.
- **Estilização:** SCSS modular. Seguir o design system baseado no Angular Material.
- **Testes:** Priorizar Jest com Spectator.

## 🛠️ Regras de Desenvolvimento

1.  **SEO & Metadados:** Todo componente em `features/pages` deve injetar o `SeoService` e definir `title` e `meta tags` no `ngOnInit`.
2.  **Performance de Imagem:** Utilizar prioritariamente o formato `.webp` disponível em `assets/images`.
3.  **Traduções:** Nunca "hardcodar" texto no HTML. Usar o pipe `| translate`.
4.  **Tipagem:** Proibido o uso de `any`. Definir interfaces em `shared/model/types/`.

## 🧠 Lógica de Negócio Técnica (Contexto para Sugestões)
Ao sugerir cálculos ou simuladores, considere:
- **Cálculo de Vidro:** Considere o "Belly Effect" (deflexão) e fatores de segurança para pressão hidrostática.
- **Proporção Áurea:** Usada para design de hardscape (aquascaping).
- **Ciclagem:** Entender o ciclo do nitrogênio (Amônia -> Nitrito -> Nitrato).

## 🚀 Comandos Úteis
- Build: `npm run build:prod`
- Testes: `npm run test`
- Lint: `npm run lint`
