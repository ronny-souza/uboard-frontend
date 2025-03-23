export const environment = {
  production: false,
  uboardApiUrl: 'http://localhost:8080',
  keycloak: {
    realm: 'uboard',
    url: 'http://localhost:8181',
    clientId: 'uboard-frontend',
    urlConditionForBearerToken: /^(http:\/\/localhost:(8080|8181))(\/.*)?$/i,
  },
};
