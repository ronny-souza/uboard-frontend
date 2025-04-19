import { CredentialTypeEnum } from './credential-type.enum';

export interface CredentialsFilter {
  name?: string;
  url?: string;
  type?: CredentialTypeEnum;
}
