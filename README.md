# Blue Fox Aquarismo 🦊🐟

![Angular](https://img.shields.io/badge/Angular-20-dd0031?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=for-the-badge&logo=typescript)
![SSR](https://img.shields.io/badge/SSR-Enabled-success?style=for-the-badge)
![Jest](https://img.shields.io/badge/Jest-Tested-944058?style=for-the-badge&logo=jest)

![CI Main](https://img.shields.io/github/actions/workflow/status/FelipeFerraz4/blue-fox-aquarismo/ci.yml?branch=main&label=CI%20Main&style=for-the-badge)
![CI Develop](https://img.shields.io/github/actions/workflow/status/FelipeFerraz4/blue-fox-aquarismo/ci.yml?branch=develop&label=CI%20Develop&style=for-the-badge)


A **Blue Fox Aquarismo** é uma plataforma educacional desenvolvida para unir aquarismo, tecnologia e conhecimento responsável. Fundada por Felipe Ferraz, o projeto visa transformar o hobby em uma prática baseada em dados, ciência e ética.

---

## 🚀 Visão Geral

O projeto não é apenas um blog, mas uma **Plataforma Educacional Digital** que integra:
- **Conteúdo Técnico:** Artigos sobre química da água, biologia e dimensionamento de aquários.
- **Ferramentas Práticas:** Simuladores e utilitários para aquaristas.
- **Ecossistema:** Integração com aplicativos do Blue Fox Group.

### 🌐 Site Oficial
Acesse a plataforma online em: **[https://bluefoxaquarismo.space/](https://bluefoxaquarismo.space/)**

## 🛠️ Stack Tecnológica

### Frontend
- **Framework:** Angular 20 (com Angular Signals e SSR).
- **Estilização:** SCSS, Angular Material e Swiper para componentes interativos.
- **Internacionalização:** `@ngx-translate` (Suporte a pt, en, es, de, fr, it, ja, ko).
- **Testes:** Jest + Spectator + Ng-Mocks.
- **Qualidade de Código:** ESLint + Prettier.

### Infraestrutura & DevOps
- **Containerização:** Docker & Docker Compose.
- **CI/CD:** GitHub Actions (Lint, Audit, Test e Build).
- **Servidor:** Express.js (para suporte ao Server-Side Rendering).

## 📂 Estrutura do Projeto

O projeto segue uma arquitetura modular focada em escalabilidade:

```text
blue-fox-aquarismo/
├── .github/
│   └── workflows/
│       ├── ci.yml
├── frontend/      # Aplicação Angular
│   ├── src/app/
│   │   ├── core/          # Serviços singleton, interceptors e guardas (Auth, API, SEO)
│   │   ├── features/      # Módulos de negócio (Blog, Páginas Institucionais, Apps)
│   │   │   ├── apps/      # Micro-aplicações integradas (ex: Daily Habits)
│   │   │   └── pages/     # Artigos técnicos e páginas estáticas
├── shared/        # Componentes, modelos e tipos reutilizáveis
└── assets/        # Recursos multimídia e arquivos de tradução (i18n)
├── .dockerignore
├── .gitignore
├── articles-suggestion.txt
├── docker-compose.yml
├── LICENSE
├── README.md
└── sketch.txt
```

## 📄 Licença e Uso
Este projeto é desenvolvido para fins educacionais e comunitários.
Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

Desenvolvido com ❤️ por [Felipe Ferraz](https://github.com/FelipeFerraz4)

