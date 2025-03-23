import Keycloak, { KeycloakProfile } from 'keycloak-js';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UboardKeycloakService {
  private readonly keycloak = inject(Keycloak);

  async getSessionUserProfileData(): Promise<KeycloakProfile> {
    return await this.keycloak.loadUserProfile();
  }
}
