# Uboard – Frontend

Frontend da plataforma **Uboard**, uma aplicação Angular para gerenciamento de repositórios Git e realização de sessões de **Scrum Poker** com base em issues de milestones sincronizadas via GitLab (com suporte futuro para outros provedores como GitHub).

## 🧰 Tecnologias Utilizadas

- Angular 19
- TypeScript
- ngx-translate (internacionalização dinâmica)
- Angular Router Guards
- Angular Material
- WebSocket (sessões de votação em tempo real)
- RxJS
- Tailwind CSS (opcional)
- Keycloak (OAuth2)

## 📦 Funcionalidades

- Autenticação via Keycloak
- Gerenciamento de credenciais (tokens GitLab/GitHub)
- Criação de organizações
- Sincronização de milestones e issues
- Página de tarefas assíncronas com atualização em tempo real
- Salas de votação com Scrum Poker
- Filtros dinâmicos e paginação em todas as tabelas
- Internacionalização completa dos componentes

## 🔐 Segurança

- Proteção de rotas com guards
- Tokens armazenados com segurança (no backend, via Vault)
- Autenticação e autorização integradas com Keycloak

## 🚀 Rodando o projeto

### Pré-requisitos

- Node.js v18+
- Angular CLI
- Keycloak em execução e configurado
- Backend Uboard rodando

### Instalação

```bash
npm install
```

### Ambiente de desenvolvimento
Configure o arquivo `environment.ts` com as variáveis do Keycloak e backend.

```ts
export const environment = {
  production: false,
  uboardApiUrl: 'http://localhost:8080',
  webSocketUrl: 'ws://localhost:8080/ws',
  keycloak: {
    realm: 'uboard',
    url: 'http://localhost:8181',
    clientId: 'uboard-frontend',
    urlConditionForBearerToken: /^(http:\/\/localhost:(8080|8181))(\/.*)?$/i,
  },
};
```

### Rodando localmente
```bash
ng serve
```

## 📄 Licença
Este projeto é proprietário. Consulte o arquivo LICENSE para mais informações.
