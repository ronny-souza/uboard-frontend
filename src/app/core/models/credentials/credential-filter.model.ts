import { CredentialTypeEnum } from './credential-type.enum';

export interface CredentialFilterModel {
  name?: string;
  url?: string;
  type?: CredentialTypeEnum;
}
