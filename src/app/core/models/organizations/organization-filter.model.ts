import { CredentialTypeEnum } from '../credentials/credential-type.enum';
import { OrganizationScopeEnum } from './organization-scope.enum';

export interface OrganizationFilter {
  name?: string;
  providerName?: string;
  scope?: OrganizationScopeEnum;
  type?: CredentialTypeEnum;
}
