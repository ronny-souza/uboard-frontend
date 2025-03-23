import {
  AutoRefreshTokenService,
  createInterceptorCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  IncludeBearerTokenCondition,
  provideKeycloak,
  UserActivityService,
  withAutoRefreshToken,
} from 'keycloak-angular';
import { environment } from '../environments/environment';

const includeBearerTokenOnRequestsCondition =
  createInterceptorCondition<IncludeBearerTokenCondition>({
    urlPattern: environment.keycloak.urlConditionForBearerToken,
  });

export const keycloakInitializer = () =>
  provideKeycloak({
    config: {
      realm: environment.keycloak.realm,
      url: environment.keycloak.url,
      clientId: environment.keycloak.clientId,
    },

    initOptions: {
      silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    },

    features: [
      withAutoRefreshToken({
        onInactivityTimeout: 'logout',
        sessionTimeout: 60000,
      }),
    ],

    providers: [
      AutoRefreshTokenService,
      UserActivityService,
      {
        provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
        useValue: [includeBearerTokenOnRequestsCondition],
      },
    ],
  });
