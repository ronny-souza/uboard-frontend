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
