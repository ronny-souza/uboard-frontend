import { CredentialModel } from '../credentials/credential.model';

export interface OrganizationModel {
  uuid: string;
  name: string;
  integration: {
    providerName: string;
    type: string;
    scope: string;
    createdAt: Date;
    updatedAt: Date;
  };
  credential: CredentialModel;
  createdAt: Date;
  updatedAt: Date;
}
