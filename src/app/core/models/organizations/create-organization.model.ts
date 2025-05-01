export interface CreateOrganizationModel {
  name: string;
  type: string;
  scope: string;
  credential: string;
  target: {
    id: number;
    name: string;
  };
}
